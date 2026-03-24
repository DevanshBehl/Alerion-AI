import { create } from 'zustand';
import type { TelemetryState, Machine, TelemetryDataPoint, AnomalyAlert, TelemetryMetric } from '../types';
import { TELEMETRY_CONFIG } from '../utils/constants';

export interface PredictionStats {
    totalRequests: number;
    passedCount: number;
    failedCount: number;
    failureBreakdown: Record<string, number>;
}

interface TelemetryActions {
    setMachines: (machines: Machine[]) => void;
    updateMachineStatus: (machineId: string, status: Machine['status']) => void;
    addTelemetryPoint: (point: TelemetryDataPoint) => void;
    addAlert: (alert: AnomalyAlert) => void;
    setSelectedMetric: (metric: TelemetryMetric) => void;
    setSelectedMachine: (machineId: string | null) => void;
    setConnected: (connected: boolean) => void;
    getPredictionStats: () => PredictionStats;
}

export const useTelemetryStore = create<TelemetryState & TelemetryActions & { predictionStats: PredictionStats }>((set, get) => ({
    machines: [],
    telemetryData: [],
    alerts: [],
    selectedMetric: 'air_temperature',
    selectedMachineId: null,
    bufferSize: TELEMETRY_CONFIG.BUFFER_SIZE,
    isConnected: false,
    predictionStats: {
        totalRequests: 0,
        passedCount: 0,
        failedCount: 0,
        failureBreakdown: {},
    },

    setMachines: (machines) => set({ machines }),

    updateMachineStatus: (machineId, status) =>
        set((state) => ({
            machines: state.machines.map((m) =>
                m.id === machineId ? { ...m, status, lastUpdate: Date.now() } : m
            ),
        })),

    addTelemetryPoint: (point) =>
        set((state) => {
            const currentMachinePoints = state.telemetryData.filter(
                (p) => p.machineId === point.machineId
            );

            let newTelemetryData = state.telemetryData;

            if (currentMachinePoints.length >= state.bufferSize) {
                const oldestIndex = newTelemetryData.findIndex(p => p.machineId === point.machineId);
                if (oldestIndex !== -1) {
                    newTelemetryData = [
                        ...newTelemetryData.slice(0, oldestIndex),
                        ...newTelemetryData.slice(oldestIndex + 1)
                    ];
                }
            }

            // Update cumulative prediction stats
            const stats = { ...state.predictionStats };
            stats.totalRequests++;
            if (point.prediction === 1) {
                stats.failedCount++;
                const ft = point.failure_type || 'Unknown';
                if (ft !== 'No Failure') {
                    stats.failureBreakdown = { ...stats.failureBreakdown };
                    stats.failureBreakdown[ft] = (stats.failureBreakdown[ft] || 0) + 1;
                }
            } else {
                stats.passedCount++;
            }

            return {
                telemetryData: [...newTelemetryData, point],
                predictionStats: stats,
            };
        }),

    addAlert: (alert) =>
        set((state) => ({
            alerts: [alert, ...state.alerts].slice(0, 50),
        })),

    setSelectedMetric: (metric) => set({ selectedMetric: metric }),

    setSelectedMachine: (machineId) => set({ selectedMachineId: machineId }),

    setConnected: (isConnected) => set({ isConnected }),

    getPredictionStats: () => get().predictionStats,
}));
