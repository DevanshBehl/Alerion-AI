/**
 * Alerion AI — WebSocket Server
 *
 * Real-time broadcast server that pushes prediction data to all
 * connected frontend dashboard clients.
 *
 * Features:
 * • Broadcast to all connected clients (fan-out)
 * • Heartbeat/ping-pong for stale connection detection
 * • Connection tracking with client metadata
 * • Graceful disconnect handling
 * • Structured JSON message envelopes (WSMessage type)
 *
 * SCALABILITY:
 * • Single instance handles ~10K concurrent WebSocket connections.
 * • For higher scale: run multiple WS server instances behind a
 *   load balancer (sticky sessions or Layer 4 LB).
 * • Each instance runs its own predictionConsumer from Kafka.
 * • To broadcast across all instances: use Redis Pub/Sub as a
 *   cross-instance message bus.
 * • For 1M+ connections: use a dedicated WS gateway (e.g., Socket.io
 *   cluster with Redis adapter, or a native WS gateway like Centrifugo).
 */

import { WebSocketServer, WebSocket, type RawData } from 'ws';
import type { PredictionResult, WSMessage } from '../types/machine.types.js';

// ─────────────────────────────────────────────────────────────
// Client Tracking
// ─────────────────────────────────────────────────────────────

interface ClientInfo {
    id: string;
    connectedAt: Date;
    isAlive: boolean;
    messagesSent: number;
}

const clients = new Map<WebSocket, ClientInfo>();
let clientIdCounter = 0;

// ─────────────────────────────────────────────────────────────
// WebSocket Server
// ─────────────────────────────────────────────────────────────

let wss: WebSocketServer | null = null;
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start the WebSocket server.
 *
 * @param port - Port to listen on (default: 8080)
 * @returns The WebSocketServer instance
 */
export function startWSServer(port: number = 8080): WebSocketServer {
    wss = new WebSocketServer({
        port,
        host: '0.0.0.0', // Bind to all interfaces for cross-device access
        perMessageDeflate: false, // Disable compression for lower latency
    });

    console.log(`\n[WebSocket] Server started on ws://0.0.0.0:${port}`);
    console.log('[WebSocket] Waiting for client connections...\n');

    // ─── Connection Handler ──────────────────────────────────
    wss.on('connection', (ws: WebSocket, req) => {
        const clientId = `client-${++clientIdCounter}`;
        const clientIp = req.socket.remoteAddress || 'unknown';

        const info: ClientInfo = {
            id: clientId,
            connectedAt: new Date(),
            isAlive: true,
            messagesSent: 0,
        };
        clients.set(ws, info);

        console.log(`[WebSocket] ✅ ${clientId} connected from ${clientIp} | Total clients: ${clients.size}`);

        // Send welcome message
        const welcome: WSMessage<{ clientId: string; message: string }> = {
            type: 'system',
            payload: {
                clientId,
                message: 'Connected to Alerion AI prediction stream',
            },
            timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(welcome));

        // ─── Pong handler (heartbeat response) ───────────────
        ws.on('pong', () => {
            const client = clients.get(ws);
            if (client) client.isAlive = true;
        });

        // ─── Message handler (client → server) ───────────────
        ws.on('message', (data: RawData) => {
            try {
                const msg = JSON.parse(data.toString());
                console.log(`[WebSocket] Message from ${clientId}:`, msg);

                // Future: handle client commands (subscribe to specific machines, etc.)
            } catch {
                // Ignore malformed messages
            }
        });

        // ─── Disconnect handler ──────────────────────────────
        ws.on('close', (code: number, reason: Buffer) => {
            clients.delete(ws);
            console.log(
                `[WebSocket] ❌ ${clientId} disconnected (code: ${code}) | ` +
                `Total clients: ${clients.size} | ` +
                `Messages sent: ${info.messagesSent}`
            );
        });

        // ─── Error handler ───────────────────────────────────
        ws.on('error', (err: Error) => {
            console.error(`[WebSocket] Error on ${clientId}:`, err.message);
            clients.delete(ws);
        });
    });

    // ─── Heartbeat: detect and clean stale connections ─────────
    // Ping every 30 seconds; if no pong received before next ping, terminate
    heartbeatInterval = setInterval(() => {
        wss!.clients.forEach((ws) => {
            const info = clients.get(ws);
            if (info && !info.isAlive) {
                console.log(`[WebSocket] 💀 Terminating stale connection: ${info.id}`);
                clients.delete(ws);
                return ws.terminate();
            }
            if (info) info.isAlive = false;
            ws.ping();
        });
    }, 30000);

    return wss;
}

// ─────────────────────────────────────────────────────────────
// Broadcast
// ─────────────────────────────────────────────────────────────

/**
 * Broadcast a prediction result to all connected WebSocket clients.
 * Wraps the payload in a WSMessage envelope.
 *
 * @param prediction - The enriched prediction from the ML pipeline
 */
export function broadcastPrediction(prediction: PredictionResult): void {
    if (!wss || clients.size === 0) return;

    const message: WSMessage<PredictionResult> = {
        type: prediction.prediction === 1 ? 'alert' : 'prediction',
        payload: prediction,
        timestamp: new Date().toISOString(),
    };

    const serialized = JSON.stringify(message);

    wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(serialized);
            const info = clients.get(ws);
            if (info) info.messagesSent++;
        }
    });
}

/**
 * Get current WebSocket server statistics.
 */
export function getWSStats(): {
    connectedClients: number;
    clientDetails: Array<{ id: string; connectedAt: string; messagesSent: number }>;
} {
    const clientDetails = Array.from(clients.values()).map((info) => ({
        id: info.id,
        connectedAt: info.connectedAt.toISOString(),
        messagesSent: info.messagesSent,
    }));

    return {
        connectedClients: clients.size,
        clientDetails,
    };
}

/**
 * Gracefully shut down the WebSocket server.
 */
export async function stopWSServer(): Promise<void> {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }

    if (wss) {
        // Close all client connections
        wss.clients.forEach((ws) => {
            ws.close(1001, 'Server shutting down');
        });

        await new Promise<void>((resolve) => {
            wss!.close(() => {
                console.log('[WebSocket] Server stopped');
                resolve();
            });
        });
        wss = null;
    }

    clients.clear();
}
