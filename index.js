/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD WhatsApp Bot      ┃
┃        Ultra Premium Edition           ┃
┃      DESIGN: NEON CYBERPUNK UI         ┃
┃      DEVELOPER: MUHAMMAD YOUSAF        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import './config.js';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import { readdirSync, existsSync } from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import Pino from 'pino';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import figlet from 'figlet';
import express from 'express';

const { 
    DisconnectReason, 
    useMultiFileAuthState, 
    MessageRetryMap, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    jidNormalizedUser,
    makeInMemoryStore 
} = await import('@whiskeysockets/baileys');

const { chain } = lodash;
const PORT = process.env.PORT || 8000;
const store = makeInMemoryStore({ logger: Pino({ level: 'silent' }) });

protoType();
serialize();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔒 GLOBAL SETUP (Security Guaranteed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
global.sessionName = 'session'; // FIXED: Unified folder name
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

const __dirname = global.__dirname(import.meta.url);
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

// Database Initialization
global.db = new Low(new JSONFile(`database.json`));
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return;
  await global.db.read().catch(console.error);
  global.db.data = {
    users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {},
    ...(global.db.data || {}),
  };
};
loadDatabase();

console.clear();
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green(figlet.textSync('YOUSAF-BALOCH-MD', { font: 'Standard' })));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

const app = express();

app.use(express.json());

