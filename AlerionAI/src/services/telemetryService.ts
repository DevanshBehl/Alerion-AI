import { useTelemetryStore } from '../store/telemetryStore';
import { MOCK_MACHINES, SIMULATION_CONFIG } from '../utils/constants';
import type { TelemetryDataPoint, AnomalyAlert, Machine } from '../types';

let intervalId: ReturnType<typeof setInterval> | null = null;
const { getState } = useTelemetryStore;

/**
 * Service to handle telemetry data streaming.
 * Currently uses a simulation via setInterval.
 * 
 * TO IMPLEMENT WEBSOCKETS:
 * 1. Replace startTelemetrySimulation with a connect() method.
 * 2. Replace stopTelemetrySimulation with a disconnect() method.
 * 3. Inside connect(), initialize WebSocket connection:
 *    const ws = new WebSocket('wss://api.alerion.ai/telemetry');
 * 4. On message, parse data and dispatch to store:
 *    ws.onmessage = (event) => {
 *      const data = JSON.parse(event.data);
 *      if (data.type === 'telemetry') getState().addTelemetryPoint(data.payload);
 *      if (data.type === 'alert') getState().addAlert(data.payload);
 *    };
 */
export const TelemetryService = {
    startTelemetrySimulation: () => {
        if (intervalId) return;

        // Initialize machines if empty
        if (getState().machines.length === 0) {
            const initializedMachines: Machine[] = MOCK_MACHINES.map(m => ({
                ...m,
                lastUpdate: Date.now()
            }));
            getState().setMachines(initializedMachines);
        }

        intervalId = setInterval(() => {
            const now = Date.now();
            const machines = getState().machines;

            machines.forEach((machine) => {
                // 1. Generate Telemetry Data
                const point: TelemetryDataPoint = {
                    timestamp: now,
                    machineId: machine.id,
                    temperature: getNextValue(machine.id, 'temperature'),
                    vibration: getNextValue(machine.id, 'vibration'),
                    pressure: getNextValue(machine.id, 'pressure'),
                };

                getState().addTelemetryPoint(point);

                // 2. Simulate Anomaly / Alert
                if (Math.random() < SIMULATION_CONFIG.ALERT_PROBABILITY) {
                    const isCritical = Math.random() < 0.3; // 30% chance of critical if alert happens
                    const severity = isCritical ? 'critical' : 'warning';

                    const alert: AnomalyAlert = {
                        id: `alert-${now}-${machine.id}`,
                        machineId: machine.id,
                        machineName: machine.name,
                        severity: severity,
                        message: generateAlertMessage(machine.name),
                        timestamp: now,
                        isNew: true,
                    };

                    getState().addAlert(alert);
                    getState().updateMachineStatus(machine.id, severity);

                    // Auto-recover after some time for simulation
                    setTimeout(() => {
                        // Only recover if it's still the same status (simplification)
                        const currentStatus = getState().machines.find(m => m.id === machine.id)?.status;
                        if (currentStatus === severity) {
                            getState().updateMachineStatus(machine.id, 'normal');
                        }
                    }, 10000);
                }
            });
        }, SIMULATION_CONFIG.INTERVAL_MS);
    },

    stopTelemetrySimulation: () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    },
};

// --- Helper Functions for Simulation ---

// Keep track of last values to make smooth random walks
const lastValues: Record<string, { temperature: number; vibration: number; pressure: number }> = {};

function getNextValue(machineId: string, metric: 'temperature' | 'vibration' | 'pressure'): number {
    if (!lastValues[machineId]) {
        lastValues[machineId] = {
            temperature: 60 + Math.random() * 20, // 60-80
            vibration: 2 + Math.random() * 3,     // 2-5
            pressure: 20 + Math.random() * 10,    // 20-30
        };
    }

    const current = lastValues[machineId][metric];
    let change = (Math.random() - 0.5) * 2; // -1 to 1

    // Scale change based on metric
    if (metric === 'temperature') change *= 1.5;
    if (metric === 'vibration') change *= 0.5;
    if (metric === 'pressure') change *= 1.0;

    let newValue = current + change;

    // Clamping to realistic bounds
    if (metric === 'temperature') newValue = Math.max(40, Math.min(120, newValue));
    if (metric === 'vibration') newValue = Math.max(0, Math.min(20, newValue));
    if (metric === 'pressure') newValue = Math.max(10, Math.min(60, newValue));

    lastValues[machineId][metric] = newValue;
    return Number(newValue.toFixed(1));
}

function generateAlertMessage(machineName: string): string {
    const issues = [
        'High Temperature Detected',
        'Abnormal Vibration Pattern',
        'Pressure Drop',
        'Sensor Drift',
        'Bearing Wear Indication'
    ];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    return `${issue} on ${machineName}`;
}
