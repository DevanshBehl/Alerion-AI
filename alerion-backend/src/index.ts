/**
 * Alerion AI — Backend Entrypoint
 *
 * Starts the Fog Layer services:
 * 1. Express health/status server (HTTP)
 * 2. WebSocket prediction broadcast server
 * 3. Prediction consumer (Kafka → WebSocket bridge)
 * 4. [Optional] ML consumer (mock fallback when Python service is unavailable)
 *
 * Edge nodes are NOT started here — they run as independent processes.
 *
 * SCALABILITY:
 * • Each service component can be extracted into its own process/container
 * • WebSocket servers can be load-balanced (sticky sessions)
 * • Consumer groups auto-scale with additional instances
 * • Express health endpoint enables container orchestration readiness probes
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { startWSServer, broadcastPrediction, stopWSServer, getWSStats } from './websocket/wsServer.js';
import { startPredictionConsumer, stopPredictionConsumer } from './consumers/predictionConsumer.js';
import { startMLConsumer, stopMLConsumer } from './consumers/mlConsumer.js';
import { createKafkaClient, ensureTopics } from './config/kafka.js';

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

const HTTP_PORT = parseInt(process.env.HTTP_PORT || '3000', 10);
const WS_PORT = parseInt(process.env.WS_PORT || '8080', 10);
const USE_MOCK_ML = process.env.USE_MOCK_ML === 'true';

// ─────────────────────────────────────────────────────────────
// Express Health/Status Server
// ─────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

/** Health check — used by Docker, Kubernetes, load balancers */
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'alerion-backend',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

/** WebSocket server statistics */
app.get('/stats', (_req, res) => {
    const wsStats = getWSStats();
    res.json({
        websocket: wsStats,
        mode: USE_MOCK_ML ? 'mock-ml' : 'python-ml-service',
        uptime: process.uptime(),
    });
});

/** Readiness probe — indicates if the service is ready to accept traffic */
app.get('/ready', (_req, res) => {
    res.json({ ready: true });
});

// ─────────────────────────────────────────────────────────────
// Startup Sequence
// ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║        ALERION AI — Fog Layer Backend            ║');
    console.log('║   Real-Time Industrial Anomaly Detection         ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    try {
        // 0. Ensure Kafka topics exist before consumers start
        console.log('[Startup]   Ensuring Kafka topics exist...');
        const adminKafka = createKafkaClient('admin');
        await ensureTopics(adminKafka);

        // 1. Start Express health server
        const httpServer = app.listen(HTTP_PORT, '0.0.0.0', () => {
            console.log(`[HTTP]      Health server → http://0.0.0.0:${HTTP_PORT}/health`);
            console.log(`[HTTP]      Stats endpoint → http://0.0.0.0:${HTTP_PORT}/stats`);
        });

        // 2. Start WebSocket server
        startWSServer(WS_PORT);

        // 3. Start prediction consumer (Kafka → WebSocket bridge)
        console.log('[Startup]   Starting prediction consumer...');
        await startPredictionConsumer(broadcastPrediction);
        console.log('[Startup]   ✅ Prediction consumer ready');

        // 4. Optionally start mock ML consumer
        if (USE_MOCK_ML) {
            console.log('[Startup]   Starting mock ML consumer (USE_MOCK_ML=true)...');
            await startMLConsumer();
            console.log('[Startup]   ✅ Mock ML consumer ready');
        } else {
            console.log('[Startup]   ⏭  Mock ML disabled — expecting Python ML service');
        }

        console.log('\n[Startup]   ═══════════════════════════════════');
        console.log('[Startup]   🚀 All services started successfully');
        console.log('[Startup]   ═══════════════════════════════════\n');

        // ─── Graceful Shutdown ─────────────────────────────────
        const shutdown = async (signal: string) => {
            console.log(`\n[Shutdown] Received ${signal} — initiating graceful shutdown...`);

            // Stop services in reverse order
            if (USE_MOCK_ML) {
                console.log('[Shutdown] Stopping ML consumer...');
                await stopMLConsumer();
            }

            console.log('[Shutdown] Stopping prediction consumer...');
            await stopPredictionConsumer();

            console.log('[Shutdown] Stopping WebSocket server...');
            await stopWSServer();

            console.log('[Shutdown] Stopping HTTP server...');
            httpServer.close();

            console.log('[Shutdown] ✅ Graceful shutdown complete');
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        // Handle uncaught errors
        process.on('uncaughtException', (err) => {
            console.error('[FATAL] Uncaught exception:', err);
            shutdown('uncaughtException');
        });

        process.on('unhandledRejection', (reason) => {
            console.error('[FATAL] Unhandled rejection:', reason);
        });
    } catch (err) {
        console.error('[Startup] ❌ Failed to start services:', err);
        process.exit(1);
    }
}

main();
