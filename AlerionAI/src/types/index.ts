export type MachineStatus = 'normal' | 'warning' | 'critical';

export interface Machine {
    id: string;
    name: string;
    status: MachineStatus;
    lastUpdate: number;
}

export interface TelemetryDataPoint {
    timestamp: number;
    machineId: string;
    temperature: number; // usually 20-100 C
    vibration: number;   // usually 0-10 mm/s
    pressure: number;    // usually 10-50 PSI
}

export interface AnomalyAlert {
    id: string;
    machineId: string;
    machineName: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: number;
    isNew: boolean; // for animation
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'viewer';
}

export type TelemetryMetric = 'temperature' | 'vibration' | 'pressure';

export interface TelemetryState {
    machines: Machine[];
    telemetryData: TelemetryDataPoint[];
    alerts: AnomalyAlert[];
    selectedMetric: TelemetryMetric;
    selectedMachineId: string | null;
    bufferSize: number;
}
