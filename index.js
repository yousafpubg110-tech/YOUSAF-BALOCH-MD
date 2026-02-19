/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         YOUSAF-BALOCH-MD — MAIN BOT ENGINE                      ║
 * ║         Created by: Muhammad Yousaf Baloch                      ║
 * ║         WhatsApp: +923710636110                                  ║
 * ║         GitHub: https://github.com/musakhanbaloch03-sad         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  proto,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { OWNER, CONFIG, SYSTEM, validateConfig } from './config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Silent Baileys Logger ────────────────────────────────────────────
const logger = pino({ level: 'silent' });

// ── In-memory store ──────────────────────────────────────────────────
const store = makeInMemoryStore({ logger });

// ── Ensure directories exist ─────────────────────────────────────────
[SYSTEM.SESSION_DIR, SYSTEM.TEMP_DIR, SYSTEM.PLUGINS_DIR].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// ═══════════════════════════════════════════════════════════════════
//  🎨 ULTRA-PREMIUM TERMINAL UI
// ═══════════════════════════════════════════════════════════════════
function printBanner() {
  console.clear();

  const fire    = gradient(['#FF0000', '#FF4500', '#FF8C00', '#FFD700']);
  const cyber   = gradient(['#00FFFF', '#00BFFF', '#0080FF', '#8000FF']);
  const gold    = gradient(['#FFD700', '#FFA500', '#FF8C00']);
  const neon    = gradient(['#39FF14', '#00FF7F', '#00FFFF']);
  const crimson = gradient(['#FF1744', '#FF6F00', '#FFD740']);

  console.log('\n');
  console.log(fire.multiline(
    figlet.textSync('YOUSAF-MD', { font: 'ANSI Shadow', horizontalLayout: 'full' })
  ));

  const line = '═'.repeat(70);
  console.log('\n' + cyber(line));
  console.log(gold.multiline(
    '  ⚡  YOUSAF-BALOCH-MD  |  Ultra-Premium WhatsApp Bot  |  v2.0.0  ⚡'
  ));
  console.log(cyber(line) + '\n');

  const label  = (text) => chalk.hex('#00FFFF').bold(text);
  const value  = (text) => chalk.hex('#FFFFFF')(text);
  const accent = (text) => chalk.hex('#FFD700').bold(text);
  const green  = (text) => chalk.hex('#39FF14').bold(text);

  console.log(label('  👑  OWNER     : ') + accent(OWNER.FULL_NAME));
  console.log(label('  📱  WHATSAPP  : ') + green('+' + OWNER.NUMBER));
  console.log(label('  🎵  TIKTOK    : ') + chalk.hex('#FF0050')(OWNER.TIKTOK));
  console.log(label('  🎬  YOUTUBE   : ') + chalk.hex('#FF0000')(OWNER.YOUTUBE));
  console.log(label('  📢  CHANNEL   : ') + chalk.hex('#25D366')(OWNER.CHANNEL));
  console.log(label('  💻  GITHUB    : ') + value(OWNER.GITHUB));

  console.log('\n' + cyber(line));
  console.log(neon('  ⚙️  CONFIGURATION:'));
  console.log(label('  🔑  SESSION   : ') + (CONFIG.SESSION_ID ? green('✅ Set') : chalk.hex('#FF1744').bold('❌ NOT SET!')));
  console.log(label('  🔧  PREFIX    : ') + accent(CONFIG.PREFIX));
  console.log(label('  🌐  MODE      : ') + (CONFIG.MODE === 'public' ? green('Public 🌍') : crimson('Private 🔒')));
  console.log(label('  🤖  APP NAME  : ') + value(CONFIG.APP_NAME));
  console.log(label('  🕐  TIMEZONE  : ') + value(CONFIG.TIMEZONE));
  console.log(cyber(line) + '\n');
}

// ── Premium Log Helpers ──────────────────────────────────────────────
const LOG = {
  success: (msg) => console.log(chalk.hex('#39FF14').bold('  ✅  ') + chalk.hex('#FFFFFF')(msg)),
  error:   (msg) => console.log(chalk.hex('#FF1744').bold('  ❌  ') + chalk.hex('#FF6B6B')(msg)),
  warn:    (msg) => console.log(chalk.hex('#FFD700').bold('  ⚠️   ') + chalk.hex('#FFA500')(msg)),
  info:    (msg) => console.log(chalk.hex('#00BFFF').bold('  ℹ️   ') + chalk.hex('#87CEEB')(msg)),
  event:   (msg) => console.log(chalk.hex('#BF00FF').bold('  ⚡  ') + chalk.hex('#DDA0DD')(msg)),
  msg:     (from, cmd) => console.log(
    chalk.hex('#00FF7F').bold('  💬  ') +
    chalk.hex('#00FFFF')(`From: `) + chalk.hex('#FFD700').bold(from) +
    chalk.hex('#00FFFF')(` | CMD: `) + chalk.hex('#FF6F00').bold(cmd)
  ),
  divider: () => console.log(chalk.hex('#333333')('  ' + '─'.repeat(68))),
};

