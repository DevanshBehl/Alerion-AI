import os
import json
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), 'model_artifacts')

model = joblib.load(os.path.join(ARTIFACTS_DIR, 'model.pkl'))
scaler = joblib.load(os.path.join(ARTIFACTS_DIR, 'scaler.pkl'))
label_encoder = joblib.load(os.path.join(ARTIFACTS_DIR, 'label_encoder.pkl'))

with open(os.path.join(ARTIFACTS_DIR, 'metadata.json')) as f:
    metadata = json.load(f)

FEATURE_COLS = metadata['feature_cols']
CLASSES = metadata['classes']

def build_feature_vector(data: dict) -> pd.DataFrame:
    type_map = {'L': 0, 'M': 1, 'H': 2}

    air_temp = float(data['air_temperature'])
    proc_temp = float(data['process_temperature'])
    rpm = float(data['rotational_speed'])
    torque = float(data['torque'])
    wear = float(data['tool_wear'])
    mtype = str(data.get('machine_type', 'M')).upper()

    type_enc = type_map.get(mtype, 1)
    temp_diff = proc_temp - air_temp
    power_W = torque * (rpm * 2 * np.pi / 60)
    torque_x_wear = torque * wear
    rpm_per_torque = rpm / (torque + 1e-6)

    features = pd.DataFrame([{
        'Air temperature [K]':      air_temp,
        'Process temperature [K]':  proc_temp,
        'Rotational speed [rpm]':   rpm,
        'Torque [Nm]':              torque,
        'Tool wear [min]':          wear,
        'type_encoded':             type_enc,
        'temp_diff':                temp_diff,
        'power_W':                  power_W,
        'torque_x_wear':            torque_x_wear,
        'rpm_per_torque':           rpm_per_torque,
    }])

    return features[FEATURE_COLS]

def validate_input(data: dict) -> list[str]:
    errors = []
    required = {
        'air_temperature':     (250, 400, 'Kelvin'),
        'process_temperature': (250, 400, 'Kelvin'),
        'rotational_speed':    (0, 10000, 'rpm'),
        'torque':              (0, 300, 'Nm'),
        'tool_wear':           (0, 500, 'minutes'),
    }
    for field, (lo, hi, unit) in required.items():
        if field not in data:
            errors.append(f"Missing required field: '{field}'")
        else:
            try:
                val = float(data[field])
                if not (lo <= val <= hi):
                    errors.append(f"'{field}' value {val} out of expected range [{lo}, {hi}] {unit}")
            except (ValueError, TypeError):
                errors.append(f"'{field}' must be a number")

    if 'machine_type' in data:
        if str(data['machine_type']).upper() not in ('L', 'M', 'H'):
            errors.append("'machine_type' must be one of: 'L', 'M', 'H'")

    return errors

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model': metadata['best_model'],
        'version': '1.0.0'
    }), 200

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({
        'classes': CLASSES,
        'count': len(CLASSES)
    }), 200

@app.route('/metadata', methods=['GET'])
def get_metadata():
    return jsonify(metadata), 200

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 415

    data = request.get_json()

    errors = validate_input(data)
    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    try:
        features_df = build_feature_vector(data)
        features_scaled = scaler.transform(features_df)

        pred_idx = int(model.predict(features_scaled)[0])
        prob = model.predict_proba(features_scaled)[0]

        predicted_class = label_encoder.classes_[pred_idx]
        confidence = round(float(prob[pred_idx]) * 100, 2)
        is_failure = predicted_class != 'No Failure'

        severity_map = {
            'No Failure':                 'none',
            'Heat Dissipation Failure':   'high',
            'Power Failure':              'high',
            'Overstrain Failure':         'high',
            'Tool Wear Failure':          'medium',
            'Random Failures':            'medium',
        }

        all_probs = {
            cls: round(float(p) * 100, 2)
            for cls, p in zip(label_encoder.classes_, prob)
        }

        response = {
            'predicted_failure_type': predicted_class,
            'failure_class_index':    pred_idx,
            'is_failure':             is_failure,
            'confidence':             confidence,
            'severity':               severity_map.get(predicted_class, 'unknown'),
            'all_probabilities':      all_probs,
            'input_received':         data,
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    if not request.is_json:
        return jsonify({'error': 'Content-Type must be application/json'}), 415

    data = request.get_json()
    readings = data.get('readings', [])

    if not readings:
        return jsonify({'error': "'readings' array is required and cannot be empty"}), 400

    if len(readings) > 100:
        return jsonify({'error': 'Batch size cannot exceed 100 readings'}), 400

    results = []
    for i, reading in enumerate(readings):
        errors = validate_input(reading)
        if errors:
            results.append({'index': i, 'error': errors})
            continue

        try:
            features_df = build_feature_vector(reading)
            features_scaled = scaler.transform(features_df)

            pred_idx = int(model.predict(features_scaled)[0])
            prob = model.predict_proba(features_scaled)[0]
            predicted_class = label_encoder.classes_[pred_idx]

            results.append({
                'index': i,
                'predicted_failure_type': predicted_class,
                'is_failure': predicted_class != 'No Failure',
                'confidence': round(float(prob[pred_idx]) * 100, 2),
            })
        except Exception as e:
            results.append({'index': i, 'error': str(e)})

    return jsonify({'results': results, 'total': len(results)}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    print(f"\nAPI starting on http://localhost:{port}")
    print(f"   Endpoints: /health  /predict  /predict/batch  /classes  /metadata\n")
    app.run(host='0.0.0.0', port=port, debug=debug)