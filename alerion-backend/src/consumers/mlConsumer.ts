/**
 * Alerion AI — ML Consumer (Mock Fallback)
 *
 * Consumes raw telemetry from 'machine-data' topic, runs the mock
 * TypeScript predictor, and publishes enriched results to 'prediction-data'.
 *
 * This consumer is ONLY used when USE_MOCK_ML=true (Python ML service unavailable).
 * In production, the Python FastAPI service directly consumes machine-data
 * and publishes to prediction-data — this consumer is not needed.
 *
 * SCALABILITY:
 * • Consumer group 'ml-consumers' allows horizontal scaling.
 * • Multiple instances share the partition load via Kafka rebalancing.
 * • For high throughput: increase partitions on machine-data topic,
 *   then spin up more mlConsumer instances (up to partition count).
 */

import { Consumer, Producer } from 'kafkajs';
import {
    createKafkaClient,
    createConsumer,
    createProducer,
    disconnectConsumer,
    disconnectProducer,
    MACHINE_DATA_TOPIC,
    PREDICTION_DATA_TOPIC,
} from '../config/kafka.js';
import { predict } from '../ml/predictor.js';
import type { MachineData, PredictionResult } from '../types/machine.types.js';

const CONSUMER_GROUP = 'ml-consumers';

let consumer: Consumer | null = null;
let producer: Producer | null = null;

/**
 * Start the ML inference consumer pipeline.
 *
 * Flow: machine-data → predict() → prediction-data
 */
export async function startMLConsumer(): Promise<void> {
    const kafka = createKafkaClient('ml-consumer');

    consumer = await createConsumer(kafka, CONSUMER_GROUP);
    producer = await createProducer(kafka);

    await consumer.subscribe({
        topic: MACHINE_DATA_TOPIC,
        fromBeginning: false, // Only process new messages
    });

    console.log(`[ML Consumer] Subscribed to "${MACHINE_DATA_TOPIC}" (group: ${CONSUMER_GROUP})`);
    console.log('[ML Consumer] Using TypeScript mock predictor (USE_MOCK_ML=true)');

    await consumer.run({
        // Process each message individually for low latency
        // For throughput, use eachBatch with batch processing
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) return;

            try {
                const machineData: MachineData = JSON.parse(message.value.toString());

                // Run mock ML prediction
                const predictionOutput = predict(machineData);

                // Build enriched prediction result
                const result: PredictionResult = {
                    ...machineData,
                    ...predictionOutput,
                    processed_at: new Date().toISOString(),
                };

                // Publish to prediction-data topic
                await producer!.send({
                    topic: PREDICTION_DATA_TOPIC,
                    messages: [
                        {
                            key: machineData.machine_id,
                            value: JSON.stringify(result),
                            timestamp: Date.now().toString(),
                        },
                    ],
                });

                // Log predictions (highlight failures)
                const icon = result.prediction === 1 ? '🚨' : '✅';
                console.log(
                    `[ML Consumer] ${icon} ${result.machine_id} | ` +
                    `pred: ${result.prediction} | ` +
                    `conf: ${result.confidence.toFixed(3)} | ` +
                    `anomaly: ${result.anomalyScore.toFixed(3)} | ` +
                    `type: ${result.failure_type} | ` +
                    `partition: ${partition}`
                );
            } catch (err) {
                console.error(`[ML Consumer] Error processing message from partition ${partition}:`, err);
                // Don't throw — consumer should continue processing remaining messages
            }
        },
    });
}

/**
 * Gracefully shut down the ML consumer pipeline.
 */
export async function stopMLConsumer(): Promise<void> {
    if (consumer) await disconnectConsumer(consumer);
    if (producer) await disconnectProducer(producer);
    consumer = null;
    producer = null;
    console.log('[ML Consumer] Shutdown complete');
}
