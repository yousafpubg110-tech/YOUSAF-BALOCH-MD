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
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, existsSync } from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import figlet from 'figlet';
import readline from 'readline';
import { Low, JSONFile } from 'lowdb';
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

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.db = new Low(new JSONFile('database.json'));
await global.db.read();
global.db.data ||= { users: {}, chats: {}, settings: {} };

console.clear();
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green(figlet.textSync('YOUSAF-BALOCH-MD')));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

const question = (text) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(text, ans => {
    rl.close();
    resolve(ans);
  }));
};

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  let useQR = false;
  let usePairingCode = false;

  if (!state.creds.registered) {
    console.log('1️⃣ Pairing Code');
    console.log('2️⃣ QR Code');
    const choice = await question('Choose (1/2): ');
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

  // ✅ PAIRING CODE – SAFE & ORIGINAL
  if (usePairingCode && !conn.authState.creds.registered) {

    let phoneNumber = await question('Enter WhatsApp number: ');
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    try {
      let code = await conn.requestPairingCode(phoneNumber);

      // 🔥 ONLY FIX:
      // ❌ no split
      // ❌ no pad
      // ✅ show WhatsApp original code
      code = String(code);

      console.log('\n🔐 YOUR WHATSAPP PAIRING CODE:\n');
      console.log(code);
      console.log('\nWhatsApp > Linked Devices > Link with phone number\n');

    } catch (err) {
      console.log('Pairing error:', err);
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

  const pluginFolder = join(__dirname, './plugins');
  if (existsSync(pluginFolder)) {
    for (const file of readdirSync(pluginFolder).filter(f => f.endsWith('.js'))) {
      await import(pathToFileURL(join(pluginFolder, file)));
    }
  }
}

startBot();

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
