#!/bin/bash

# YOUSAF-BALOCH-MD - Startup Script
# Developer: Muhammad Yousaf Baloch

clear

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "           🤖 YOUSAF-BALOCH-MD Bot Starting...         "
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👨‍💻 Developer:      Muhammad Yousaf Baloch"
echo "📺 YouTube:        https://www.youtube.com/@Yousaf_Baloch_Tech"
echo "📱 WhatsApp:       +923710636110"
echo "🐙 GitHub:         https://github.com/musakhanbaloch03-sad"
echo "📢 WA Channel:     https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j"
echo "🎵 TikTok:         https://tiktok.com/@loser_boy.110"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Clear npm cache
echo "🧹 Clearing cache..."
npm cache clean --force

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --production

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Error installing dependencies!"
    exit 1
fi

# Start the bot
echo ""
echo "🚀 Launching YOUSAF-BALOCH-MD..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm start
