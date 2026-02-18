"""
Alerion AI — Python ML Inference Microservice

FastAPI service that:
1. Consumes raw telemetry from Kafka topic 'machine-data'
2. Runs the trained ML model for failure prediction
3. Publishes enriched predictions to Kafka topic 'prediction-data'

SCALABILITY:
• Multiple replicas can run simultaneously using Kafka consumer groups.
• Each replica auto-balances partitions via Kafka rebalancing protocol.
• For GPU-intensive models: use batched inference with async queue.
• Model loading happens once at startup — inference is in-memory.
"""

import json
import os
import signal
import threading
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from confluent_kafka import Consumer, Producer, KafkaError, KafkaException
from fastapi import FastAPI
import uvicorn

from predictor import ModelPredictor

# ─────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────

KAFKA_BROKERS = os.getenv("KAFKA_BROKERS", "localhost:9092")
MACHINE_DATA_TOPIC = os.getenv("MACHINE_DATA_TOPIC", "machine-data")
PREDICTION_DATA_TOPIC = os.getenv("PREDICTION_DATA_TOPIC", "prediction-data")
CONSUMER_GROUP = os.getenv("CONSUMER_GROUP", "ml-python-consumers")
MODEL_PATH = os.getenv("MODEL_PATH", "./model/model.pkl")

# ─────────────────────────────────────────────────────────────
# Global State
# ─────────────────────────────────────────────────────────────

predictor = ModelPredictor(MODEL_PATH)
running = True
message_count = 0
alert_count = 0


# ─────────────────────────────────────────────────────────────
# Kafka Consumer/Producer Loop (Background Thread)
# ─────────────────────────────────────────────────────────────

def create_kafka_consumer() -> Consumer:
    """Create a Kafka consumer with production-grade settings."""
    return Consumer({
        "bootstrap.servers": KAFKA_BROKERS,
        "group.id": CONSUMER_GROUP,
        "auto.offset.reset": "latest",
        "enable.auto.commit": True,
        "auto.commit.interval.ms": 1000,
        # SCALABILITY: session.timeout.ms and heartbeat.interval.ms control
        # how quickly Kafka detects a dead consumer and rebalances.
        "session.timeout.ms": 30000,
        "heartbeat.interval.ms": 3000,
        # Fetch settings for throughput tuning
        "fetch.min.bytes": 1,
        "fetch.wait.max.ms": 100,
    })


def create_kafka_producer() -> Producer:
    """Create a Kafka producer with delivery guarantees."""
    return Producer({
        "bootstrap.servers": KAFKA_BROKERS,
        "acks": "all",  # Wait for all replicas to acknowledge
        # Batching for throughput (accumulate messages for 5ms before sending)
        "linger.ms": 5,
        "batch.size": 16384,
    })


def delivery_callback(err, msg):
    """Kafka producer delivery report callback."""
    if err:
        print(f"[Producer] ❌ Delivery failed: {err}")
    # else: successful delivery (no log for normal flow to reduce noise)


def kafka_consumer_loop():
    """
    Background thread: consume machine-data, predict, publish to prediction-data.

    SCALABILITY: This loop runs in a background thread. For multi-core scaling,
    run multiple FastAPI replicas — each gets its own consumer thread, and Kafka
    distributes partitions across them automatically.
    """
    global running, message_count, alert_count

    consumer = create_kafka_consumer()
    producer = create_kafka_producer()

    consumer.subscribe([MACHINE_DATA_TOPIC])
    print(f"[ML Service] Subscribed to '{MACHINE_DATA_TOPIC}' (group: {CONSUMER_GROUP})")
    print(f"[ML Service] Model loaded: {predictor.model_loaded}")

    try:
        while running:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                continue

            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                raise KafkaException(msg.error())

            try:
                # Parse incoming machine data
                machine_data = json.loads(msg.value().decode("utf-8"))

                # Run ML prediction
                prediction_output = predictor.predict(machine_data)

                # Build enriched result
                result = {
                    **machine_data,
                    **prediction_output,
                    "processed_at": datetime.now(timezone.utc).isoformat(),
                }

                # Publish to prediction-data topic
                producer.produce(
                    topic=PREDICTION_DATA_TOPIC,
                    key=machine_data.get("machine_id", "unknown").encode("utf-8"),
                    value=json.dumps(result).encode("utf-8"),
                    callback=delivery_callback,
                )
                producer.poll(0)  # Trigger delivery callbacks

                message_count += 1
                if prediction_output["prediction"] == 1:
                    alert_count += 1

                icon = "🚨" if prediction_output["prediction"] == 1 else "✅"
                print(
                    f"[ML Service] {icon} {machine_data['machine_id']} | "
                    f"pred: {prediction_output['prediction']} | "
                    f"conf: {prediction_output['confidence']:.3f} | "
                    f"anomaly: {prediction_output['anomalyScore']:.3f} | "
                    f"type: {prediction_output['failure_type']}"
                )

            except (json.JSONDecodeError, KeyError) as e:
                print(f"[ML Service] ⚠️  Error processing message: {e}")
                continue

    except KeyboardInterrupt:
        pass
    finally:
        print("[ML Service] Shutting down consumer...")
        producer.flush(timeout=5)
        consumer.close()
        print("[ML Service] Consumer closed")


# ─────────────────────────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start Kafka consumer in background thread on startup."""
    global running

    consumer_thread = threading.Thread(target=kafka_consumer_loop, daemon=True)
    consumer_thread.start()
    print("[ML Service] Kafka consumer thread started")

    yield

    # Shutdown
    running = False
    consumer_thread.join(timeout=10)
    print("[ML Service] Shutdown complete")


app = FastAPI(
    title="Alerion AI — ML Inference Service",
    description="Real-time ML prediction microservice for industrial anomaly detection",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/health")
async def health():
    """Health check endpoint for container orchestration."""
    return {
        "status": "ok",
        "service": "ml-inference",
        "model_loaded": predictor.model_loaded,
        "messages_processed": message_count,
        "alerts_generated": alert_count,
        "uptime_topic": MACHINE_DATA_TOPIC,
    }


@app.get("/stats")
async def stats():
    """Detailed service statistics."""
    return {
        "messages_processed": message_count,
        "alerts_generated": alert_count,
        "alert_rate": f"{(alert_count / max(message_count, 1)) * 100:.2f}%",
        "model_loaded": predictor.model_loaded,
        "model_path": MODEL_PATH,
        "kafka_brokers": KAFKA_BROKERS,
        "consumer_group": CONSUMER_GROUP,
    }


@app.post("/predict")
async def predict_endpoint(data: dict):
    """
    Direct HTTP inference endpoint (for testing or hybrid architecture).
    In production, inference happens via Kafka consumer loop.
    """
    result = predictor.predict(data)
    return result


# ─────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("ML_SERVICE_PORT", "8000"))
    print(f"\n{'='*50}")
    print(f"  ALERION AI — ML Inference Service")
    print(f"  Port: {port}")
    print(f"  Model: {MODEL_PATH}")
    print(f"  Kafka: {KAFKA_BROKERS}")
    print(f"{'='*50}\n")

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
