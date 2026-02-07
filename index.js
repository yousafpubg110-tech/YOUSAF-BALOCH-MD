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
import { readdirSync, existsSync } from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import { Low, JSONFile } from 'lowdb';
import figlet from 'figlet';
import readline from 'readline';
import Pino from 'pino';

const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys');

import { makeWASocket, protoType, serialize } from './lib/simple.js';

protoType();
serialize();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(new JSONFile('database.json'));

await global.db.read();
global.db.data ||= { users: {}, chats: {}, settings: {} };

console.clear();
console.log(chalk.cyan(figlet.textSync('YOUSAF-BALOCH-MD')));

const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(text, ans => { rl.close(); res(ans); }));
};

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version } = await fetchLatestBaileysVersion();

  let useQR = false;
  let usePairingCode = false;

  if (!state.creds.registered) {
    console.log('1) Pairing Code\n2) QR Code');
    const choice = await question('Choose: ');
    if (choice === '1') usePairingCode = true;
    else useQR = true;
  }

  const conn = makeWASocket({
    version,
    logger: Pino({ level: 'silent' }),
    printQRInTerminal: useQR,
    browser: ['YOUSAF-BALOCH-MD', 'Safari', '1.0.0'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'silent' }))
    },
    msgRetryCounterMap: MessageRetryMap
  });

  // ===========================
  // 🔥 FIXED 8‑DIGIT PAIRING
  // ===========================
  if (usePairingCode && !conn.authState.creds.registered) {

    let phoneNumber = await question('Enter WhatsApp number: ');
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    try {
      let code = await conn.requestPairingCode(phoneNumber);

      // 🔴 ONLY FIX — FORCE REAL 8 DIGITS
      code = String(code).replace(/\D/g, '');
      if (code.length < 8) code = code.padStart(8, '0');

      console.log('\n🔐 YOUR 8‑DIGIT PAIRING CODE:\n', code, '\n');

    } catch (e) {
      console.log('Pairing error:', e);
    }
  }

  conn.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      console.log('✅ Bot Connected');
    }
    if (update.connection === 'close') {
      if (update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot();
      }
    }
  });

  conn.ev.on('creds.update', saveCreds);

  // Plugin loader (unchanged)
  const pluginsPath = path.join(__dirname, 'plugins');
  if (existsSync(pluginsPath)) {
    for (const file of readdirSync(pluginsPath).filter(f => f.endsWith('.js'))) {
      await import(pathToFileURL(path.join(pluginsPath, file)));
    }
  }
}

startBot();

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
