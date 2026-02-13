📡 Alerion AI
Distributed Edge–Fog AI Monitoring Platform

Alerion AI is a distributed industrial monitoring system designed to simulate real-world machine telemetry pipelines using Edge nodes, Fog computing, Kafka streaming, ML-based anomaly detection, and a real-time React dashboard.

This project demonstrates scalable distributed systems architecture in a local multi-device environment.

🏗 Architecture Overview

The system follows a 3-layer distributed architecture:

                ┌────────────────────────┐
                │      EDGE LAYER        │
                │  (Laptop 1)            │
                │  - Sensor simulators   │
                │  - Machine generators  │
                └──────────┬─────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │      FOG LAYER         │
                │  (Laptop 2)            │
                │  - Kafka Broker        │
                │  - Statistical Filter  │
                │  - ML Anomaly Model    │
                │  - WebSocket Server    │
                └──────────┬─────────────┘
                           │
                           ▼
                ┌────────────────────────┐
                │   DASHBOARD LAYER      │
                │   (Laptop 3)           │
                │   - React Frontend     │
                │   - Real-time Charts   │
                │   - Alerts UI          │
                └────────────────────────┘

🧠 System Flow

Edge nodes simulate machine sensor data.

Data is pushed to the Fog layer via Kafka.

Fog layer performs:

Statistical boundary validation

ML-based anomaly detection

If statistical model fails → immediate alert.

If ML detects anomaly → alert generated.

Dashboard receives real-time updates via WebSocket.

⚙️ Technologies Used
Edge Layer

Node.js

TypeScript

KafkaJS

Fog Layer

Apache Kafka (Docker)

Node.js / Python

ML Model (Pre-trained anomaly detection)

WebSocket Server

Dashboard Layer

React

TypeScript

Tailwind CSS

Recharts

WebSocket Client

🖥 Multi-Laptop Setup (Distributed Demo Mode)

This project is designed to run across 3 physical laptops connected via a local WiFi hotspot.

Laptop	Role
Laptop 1	Edge Nodes
Laptop 2	Fog Layer (Kafka + ML + WS Server)
Laptop 3	React Dashboard
🌐 Network Configuration
Step 1: Find Fog Laptop IP

On Laptop 2:

ipconfig getifaddr en0


Example:

192.168.1.45


This IP will be used by:

Edge nodes

Dashboard

🐳 Kafka Setup (Fog Laptop)
Start Kafka
docker compose up -d

Stop Kafka
docker compose down

Create Topic
docker exec -it kafka kafka-topics \
  --create \
  --topic sensor-data \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1

🔌 WebSocket Server Configuration

Make sure server binds to all interfaces:

server.listen(3000, '0.0.0.0')


Dashboard connects using:

ws://192.168.1.45:3000


NOT localhost.

📊 Statistical Model Logic

The Fog layer applies a variance boundary check:

Example:

Temperature safe range: 20°C – 80°C
Vibration threshold: < 5.0
Pressure threshold: < 200 PSI


If data exceeds threshold:

ALERT: Machine ID XX requires attention.


The message bypasses ML and triggers immediate alert.

🤖 ML Anomaly Detection

If statistical validation passes:

Data is forwarded to ML model.

Model predicts anomaly probability.

If anomaly score > threshold:

Alert generated

Dashboard updated

Model can be:

Isolation Forest

Autoencoder

One-Class SVM

Custom TensorFlow/PyTorch model

📈 Dashboard Features

Real-time machine status

Interactive graphs

Live anomaly feed

Alert notification panel

Machine health statistics

Dark professional UI

🚀 Running the Full System
Laptop 2 (Fog Layer)
docker compose up -d
npm run start:fog

Laptop 1 (Edge Layer)
npm run start:edge


Make sure Kafka broker is set to:

192.168.1.45:9092

Laptop 3 (Dashboard)
npm run dev


Ensure WebSocket URL points to:

ws://192.168.1.45:3000

📊 Performance Capability

Local demo can handle:

2 machine updates/sec (very low load)

100+ updates/sec easily

10,000 messages/sec theoretically (hardware dependent)

Kafka provides buffering to handle burst traffic.

🧱 Scalability Design

Although demo runs locally, the architecture supports:

Horizontal WebSocket scaling

Multiple Kafka brokers

Partitioned topics

Scalable ML workers

Cloud deployment (AWS / GCP)

🔐 Authentication (Dashboard)

JWT-based authentication

Protected routes

Role-based access (Admin / Viewer)

🛡 Alert Logic

Alerts are triggered when:

Statistical boundary violation

ML anomaly detection

Edge node failure detection

Kafka consumer lag threshold exceeded

📂 Suggested Folder Structure
alerion-ai/
│
├── edge/
│   ├── src/
│   └── package.json
│
├── fog/
│   ├── kafka/
│   ├── ml/
│   ├── websocket/
│   └── package.json
│
├── dashboard/
│   ├── src/
│   └── package.json
│
└── README.md

🎯 Demo Explanation Script (For Presentation)

“Alerion AI simulates a distributed industrial monitoring platform.
Edge nodes generate machine telemetry.
Fog layer processes data using statistical filtering and ML anomaly detection.
Kafka ensures scalable, decoupled streaming.
WebSockets push real-time updates to the dashboard.
The architecture is horizontally scalable and production-ready.”

🔮 Future Improvements

Kubernetes deployment

Kafka cluster (multi-broker)

Redis caching

Alert escalation via email/SMS

Edge AI preprocessing

Time-series database integration (InfluxDB)

📌 Why This Project Matters

Industrial IoT systems require:

Low-latency processing

Distributed compute

Real-time anomaly detection

Fault tolerance

Alerion AI simulates this architecture in a controlled local environment.

🧑‍💻 Developed By

Alerion AI Team
Distributed Systems & AI Engineering