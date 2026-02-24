#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║   YOUSAF-BALOCH-MD — Universal Start Script                     ║
# ║   Created by: Muhammad Yousaf Baloch                            ║
# ║   WhatsApp: +923710636110                                        ║
# ╚══════════════════════════════════════════════════════════════════╝

set -e

echo ""
echo "  ⚡ YOUSAF-BALOCH-MD — Starting Bot..."
echo "  👑 Created by: Muhammad Yousaf Baloch"
echo "  📱 WhatsApp: +923710636110"
echo ""

# ── Check Node.js version ────────────────────────────────────────────
NODE_VER=$(node -v | cut -c2- | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "  ❌ ERROR: Node.js 18+ required. You have $(node -v)"
  echo "  📖 Install: https://nodejs.org"
  exit 1
fi

echo "  ✅ Node.js version: $(node -v)"

# ── Install dependencies if missing ─────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo "  📦 Installing dependencies..."
  npm install --no-audit --no-fund --legacy-peer-deps
  echo "  ✅ Dependencies installed!"
fi

# ── Check SESSION_ID ─────────────────────────────────────────────────
if [ -z "$SESSION_ID" ] && [ ! -f ".env" ]; then
  echo ""
  echo "  ⚠️  WARNING: SESSION_ID not found!"
  echo "  📖 Get your Session ID from:"
  echo "     https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1"
  echo ""
fi

# ✅ FIX: Directories match config.js exactly
# SESSION_DIR = './session'
# TEMP_DIR    = './temp'
# PLUGINS_DIR = './plugins'
# DB_DIR      = './database'
# LOGS_DIR    = './logs'
mkdir -p session temp plugins database logs lib

echo "  ✅ Directories ready!"
echo "  🚀 Launching YOUSAF-BALOCH-MD..."
echo ""

# ── Auto-restart loop ────────────────────────────────────────────────
while true; do
  node index.js || {
    echo ""
    echo "  ⚠️  Bot crashed! Restarting in 5 seconds..."
    echo "  👑 YOUSAF-BALOCH-MD by Muhammad Yousaf Baloch"
    sleep 5
  }
done
