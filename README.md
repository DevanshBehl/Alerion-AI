# 📡 Alerion AI

### Distributed Edge–Fog AI Monitoring Platform

**Alerion AI** is a distributed industrial monitoring system designed to simulate real-world machine telemetry pipelines using Edge nodes, Fog computing, Kafka streaming, ML-based anomaly detection, and a real-time React dashboard.

> This project demonstrates scalable distributed systems architecture in a local multi-device environment.

---

## 🏗 Architecture Overview

The system follows a 3-layer distributed architecture:

```text
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
```

### 🧠 System Flow

1.  **Edge nodes** simulate machine sensor data.
2.  Data is pushed to the **Fog layer** via Kafka.
3.  **Fog layer** performs:
    *   Statistical boundary validation
    *   ML-based anomaly detection
4.  **Logic**:
    *   If statistical model fails → **Immediate Alert**.
    *   If ML detects anomaly → **Alert Generated**.
5.  **Dashboard** receives real-time updates via WebSocket.

---

## ⚙️ Technologies Used

| Layer | Technologies |
| :--- | :--- |
| **Edge Layer** | Node.js, TypeScript, KafkaJS |
| **Fog Layer** | Apache Kafka (Docker), Node.js / Python, ML Model (Pre-trained), WebSocket Server |
| **Dashboard Layer** | React, TypeScript, Tailwind CSS, Recharts, WebSocket Client |

---

## 🖥 Multi-Laptop Setup (Distributed Demo Mode)

This project is designed to run across 3 physical laptops connected via a local WiFi hotspot.

| Device | Role |
| :--- | :--- |
| **Laptop 1** | Edge Nodes |
| **Laptop 2** | Fog Layer (Kafka + ML + WS Server) |
| **Laptop 3** | React Dashboard |

### 🌐 Network Configuration

**Step 1: Find Fog Laptop IP**

On **Laptop 2** (Fog Layer), run:

```bash
ipconfig getifaddr en0
```

> **Example:** `192.168.1.45`

This IP will be used by both **Edge nodes** and the **Dashboard**.

---

## 🐳 Kafka Setup (Fog Laptop)

**Start Kafka**
```bash
docker compose up -d
```

**Stop Kafka**
```bash
docker compose down
```

**Create Topic**
```bash
docker exec -it kafka kafka-topics \
  --create \
  --topic sensor-data \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```

---

## 🔌 WebSocket Server Configuration

Make sure the server binds to all interfaces:

```javascript
server.listen(3000, '0.0.0.0')
```

**Dashboard Connection:**
The dashboard must connect using the Fog Laptop's IP, **NOT** localhost.

```text
ws://192.168.1.45:3000
```

---

## 📊 Anomaly Detection Logic

### Statistical Model Logic
The Fog layer applies a variance boundary check.

*   **Temperature safe range:** 20°C – 80°C
*   **Vibration threshold:** < 5.0
*   **Pressure threshold:** < 200 PSI

> **Alert:** If data exceeds these thresholds, an immediate alert is triggered: *"Machine ID XX requires attention."* (Bypasses ML).

### 🤖 ML Anomaly Detection
If statistical validation passes:

1.  Data is forwarded to the **ML model**.
2.  Model predicts anomaly probability.
3.  If `anomaly score > threshold`:
    *   **Alert generated**
    *   **Dashboard updated**

*Supported Models:* Isolation Forest, Autoencoder, One-Class SVM, or Custom TensorFlow/PyTorch model.

---

## 📈 Dashboard Features

*   ✅ **Real-time machine status**
*   ✅ **Interactive graphs**
*   ✅ **Live anomaly feed**
*   ✅ **Alert notification panel**
*   ✅ **Machine health statistics**
*   ✅ **Dark professional UI**

---

## 🚀 Running the Full System

### 1. Laptop 2 (Fog Layer)
```bash
docker compose up -d
npm run start:fog
```

### 2. Laptop 1 (Edge Layer)
Make sure Kafka broker is set to `192.168.1.45:9092`.
```bash
npm run start:edge
```

### 3. Laptop 3 (Dashboard)
Ensure WebSocket URL points to `ws://192.168.1.45:3000`.
```bash
npm run dev
```

---

## 📊 Performance & Scalability

### Capabilities
*   **Local demo**: Handles 2 machine updates/sec (very low load).
*   **High load**: Can handle 100+ updates/sec easily.
*   **Theoretical max**: 10,000 messages/sec (hardware dependent).
*   **Buffering**: Kafka handles burst traffic.

### Scalability Design
Although the demo runs locally, the architecture supports:
*   Horizontal WebSocket scaling
*   Multiple Kafka brokers
*   Partitioned topics
*   Scalable ML workers
*   Cloud deployment (AWS / GCP)

---

## 🔐 Security & Alerts

### Authentication (Dashboard)
*   JWT-based authentication
*   Protected routes
*   Role-based access (Admin / Viewer)

### 🛡 Alert Logic
Alerts are triggered when:
1.  Statistical boundary violation
2.  ML anomaly detection
3.  Edge node failure detection
4.  Kafka consumer lag threshold exceeded

---

## 📂 Suggested Folder Structure

```text
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
```

---

## 🎯 Demo Explanation Script (For Presentation)

> "Alerion AI simulates a distributed industrial monitoring platform. 
> Edge nodes generate machine telemetry. 
> Fog layer processes data using statistical filtering and ML anomaly detection. 
> Kafka ensures scalable, decoupled streaming. 
> WebSockets push real-time updates to the dashboard. 
> The architecture is horizontally scalable and production-ready."

---

## 🔮 Future Improvements

*   [ ] Kubernetes deployment
*   [ ] Kafka cluster (multi-broker)
*   [ ] Redis caching
*   [ ] Alert escalation via email/SMS
*   [ ] Edge AI preprocessing
*   [ ] Time-series database integration (InfluxDB)

---

## 📌 Why This Project Matters

Industrial IoT systems require:
*   **Low-latency processing**
*   **Distributed compute**
*   **Real-time anomaly detection**
*   **Fault tolerance**

Alerion AI simulates this architecture in a controlled local environment.

---

### 🧑‍💻 Developed By

**Alerion AI Team**
*Distributed Systems & AI Engineering*