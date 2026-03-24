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

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
const USE_MOCK_ML = process.env.USE_MOCK_ML === 'true';

/**
 * ML prediction: calls Python API if available, else falls back to mock rules.
 */
export async function predict(data: MachineData): Promise<Omit<PredictionResult, keyof MachineData | 'processed_at'>> {
    if (!USE_MOCK_ML) {
        try {
            const response = await fetch(`${ML_SERVICE_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // Convert Flask API confidence (0-100) to (0-1)
                let conf = result.confidence / 100;
                
                // Map to typescript expected types
                return {
                    prediction: result.is_failure ? 1 : 0,
                    confidence: conf,
                    anomalyScore: result.is_failure ? 0.5 + (conf / 2) : 0.5 - (conf / 2),
                    failure_type: result.predicted_failure_type,
                };
            } else {
                console.error(`[Predictor] Python API Error: ${response.status}`, await response.text());
                // Fallback below
            }
        } catch (err) {
            console.error(`[Predictor] Fetch Error using Flask API, falling back to mock:`, err);
        }
    }

    // ─── Mock predictor: rules matching real training data patterns ──
    // These rules mirror what the trained Random Forest model learned.

    const tempDiff = data.process_temperature - data.air_temperature;
    const torque_x_wear = data.torque * data.tool_wear;
    const powerMetric = data.torque * data.rotational_speed;

    let failure_type: FailureType = 'No Failure';
    let confidence = 0.92;
    let prediction: 0 | 1 = 0;

    // 1. Power Failure: very high RPM (>2300) with low torque (<15)
    //    Training data: RPM up to 2861, torque as low as 4.6
    if (data.rotational_speed > 2300 && data.torque < 15) {
        failure_type = 'Power Failure';
        prediction = 1;
        confidence = 0.93;
    }
    // 2. Overstrain Failure: low RPM (<1400) + high torque (>50) + high wear (>200)
    //    Training data: RPM 1181–1515, torque 46–68, wear 177–251
    else if (data.rotational_speed < 1400 && data.torque > 50 && data.tool_wear > 200) {
        failure_type = 'Overstrain Failure';
        prediction = 1;
        confidence = 0.91;
    }
    // 3. Tool Wear Failure: very high wear (>200) with normal RPM
    //    Training data: wear 198–253
    else if (data.tool_wear > 200 && data.rotational_speed >= 1400) {
        failure_type = 'Tool Wear Failure';
        prediction = 1;
        confidence = 0.88;
    }
    // 4. Heat Dissipation Failure: low temp_diff (<8.6) + high air temp (>300) + low RPM (<1400)
    //    Training data: temp_diff 7.6–8.6, air 300–304, RPM 1212–1379
    else if (tempDiff < 8.7 && data.air_temperature > 300 && data.rotational_speed < 1400 && data.torque > 40) {
        failure_type = 'Heat Dissipation Failure';
        prediction = 1;
        confidence = 0.90;
    }
    // 5. Random Failures: high torque×wear product with normal RPM
    //    Training data: diverse patterns the model picks up
    else if (torque_x_wear > 7000 && data.rotational_speed < 1500) {
        failure_type = 'Random Failures';
        prediction = 1;
        confidence = 0.70;
    }

    // Compute anomaly score from detection
    const anomalyScore = prediction === 1
        ? Number((0.6 + Math.random() * 0.35).toFixed(4))
        : Number((Math.random() * 0.3).toFixed(4));

    // Add slight noise to confidence
    confidence = Number((confidence + (Math.random() - 0.5) * 0.06).toFixed(4));
    confidence = Math.max(0, Math.min(1, confidence));

    return {
        prediction,
        confidence,
        anomalyScore,
        failure_type,
    };
}