// ═══════════════════════════════════════════════════════════════════
//  🔌 BOT CONNECTION CORE
// ═══════════════════════════════════════════════════════════════════
async function startBot() {
  printBanner();

  const configErrors = validateConfig();
  if (configErrors.length > 0) {
    configErrors.forEach(err => LOG.error(err));
    LOG.warn('Bot cannot start without valid configuration. Please fix the above errors.');
    process.exit(1);
  }

  const { version, isLatest } = await fetchLatestBaileysVersion();
  LOG.info(`Baileys Version: v${version.join('.')} | Latest: ${isLatest ? '✅' : '⚠️ Update available'}`);

  const sessionPath = join(__dirname, SYSTEM.SESSION_DIR, 'auth');
  if (!existsSync(sessionPath)) mkdirSync(sessionPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  store?.bind(sock.ev);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (connection === 'connecting') {
      LOG.info('Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      LOG.divider();
      LOG.success(chalk.bold.hex('#FFD700')('YOUSAF-BALOCH-MD CONNECTED SUCCESSFULLY! 🚀'));
      LOG.success(`Logged in as: ${chalk.hex('#25D366').bold(sock.user?.name || sock.user?.id)}`);
      LOG.divider();

      try {
        const startupMsg = `╔══════════════════════════════════╗
║  ⚡ YOUSAF-BALOCH-MD ONLINE! ⚡  ║
╚══════════════════════════════════╝

✅ *Bot Started Successfully!*

🤖 *Bot:* ${OWNER.BOT_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
📅 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 ${OWNER.TIKTOK}
🎬 ${OWNER.YOUTUBE}
📢 ${OWNER.CHANNEL}
💻 ${OWNER.GITHUB}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}* ⚡`;

        await sock.sendMessage(OWNER.JID, { text: startupMsg });
        LOG.success('Startup notification sent to owner!');
      } catch (notifErr) {
        LOG.warn('Could not send startup notification: ' + notifErr.message);
      }
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;

      LOG.warn(`Connection closed. Reason: ${reason}`);

      if (shouldReconnect) {
        LOG.info('Reconnecting in 5 seconds...');
        setTimeout(startBot, 5000);
      } else {
        LOG.error('Session logged out. Please generate a new SESSION_ID.');
        LOG.error('Visit: https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1');
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;

      try {
        await handleMessage(sock, msg);
      } catch (err) {
        LOG.error(`Message handler error: ${err.message}`);
      }
    }
  });

  return sock;
}

// ═══════════════════════════════════════════════════════════════════
//  💬 MESSAGE HANDLER
// ═══════════════════════════════════════════════════════════════════
async function handleMessage(sock, rawMsg) {
  const from     = rawMsg.key.remoteJid;
  const isGroup  = from?.endsWith('@g.us');
  const sender   = isGroup ? rawMsg.key.participant : rawMsg.key.remoteJid;
  const isOwner  = sender?.replace(/[^0-9]/g, '') === OWNER.NUMBER;

  const msgContent = rawMsg.message;
  const body =
    msgContent?.conversation ||
    msgContent?.extendedTextMessage?.text ||
    msgContent?.imageMessage?.caption ||
    msgContent?.videoMessage?.caption ||
    '';

  if (CONFIG.MODE === 'private' && !isOwner) return;

  const hasPrefix = body.startsWith(CONFIG.PREFIX);
  if (!hasPrefix) return;

  const command = body.slice(CONFIG.PREFIX.length).trim().split(' ')[0].toLowerCase();
  const args    = body.slice(CONFIG.PREFIX.length + command.length).trim().split(' ').filter(a => a);

  if (!command) return;

  LOG.msg(sender?.split('@')[0] || 'unknown', command);

  const context = { sock, msg: rawMsg, from, sender, isOwner, isGroup, args, body };

  switch (command) {
    case 'owner':
      await cmdOwner(context);
      break;
    case 'alive':
    case 'ping':
      await cmdAlive(context);
      break;
    default:
      break;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  🛠️  BUILT-IN COMMANDS
// ═══════════════════════════════════════════════════════════════════
async function cmdOwner({ sock, from }) {
  const text = `╔══════════════════════════════════════╗
║     👑 BOT DEVELOPER INFO 👑         ║
╚══════════════════════════════════════╝

🌟 *Developer: ${OWNER.FULL_NAME}*

📱 *WhatsApp:*
wa.me/${OWNER.NUMBER}

━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Official Social Media:*

🎵 *TikTok:*
${OWNER.TIKTOK}

🎬 *YouTube:*
${OWNER.YOUTUBE}

📢 *WhatsApp Channel:*
${OWNER.CHANNEL}

💻 *GitHub:*
${OWNER.GITHUB}
━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *${OWNER.BOT_NAME} v${OWNER.VERSION}*
⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}*`;

  await sock.sendMessage(from, { text });
}

async function cmdAlive({ sock, from }) {
  const uptime  = process.uptime();
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const text = `╔══════════════════════════════════════╗
║   ⚡ ${OWNER.BOT_NAME} IS ALIVE! ⚡   ║
╚══════════════════════════════════════╝

✅ *Status:* Online 🟢
🤖 *Bot:* ${CONFIG.APP_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
🕐 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}
━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 ${OWNER.TIKTOK}
🎬 ${OWNER.YOUTUBE}
━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Powered by ${OWNER.FULL_NAME}*`;

  await sock.sendMessage(from, { text });
}

// ═══════════════════════════════════════════════════════════════════
//  🚦 GLOBAL ERROR HANDLERS
// ═══════════════════════════════════════════════════════════════════
process.on('uncaughtException', (err) => {
  LOG.error(`Uncaught Exception: ${err.message}`);
  LOG.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  LOG.error(`Unhandled Rejection: ${reason}`);
});

process.on('SIGTERM', () => {
  LOG.warn('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  LOG.warn('SIGINT received. Shutting down...');
  process.exit(0);
});

// ═══════════════════════════════════════════════════════════════════
//  🚀 START
// ═══════════════════════════════════════════════════════════════════
startBot().catch((err) => {
  LOG.error('Fatal startup error: ' + err.message);
  LOG.error(err.stack);
  process.exit(1);
});
