export const APP_NAME = 'Alerion AI';

export const SIMULATION_CONFIG = {
    INTERVAL_MS: 2000,
    BUFFER_SIZE: 60, // Keep last 60 points (e.g. 2 minutes @ 2s interval)
    ALERT_PROBABILITY: 0.05, // 5% chance of alert per cycle per machine
};

export const MOCK_MACHINES = [
    { id: 'm-001', name: 'Turbine A-1', status: 'normal' },
    { id: 'm-002', name: 'Compressor B-2', status: 'normal' },
    { id: 'm-003', name: 'Pump C-3', status: 'normal' },
    { id: 'm-004', name: 'Generator D-4', status: 'normal' },
    { id: 'm-005', name: 'Cooling Unit E-5', status: 'normal' },
] as const;

export const CHART_COLORS = {
    temperature: '#EF4444', // Red
    vibration: '#F59E0B',   // Amber
    pressure: '#3B82F6',    // Blue
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
    password: 'password123', // In a real app, never store this client-side!
    role: 'admin',
};