// 🎨 Ultra-Premium Web UI (Restored & Fixed)
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YOUSAF-BALOCH-MD - Premium Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #00f2ff;
            --secondary: #ff0080;
            --accent: #ffd700;
            --purple: #8b5cf6;
            --dark-bg: #050505;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Poppins', sans-serif;
            background: var(--dark-bg);
            background: linear-gradient(135deg, #050505 0%, #1a0033 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            overflow-x: hidden;
            padding: 20px;
        }

        .container { width: 100%; max-width: 480px; position: relative; z-index: 10; }

        .clock-card {
            background: linear-gradient(135deg, #00f2ff, #0066ff);
            border-radius: 30px;
            padding: 30px;
            margin-bottom: 25px;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 242, 255, 0.4), inset 0 0 15px rgba(255,255,255,0.3);
            border: 2px solid rgba(255,255,255,0.2);
        }

        #time { font-family: 'Orbitron', sans-serif; font-size: 3.5em; font-weight: 900; text-shadow: 0 0 20px rgba(255,255,255,0.5); }
        #date { font-size: 1.1em; opacity: 0.9; font-weight: 600; letter-spacing: 1px; }

        .main-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 35px;
            padding: 35px 25px;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            margin-bottom: 25px;
            text-align: center;
        }

        .bot-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.2em;
            font-weight: 900;
            background: linear-gradient(to right, var(--primary), var(--secondary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.3));
        }

        .pair-btn {
            width: 100%;
            padding: 22px;
            border-radius: 20px;
            border: none;
            background: linear-gradient(135deg, #b06ab3, #4568dc);
            color: white;
            font-size: 1.2em;
            font-weight: 800;
            font-family: 'Orbitron', sans-serif;
            cursor: pointer;
            box-shadow: 0 10px 0px #2a3eb1, 0 20px 30px rgba(0,0,0,0.4);
            transition: 0.1s;
            margin: 20px 0;
            display: block;
            text-decoration: none;
        }
        .pair-btn:active { transform: translateY(6px); box-shadow: 0 4px 0px #2a3eb1; }

        .owner-card {
            background: linear-gradient(135deg, #ff6b6b, #ff0080);
            border-radius: 30px;
            padding: 25px;
            margin-bottom: 30px;
            text-align: left;
            position: relative;
            box-shadow: 0 15px 35px rgba(255, 0, 128, 0.3);
        }

        .owner-tag { font-family: 'Orbitron', sans-serif; font-size: 1.1em; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
        .info-row { background: rgba(255,255,255,0.15); padding: 15px; border-radius: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; font-weight: 600; }

        .social-btn {
            width: 100%;
            padding: 20px;
            border-radius: 18px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            font-weight: 800;
            color: white;
            text-decoration: none;
            font-family: 'Orbitron', sans-serif;
            font-size: 1.05em;
            transition: 0.3s;
            border: 2px solid rgba(255,255,255,0.1);
        }

        .wa-btn { background: linear-gradient(45deg, #25D366, #128C7E); box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3); }
        .yt-btn { background: linear-gradient(45deg, #FF0000, #990000); box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3); }
        .tk-btn { background: linear-gradient(45deg, #000, #333); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        .ch-btn { background: linear-gradient(45deg, #00f2ff, #0066ff); box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3); }

        .social-btn:hover { transform: scale(1.03); filter: brightness(1.2); }

        #code-display { font-size: 2.5em; font-family: 'Orbitron', sans-serif; color: var(--accent); margin-top: 15px; font-weight: 900; letter-spacing: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="clock-card">
            <div id="time">00:00:00</div>
            <div id="date">Loading...</div>
        </div>

        <div class="main-card">
            <h1 class="bot-title">YOUSAF-BALOCH-MD</h1>
            <p style="color: #aaa; margin-bottom: 20px;">V2.0 Ultra Premium Edition</p>
            
            <input type="tel" id="phone" placeholder="923170636110" style="width: 100%; padding: 18px; border-radius: 15px; border: 1px solid #444; background: #000; color: #fff; text-align: center; font-family: 'Orbitron'; font-size: 1.2em;">
            
            <button class="pair-btn" onclick="getPairing()">⚡ GET PAIRING CODE</button>
            <div id="code-display"></div>
        </div>

        <div class="owner-card">
            <div class="owner-tag">👨‍💻 CREATED BY MUHAMMAD YOUSAF</div>
            <div class="info-row"><span>📞 Phone:</span> <span>923170636110</span></div>
            <div class="info-row"><span>🌐 Country:</span> <span>Pakistan 🇵🇰</span></div>
        </div>

        <a href="https://wa.me/923170636110" class="social-btn wa-btn">📱 My WhatsApp</a>
        <a href="https://youtube.com/@Yousaf_Baloch_Tech" class="social-btn yt-btn">🎬 YouTube Channel</a>
        <a href="https://tiktok.com/@loser_boy.110" class="social-btn tk-btn">🎵 TikTok Profile</a>
        <a href="https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j" class="social-btn ch-btn">📢 Join Channel</a>
    </div>

    <script>
        function updateClock() {
            const now = new Date();
            document.getElementById('time').textContent = now.toLocaleTimeString('en-GB', { hour12: false });
            document.getElementById('date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        }
        setInterval(updateClock, 1000); updateClock();

        async function getPairing() {
            const phone = document.getElementById('phone').value.replace(/[^0-9]/g, '');
            if(!phone) return alert('Enter phone number!');
            const display = document.getElementById('code-display');
            display.textContent = 'WAIT...';
            try {
                const res = await fetch('/pairing', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ phone })
                });
                const data = await res.json();
                display.textContent = data.code || 'ERROR';
            } catch { display.textContent = 'ERROR'; }
        }
    </script>
</body>
</html>
  `);
});

// --- Backend Logic ---

app.post('/pairing', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!global.conn) return res.json({ error: 'Bot starting...' });
    const code = await global.conn.requestPairingCode(phone);
    res.json({ code: code?.match(/.{1,4}/g)?.join('-') || code });
  } catch (error) { res.json({ error: 'Failed' }); }
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'silent' })) 
    },
    printQRInTerminal: false,
    logger: Pino({ level: 'silent' }),
    browser: ['YOUSAF-BALOCH-MD', 'Chrome', '20.0.04'], // FIXED: Modern Browser Header
    getMessage: async (key) => {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
  });

  global.conn = sock;
  store.bind(sock.ev);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'open') {
        console.log(chalk.green('✅ YOUSAF-BALOCH-MD IS ONLINE!'));
        console.log(chalk.cyan(`👤 User: ${sock.user.name || 'Bot'}`));
    }
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
          console.log(chalk.yellow('⚠️ Connection closed. Reconnecting...'));
          startBot();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Auto-load plugins logic (Keep intact as per your request)
  const pluginFolder = path.join(__dirname, './plugins');
  if (existsSync(pluginFolder)) {
    const files = readdirSync(pluginFolder).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const plugin = await import(pathToFileURL(path.join(pluginFolder, file)).href);
        global.plugins = global.plugins || {};
        global.plugins[file] = plugin.default || plugin;
      } catch (e) {}
    }
  }
}

app.listen(PORT, () => console.log(chalk.blue(`🚀 Dashboard: http://localhost:${PORT}`)));
startBot();

process.on('unhandledRejection', console.error);
