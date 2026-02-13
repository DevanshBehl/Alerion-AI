import { useTelemetryStore } from '../store/telemetryStore';
import { useMemo } from 'react';

export const useTelemetry = () => {
    return useTelemetryStore();
};

export const useMachineTelemetry = (machineId: string | null) => {
    const telemetryData = useTelemetryStore((state) => state.telemetryData);


    const data = useMemo(() => {
        if (!machineId) return [];

        // Sort by timestamp just in case, though they should be ordered
        return telemetryData
            .filter((d) => d.machineId === machineId)
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [telemetryData, machineId]);

    return data;
};

export const useLatestAlerts = () => {
    return useTelemetryStore((state) => state.alerts);
};

export const useMachineStats = () => {
    const machines = useTelemetryStore((state) => state.machines);

    const stats = useMemo(() => {
        const total = machines.length;
        const active = machines.filter(m => m.status !== 'critical').length; // Assuming critical might mean down/issue
        const alerts = machines.filter(m => m.status !== 'normal').length;

        return { total, active, alerts };
    }, [machines]);

    return stats;
};
