<div align="center">

# 📡 Alerion AI

### Distributed Edge–Fog AI Monitoring Platform

**Real-time industrial anomaly detection** powered by Kafka streaming, ML inference, and WebSocket-driven dashboards.

[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Apache Kafka](https://img.shields.io/badge/Kafka-KRaft_Mode-231F20?logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [High-Level Diagram](#high-level-diagram)
  - [Data Flow Pipeline](#data-flow-pipeline)
  - [Component Interaction](#component-interaction)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Start Database & Kafka (Docker)](#1-start-database--kafka-docker)
  - [2. Start the Backend API & WebSocket](#2-start-the-backend-api--websocket)
  - [3. Start Edge Node Simulators](#3-start-edge-node-simulators)
  - [4. Start the Dashboard (Frontend)](#4-start-the-dashboard-frontend)
- [Running Modes](#running-modes)
  - [Single Machine (Development)](#single-machine-development)
  - [Multi-Laptop (Distributed Demo)](#multi-laptop-distributed-demo)
- [ML Model Details](#ml-model-details)
- [API Reference](#api-reference)
- [Kafka Topics](#kafka-topics)
- [Environment Variables](#environment-variables)
- [Scalability & Performance](#scalability--performance)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Alerion AI** simulates a full-scale industrial IoT monitoring pipeline. It generates machine sensor telemetry from edge nodes, streams it through Apache Kafka to a fog layer that performs both statistical boundary checks and ML-based anomaly detection, and pushes real-time predictions to a React dashboard via WebSockets.

> This project demonstrates scalable distributed systems architecture in a local multi-device environment.

**Key capabilities:**
- 🏭 **5 independent edge nodes** simulating CNC machines with realistic sensor drift & anomaly spikes
- ⚡ **Apache Kafka (KRaft mode)** for fault-tolerant, high-throughput event streaming
- 🤖 **Dual ML inference** — Flask standalone API + Dockerized FastAPI Kafka consumer
- 📊 **Real-time React dashboard** with live charts, alert feeds, and machine health views
- 🐳 **One-command Docker deployment** orchestrating Kafka, ML, and backend

---

## Architecture

### High-Level Diagram

```mermaid
graph TB
    subgraph Edge["🔧 Edge Layer"]
        E1["Edge Node 1<br/>(CNC Mill — H)"]
        E2["Edge Node 2<br/>(Lathe — M)"]
        E3["Edge Node 3<br/>(Press — L)"]
        E4["Edge Node 4<br/>(Grinder — H)"]
        E5["Edge Node 5<br/>(Drill — M)"]
    end

    subgraph Fog["☁️ Fog Layer"]
        K["Apache Kafka<br/>KRaft Mode"]
        ML["ML Service<br/>XGBoost / Random Forest"]
        WS["WebSocket Server<br/>Port 8080"]
        HTTP["Express Health API<br/>Port 3000"]
    end

    subgraph Dashboard["📊 Dashboard Layer"]
        UI["React Frontend<br/>Vite + Tailwind"]
    end

    E1 & E2 & E3 & E4 & E5 -->|"Produce → machine-data"| K
    K -->|"Consume"| ML
    ML -->|"Produce → prediction-data"| K
    K -->|"Consume"| WS
    WS -->|"WebSocket Push"| UI
    HTTP -.->|"Health / Stats"| UI

    style Edge fill:#1a1a2e,stroke:#e94560,color:#fff
    style Fog fill:#16213e,stroke:#0f3460,color:#fff
    style Dashboard fill:#0f3460,stroke:#533483,color:#fff
```

### Data Flow Pipeline

```mermaid
sequenceDiagram
    participant Edge as 🔧 Edge Node
    participant Kafka as 📨 Kafka Broker
    participant ML as 🤖 ML Service
    participant Backend as ⚙️ Backend
    participant WS as 🔌 WebSocket
    participant UI as 📊 Dashboard

    Edge->>Kafka: Publish sensor telemetry<br/>(topic: machine-data)
    Kafka->>ML: Consume raw readings
    ML->>ML: Feature engineering<br/>+ Model inference
    ML->>Kafka: Publish prediction<br/>(topic: prediction-data)
    Kafka->>Backend: Consume predictions
    Backend->>WS: Forward to WebSocket
    WS->>UI: Real-time push<br/>(JSON over WS)
    UI->>UI: Render charts,<br/>alerts & status
```

### Component Interaction

```mermaid
flowchart LR
    subgraph Telemetry["Sensor Telemetry"]
        direction TB
        T1["Air Temperature (K)"]
        T2["Process Temperature (K)"]
        T3["Rotational Speed (RPM)"]
        T4["Torque (Nm)"]
        T5["Tool Wear (min)"]
    end

    subgraph Detection["Anomaly Detection"]
        direction TB
        STAT["Statistical<br/>Boundary Check"]
        MLM["ML Model<br/>Prediction"]
    end

    subgraph Outcomes["Results"]
        direction TB
        OK["✅ Normal Operation"]
        ALERT["🚨 Alert Generated"]
    end

    Telemetry --> STAT
    STAT -->|"Within bounds"| MLM
    STAT -->|"Boundary violation"| ALERT
    MLM -->|"No anomaly"| OK
    MLM -->|"Anomaly detected"| ALERT
```

---

## Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Edge** | Node.js 22, TypeScript, KafkaJS | Sensor data simulation & Kafka publishing |
| **Kafka** | Confluent Kafka 7.6.0 (KRaft) | Event streaming, topic partitioning, consumer groups |
| **ML (Dockerized)** | Python 3.11, FastAPI, Confluent Kafka | Real-time Kafka consumer → ML inference → Kafka producer |
| **ML (Standalone)** | Python, Flask, scikit-learn, XGBoost | REST API for batch & single predictions |
| **Backend** | Node.js, Express, WebSocket (ws) | Kafka → WebSocket bridge, health/stats endpoints |
| **Frontend** | React 19, Vite, Tailwind CSS, Recharts | Real-time dashboard, charts, alerts UI |
| **State** | Zustand | Frontend state management |
| **Animations** | Framer Motion | UI transitions & micro-animations |
| **Infra** | Docker, Docker Compose | One-command deployment of all services |

---

## Project Structure

```text
alerion-ai/
│
├── alerion-backend/              # ⚙️ Fog Layer (Node.js + Docker services)
│   ├── src/
│   │   ├── index.ts              #    Backend entrypoint (Express + WS + Consumers)
│   │   ├── config/
│   │   │   └── kafka.ts          #    Kafka client factory & topic management
│   │   ├── consumers/
│   │   │   ├── mlConsumer.ts     #    Kafka → ML inference → Kafka pipeline
│   │   │   └── predictionConsumer.ts  # Kafka → WebSocket bridge
│   │   ├── producers/
│   │   │   └── machineProducer.ts     # Edge → Kafka publisher
│   │   ├── edge/
│   │   │   ├── edgeSimulator.ts  #    Shared telemetry generator (Gaussian noise + drift)
│   │   │   ├── edgeNode1.ts      #    CNC Milling Machine (High capacity)
│   │   │   ├── edgeNode2.ts      #    Industrial Lathe (Medium)
│   │   │   ├── edgeNode3.ts      #    Hydraulic Press (Low)
│   │   │   ├── edgeNode4.ts      #    Surface Grinder (High)
│   │   │   └── edgeNode5.ts      #    Precision Drill (Medium)
│   │   ├── websocket/
│   │   │   └── wsServer.ts       #    WebSocket broadcast server
│   │   ├── types/
│   │   │   └── machine.types.ts  #    Shared TypeScript interfaces
│   │   ├── ml/                   #    Mock ML consumer (fallback)
│   │   └── test/
│   │       └── wsTestClient.ts   #    WebSocket test client
│   ├── ml-service/               # 🤖 Dockerized FastAPI ML microservice
│   │   ├── app/
│   │   │   ├── main.py           #    FastAPI app + Kafka consumer/producer
│   │   │   └── predictor.py      #    ML model loader + inference
│   │   ├── model/                #    Trained model artifacts (.pkl)
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── docker-compose.yml        # 🐳 Full stack orchestration
│   ├── Dockerfile                #    Backend container
│   ├── .env.example              #    Environment template
│   └── package.json
│
├── AlerionAI/                    # 📊 Dashboard (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx       #    Landing page
│   │   │   ├── Dashboard.tsx     #    Real-time monitoring dashboard
│   │   │   ├── Login.tsx         #    Authentication
│   │   │   ├── SignUp.tsx        #    Registration
│   │   │   ├── About.tsx         #    About page
│   │   │   └── Documentation.tsx #    Docs page
│   │   ├── components/           #    25 reusable UI components
│   │   ├── services/
│   │   │   └── telemetryService.ts  # WebSocket client
│   │   ├── store/                #    Zustand state stores
│   │   ├── hooks/                #    Custom React hooks
│   │   ├── types/                #    TypeScript types
│   │   └── styles/               #    Global styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── ml/                           # 🧪 Standalone ML Training & API
│   ├── app.py                    #    Flask REST API (/predict, /predict/batch)
│   ├── training_notebook.ipynb   #    Jupyter notebook — model training pipeline
│   ├── predictive_maintenance.csv#    Training dataset (10,000 records)
│   ├── model_artifacts/          #    Saved models, scaler, label encoder
│   │   ├── model.pkl
│   │   ├── scaler.pkl
│   │   ├── label_encoder.pkl
│   │   └── metadata.json
│   ├── requirements.txt
│   └── *.png                     #    Visualizations (confusion matrices, distributions)
│
├── infrastructure/               # 🏗️ Infrastructure configs
│   └── kafka/                    #    Kafka configuration files
│
├── .gitignore
└── README.md                     #    ← You are here
```

---

## Prerequisites

| Tool | Version | Install |
|:-----|:--------|:--------|
| **Node.js** | ≥ 22.x | [nodejs.org](https://nodejs.org/) |
| **npm** | ≥ 10.x | Included with Node.js |
| **Docker** | ≥ 24.x | [docker.com](https://docker.com/) |
| **Docker Compose** | ≥ 2.20 | Included with Docker Desktop |
| **MongoDB Atlas** | Free Tier | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **Python** | ≥ 3.10 | [python.org](https://python.org/) *(only for standalone ML)* |

---

## Getting Started

> **Important:** Follow these steps **in order**. Each step depends on the previous one.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/DevanshBehl/Alerion-AI.git
cd Alerion-AI
```

### Step 2 — Set Up MongoDB Atlas

The project uses **MongoDB Atlas** (cloud) for user authentication. No local MongoDB is needed.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Create a database user with password
3. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for development)
4. Get your connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alerionAI
   ```
5. You'll paste this into the `.env` file in Step 4

### Step 3 — Start Kafka (Terminal 1)

Kafka handles real-time data streaming between edge nodes, the ML service, and the dashboard.

```bash
cd infrastructure/kafka
docker compose up -d
```

**Verify it's running:**
```bash
docker ps | grep kafka
# Expected: kafka   Up X seconds   0.0.0.0:9092->9092/tcp
```

> **Note:** Wait ~15 seconds after starting for Kafka to fully initialize before starting the backend.

### Step 4 — Start the ML Service (Terminal 2)

Open a **new terminal**. The Flask ML service loads the trained anomaly detection model and exposes a prediction REST API.

```bash
cd ml

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate    # macOS/Linux
# .venv\Scripts\activate     # Windows

# Install dependencies
pip3 install -r requirements.txt

# Start the Flask API
python3 app.py
```

**Expected output:**
```text
API starting on http://localhost:5000
   Endpoints: /health  /predict  /predict/batch  /classes  /metadata
```

### Step 5 — Start the Backend (Terminal 3)

Open a **new terminal**. The backend connects to MongoDB Atlas, Kafka, and the ML Service, then serves the Auth API + WebSocket server.

```bash
cd alerion-backend

# Install dependencies (first time only)
npm install

# Copy the environment template
cp .env.example .env
```

**Edit the `.env` file** and set your MongoDB Atlas connection string:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alerionAI"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:5000
USE_MOCK_ML=false
```

Then start the server:
```bash
npm run dev
```

**Expected output:**
```text
[MongoDB]   ✅ Connected → mongodb+srv://***@cluster0.xxxxx.mongodb.net/alerionAI
[Kafka]     ✅ All required topics already exist
[HTTP]      Health server → http://0.0.0.0:3000/health
[HTTP]      Auth API      → http://0.0.0.0:3000/api/auth
[WebSocket] Server started on ws://0.0.0.0:8080
[Startup]   ✅ Prediction consumer ready
[Startup]   ✅ ML consumer ready (using Python Flask API via HTTP)
[Startup]   🚀 All services started successfully
```

### Step 6 — Start Edge Node Simulators (Terminal 4)

Open a **new terminal**. Edge nodes simulate 5 industrial machines that send sensor telemetry into Kafka.

```bash
cd alerion-backend
npm run start:edges
```

**Expected output:**
```text
[Producer] Sent → MACHINE_001 | temp: 305.2K | torque: 42.3Nm | wear: 13
[Producer] Sent → MACHINE_002 | temp: 303.6K | torque: 41.9Nm | wear: 31
[Producer] Sent → MACHINE_003 | temp: 307.3K | torque: 35.5Nm | wear: 33
[Producer] Sent → MACHINE_004 | temp: 306.8K | torque: 63.1Nm | wear: 29
[Producer] Sent → MACHINE_005 | temp: 314.0K | torque: 62.3Nm | wear: 38
```

You can also start individual nodes: `npm run start:edge1`, `start:edge2`, ..., `start:edge5`

### Step 7 — Start the Dashboard (Terminal 5)

Open a **new terminal**. The React dashboard displays real-time machine monitoring and anomaly alerts.

```bash
cd AlerionAI

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected output:**
```text
VITE ready in 200ms
➜  Local:   http://localhost:5173/
```

### Step 8 — Test It

1. Open **http://localhost:5173/signup** in your browser
2. Create an account (name, email, company, role, password)
3. You'll be redirected to the **real-time dashboard** at `/app`
4. You should see live machine telemetry data streaming in from the edge nodes
5. To test login: go to **http://localhost:5173/login** and use your credentials

---

## Stopping the Project

```bash
# Stop edge nodes: Ctrl+C in Terminal 4
# Stop backend:    Ctrl+C in Terminal 3
# Stop ML service: Ctrl+C in Terminal 2
# Stop frontend:   Ctrl+C in Terminal 5

# Stop Kafka:
cd infrastructure/kafka
docker compose down

# Full reset (removes Kafka data):
docker compose down -v
```

---

## Quick Reference

| Step | Terminal | Directory | Command | What It Starts |
|:----:|:---------|:----------|:--------|:---------------|
| 1 | Terminal 1 | `infrastructure/kafka` | `docker compose up -d` | Kafka broker (port 9092) |
| 2 | Terminal 2 | `ml` | `python3 app.py` | Flask ML Service (port 5000) |
| 3 | Terminal 3 | `alerion-backend` | `npm run dev` | Backend API (3000) + WebSocket (8080) |
| 4 | Terminal 4 | `alerion-backend` | `npm run start:edges` | 5 edge node simulators |
| 5 | Terminal 5 | `AlerionAI` | `npm run dev` | React dashboard (5173) |

---

## Running Modes

### Single Machine (Development)

Everything runs on one machine — this is the default setup described above.

```mermaid
graph LR
    A["Terminal 1<br/>docker compose up -d<br/>(infrastructure/kafka)"] --> B["Terminal 2<br/>npm run dev<br/>(alerion-backend)"]
    B --> C["Terminal 3<br/>npm run start:edges<br/>(alerion-backend)"]
    C --> D["Terminal 4<br/>npm run dev<br/>(AlerionAI)"]
```

### Multi-Laptop (Distributed Demo)

For the full distributed experience across physical machines.

```mermaid
graph TB
    subgraph L1["💻 Laptop 1 — Edge Layer"]
        Edge["5× Edge Nodes<br/>npm run start:edges"]
    end

    subgraph L2["💻 Laptop 2 — Fog Layer"]
        Docker["Docker Compose<br/>(Kafka + ML + Backend)"]
    end

    subgraph L3["💻 Laptop 3 — Dashboard"]
        React["React Frontend<br/>npm run dev"]
    end

    Edge -->|"Kafka TCP<br/>IP:9092"| Docker
    Docker -->|"WebSocket<br/>IP:8080"| React

    style L1 fill:#1a1a2e,stroke:#e94560,color:#fff
    style L2 fill:#16213e,stroke:#0f3460,color:#fff
    style L3 fill:#0f3460,stroke:#533483,color:#fff
```

**Step-by-step:**

#### Step 1 — Find the Fog Laptop IP

On **Laptop 2** (Fog), run:

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I | awk '{print $1}'

# Windows
ipconfig | findstr "IPv4"
```

> Example output: `192.168.1.45`

#### Step 2 — Start Fog Layer (Laptop 2)

```bash
cd alerion-backend

# Update Kafka advertised listeners for external access
# Edit docker-compose.yml → KAFKA_ADVERTISED_LISTENERS:
#   EXTERNAL://192.168.1.45:9092  (replace localhost)

docker compose up -d
```

#### Step 3 — Start Edge Nodes (Laptop 1)

```bash
cd alerion-backend

# Update .env to point to Fog laptop
echo "KAFKA_BROKERS=192.168.1.45:9092" > .env

npm install
npm run start:edges
```

#### Step 4 — Start Dashboard (Laptop 3)

```bash
cd AlerionAI

# Update WebSocket URL in the telemetry service to:
# ws://192.168.1.45:8080

npm install
npm run dev
```

---

## ML Model Details

### Training Pipeline

The model is trained on the [Predictive Maintenance Dataset](https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset) (10,000 records) with the following pipeline:

```mermaid
flowchart LR
    A["Raw CSV<br/>10K records"] --> B["Feature<br/>Engineering"]
    B --> C["SMOTE<br/>Oversampling"]
    C --> D["Train/Test<br/>Split"]
    D --> E["Model Training<br/>XGBoost + RF"]
    E --> F["Model<br/>Evaluation"]
    F --> G["Export<br/>model.pkl"]

    style A fill:#1a1a2e,stroke:#e94560,color:#fff
    style G fill:#0f3460,stroke:#533483,color:#fff
```

### Features Used

| Feature | Description | Range |
|:--------|:------------|:------|
| `Air temperature [K]` | Ambient air temperature | 290–320 K |
| `Process temperature [K]` | Process operating temperature | 300–340 K |
| `Rotational speed [rpm]` | Spindle RPM | 1,000–3,000 |
| `Torque [Nm]` | Torque applied | 10–80 Nm |
| `Tool wear [min]` | Cumulative tool usage | 0–250 min |
| `type_encoded` | Machine type (L=0, M=1, H=2) | 0–2 |
| `temp_diff` | Process − Air temperature | Derived |
| `power_W` | Torque × angular velocity | Derived |
| `torque_x_wear` | Torque × tool wear | Derived |
| `rpm_per_torque` | RPM / Torque ratio | Derived |

### Failure Classes

| Class | Severity | Description |
|:------|:---------|:------------|
| No Failure | — | Normal operation |
| Heat Dissipation Failure | 🔴 High | Overheating condition |
| Power Failure | 🔴 High | Electrical/power anomaly |
| Overstrain Failure | 🔴 High | Mechanical overstress |
| Tool Wear Failure | 🟡 Medium | Gradual tool degradation |
| Random Failures | 🟡 Medium | Unpredictable failure events |

### Running the Standalone ML API

```bash
cd ml

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate    # macOS/Linux
# .venv\Scripts\activate     # Windows

# Install dependencies
pip3 install -r requirements.txt

# Start the Flask API
python3 app.py
# → API running at http://localhost:5000
```

**Test a prediction:**

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "air_temperature": 298.1,
    "process_temperature": 308.6,
    "rotational_speed": 1551,
    "torque": 42.8,
    "tool_wear": 0,
    "machine_type": "M"
  }'
```

---

## API Reference

### Backend (Express — Port 3000)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | Service health check (uptime, status) |
| `GET` | `/stats` | WebSocket stats (connected clients, messages) |
| `GET` | `/ready` | Readiness probe for orchestrators |

### ML Service — Flask (Port 5000)

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | Model info & service status |
| `GET` | `/classes` | List all failure classes |
| `GET` | `/metadata` | Full model metadata (features, metrics) |
| `POST` | `/predict` | Single reading prediction |
| `POST` | `/predict/batch` | Batch predictions (max 100 readings) |

### ML Service — FastAPI / Docker (Port 8000)

The Dockerized ML service consumes directly from Kafka (`machine-data` topic), runs inference, and publishes results to the `prediction-data` topic. It also exposes a health endpoint.

### WebSocket (Port 8080)

Clients connect to `ws://localhost:8080` and receive JSON messages:

```json
{
  "type": "prediction",
  "payload": {
    "machine_id": "MACHINE-001",
    "machine_type": "H",
    "air_temperature": 305.2,
    "process_temperature": 312.4,
    "rotational_speed": 1847,
    "torque": 42.3,
    "tool_wear": 128,
    "prediction": 0,
    "confidence": 0.94,
    "anomalyScore": 0.12,
    "failure_type": "No Failure",
    "processed_at": "2026-02-19T01:10:00.000Z"
  },
  "timestamp": "2026-02-19T01:10:00.000Z"
}
```

Message types: `prediction` | `alert` | `heartbeat` | `system`

---

## Kafka Topics

| Topic | Partitions | Producer | Consumer | Description |
|:------|:-----------|:---------|:---------|:------------|
| `machine-data` | 5 | Edge Nodes | ML Service | Raw sensor telemetry |
| `prediction-data` | 5 | ML Service | Backend | ML prediction results |

Topics are auto-created by Kafka (configured via `KAFKA_AUTO_CREATE_TOPICS_ENABLE=true`), or you can create them manually:

```bash
# Create topics manually
docker exec -it alerion-kafka kafka-topics \
  --create --topic machine-data \
  --bootstrap-server localhost:9092 \
  --partitions 5 --replication-factor 1

docker exec -it alerion-kafka kafka-topics \
  --create --topic prediction-data \
  --bootstrap-server localhost:9092 \
  --partitions 5 --replication-factor 1

# List all topics
docker exec -it alerion-kafka kafka-topics \
  --list --bootstrap-server localhost:9092

# Consume messages from a topic (debug)
docker exec -it alerion-kafka kafka-console-consumer \
  --topic machine-data \
  --bootstrap-server localhost:9092 \
  --from-beginning
```

---

## Environment Variables

### Backend (`alerion-backend/.env`)

| Variable | Default | Description |
|:---------|:--------|:------------|
| `KAFKA_BROKERS` | `localhost:9092` | Kafka bootstrap servers |
| `KAFKA_CLIENT_ID` | `alerion-backend` | Kafka client identifier |
| `WS_PORT` | `8080` | WebSocket server port |
| `HTTP_PORT` | `3000` | Express health server port |
| `ML_SERVICE_URL` | `http://localhost:5000` | Python Flask ML service URL |
| `USE_MOCK_ML` | `false` | Use TypeScript mock ML (set `false` for Python service) |
| `MACHINE_DATA_TOPIC` | `machine-data` | Topic for raw telemetry |
| `PREDICTION_DATA_TOPIC` | `prediction-data` | Topic for ML predictions |

---

## Scalability & Performance

### Current Capabilities

| Metric | Value |
|:-------|:------|
| Edge nodes (demo) | 5 concurrent simulators |
| Message rate (demo) | ~10 msg/sec (2/sec per node) |
| Max throughput | 10,000+ msg/sec (hardware dependent) |
| Kafka partitions | 5 per topic |
| WebSocket clients | Unlimited (broadcast) |
| ML replicas | Scalable via `docker compose --scale` |

### Scalability Architecture

```mermaid
graph TB
    subgraph Scale["Horizontal Scaling Points"]
        A["🔧 Edge Nodes<br/>Add more node configs"]
        B["📨 Kafka<br/>Multi-broker cluster"]
        C["🤖 ML Workers<br/>docker compose scale"]
        D["🔌 WebSocket<br/>Load-balanced instances"]
        E["☁️ Cloud<br/>AWS / GCP / Azure"]
    end

    A --> B --> C --> D --> E

    style Scale fill:#1a1a2e,stroke:#e94560,color:#fff
```

---

## Future Roadmap

- [ ] Kubernetes deployment manifests (Helm charts)
- [ ] Multi-broker Kafka cluster for fault tolerance
- [ ] Redis caching for prediction results
- [ ] Alert escalation via email / SMS / Slack
- [ ] Edge AI preprocessing (TensorFlow Lite)
- [ ] Time-series database integration (InfluxDB / TimescaleDB)
- [ ] Grafana monitoring dashboards
- [ ] OAuth2 / SSO authentication
- [ ] CI/CD pipeline (GitHub Actions)

---

## Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

---

## License

This project is developed by the **Alerion AI Team** for distributed systems & AI engineering research.

---

<div align="center">

**Built with ❤️ by [Devansh Behl](https://github.com/DevanshBehl)**

*Distributed Systems & AI Engineering*

</div>