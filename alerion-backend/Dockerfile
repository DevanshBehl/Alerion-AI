# ─────────────────────────────────────────────────────────────
# Alerion AI — Node.js Backend Dockerfile
# ─────────────────────────────────────────────────────────────
# Builds the TypeScript backend for the WebSocket + Kafka consumer
# services (NOT edge nodes — they run separately on Laptop 1).
# ─────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder

WORKDIR /app

# ─── Dependencies (cached layer) ─────────────────────────────
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ─── Build TypeScript ─────────────────────────────────────────
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc

# ─── Production Image ────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

# Copy production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled JavaScript
COPY --from=builder /app/dist ./dist

# ─── Health Check ─────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000 8080

CMD ["node", "dist/index.js"]
