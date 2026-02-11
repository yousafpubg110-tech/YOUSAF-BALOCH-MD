# ╔══════════════════════════════════════════════════════════════════╗
# ║   YOUSAF-BALOCH-MD — Universal Dockerfile                       ║
# ║   Created by: Muhammad Yousaf Baloch                            ║
# ║   Compatible: Koyeb | Heroku | Railway | Render | Replit | VPS  ║
# ╚══════════════════════════════════════════════════════════════════╝

# ── Stage 1: Builder ────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install all build tools for native Node modules
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

# Copy package files FIRST (better caching)
COPY package.json ./

# ✅ KEY FIX: npm install bypasses lockfile issues on all platforms
# This permanently fixes: "Missing lockfile" and "exit status 1" errors
RUN npm install --omit=dev --no-audit --no-fund --legacy-peer-deps

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
    curl

# Create non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S botuser -u 1001

WORKDIR /app

# Copy built node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy all application files
COPY --chown=botuser:nodejs . .

# Create required directories
RUN mkdir -p /app/sessions/auth /app/temp /app/plugins && \
    chown -R botuser:nodejs /app/sessions /app/temp /app/plugins

USER botuser

# PORT env variable — all platforms inject this automatically
EXPOSE ${PORT:-3000}

# Health check compatible with all platforms
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD node -e "import('http').then(h=>h.default.get('http://localhost:${PORT:-3000}/',r=>r.statusCode<500?process.exit(0):process.exit(1)).on('error',()=>process.exit(1)))"

# Use tini for proper signal handling (prevents zombie processes)
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]
