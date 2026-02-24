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
import { Boom }                    from '@hapi/boom';
import pino                        from 'pino';
import chalk                       from 'chalk';
import figlet                      from 'figlet';
import gradient                    from 'gradient-string';
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname }           from 'path';
import { fileURLToPath }           from 'url';
import { createRequire }           from 'module';

// ✅ FIX: Import config properly
import { OWNER, CONFIG, SYSTEM, validateConfig, ownerFooter, isOwner as checkOwner } from './config.js';

// ✅ FIX: Import cron jobs
import { startCronJobs, registerCronGroup } from './lib/cron.js';

// ✅ FIX: Import middleware
import { runMiddleware } from './lib/middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

// ── Silent Baileys Logger ────────────────────────────────────────────
const logger = pino({ level: 'silent' });

// ── In-memory store ──────────────────────────────────────────────────
const store = makeInMemoryStore({ logger });

// ── Plugin Storage ───────────────────────────────────────────────────
// ✅ FIX: Store handlers properly — matches our plugin export format
const plugins = new Map(); // commandName → handler function

// ── Ensure directories exist ─────────────────────────────────────────
[SYSTEM.SESSION_DIR, SYSTEM.TEMP_DIR, SYSTEM.PLUGINS_DIR, SYSTEM.DB_DIR, SYSTEM.LOGS_DIR].forEach(dir => {
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Failed to create directory ${dir}: ${err.message}`);
  }
});

// ═══════════════════════════════════════════════════════════════════
//  🔌 PLUGIN LOADER SYSTEM
//  ✅ FIX: Now supports our plugin export format:
//    handler.command = /^(cmd1|cmd2)$/i
//    handler.handler = async (m, { conn, ... }) => {}
//    export default handler
// ═══════════════════════════════════════════════════════════════════
async function loadPlugins() {
  const pluginsDir = join(__dirname, SYSTEM.PLUGINS_DIR);

  if (!existsSync(pluginsDir)) {
    LOG.warn('Plugins directory not found. Skipping plugin load.');
    return;
  }

  let files;
  try {
    files = readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
  } catch (err) {
    LOG.error('Failed to read plugins directory: ' + err.message);
    return;
  }

  if (files.length === 0) {
    LOG.warn('No plugin files found in plugins/ folder.');
    return;
  }

  let loaded = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const pluginPath = join(pluginsDir, file);
      const mod        = await import(`file://${pluginPath}`);
      const handler    = mod.default;

      if (!handler) {
        LOG.warn(`No default export in ${file}`);
        failed++;
        continue;
      }

      // ✅ FIX: Support both formats:
      // Format 1: handler.command = /^(cmd)$/i  (our new format)
      // Format 2: handler.command = ['cmd1','cmd2'] (array format)
      // Format 3: handler.command = 'cmd' (string format)

      let commandNames = [];

      if (handler.command instanceof RegExp) {
        // Extract names from regex like /^(menu|help)$/i
        const regexStr = handler.command.source
          .replace('^(', '').replace(')$', '')
          .split('|');
        commandNames = regexStr.map(c => c.trim().toLowerCase());

      } else if (Array.isArray(handler.command)) {
        commandNames = handler.command.map(c => c.toLowerCase());

      } else if (typeof handler.command === 'string') {
        commandNames = [handler.command.toLowerCase()];

      } else if (Array.isArray(handler.help)) {
        commandNames = handler.help.map(c => c.toLowerCase());
      }

      if (commandNames.length === 0) {
        LOG.warn(`No commands found in ${file}`);
        failed++;
        continue;
      }

      for (const name of commandNames) {
        plugins.set(name, handler);
      }

      loaded++;
    } catch (err) {
      failed++;
      LOG.error(`Failed to load plugin ${file}: ${err.message}`);
    }
  }

  LOG.info(`Plugins: ${loaded} loaded, ${failed} failed. Total: ${plugins.size} commands`);
}

