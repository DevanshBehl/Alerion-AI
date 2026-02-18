export const APP_NAME = 'Alerion AI';

/** WebSocket server URL — change to Fog laptop IP for distributed mode */
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

/** Backend health endpoint */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const TELEMETRY_CONFIG = {
    BUFFER_SIZE: 100,   // Keep last 100 points per machine
    RECONNECT_DELAY: 3000, // WebSocket reconnect delay (ms)
    MAX_RECONNECT_ATTEMPTS: 20,
};

/** Machine ID → display name mapping (matches backend edge nodes) */
export const MACHINE_NAMES: Record<string, string> = {
    'MACHINE_001': 'Turbine A-1',
    'MACHINE_002': 'Compressor B-2',
    'MACHINE_003': 'Pump C-3',
    'MACHINE_004': 'Generator D-4',
    'MACHINE_005': 'Cooling Unit E-5',
};

/** Machine ID → type mapping */
export const MACHINE_TYPES: Record<string, 'L' | 'M' | 'H'> = {
    'MACHINE_001': 'L',
    'MACHINE_002': 'M',
    'MACHINE_003': 'H',
    'MACHINE_004': 'L',
    'MACHINE_005': 'M',
};

export const CHART_COLORS: Record<string, string> = {
    air_temperature: '#EF4444',     // Red
    process_temperature: '#F97316', // Orange
    rotational_speed: '#3B82F6',    // Blue
    torque: '#F59E0B',              // Amber
    tool_wear: '#8B5CF6',           // Purple
    anomalyScore: '#10B981',        // Emerald
};

/** Units for each metric */
export const METRIC_UNITS: Record<string, string> = {
    air_temperature: 'K',
    process_temperature: 'K',
    rotational_speed: 'RPM',
    torque: 'Nm',
    tool_wear: 'min',
    anomalyScore: '',
};

export const ANIMATION_DURATION = {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
};

export const MOCK_USER = {
    id: 'u-123',
    name: 'System Admin',
    email: 'admin@alerion.ai',
    password: 'password123',
    role: 'admin',
};
