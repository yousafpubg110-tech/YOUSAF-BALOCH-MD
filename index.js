/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD WhatsApp Bot      ┃
┃   Premium Multi-Device Bot with 280+   ┃
┃              Commands                  ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

👨‍💻 Developer: Muhammad Yousaf Baloch
📞 Contact: +923710636110
🌐 GitHub: https://github.com/musakhanbaloch03-sad
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
📢 WhatsApp: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
🎵 TikTok: https://tiktok.com/@loser_boy.110

© 2026 YOUSAF-BALOCH-MD - All Rights Reserved
*/

import './config.js';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync } from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import { tmpdir } from 'os';
import Pino from 'pino';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB } from './lib/mongoDB.js';
import figlet from 'figlet';
import express from 'express';

const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } = await import('@whiskeysockets/baileys');

const { chain } = lodash;
const PORT = process.env.PORT || 8000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date};

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@').replace(/[|\\{}()[\]^$+*+?.\-\^]/g, '\\$&') + ']');

global.db = new Low(new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

console.clear();
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green(figlet.textSync('YOUSAF-BALOCH-MD', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
console.log(chalk.yellow('🛡️  Premium Multi-Device WhatsApp Bot'));
console.log(chalk.yellow('📊  280+ Premium Commands Available'));
console.log(chalk.yellow('🚀  Ultra Premium Web Interface'));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

const app = express();
let currentQR = null;
let connectionStatus = 'waiting';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YOUSAF-BALOCH-MD - Ultra Premium Bot</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(-45deg, #000428, #004e92, #1a0033, #2d1b69);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Animated Stars Background */
        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        
        .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle 3s infinite;
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        /* Container */
        .container {
            position: relative;
            z-index: 1;
            max-width: 1000px;
            margin: 50px auto;
            padding: 20px;
        }
        
        /* Welcome Header */
        .welcome-header {
            text-align: center;
            margin-bottom: 30px;
            animation: slideDown 1s ease;
        }
        
        @keyframes slideDown {
            from { transform: translateY(-100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .welcome-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 3em;
            font-weight: 900;
            background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: rainbow 3s ease infinite;
            text-shadow: 0 0 30px rgba(255,0,128,0.5);
            margin-bottom: 10px;
        }
        
        @keyframes rainbow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .welcome-subtitle {
            font-size: 1.5em;
            color: #40e0d0;
            text-shadow: 0 0 20px rgba(64,224,208,0.8);
            margin-bottom: 20px;
        }
        
        /* DateTime Display */
        .datetime-container {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .datetime-box {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 15px;
            padding: 15px 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .datetime-label {
            font-size: 0.9em;
            color: #40e0d0;
            margin-bottom: 5px;
        }
        
        .datetime-value {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5em;
            color: white;
            font-weight: bold;
        }
        
        /* Developer Info */
        .developer-card {
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255,0,128,0.3);
            border-radius: 25px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 0 50px rgba(255,0,128,0.3);
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .dev-name {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5em;
            text-align: center;
            background: linear-gradient(45deg, #ff0080, #7928ca, #ff0080);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine 3s linear infinite;
            margin-bottom: 15px;
        }
        
        @keyframes shine {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        
        .dev-contact {
            text-align: center;
            font-size: 1.3em;
            color: #40e0d0;
            margin-bottom: 10px;
        }
        
        /* Status */
        .status-card {
            background: rgba(0,0,0,0.5);
            border: 2px solid rgba(64,224,208,0.3);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .status-text {
            font-size: 1.2em;
            color: white;
        }
        
        .status.waiting { color: #ffd700; }
        .status.connected { color: #00ff00; }
        
        /* Connection Buttons */
        .connection-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        @media (max-width: 768px) {
            .connection-container {
                grid-template-columns: 1fr;
            }
        }
        
        .connection-card {
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(10px);
            border: 2px solid transparent;
            border-radius: 20px;
            padding: 30px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .connection-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg);
            transition: 0.5s;
        }
        
        .connection-card:hover::before {
            left: 100%;
        }
        
        .connection-card.qr {
            border-color: #ff0080;
            box-shadow: 0 0 30px rgba(255,0,128,0.3);
        }
        
        .connection-card.pairing {
            border-color: #40e0d0;
            box-shadow: 0 0 30px rgba(64,224,208,0.3);
        }
        
        .connection-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 50px rgba(255,0,128,0.5);
        }
        
        .connection-icon {
            font-size: 4em;
            margin-bottom: 15px;
        }
        
        .connection-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.5em;
            margin-bottom: 10px;
            color: white;
        }
        
        .connection-desc {
            color: rgba(255,255,255,0.7);
        }
        
        /* Modal Sections */
        .modal {
            display: none;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 25px;
            padding: 30px;
            margin-bottom: 20px;
        }
        
        .modal.active {
            display: block;
            animation: modalAppear 0.5s ease;
        }
        
        @keyframes modalAppear {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .modal-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2em;
            color: #40e0d0;
            text-align: center;
            margin-bottom: 20px;
        }
        
        #qrcode {
            display: flex;
            justify-content: center;
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 15px;
        }
        
        .input-group {
            margin: 20px 0;
        }
        
        input {
            width: 100%;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 10px;
            color: white;
            font-size: 1.1em;
            margin-bottom: 15px;
        }
        
        input::placeholder {
            color: rgba(255,255,255,0.5);
        }
        
        input:focus {
            outline: none;
            border-color: #40e0d0;
            box-shadow: 0 0 20px rgba(64,224,208,0.5);
        }
        
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, #ff0080, #7928ca);
            border: none;
            border-radius: 10px;
            color: white;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(255,0,128,0.5);
        }
        
        .code-display {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5em;
            letter-spacing: 10px;
            color: #40e0d0;
            text-align: center;
            padding: 20px;
            background: rgba(0,0,0,0.5);
            border-radius: 15px;
            margin: 20px 0;
            text-shadow: 0 0 20px rgba(64,224,208,0.8);
        }
        
        /* Social Links */
        .social-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 30px;
        }
        
        .social-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 25px;
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 50px;
            color: white;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .social-link:hover {
            background: rgba(255,0,128,0.3);
            border-color: #ff0080;
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(255,0,128,0.4);
        }
        
        .social-icon {
            font-size: 1.5em;
        }
        
        /* Timer */
        .timer {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.3em;
            color: #ffd700;
            text-align: center;
            margin-top: 15px;
        }
        
        .info-text {
            text-align: center;
            color: rgba(255,255,255,0.7);
            margin: 15px 0;
        }
        
        /* Loading Animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #40e0d0;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Animated Stars -->
    <div class="stars" id="stars"></div>

    <div class="container">
        <!-- Welcome Header -->
        <div class="welcome-header">
            <h1 class="welcome-title">WELCOME TO</h1>
            <h2 class="welcome-subtitle">YOUSAF-BALOCH-MD BOT</h2>
        </div>

        <!-- DateTime Display -->
        <div class="datetime-container">
            <div class="datetime-box">
                <div class="datetime-label">⏰ TIME</div>
                <div class="datetime-value" id="time">00:00:00</div>
            </div>
            <div class="datetime-box">
                <div class="datetime-label">📅 DATE</div>
                <div class="datetime-value" id="date">Loading...</div>
            </div>
            <div class="datetime-box">
                <div class="datetime-label">📆 DAY</div>
                <div class="datetime-value" id="day">Loading...</div>
            </div>
        </div>

        <!-- Developer Card -->
        <div class="developer-card">
            <div class="dev-name">MUHAMMAD YOUSAF BALOCH</div>
            <div class="dev-contact">📞 +923710636110</div>
        </div>

        <!-- Status -->
        <div class="status-card">
            <div class="status-text">
                Status: <span id="status" class="status waiting">⏳ Waiting for connection...</span>
            </div>
        </div>

        <!-- Connection Options -->
        <div class="connection-container">
            <div class="connection-card qr" onclick="showQR()">
                <div class="connection-icon">📱</div>
                <div class="connection-title">QR CODE</div>
                <div class="connection-desc">Scan with WhatsApp</div>
            </div>
            
            <div class="connection-card pairing" onclick="showPairing()">
                <div class="connection-icon">🔐</div>
                <div class="connection-title">PAIRING CODE</div>
                <div class="connection-desc">8-Digit Code</div>
            </div>
        </div>

        <!-- QR Code Modal -->
        <div id="qr-modal" class="modal">
            <div class="modal-title">📱 SCAN QR CODE</div>
            <div class="info-text">Open WhatsApp → Linked Devices → Link a Device</div>
            <div id="qrcode"></div>
            <div class="timer" id="qr-timer"></div>
        </div>

        <!-- Pairing Code Modal -->
        <div id="pairing-modal" class="modal">
            <div class="modal-title">🔐 PAIRING CODE</div>
            <div class="input-group">
                <input type="tel" id="phone" placeholder="Enter Phone Number (923710636110)" maxlength="15">
                <button onclick="generateCode()">🚀 GENERATE CODE</button>
            </div>
            <div id="code-result"></div>
        </div>

        <!-- Social Links -->
        <div class="social-container">
            <a href="https://github.com/musakhanbaloch03-sad" target="_blank" class="social-link">
                <span class="social-icon">💻</span>
                <span>GitHub</span>
            </a>
            <a href="https://www.youtube.com/@Yousaf_Baloch_Tech" target="_blank" class="social-link">
                <span class="social-icon">📺</span>
                <span>YouTube</span>
            </a>
            <a href="https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j" target="_blank" class="social-link">
                <span class="social-icon">📢</span>
                <span>WhatsApp</span>
            </a>
            <a href="https://tiktok.com/@loser_boy.110" target="_blank" class="social-link">
                <span class="social-icon">🎵</span>
                <span>TikTok</span>
            </a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <script>
        // Generate animated stars
        function createStars() {
            const starsContainer = document.getElementById('stars');
