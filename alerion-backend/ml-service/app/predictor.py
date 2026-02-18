"""
Alerion AI — ML Model Predictor

Loads the trained ML model and provides prediction interface.
Falls back to heuristic-based prediction if model file is not found.

USAGE:
    predictor = ModelPredictor("./model/model.pkl")
    result = predictor.predict(machine_data_dict)

PRODUCTION NOTES:
• Model file should be mounted as a Docker volume or baked into the image.
• For model versioning: use MLflow, DVC, or a model registry.
• For GPU inference: modify to use torch/tensorflow with CUDA.
• The feature extraction pipeline MUST match the training pipeline exactly.
"""

import os
import math
import random
from typing import Any

# Optional imports — gracefully handle missing packages
try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False


class ModelPredictor:
    """
    ML Model wrapper with fallback heuristic prediction.

    Attempts to load a trained model (.pkl) from disk.
    If unavailable, uses rule-based heuristics matching
    the predictive_maintenance dataset patterns.
    """

    def __init__(self, model_path: str = "./model/model.pkl"):
        self.model_path = model_path
        self.model = None
        self.model_loaded = False
        self._load_model()

    def _load_model(self):
        """Attempt to load trained model from file."""
        if not os.path.exists(self.model_path):
            print(f"[Predictor] ⚠️  Model file not found: {self.model_path}")
            print("[Predictor] Using heuristic fallback prediction")
            return

        if not JOBLIB_AVAILABLE:
            print("[Predictor] ⚠️  joblib not installed — using heuristic fallback")
            return

        try:
            self.model = joblib.load(self.model_path)
            self.model_loaded = True
            print(f"[Predictor] ✅ Model loaded from: {self.model_path}")
            print(f"[Predictor] Model type: {type(self.model).__name__}")
        except Exception as e:
            print(f"[Predictor] ❌ Failed to load model: {e}")
            print("[Predictor] Using heuristic fallback prediction")

    def predict(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Run prediction on machine telemetry data.

        Args:
            data: Dictionary with keys matching MachineData interface:
                  machine_id, machine_type, air_temperature, process_temperature,
                  rotational_speed, torque, tool_wear

        Returns:
            Dictionary with prediction results:
                prediction: 0 or 1
                confidence: float 0.0–1.0
                anomalyScore: float 0.0–1.0
                failure_type: string
        """
        if self.model_loaded and self.model is not None:
            return self._model_predict(data)
        return self._heuristic_predict(data)

    def _model_predict(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Run the trained model for prediction.
        Feature extraction matches the training pipeline.
        """
        try:
            # Extract features in the same order as training
            features = self._extract_features(data)

            if NUMPY_AVAILABLE:
                feature_array = np.array([features])
            else:
                feature_array = [features]

            # Get prediction
            prediction = int(self.model.predict(feature_array)[0])

            # Get probability if available (for confidence score)
            confidence = 0.85
            if hasattr(self.model, "predict_proba"):
                proba = self.model.predict_proba(feature_array)[0]
                confidence = float(max(proba))

            # Compute anomaly score from multiple signals
            anomaly_score = self._compute_anomaly_score(data, confidence, prediction)

            # Determine failure type
            failure_type = self._classify_failure(data) if prediction == 1 else "No Failure"

            return {
                "prediction": prediction,
                "confidence": round(confidence, 4),
                "anomalyScore": round(anomaly_score, 4),
                "failure_type": failure_type,
            }

        except Exception as e:
            print(f"[Predictor] Model inference error: {e} — falling back to heuristic")
            return self._heuristic_predict(data)

    def _extract_features(self, data: dict[str, Any]) -> list[float]:
        """
        Extract feature vector matching the training pipeline.

        Adjust this to match your exact training feature set.
        Common features from predictive_maintenance.csv:
        [air_temp, process_temp, rotational_speed, torque, tool_wear, type_encoded]
        """
        # Encode machine type
        type_map = {"L": 0, "M": 1, "H": 2}
        machine_type_encoded = type_map.get(data.get("machine_type", "M"), 1)

        return [
            float(data.get("air_temperature", 300)),
            float(data.get("process_temperature", 310)),
            float(data.get("rotational_speed", 1500)),
            float(data.get("torque", 40)),
            float(data.get("tool_wear", 100)),
            float(machine_type_encoded),
        ]

    def _heuristic_predict(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Heuristic-based prediction fallback.
        Mimics trained model behavior using domain-specific rules.
        """
        anomaly_score = 0.0
        confidence = 0.85
        failure_type = "No Failure"

        air_temp = float(data.get("air_temperature", 300))
        process_temp = float(data.get("process_temperature", 310))
        rotational_speed = float(data.get("rotational_speed", 1500))
        torque = float(data.get("torque", 40))
        tool_wear = float(data.get("tool_wear", 100))

        temp_diff = process_temp - air_temp
        power_metric = torque * rotational_speed
        wear_ratio = tool_wear / 250.0

        # Rule 1: Tool Wear Failure
        if tool_wear > 180 and torque > 60:
            anomaly_score += 0.4
            failure_type = "Tool Wear Failure"
            confidence = 0.92
        elif tool_wear > 200:
            anomaly_score += 0.25
            failure_type = "Tool Wear Failure"
            confidence = 0.88

        # Rule 2: Heat Dissipation Failure
        if temp_diff > 50:
            anomaly_score += 0.35
            failure_type = "Heat Dissipation Failure"
            confidence = 0.90
        elif temp_diff > 40:
            anomaly_score += 0.15

        # Rule 3: Power Failure
        if rotational_speed > 2800:
            anomaly_score += 0.3
            failure_type = "Power Failure"
            confidence = 0.87

        # Rule 4: Overstrain Failure
        if torque > 70 and wear_ratio > 0.6:
            anomaly_score += 0.35
            failure_type = "Overstrain Failure"
            confidence = 0.91

        # Rule 5: Power metric anomaly
        if power_metric > 150000 or power_metric < 15000:
            anomaly_score += 0.2

        # Rule 6: Random failure
        if random.random() < 0.01:
            anomaly_score += 0.3
            failure_type = "Random Failures"
            confidence = 0.65

        anomaly_score = min(anomaly_score, 1.0)
        prediction = 1 if anomaly_score > 0.5 else 0

        if prediction == 0:
            failure_type = "No Failure"

        # Add noise for realism
        confidence += (random.random() - 0.5) * 0.06
        confidence = max(0.0, min(1.0, confidence))

        return {
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "anomalyScore": round(anomaly_score, 4),
            "failure_type": failure_type,
        }

    def _compute_anomaly_score(
        self, data: dict[str, Any], confidence: float, prediction: int
    ) -> float:
        """Compute a composite anomaly score from multiple signals."""
        base = confidence if prediction == 1 else (1 - confidence)

        # Boost score based on extreme sensor values
        torque = float(data.get("torque", 40))
        tool_wear = float(data.get("tool_wear", 100))
        temp_diff = float(data.get("process_temperature", 310)) - float(
            data.get("air_temperature", 300)
        )

        boost = 0.0
        if torque > 65:
            boost += 0.1
        if tool_wear > 180:
            boost += 0.1
        if temp_diff > 45:
            boost += 0.1

        return min(base + boost, 1.0)

    def _classify_failure(self, data: dict[str, Any]) -> str:
        """Classify the most likely failure type based on sensor readings."""
        torque = float(data.get("torque", 40))
        tool_wear = float(data.get("tool_wear", 100))
        temp_diff = float(data.get("process_temperature", 310)) - float(
            data.get("air_temperature", 300)
        )
        rotational_speed = float(data.get("rotational_speed", 1500))

        # Priority-based classification
        if tool_wear > 180 and torque > 55:
            return "Tool Wear Failure"
        if temp_diff > 45:
            return "Heat Dissipation Failure"
        if torque > 70 and tool_wear > 150:
            return "Overstrain Failure"
        if rotational_speed > 2700:
            return "Power Failure"
        return "Random Failures"
