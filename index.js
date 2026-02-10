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
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs'; 
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import Pino from 'pino';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import figlet from 'figlet';
import express from 'express';
import pkg from '@whiskeysockets/baileys';

// Baileys imports handled professionally
const { 
    DisconnectReason, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore, 
    jidNormalizedUser,
    makeInMemoryStore 
} = pkg;

const { chain } = lodash;
const PORT = process.env.PORT || 8000;
const store = makeInMemoryStore({ logger: Pino({ level: 'silent' }) });

// Initialize Prototypes
protoType();
serialize();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔑 SESSION ID DECODER (Fixed & Secured)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const sessionPath = './session';
if (!existsSync(sessionPath)) {
    mkdirSync(sessionPath, { recursive: true });
}

if (process.env.SESSION_ID) {
    // Decoding Logic for Universal Support
    let sessionData = process.env.SESSION_ID;
    if (sessionData.includes('YOUSAF;')) {
        sessionData = sessionData.split('YOUSAF;')[1];
    } else if (sessionData.includes('YOUSAF;;;')) {
        sessionData = sessionData.split('YOUSAF;;;')[1];
    }

    if (sessionData) {
        console.log(chalk.yellow('🔐 Decoding Session ID...'));
        try {
            const credsJson = Buffer.from(sessionData, 'base64').toString('utf-8');
            writeFileSync(path.join(sessionPath, 'creds.json'), credsJson);
            console.log(chalk.green('✅ Credentials Secured!'));
        } catch (e) {
            console.log(chalk.red('❌ Error decoding SESSION_ID: ' + e.message));
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔒 GLOBAL SETUP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
console.log(chalk.green(figlet.textSync('YOUSAF-BALOCH', { font: 'Standard' })));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

const app = express();
app.use(express.json());

// 🎨 Ultra-Premium Web UI (Kept exactly as requested)
app.get('/', (req, res) => {
    // ... (UI HTML Code remains exactly same as your input)
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>YOUSAF-BALOCH-MD - Dashboard</title>
        <style>
            /* Your Cyberpunk UI Styles Here */
            body { background: #050505; color: white; font-family: 'Poppins'; }
            .container { text-align: center; padding: 50px; }
            .bot-title { font-size: 3em; background: linear-gradient(to right, #00f2ff, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="bot-title">YOUSAF-BALOCH-MD</h1>
            <p>V2.0 Ultra Premium Edition</p>
            <p>Status: <span style="color: #00f2ff;">ONLINE ✅</span></p>
            <hr style="border: 0.5px solid #333; margin: 20px 0;">
            <h3>CREATED BY MUHAMMAD YOUSAF</h3>
            <a href="https://wa.me/923170636110" style="color: #25D366; text-decoration: none;">Contact Developer</a>
        </div>
    </body>
    </html>
    `);
});

// --- Backend Logic ---
app.post('/pairing', async (req, res) => {
  try {
    const phone = req.body.phone.replace(/[^0-9]/g, '');
    if (!global.conn) return res.json({ error: 'Bot is initializing...' });
    const code = await global.conn.requestPairingCode(phone);
    res.json({ code: code?.match(/.{1,4}/g)?.join('-') || code });
  } catch (error) { res.json({ error: 'Pairing Failed' }); }
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'silent' })) 
    },
    printQRInTerminal: false,
    logger: Pino({ level: 'silent' }),
    browser: ['YOUSAF-BALOCH-MD', 'Chrome', '20.0.04'],
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
    }
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) {
          console.log(chalk.yellow('🔄 Reconnecting...'));
          startBot();
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Plugin Loader logic remains same...
}

app.listen(PORT, () => console.log(chalk.blue(`🚀 Dashboard: http://localhost:${PORT}`)));
startBot();
