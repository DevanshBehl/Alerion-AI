/**
 * Alerion AI — Mock ML Predictor (TypeScript Fallback)
 *
 * Provides pseudo ML inference for development/testing when
 * the Python FastAPI ML service is not running.
 *
 * DECISION LOGIC:
 * • High torque (>60 Nm) + high tool_wear (>180 min) → failure likely
 * • Very high rotational speed (>2800 RPM) → power failure risk
 * • Large temperature differential (>50K) → heat dissipation failure
 * • Random failure probability (~1%) for edge cases
 *
 * PRODUCTION REPLACEMENT:
 * When USE_MOCK_ML=false, the Python FastAPI service handles inference.
 * This module is NOT used in that path.
 * To switch: set USE_MOCK_ML=false in .env and start the Python service.
 *
 * FUTURE: Replace this with an HTTP call to the Python service:
 *   const response = await fetch(`${ML_SERVICE_URL}/predict`, {
 *     method: 'POST',
 *     body: JSON.stringify(data),
 *   });
 */

import type { MachineData, PredictionResult, FailureType } from '../types/machine.types.js';

/**
 * Mock ML prediction based on heuristic rules.
 * Mimics the behavior of the trained Python model.
 */
export function predict(data: MachineData): Omit<PredictionResult, keyof MachineData | 'processed_at'> {
    let anomalyScore = 0;
    let confidence = 0.85; // Base confidence for mock predictions
    let failure_type: FailureType = 'No Failure';

    // ─── Feature Engineering (matches training pipeline) ───────

    const tempDiff = data.process_temperature - data.air_temperature;
    const powerMetric = data.torque * data.rotational_speed;
    const wearRatio = data.tool_wear / 250; // Normalized 0–1

    // ─── Rule-Based Scoring ────────────────────────────────────

    // 1. Tool Wear Failure: high tool_wear + high torque
    if (data.tool_wear > 180 && data.torque > 60) {
        anomalyScore += 0.4;
        failure_type = 'Tool Wear Failure';
        confidence = 0.92;
    } else if (data.tool_wear > 200) {
        anomalyScore += 0.25;
        failure_type = 'Tool Wear Failure';
        confidence = 0.88;
    }

    // 2. Heat Dissipation Failure: large temperature differential
    if (tempDiff > 50) {
        anomalyScore += 0.35;
        failure_type = 'Heat Dissipation Failure';
        confidence = 0.90;
    } else if (tempDiff > 40) {
        anomalyScore += 0.15;
    }

    // 3. Power Failure: very high rotational speed
    if (data.rotational_speed > 2800) {
        anomalyScore += 0.3;
        failure_type = 'Power Failure';
        confidence = 0.87;
    }

    // 4. Overstrain Failure: extreme torque with high wear
    if (data.torque > 70 && wearRatio > 0.6) {
        anomalyScore += 0.35;
        failure_type = 'Overstrain Failure';
        confidence = 0.91;
    }

    // 5. Power metric anomaly (torque × speed out of normal range)
    if (powerMetric > 150000 || powerMetric < 15000) {
        anomalyScore += 0.2;
    }

    // 6. Random failure (small probability for edge cases)
    if (Math.random() < 0.01) {
        anomalyScore += 0.3;
        failure_type = 'Random Failures';
        confidence = 0.65;
    }

    // ─── Final Prediction ─────────────────────────────────────

    // Normalize anomaly score to [0, 1]
    anomalyScore = Math.min(anomalyScore, 1.0);
    anomalyScore = Number(anomalyScore.toFixed(4));

    // Threshold: anomalyScore > 0.5 → failure predicted
    const prediction: 0 | 1 = anomalyScore > 0.5 ? 1 : 0;

    // If no failure predicted, reset failure_type
    if (prediction === 0) {
        failure_type = 'No Failure';
    }

    // Add slight noise to confidence for realism
    confidence = Number((confidence + (Math.random() - 0.5) * 0.06).toFixed(4));
    confidence = Math.max(0, Math.min(1, confidence));

    return {
        prediction,
        confidence,
        anomalyScore,
        failure_type,
    };
}
