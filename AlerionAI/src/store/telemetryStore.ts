import { create } from 'zustand';
import type { TelemetryState, Machine, TelemetryDataPoint, AnomalyAlert, TelemetryMetric } from '../types';
import { SIMULATION_CONFIG } from '../utils/constants';

interface TelemetryActions {
    setMachines: (machines: Machine[]) => void;
    updateMachineStatus: (machineId: string, status: Machine['status']) => void;
    addTelemetryPoint: (point: TelemetryDataPoint) => void;
    addAlert: (alert: AnomalyAlert) => void;
    setSelectedMetric: (metric: TelemetryMetric) => void;
    setSelectedMachine: (machineId: string | null) => void;
}

export const useTelemetryStore = create<TelemetryState & TelemetryActions>((set) => ({
    machines: [],
    telemetryData: [],
    alerts: [],
    selectedMetric: 'temperature',
    selectedMachineId: null,
    bufferSize: SIMULATION_CONFIG.BUFFER_SIZE,

    setMachines: (machines) => set({ machines }),

    updateMachineStatus: (machineId, status) =>
        set((state) => ({
            machines: state.machines.map((m) =>
                m.id === machineId ? { ...m, status, lastUpdate: Date.now() } : m
            ),
        })),

    addTelemetryPoint: (point) =>
        set((state) => {
            // Logic to append point and keep max buffer size PER MACHINE
            // This is slightly inefficient O(N) but fine for N < 1000 points

            const currentMachinePoints = state.telemetryData.filter(
                (p) => p.machineId === point.machineId
            );

            // If we have reached buffer size for this machine, drop the oldest point
            let newTelemetryData = state.telemetryData;

            if (currentMachinePoints.length >= state.bufferSize) {
                // Find the index of the oldest point for this machine to remove it
                // Since points are time-ordered, it should be the first one matching the machineId
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
            alerts: [alert, ...state.alerts].slice(0, 50), // Keep last 50 alerts
        })),

    setSelectedMetric: (metric) => set({ selectedMetric: metric }),

    setSelectedMachine: (machineId) => set({ selectedMachineId: machineId }),
}));
