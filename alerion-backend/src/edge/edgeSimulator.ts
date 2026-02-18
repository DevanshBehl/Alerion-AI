/**
 * Alerion AI — Shared Edge Node Simulator
 *
 * Common telemetry generation logic used by all 5 edge nodes.
 * Each edge node imports this module with its own config to start
 * an independent data stream.
 *
 * TELEMETRY SIMULATION:
 * • Values generated within realistic bounds matching predictive_maintenance.csv
 * • Gaussian noise applied for natural sensor variation
 * • Drift simulation: gradual parameter shifts over time (mimics wear)
 * • Occasional spike injection for anomaly-like patterns
 *
 * SCALABILITY:
 * • Each edge node is a standalone process — horizontally scalable
 * • Add more nodes by creating new config files
 * • In production, replace with actual sensor drivers (OPC-UA, MQTT bridge, etc.)
 */

import type { MachineData, EdgeNodeConfig, TelemetryBounds } from '../types/machine.types.js';
import { DEFAULT_TELEMETRY_BOUNDS } from '../types/machine.types.js';
import { initProducer, sendMachineData, shutdownProducer } from '../producers/machineProducer.js';

// ─────────────────────────────────────────────────────────────
// Noise & Variance Utilities
// ─────────────────────────────────────────────────────────────

/** Generate a Gaussian random number using Box-Muller transform */
function gaussianRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdDev;
}

/** Clamp a value between min and max bounds */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Generate a random value within bounds with Gaussian noise.
 * Center is the midpoint of the range, stdDev is ~15% of the range.
 */
function generateSensorValue(
    min: number,
    max: number,
    varianceFactor: number = 1.0,
    drift: number = 0,
): number {
    const center = (min + max) / 2 + drift;
    const range = max - min;
    const stdDev = (range * 0.15) * varianceFactor;
    return clamp(gaussianRandom(center, stdDev), min, max);
}

// ─────────────────────────────────────────────────────────────
// Edge Node Runtime
// ─────────────────────────────────────────────────────────────

/**
 * Start an edge node simulator.
 * Generates telemetry at the configured interval and publishes to Kafka.
 *
 * @param config - Edge node configuration (machineId, type, interval)
 * @param bounds - Optional custom telemetry bounds (defaults to standard)
 */
export async function startEdgeNode(
    config: EdgeNodeConfig,
    bounds: TelemetryBounds = DEFAULT_TELEMETRY_BOUNDS,
): Promise<void> {
    console.log(`\n╔════════════════════════════════════════════╗`);
    console.log(`║  ALERION AI — Edge Node Simulator          ║`);
    console.log(`║  Machine: ${config.machineId.padEnd(20)}         ║`);
    console.log(`║  Type:    ${config.machineType.padEnd(20)}         ║`);
    console.log(`║  Interval: ${String(config.intervalMs + 'ms').padEnd(19)}        ║`);
    console.log(`╚════════════════════════════════════════════╝\n`);

    await initProducer();

    let tickCount = 0;
    let toolWearAccumulator = Math.random() * 50; // Start with some initial wear

    const interval = setInterval(async () => {
        tickCount++;

        // Simulate gradual tool wear accumulation (increases over time, resets periodically)
        toolWearAccumulator += Math.random() * 0.5;
        if (toolWearAccumulator > bounds.toolWear.max) {
            toolWearAccumulator = 0; // Tool replaced
            console.log(`[${config.machineId}] 🔧 Tool replaced — wear reset to 0`);
        }

        // Drift simulation: gradual shift in operating point every ~200 ticks
        const driftCycle = Math.sin(tickCount / 200) * 5;
        const varianceFactor = config.varianceFactor || 1.0;

        // Occasional spike (2% chance) to simulate anomalous conditions
        const spikeMultiplier = Math.random() < 0.02 ? 1.5 : 1.0;

        const data: MachineData = {
            machine_id: config.machineId,
            machine_type: config.machineType,
            air_temperature: Number(
                generateSensorValue(
                    bounds.airTemperature.min,
                    bounds.airTemperature.max,
                    varianceFactor,
                    driftCycle,
                ).toFixed(2),
            ),
            process_temperature: Number(
                generateSensorValue(
                    bounds.processTemperature.min,
                    bounds.processTemperature.max,
                    varianceFactor,
                    driftCycle * 1.2,
                ).toFixed(2),
            ),
            rotational_speed: Math.round(
                generateSensorValue(
                    bounds.rotationalSpeed.min,
                    bounds.rotationalSpeed.max,
                    varianceFactor * spikeMultiplier,
                ),
            ),
            torque: Number(
                (
                    generateSensorValue(
                        bounds.torque.min,
                        bounds.torque.max,
                        varianceFactor * spikeMultiplier,
                    )
                ).toFixed(2),
            ),
            tool_wear: Math.round(
                clamp(toolWearAccumulator, bounds.toolWear.min, bounds.toolWear.max),
            ),
            timestamp: new Date().toISOString(),
        };

        await sendMachineData(data);
    }, config.intervalMs);

    // ─── Graceful Shutdown ─────────────────────────────────────
    const shutdown = async (signal: string) => {
        console.log(`\n[${config.machineId}] Received ${signal} — shutting down...`);
        clearInterval(interval);
        await shutdownProducer();
        console.log(`[${config.machineId}] Shutdown complete. Sent ${tickCount} messages.`);
        process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}
