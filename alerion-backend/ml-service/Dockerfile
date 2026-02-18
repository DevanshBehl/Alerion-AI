# ─────────────────────────────────────────────────────────────
# Alerion AI — Python ML Inference Service Dockerfile
# ─────────────────────────────────────────────────────────────
# Multi-stage build for production-grade container.
#
# Build: docker build -t alerion-ml-service .
# Run:   docker run -p 8000:8000 -v ./model:/app/model alerion-ml-service
# ─────────────────────────────────────────────────────────────

FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies for confluent-kafka (librdkafka)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        librdkafka-dev \
    && rm -rf /var/lib/apt/lists/*

# ─── Dependencies Layer (cached) ─────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─── Application Code ────────────────────────────────────────
COPY app/ ./app/

# Create model directory (mount trained model as volume)
RUN mkdir -p ./model

# ─── Health Check ─────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# ─── Expose & Run ────────────────────────────────────────────
EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
