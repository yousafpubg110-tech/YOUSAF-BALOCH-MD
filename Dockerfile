# YOUSAF-BALOCH-MD - Advanced WhatsApp Bot
# Developer: Muhammad Yousaf Baloch
# GitHub: https://github.com/musakhanbaloch03-sad
# YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
# WhatsApp: +923710636110

FROM node:20-bullseye-slim

# Maintainer Information
LABEL maintainer="Muhammad Yousaf Baloch <musakhanbaloch03@gmail.com>"
LABEL description="YOUSAF-BALOCH-MD - Advanced WhatsApp Bot with 40+ Plugins"
LABEL version="3.0.0"
LABEL github="https://github.com/musakhanbaloch03-sad"
LABEL youtube="https://www.youtube.com/@Yousaf_Baloch_Tech"
LABEL whatsapp="+923710636110"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    imagemagick \
    webp \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p session && \
    chmod -R 777 session

# Set environment variables
ENV PORT=8000

# Expose port
EXPOSE ${PORT}

# Health check for platform monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT}/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start command
CMD ["npm", "start"]
