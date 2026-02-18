/**
 * Alerion AI — Prediction Consumer
 *
 * Consumes enriched predictions from 'prediction-data' topic
 * and forwards them to the WebSocket broadcast layer.
 *
 * This is the final consumer in the pipeline — it bridges Kafka
 * to the real-time WebSocket stream consumed by the frontend dashboard.
 *
 * SCALABILITY:
 * • Consumer group 'prediction-consumers' enables horizontal scaling.
 * • For WebSocket, each server instance runs its own predictionConsumer.
 * • In a multi-instance WS deployment, use a shared pub/sub layer
 *   (Redis Pub/Sub or Kafka consumer groups) so all WS servers
 *   broadcast all predictions to their connected clients.
 */

import { Consumer } from 'kafkajs';
import {
    createKafkaClient,
    createConsumer,
    disconnectConsumer,
    PREDICTION_DATA_TOPIC,
} from '../config/kafka.js';
import type { PredictionResult } from '../types/machine.types.js';

const CONSUMER_GROUP = 'prediction-consumers';

let consumer: Consumer | null = null;

/**
 * Callback type for handling incoming predictions.
 * The WebSocket server registers its broadcast function here.
 */
export type PredictionHandler = (prediction: PredictionResult) => void;

/**
 * Start the prediction consumer.
 *
 * @param onPrediction - Callback invoked for each prediction message.
 *                       Typically wired to the WebSocket broadcast function.
 */
export async function startPredictionConsumer(
    onPrediction: PredictionHandler,
): Promise<void> {
    const kafka = createKafkaClient('prediction-consumer');
    consumer = await createConsumer(kafka, CONSUMER_GROUP);

    await consumer.subscribe({
        topic: PREDICTION_DATA_TOPIC,
        fromBeginning: false,
    });

    console.log(`[Prediction Consumer] Subscribed to "${PREDICTION_DATA_TOPIC}" (group: ${CONSUMER_GROUP})`);

    let messageCount = 0;

    await consumer.run({
        eachMessage: async ({ message, partition }) => {
            if (!message.value) return;

            try {
                const prediction: PredictionResult = JSON.parse(message.value.toString());
                messageCount++;

                // Forward to WebSocket broadcast
                onPrediction(prediction);

                // Periodic throughput log (every 100 messages)
                if (messageCount % 100 === 0) {
                    console.log(
                        `[Prediction Consumer] Processed ${messageCount} predictions | ` +
                        `latest: ${prediction.machine_id} | partition: ${partition}`
                    );
                }
            } catch (err) {
                console.error('[Prediction Consumer] Error processing message:', err);
            }
        },
    });
}

/**
 * Gracefully shut down the prediction consumer.
 */
export async function stopPredictionConsumer(): Promise<void> {
    if (consumer) await disconnectConsumer(consumer);
    consumer = null;
    console.log('[Prediction Consumer] Shutdown complete');
}