// ═══════════════════════════════════════════════════════════════════
//  🔑 SESSION RESTORATION FROM SESSION_ID
// ═══════════════════════════════════════════════════════════════════
async function restoreSessionFromId(sessionPath) {
  if (!CONFIG.SESSION_ID) return false;

  try {
    const credsPath = join(sessionPath, 'creds.json');
    if (existsSync(credsPath)) return true;

    const decoded = Buffer.from(CONFIG.SESSION_ID, 'base64').toString('utf-8');
    const parsed  = JSON.parse(decoded);

    writeFileSync(credsPath, JSON.stringify(parsed, null, 2));
    LOG.success('Session restored from SESSION_ID successfully!');
    return true;
  } catch (err) {
    LOG.warn('Could not restore session from SESSION_ID: ' + err.message);
    return false;
  }
}

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

  const label = (t) => chalk.hex('#00FFFF').bold(t);
  const value = (t) => chalk.hex('#FFFFFF')(t);
  const accent= (t) => chalk.hex('#FFD700').bold(t);
  const green = (t) => chalk.hex('#39FF14').bold(t);

  console.log(label('  👑  OWNER     : ') + accent(OWNER.FULL_NAME));
  console.log(label('  📱  WHATSAPP  : ') + green('+' + OWNER.NUMBER));
  console.log(label('  🎵  TIKTOK    : ') + chalk.hex('#FF0050')(OWNER.TIKTOK));
  console.log(label('  🎬  YOUTUBE   : ') + chalk.hex('#FF0000')(OWNER.YOUTUBE));
  console.log(label('  📢  CHANNEL   : ') + chalk.hex('#25D366')(OWNER.CHANNEL));
  console.log(label('  💻  GITHUB    : ') + value(OWNER.GITHUB));

  console.log('\n' + cyber(line));
  console.log(neon('  ⚙️  CONFIGURATION:'));
  console.log(label('  🔑  SESSION   : ') + (CONFIG.SESSION_ID ? green('✅ Set') : chalk.hex('#FFD700').bold('⚠️  Not Set — Use Pairing')));
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
    chalk.hex('#00FFFF')('From: ') + chalk.hex('#FFD700').bold(from) +
    chalk.hex('#00FFFF')(' | CMD: ') + chalk.hex('#FF6F00').bold(cmd)
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
    process.exit(1);
  }

  await loadPlugins();

  const { version, isLatest } = await fetchLatestBaileysVersion();
  LOG.info(`Baileys Version: v${version.join('.')} | Latest: ${isLatest ? '✅' : '⚠️ Update available'}`);

  const sessionPath = join(__dirname, SYSTEM.SESSION_DIR);
  if (!existsSync(sessionPath)) mkdirSync(sessionPath, { recursive: true });

  await restoreSessionFromId(sessionPath);

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys : makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser                       : Browsers.ubuntu('Chrome'),
    markOnlineOnConnect           : true,
    generateHighQualityLinkPreview: true,
    syncFullHistory               : false,
    getMessage                    : async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  store?.bind(sock.ev);

  // ✅ FIX: Start cron jobs after connection
  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {

    if (connection === 'connecting') {
      LOG.info('Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      LOG.divider();
      LOG.success('YOUSAF-BALOCH-MD CONNECTED SUCCESSFULLY! 🚀');
      LOG.success(`Logged in as: ${sock.user?.name || sock.user?.id}`);
      LOG.divider();

      // ✅ FIX: Start cron jobs after bot is connected
      try {
        startCronJobs(sock);
        LOG.success('Cron jobs started — Prayer times, Ramadan alerts active!');
      } catch (cronErr) {
        LOG.warn('Cron jobs failed to start: ' + cronErr.message);
      }

      // Send startup notification to owner
      try {
        const startupMsg =
`╔══════════════════════════════════╗
║  ⚡ YOUSAF-BALOCH-MD ONLINE! ⚡  ║
╚══════════════════════════════════╝

✅ *Bot Started Successfully!*

🤖 *Bot:* ${OWNER.BOT_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
📅 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}
🔌 *Plugins:* ${plugins.size} commands loaded

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
      const reason          = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;

      LOG.warn(`Connection closed. Reason: ${reason}`);

      if (shouldReconnect) {
        LOG.info('Reconnecting in 5 seconds...');
        setTimeout(startBot, 5000);
      } else {
        LOG.error('Session logged out. Please generate a new SESSION_ID.');
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ✅ FIX: Register groups for cron broadcasts
  sock.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      if (update.id) registerCronGroup(update.id);
    }
  });

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
//  ✅ FIX: Full middleware integration + proper plugin calling
// ═══════════════════════════════════════════════════════════════════
async function handleMessage(sock, rawMsg) {
  const from    = rawMsg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  const sender  = isGroup
    ? rawMsg.key.participant
    : rawMsg.key.remoteJid;

  const ownerCheck = checkOwner(sender);

  const msgContent = rawMsg.message;
  const body =
    msgContent?.conversation                   ||
    msgContent?.extendedTextMessage?.text      ||
    msgContent?.imageMessage?.caption          ||
    msgContent?.videoMessage?.caption          ||
    '';

  if (CONFIG.MODE === 'private' && !ownerCheck) return;

  // ✅ FIX: Register group for cron broadcasts
  if (isGroup) registerCronGroup(from);

  const hasPrefix = body.startsWith(CONFIG.PREFIX);
  if (!hasPrefix) return;

  const args    = body.slice(CONFIG.PREFIX.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (!command) return;

  LOG.msg(sender?.split('@')[0] || 'unknown', command);

  // ── Build context object matching plugin expectations ──────────────
  // ✅ FIX: All plugins expect (m, { conn, usedPrefix, command, text, args })
  const ctx = {
    conn       : sock,
    usedPrefix : CONFIG.PREFIX,
    command,
    args,
    text       : args.join(' '),
    isOwner    : ownerCheck,
    isGroup,
    from,
    sender,
    plugins,
  };

  // ── Run middleware (ban/spam/rate limit checks) ────────────────────
  let groupMetadata = null;
  try {
    if (isGroup) groupMetadata = await sock.groupMetadata(from).catch(() => null);
  } catch (_) {}

  // ── Built-in commands ──────────────────────────────────────────────
  if (command === 'owner') {
    await cmdOwner(sock, from);
    return;
  }

  if (command === 'alive' || command === 'ping') {
    await cmdAlive(sock, from);
    return;
  }

  // ── Plugin routing ─────────────────────────────────────────────────
  if (plugins.has(command)) {
    const handler = plugins.get(command);

    // ✅ FIX: Run middleware before plugin
    const mwResult = await runMiddleware({
      sender,
      from,
      command,
      cooldown        : handler.cooldown    || 3,
      ownerOnly       : handler.ownerOnly   || false,
      adminOnly       : handler.adminOnly   || false,
      groupOnlyCmd    : handler.groupOnly   || false,
      privateOnlyCmd  : handler.privateOnly || false,
      botAdminRequired: handler.botAdmin    || false,
      groupMetadata,
      botId           : sock.user?.id,
    });

    if (!mwResult.pass) {
      await sock.sendMessage(from, {
        text: `❌ ${mwResult.reason}${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: rawMsg });
      return;
    }

    try {
      // ✅ FIX: Call plugin in the format it expects
      // Our plugins use: handler(m, { conn, usedPrefix, command, text })
      if (typeof handler === 'function') {
        await handler(rawMsg, ctx);
      } else if (typeof handler.handler === 'function') {
        await handler.handler(rawMsg, ctx);
      } else if (typeof handler.run === 'function') {
        await handler.run(rawMsg, ctx);
      }

    } catch (pluginErr) {
      LOG.error(`Plugin error [${command}]: ${pluginErr.message}`);
      await sock.sendMessage(from, {
        text: `❌ Error in *${command}*\n_${pluginErr.message}_${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: rawMsg });
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  🛠️  BUILT-IN COMMANDS
// ═══════════════════════════════════════════════════════════════════
async function cmdOwner(sock, from) {
  const text =
`╔══════════════════════════════════════╗
║     👑 BOT DEVELOPER INFO 👑         ║
╚══════════════════════════════════════╝

🌟 *Developer: ${OWNER.FULL_NAME}*

📱 *WhatsApp:* wa.me/${OWNER.NUMBER}

━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 *TikTok:* ${OWNER.TIKTOK}
🎬 *YouTube:* ${OWNER.YOUTUBE}
📢 *Channel:* ${OWNER.CHANNEL}
💻 *GitHub:* ${OWNER.GITHUB}
━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *${OWNER.BOT_NAME} v${OWNER.VERSION}*
⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}*`;

  await sock.sendMessage(from, { text });
}

async function cmdAlive(sock, from) {
  const uptime  = process.uptime();
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const text =
`╔══════════════════════════════════════╗
║   ⚡ ${OWNER.BOT_NAME} IS ALIVE! ⚡   ║
╚══════════════════════════════════════╝

✅ *Status:* Online 🟢
🤖 *Bot:* ${CONFIG.APP_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
🔌 *Plugins:* ${plugins.size} commands
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
process.on('uncaughtException',  (err)    => LOG.error(`Uncaught Exception: ${err.message}`));
process.on('unhandledRejection', (reason) => LOG.error(`Unhandled Rejection: ${reason}`));
process.on('SIGTERM', () => { LOG.warn('SIGTERM — shutting down...'); process.exit(0); });
process.on('SIGINT',  () => { LOG.warn('SIGINT — shutting down...');  process.exit(0); });

// ═══════════════════════════════════════════════════════════════════
//  🚀 START
// ═══════════════════════════════════════════════════════════════════
startBot().catch((err) => {
  LOG.error('Fatal startup error: ' + err.message);
  process.exit(1);
});
