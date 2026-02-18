/**
 * Alerion AI — WebSocket Telemetry Service
 *
 * Connects to the backend WebSocket server and streams
 * real-time prediction data into the Zustand store.
 *
 * Replaces the previous mock simulation with live Kafka data.
 */

import { useTelemetryStore } from '../store/telemetryStore';
import { WS_URL, TELEMETRY_CONFIG, MACHINE_NAMES, MACHINE_TYPES } from '../utils/constants';
import type { TelemetryDataPoint, AnomalyAlert, Machine, WSMessage } from '../types';

const { getState } = useTelemetryStore;

let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Initialize machines from first incoming data, or pre-seed defaults.
 */
function ensureMachineExists(machineId: string): void {
    const machines = getState().machines;
    const exists = machines.some(m => m.id === machineId);

    if (!exists) {
        const name = MACHINE_NAMES[machineId] || machineId;
        const type = MACHINE_TYPES[machineId] || 'M';
        const newMachine: Machine = {
            id: machineId,
            name,
            type,
            status: 'normal',
            lastUpdate: Date.now(),
        };
        getState().setMachines([...machines, newMachine]);
    }
}

/**
 * Process an incoming WebSocket message and dispatch to the store.
 */
function handleMessage(event: MessageEvent): void {
    try {
        const msg: WSMessage = JSON.parse(event.data);

        if (msg.type === 'system') {
            console.log('[WS] System:', msg.payload.message);
            return;
        }

        if (msg.type === 'heartbeat') return;

        if (msg.type === 'prediction' || msg.type === 'alert') {
            const p = msg.payload;

            // Ensure machine is registered
            ensureMachineExists(p.machine_id);

            // Build telemetry data point
            const point: TelemetryDataPoint = {
                timestamp: new Date(p.timestamp).getTime(),
                machineId: p.machine_id,
                air_temperature: p.air_temperature,
                process_temperature: p.process_temperature,
                rotational_speed: p.rotational_speed,
                torque: p.torque,
                tool_wear: p.tool_wear,
                prediction: p.prediction,
                confidence: p.confidence,
                anomalyScore: p.anomalyScore,
                failure_type: p.failure_type,
            };

            getState().addTelemetryPoint(point);

            // Update machine status based on prediction
            if (p.prediction === 1) {
                const severity = p.anomalyScore > 0.7 ? 'critical' : 'warning';
                getState().updateMachineStatus(p.machine_id, severity);

                // Generate alert
                const machineName = MACHINE_NAMES[p.machine_id] || p.machine_id;
                const alert: AnomalyAlert = {
                    id: `alert-${Date.now()}-${p.machine_id}`,
                    machineId: p.machine_id,
                    machineName,
                    severity,
                    message: `${p.failure_type} detected on ${machineName}`,
                    timestamp: Date.now(),
                    isNew: true,
                    confidence: p.confidence,
                    anomalyScore: p.anomalyScore,
                    failure_type: p.failure_type,
                };
                getState().addAlert(alert);
            } else {
                // Normal reading — recover machine status
                getState().updateMachineStatus(p.machine_id, 'normal');
            }
        }
    } catch (err) {
        console.error('[WS] Error parsing message:', err);
    }
}

export const TelemetryService = {
    /**
     * Connect to the backend WebSocket server.
     * Replaces the old startTelemetrySimulation().
     */
    connect: (): void => {
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log(`[WS] Connecting to ${WS_URL}...`);

        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('[WS] ✅ Connected to Alerion AI backend');
            reconnectAttempts = 0;
            getState().setConnected(true);
        };

        ws.onmessage = handleMessage;

        ws.onclose = (event) => {
            console.log(`[WS] ❌ Disconnected (code: ${event.code})`);
            getState().setConnected(false);
            ws = null;

            // Auto-reconnect with backoff
            if (reconnectAttempts < TELEMETRY_CONFIG.MAX_RECONNECT_ATTEMPTS) {
                const delay = TELEMETRY_CONFIG.RECONNECT_DELAY * Math.min(reconnectAttempts + 1, 5);
                reconnectAttempts++;
                console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})...`);
                reconnectTimer = setTimeout(() => TelemetryService.connect(), delay);
            } else {
                console.error('[WS] Max reconnect attempts reached. Please check the backend.');
            }
        };

        ws.onerror = (err) => {
            console.error('[WS] WebSocket error:', err);
        };
    },

    /**
     * Disconnect from the WebSocket server.
     * Replaces the old stopTelemetrySimulation().
     */
    disconnect: (): void => {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        reconnectAttempts = TELEMETRY_CONFIG.MAX_RECONNECT_ATTEMPTS; // Prevent auto-reconnect
        if (ws) {
            ws.close(1000, 'Client disconnect');
            ws = null;
        }
        getState().setConnected(false);
    },

    /** Check if currently connected */
    isConnected: (): boolean => {
        return ws !== null && ws.readyState === WebSocket.OPEN;
    },

    // ─── Legacy aliases for backward compatibility ───────────
    startTelemetrySimulation: (): void => TelemetryService.connect(),
    stopTelemetrySimulation: (): void => TelemetryService.disconnect(),
};
