import { create } from 'zustand';
import type { TelemetryState, Machine, TelemetryDataPoint, AnomalyAlert, TelemetryMetric } from '../types';
import { TELEMETRY_CONFIG } from '../utils/constants';

interface TelemetryActions {
    setMachines: (machines: Machine[]) => void;
    updateMachineStatus: (machineId: string, status: Machine['status']) => void;
    addTelemetryPoint: (point: TelemetryDataPoint) => void;
    addAlert: (alert: AnomalyAlert) => void;
    setSelectedMetric: (metric: TelemetryMetric) => void;
    setSelectedMachine: (machineId: string | null) => void;
    setConnected: (connected: boolean) => void;
}

export const useTelemetryStore = create<TelemetryState & TelemetryActions>((set) => ({
    machines: [],
    telemetryData: [],
    alerts: [],
    selectedMetric: 'air_temperature',
    selectedMachineId: null,
    bufferSize: TELEMETRY_CONFIG.BUFFER_SIZE,
    isConnected: false,

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

            return {
                telemetryData: [...newTelemetryData, point],
            };
        }),

    addAlert: (alert) =>
        set((state) => ({
            alerts: [alert, ...state.alerts].slice(0, 50),
        })),

    setSelectedMetric: (metric) => set({ selectedMetric: metric }),

    setSelectedMachine: (machineId) => set({ selectedMachineId: machineId }),

    setConnected: (isConnected) => set({ isConnected }),
}));
