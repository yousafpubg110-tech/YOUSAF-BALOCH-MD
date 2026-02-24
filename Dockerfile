# ╔══════════════════════════════════════════════════════════════════╗
# ║   YOUSAF-BALOCH-MD — Universal Dockerfile                       ║
# ║   Created by: Muhammad Yousaf Baloch                            ║
# ║   WhatsApp: +923710636110                                        ║
# ║   Compatible: Koyeb | Railway | Render | Heroku | VPS           ║
# ╚══════════════════════════════════════════════════════════════════╝

# ── Stage 1: Builder ────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build tools for native Node modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    vips-dev \
    libc6-compat \
    openssl \
    ffmpeg \
    imagemagick \
    wget \
    curl

WORKDIR /app

# Copy package.json first (better layer caching)
COPY package.json ./

# Install dependencies
# --legacy-peer-deps fixes baileys + sharp conflicts
# --no-audit --no-fund = faster install
RUN npm install \
    --omit=dev \
    --no-audit \
    --no-fund \
    --legacy-peer-deps

# ── Stage 2: Production ─────────────────────────────────────────────
FROM node:20-alpine AS production

# Runtime dependencies only (smaller final image)
RUN apk add --no-cache \
    vips \
    libc6-compat \
    openssl \
    ffmpeg \
    imagemagick \
    tini \
    wget \
    curl \
    bash

# Create non-root user (security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S botuser -u 1001

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy all project files
COPY --chown=botuser:nodejs . .

# ✅ FIX: Directories match config.js exactly
# SESSION_DIR  = './session'
# TEMP_DIR     = './temp'
# PLUGINS_DIR  = './plugins'
# DB_DIR       = './database'
# LOGS_DIR     = './logs'
RUN mkdir -p \
    /app/session \
    /app/temp \
    /app/plugins \
    /app/database \
    /app/logs \
    /app/lib && \
    chown -R botuser:nodejs \
    /app/session \
    /app/temp \
    /app/plugins \
    /app/database \
    /app/logs \
    /app/lib

USER botuser

# PORT — all platforms inject this automatically
EXPOSE ${PORT:-3000}

# ✅ FIX: Health check using wget (works in alpine, no ESM issues)
HEALTHCHECK \
    --interval=30s \
    --timeout=10s \
    --start-period=60s \
    --retries=5 \
    CMD wget -qO- http://localhost:${PORT:-3000}/health \
        || wget -qO- http://localhost:${PORT:-3000}/ \
        || exit 1

# tini = proper signal handling (no zombie processes)
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]
