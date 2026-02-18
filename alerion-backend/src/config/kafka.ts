/**
 * Alerion AI — Kafka Configuration & Factory
 *
 * Centralized Kafka client configuration with:
 * - Connection retry logic with exponential backoff
 * - Producer/consumer factory helpers
 * - Topic constants
 *
 * SCALABILITY NOTES:
 * ─────────────────
 * • Kafka topics should be created with multiple partitions for parallel consumption.
 *   e.g., machine-data with 12 partitions allows 12 concurrent consumers.
 * • Consumer groups enable horizontal scaling — spin up more consumer instances
 *   and Kafka automatically rebalances partitions across them.
 * • KAFKA_BROKERS accepts comma-separated broker list for multi-broker clusters.
 * • For 1M msg/sec: use dedicated Kafka cluster (3+ brokers), partition count >= 30,
 *   and batch/linger settings tuned for throughput.
 */

import { Kafka, logLevel, Producer, Consumer, type KafkaConfig } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────
// Topic Constants
// ─────────────────────────────────────────────────────────────

/** Topic for raw edge telemetry — partitioned by machine_id for ordering */
export const MACHINE_DATA_TOPIC = process.env.MACHINE_DATA_TOPIC || 'machine-data';

/** Topic for ML-enriched predictions — consumed by WebSocket server */
export const PREDICTION_DATA_TOPIC = process.env.PREDICTION_DATA_TOPIC || 'prediction-data';

// ─────────────────────────────────────────────────────────────
// Kafka Client Factory
// ─────────────────────────────────────────────────────────────

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID || 'alerion-backend';

/**
 * Creates a configured Kafka client instance.
 *
 * @param clientSuffix - Optional suffix appended to clientId for uniqueness
 *                       (important when running multiple producers/consumers)
 */
export function createKafkaClient(clientSuffix?: string): Kafka {
    const config: KafkaConfig = {
        clientId: clientSuffix ? `${clientId}-${clientSuffix}` : clientId,
        brokers,
        logLevel: logLevel.WARN,

        // Connection retry with exponential backoff
        // Ensures resilience during Kafka broker restarts or network partitions
        retry: {
            initialRetryTime: 300,      // Start with 300ms delay
            retries: 15,                 // Max 15 retry attempts
            maxRetryTime: 30000,         // Cap at 30 seconds between retries
            factor: 0.2,                 // Jitter factor to prevent thundering herd
            multiplier: 2,               // Double the delay each attempt
        },
    };

    console.log(`[Kafka] Creating client "${config.clientId}" → brokers: ${brokers.join(', ')}`);
    return new Kafka(config);
}

// ─────────────────────────────────────────────────────────────
// Producer Factory
// ─────────────────────────────────────────────────────────────

/**
 * Creates and connects a Kafka producer.
 *
 * SCALABILITY: Producers are thread-safe and can be shared.
 * For extreme throughput, tune batch.size and linger.ms.
 */
export async function createProducer(kafka: Kafka): Promise<Producer> {
    const producer = kafka.producer({
        allowAutoTopicCreation: true,
        // For high-throughput scenarios, enable batching:
        // batch.size controls how many messages are batched before sending
        // linger.ms adds a small delay to accumulate more messages per batch
    });

    await producer.connect();
    console.log('[Kafka] Producer connected');
    return producer;
}

// ─────────────────────────────────────────────────────────────
// Consumer Factory
// ─────────────────────────────────────────────────────────────

/**
 * Creates and connects a Kafka consumer.
 *
 * SCALABILITY: Consumer groups allow horizontal scaling.
 * Multiple instances with the same groupId will automatically
 * distribute partitions among themselves via Kafka rebalancing.
 *
 * @param kafka - Kafka client instance
 * @param groupId - Consumer group identifier. Same groupId = load balanced.
 *                  Different groupId = each gets all messages (fan-out).
 */
export async function createConsumer(kafka: Kafka, groupId: string): Promise<Consumer> {
    const consumer = kafka.consumer({
        groupId,
        // Session timeout: how long before Kafka considers a consumer dead
        sessionTimeout: 30000,
        // Heartbeat interval: how often to ping Kafka to stay alive
        heartbeatInterval: 3000,
        // Max bytes per partition per fetch (tune for throughput vs latency)
        maxBytesPerPartition: 1048576, // 1MB
    });

    await consumer.connect();
    console.log(`[Kafka] Consumer connected (group: ${groupId})`);
    return consumer;
}

// ─────────────────────────────────────────────────────────────
// Graceful Disconnect Helpers
// ─────────────────────────────────────────────────────────────

/** Safely disconnect a producer with error handling */
export async function disconnectProducer(producer: Producer): Promise<void> {
    try {
        await producer.disconnect();
        console.log('[Kafka] Producer disconnected');
    } catch (err) {
        console.error('[Kafka] Error disconnecting producer:', err);
    }
}

/** Safely disconnect a consumer with error handling */
export async function disconnectConsumer(consumer: Consumer): Promise<void> {
    try {
        await consumer.disconnect();
        console.log('[Kafka] Consumer disconnected');
    } catch (err) {
        console.error('[Kafka] Error disconnecting consumer:', err);
    }
}

// ─────────────────────────────────────────────────────────────
// Topic Administration
// ─────────────────────────────────────────────────────────────

/**
 * Ensures required Kafka topics exist before consumers subscribe.
 * Creates them with 5 partitions if they don't exist.
 * Safe to call multiple times — idempotent.
 */
export async function ensureTopics(kafka: Kafka): Promise<void> {
    const admin = kafka.admin();
    await admin.connect();

    const existingTopics = await admin.listTopics();
    const requiredTopics = [MACHINE_DATA_TOPIC, PREDICTION_DATA_TOPIC];
    const toCreate = requiredTopics.filter(t => !existingTopics.includes(t));

    if (toCreate.length > 0) {
        console.log(`[Kafka] Creating topics: ${toCreate.join(', ')}`);
        await admin.createTopics({
            waitForLeaders: true,
            topics: toCreate.map(topic => ({
                topic,
                numPartitions: 5,
                replicationFactor: 1,
            })),
        });
        console.log('[Kafka] ✅ Topics created successfully');
    } else {
        console.log('[Kafka] ✅ All required topics already exist');
    }

    await admin.disconnect();
}
