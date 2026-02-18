// ─────────────────────────────────────────────────────────────
// Machine Types (synced with backend PredictionResult schema)
// ─────────────────────────────────────────────────────────────

export type MachineStatus = 'normal' | 'warning' | 'critical';

export type MachineType = 'L' | 'M' | 'H';

export type FailureType =
    | 'No Failure'
    | 'Heat Dissipation Failure'
    | 'Power Failure'
    | 'Overstrain Failure'
    | 'Tool Wear Failure'
    | 'Random Failures';

export interface Machine {
    id: string;
    name: string;
    type: MachineType;
    status: MachineStatus;
    lastUpdate: number;
}

// ─────────────────────────────────────────────────────────────
// Telemetry — matches backend PredictionResult
// ─────────────────────────────────────────────────────────────

export interface TelemetryDataPoint {
    timestamp: number;
    machineId: string;
    air_temperature: number;
    process_temperature: number;
    rotational_speed: number;
    torque: number;
    tool_wear: number;
    // ML prediction fields
    prediction: 0 | 1;
    confidence: number;
    anomalyScore: number;
    failure_type: FailureType;
}

export interface AnomalyAlert {
    id: string;
    machineId: string;
    machineName: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: number;
    isNew: boolean;
    confidence?: number;
    anomalyScore?: number;
    failure_type?: FailureType;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'viewer';
}

export type TelemetryMetric =
    | 'air_temperature'
    | 'process_temperature'
    | 'rotational_speed'
    | 'torque'
    | 'tool_wear'
    | 'anomalyScore';

export interface TelemetryState {
    machines: Machine[];
    telemetryData: TelemetryDataPoint[];
    alerts: AnomalyAlert[];
    selectedMetric: TelemetryMetric;
    selectedMachineId: string | null;
    bufferSize: number;
    isConnected: boolean;
}

// ─────────────────────────────────────────────────────────────
// WebSocket message envelope (matches backend WSMessage)
// ─────────────────────────────────────────────────────────────

export interface WSMessage<T = any> {
    type: 'prediction' | 'alert' | 'heartbeat' | 'system';
    payload: T;
    timestamp: string;
}
