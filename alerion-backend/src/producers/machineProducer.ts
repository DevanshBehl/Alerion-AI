/**
 * Alerion AI — Machine Data Kafka Producer
 *
 * Publishes raw telemetry data from edge nodes to the machine-data topic.
 * Each message is keyed by machine_id to guarantee per-machine ordering
 * within a Kafka partition.
 *
 * SCALABILITY:
 * • machine_id as partition key ensures all data from one machine lands
 *   in the same partition → preserves temporal ordering per machine.
 * • With 5 machines and 5+ partitions, each machine gets its own partition.
 * • For 1000+ machines, increase partition count proportionally.
 * • Producer batching (linger.ms) can be tuned for throughput vs latency.
 */

import { Producer } from 'kafkajs';
import {
    createKafkaClient,
    createProducer,
    disconnectProducer,
    MACHINE_DATA_TOPIC,
} from '../config/kafka.js';
import type { MachineData } from '../types/machine.types.js';

let producer: Producer | null = null;

/**
 * Initialize the Kafka producer for machine telemetry.
 * Reuses existing connection if already initialized.
 */
export async function initProducer(): Promise<Producer> {
    if (producer) return producer;

    const kafka = createKafkaClient('edge-producer');
    producer = await createProducer(kafka);
    return producer;
}

/**
 * Send a single machine telemetry reading to Kafka.
 *
 * @param data - Machine telemetry payload
 * @throws Will log error but not crash — edge nodes should be resilient
 */
export async function sendMachineData(data: MachineData): Promise<void> {
    if (!producer) {
        throw new Error('[Producer] Not initialized. Call initProducer() first.');
    }

    try {
        await producer.send({
            topic: MACHINE_DATA_TOPIC,
            messages: [
                {
                    // Partition key: ensures all data from the same machine
                    // goes to the same partition for ordered processing
                    key: data.machine_id,
                    value: JSON.stringify(data),
                    timestamp: Date.now().toString(),
                },
            ],
        });

        console.log(
            `[Producer] Sent → ${data.machine_id} | ` +
            `temp: ${data.air_temperature.toFixed(1)}K | ` +
            `torque: ${data.torque.toFixed(1)}Nm | ` +
            `wear: ${data.tool_wear}`
        );
    } catch (err) {
        console.error(`[Producer] Failed to send data for ${data.machine_id}:`, err);
        // Don't re-throw — edge node should continue operating
        // In production, implement dead letter queue or local buffering
    }
}

/**
 * Gracefully shut down the producer.
 * Called during SIGINT/SIGTERM handling.
 */
export async function shutdownProducer(): Promise<void> {
    if (producer) {
        await disconnectProducer(producer);
        producer = null;
    }
}
