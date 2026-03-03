/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         YOUSAF-BALOCH-MD — MAIN BOT ENGINE                      ║
 * ║         Created by: Muhammad Yousaf Baloch                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  proto,
} from '@whiskeysockets/baileys';
import { Boom }                                        from '@hapi/boom';
import pino                                            from 'pino';
import chalk                                           from 'chalk';
import figlet                                          from 'figlet';
import gradient                                        from 'gradient-string';
import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname }                               from 'path';
import { fileURLToPath }                               from 'url';
import { createRequire }                               from 'module';
import express                                         from 'express';

import {
  OWNER,
  CONFIG,
  SYSTEM,
  validateConfig,
  initDatabase,
  isOwner    as checkOwner,
  isDeployer as checkDeployer,
} from './config.js';

import { startCronJobs, registerCronGroup } from './lib/cron.js';
import { runMiddleware }                    from './lib/middleware.js';
import { serialize }                        from './lib/serialize.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const app  = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('YOUSAF-BALOCH-MD is running! ✅'));
app.listen(PORT, () => console.log(`✅ Express server running on port ${PORT}`));

const logger       = pino({ level: 'silent' });
const messageCache = new Map();
const plugins      = new Map();

[SYSTEM.SESSION_DIR, SYSTEM.TEMP_DIR, SYSTEM.PLUGINS_DIR, SYSTEM.DB_DIR, SYSTEM.LOGS_DIR].forEach(dir => {
  try { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); } catch (err) {
    console.error(`Failed to create directory ${dir}: ${err.message}`);
  }
});

async function loadPlugins() {
  const pluginsDir = join(__dirname, SYSTEM.PLUGINS_DIR);
  if (!existsSync(pluginsDir)) { LOG.warn('Plugins directory not found.'); return; }

  let files;
  try { files = readdirSync(pluginsDir).filter(f => f.endsWith('.js')); }
  catch (err) { LOG.error('Failed to read plugins directory: ' + err.message); return; }

  if (!files.length) { LOG.warn('No plugin files found.'); return; }

  let loaded = 0, failed = 0;

  for (const file of files) {
    try {
      const mod     = await import(`file://${join(pluginsDir, file)}`);
      const handler = mod.default;

      if (!handler) { failed++; continue; }

      let commandNames = [];

      if (handler.command instanceof RegExp) {
        commandNames = handler.command.source
          .replace('^(', '').replace(')$', '')
          .split('|').map(c => c.trim().toLowerCase());
      } else if (Array.isArray(handler.command)) {
        commandNames = handler.command.map(c => c.toLowerCase());
      } else if (typeof handler.command === 'string') {
        commandNames = [handler.command.toLowerCase()];
      } else if (Array.isArray(handler.help)) {
        commandNames = handler.help.map(c => c.toLowerCase());
      }

      if (!commandNames.length) { failed++; continue; }

      for (const name of commandNames) plugins.set(name, handler);
      loaded++;
    } catch (err) {
      failed++;
      LOG.error(`Failed to load plugin ${file}: ${err.message}`);
    }
  }

  LOG.info(`Plugins: ${loaded} loaded, ${failed} failed. Total: ${plugins.size} commands`);
}

async function restoreSessionFromId(sessionPath) {
  if (!CONFIG.SESSION_ID) return false;
  try {
    const credsPath = join(sessionPath, 'creds.json');
    if (existsSync(credsPath)) return true;
    const decoded = Buffer.from(CONFIG.SESSION_ID, 'base64').toString('utf-8');
    writeFileSync(credsPath, JSON.stringify(JSON.parse(decoded), null, 2));
    LOG.success('Session restored from SESSION_ID successfully!');
    return true;
  } catch (err) {
    LOG.warn('Could not restore session: ' + err.message);
    return false;
  }
}

function printBanner(dbType = 'json') {
  console.clear();
  const fire    = gradient(['#FF0000', '#FF4500', '#FF8C00', '#FFD700']);
  const cyber   = gradient(['#00FFFF', '#00BFFF', '#0080FF', '#8000FF']);
  const gold    = gradient(['#FFD700', '#FFA500', '#FF8C00']);
  const neon    = gradient(['#39FF14', '#00FF7F', '#00FFFF']);
  const crimson = gradient(['#FF1744', '#FF6F00', '#FFD740']);

  console.log('\n');
  console.log(fire.multiline(figlet.textSync('YOUSAF-MD', { font: 'ANSI Shadow', horizontalLayout: 'full' })));
  const line = '═'.repeat(70);
  console.log('\n' + cyber(line));
  console.log(gold.multiline('  ⚡  YOUSAF-BALOCH-MD  |  Ultra-Premium WhatsApp Bot  |  v2.0.0  ⚡'));
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
  console.log(label('  🔑  SESSION   : ') + (CONFIG.SESSION_ID ? green('✅ Set') : chalk.hex('#FFD700').bold('⚠️  Not Set')));
  console.log(label('  🔧  PREFIX    : ') + accent(CONFIG.PREFIX));
  console.log(label('  🌐  MODE      : ') + (CONFIG.MODE === 'public' ? green('Public 🌍') : crimson('Private 🔒')));
  console.log(label('  🤖  APP NAME  : ') + value(CONFIG.APP_NAME));
  console.log(label('  🕐  TIMEZONE  : ') + value(CONFIG.TIMEZONE));
  console.log(label('  🗄️  DATABASE   : ') + (dbType === 'mongodb' ? green('✅ MongoDB Connected') : chalk.hex('#FFD700').bold('📁 JSON Local Database')));
  console.log(cyber(line) + '\n');
}

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

// Check if sender is a group admin
function isGroupAdmin(groupMetadata, sender) {
  if (!groupMetadata || !sender) return false;
  return groupMetadata.participants?.some(
    p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
  ) || false;
}

// Check if message was sent by the bot itself
// Bot's own messages must never trigger antilink, kick, or any event plugin
function isBotMessage(sock, rawMsg) {
  // Only block messages that bot sent automatically (not fromMe typing)
  // fromMe = true on GROUP messages means bot sent it
  // fromMe = true on PRIVATE messages could be the user themselves
  const from    = rawMsg.key?.remoteJid || '';
  const isGroup = from.endsWith('@g.us');

  // In groups: fromMe means bot sent it — block for event plugins
  if (isGroup && rawMsg.key?.fromMe === true) return true;

  // Match exact bot JID
  const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
  const sender  = rawMsg.key?.participant || '';
  if (isGroup && sender === botJid) return true;

  return false;
}

// Run event-based plugin functions on every incoming user message
// Bot messages are blocked before this function is ever called
// 3-warning system is handled inside each plugin (e.g. antilink.js)
// First offense = warning, third offense = kick
async function runEventPlugins(sock, rawMsg, { from, sender, isGroup, senderIsOwner, senderIsDeployer, groupMetadata }) {
  for (const [, handler] of plugins) {

    // Anti-link: delete links sent by users, warn 3 times before kick
    // Bot's own links (YouTube results, menu, etc.) are never affected
    if (typeof handler.autoDeleteLinks === 'function' && isGroup) {
      try {
        const senderIsGroupAdmin = isGroupAdmin(groupMetadata, sender);
        await handler.autoDeleteLinks({
          sock,
          msg     : rawMsg,
          from,
          sender,
          isAdmin : senderIsGroupAdmin || senderIsDeployer,
          isOwner : senderIsOwner,
        });
      } catch (_) {}
    }

    // Anti bad words
    if (typeof handler.autoDeleteBadWords === 'function' && isGroup) {
      try {
        const senderIsGroupAdmin = isGroupAdmin(groupMetadata, sender);
        await handler.autoDeleteBadWords({
          sock,
          msg     : rawMsg,
          from,
          sender,
          isAdmin : senderIsGroupAdmin || senderIsDeployer,
          isOwner : senderIsOwner,
        });
      } catch (_) {}
    }

    // Auto view once reveal
    if (typeof handler.autoViewOnce === 'function') {
      try {
        await handler.autoViewOnce({ sock, msg: rawMsg, from, sender });
      } catch (_) {}
    }

    // Auto react
    if (typeof handler.autoReact === 'function') {
      try {
        await handler.autoReact({ sock, msg: rawMsg, from, sender });
      } catch (_) {}
    }

    // Generic message event
    if (typeof handler.onMessage === 'function') {
      try {
        await handler.onMessage({ sock, msg: rawMsg, from, sender, isOwner: senderIsOwner });
      } catch (_) {}
    }
  }
}

async function startBot() {
  let dbType = 'json';
  try { dbType = await initDatabase(); }
  catch (dbErr) { LOG.warn('Database init error: ' + dbErr.message); dbType = 'json'; }

  printBanner(dbType);

  const configErrors = validateConfig();
  if (configErrors.length > 0) { configErrors.forEach(err => LOG.error(err)); process.exit(1); }

  if (dbType === 'mongodb') LOG.success('Database: MongoDB connected!');
  else LOG.info('Database: Using local JSON database');

  await loadPlugins();

  const { version, isLatest } = await fetchLatestBaileysVersion();
  LOG.info(`Baileys Version: v${version.join('.')} | Latest: ${isLatest ? '✅' : '⚠️'}`);

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
    getMessage: async (key) => {
      const cached = messageCache.get(`${key.remoteJid}_${key.id}`);
      return cached || proto.Message.fromObject({});
    },
  });

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'connecting') LOG.info('Connecting to WhatsApp...');

    if (connection === 'open') {
      LOG.divider();
      LOG.success('YOUSAF-BALOCH-MD CONNECTED SUCCESSFULLY! 🚀');
      LOG.success(`Logged in as: ${sock.user?.name || sock.user?.id}`);
      LOG.divider();

      try { startCronJobs(sock); LOG.success('Cron jobs started!'); }
      catch (cronErr) { LOG.warn('Cron jobs failed: ' + cronErr.message); }

      try {
        await sock.sendMessage(OWNER.JID, { text:
`╔══════════════════════════════════╗
║  ⚡ YOUSAF-BALOCH-MD ONLINE! ⚡  ║
╚══════════════════════════════════╝

✅ *Bot Started Successfully!*
🤖 *Bot:* ${OWNER.BOT_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
🗄️ *Database:* ${dbType === 'mongodb' ? 'MongoDB ✅' : 'JSON Local 📁'}
📅 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}
🔌 *Plugins:* ${plugins.size} commands loaded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 ${OWNER.TIKTOK}
🎬 ${OWNER.YOUTUBE}
📢 ${OWNER.CHANNEL}
💻 ${OWNER.GITHUB}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}* ⚡` });
        LOG.success('Startup notification sent to owner!');
      } catch (notifErr) { LOG.warn('Could not send startup notification: ' + notifErr.message); }
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      LOG.warn(`Connection closed. Reason: ${reason}`);
      if (reason !== DisconnectReason.loggedOut) {
        LOG.info('Reconnecting in 5 seconds...');
        setTimeout(startBot, 5000);
      } else {
        LOG.error('Session logged out. Please generate a new SESSION_ID.');
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('groups.update', async (updates) => {
    for (const update of updates) { if (update.id) registerCronGroup(update.id); }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message) continue;
      if (msg.key?.remoteJid && msg.key?.id) {
        messageCache.set(`${msg.key.remoteJid}_${msg.key.id}`, msg.message);
        if (messageCache.size > 500) messageCache.delete(messageCache.keys().next().value);
      }
      try { await handleMessage(sock, msg); }
      catch (err) { LOG.error(`Message handler error: ${err.message}`); }
    }
  });

  return sock;
}

async function handleMessage(sock, rawMsg) {
  const from    = rawMsg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  const sender  = isGroup ? rawMsg.key.participant : rawMsg.key.remoteJid;

  // If this message was sent by the bot itself, ignore completely
  // This prevents antilink from kicking users when bot sends YouTube/menu links
  if (isBotMessage(sock, rawMsg)) return;

  // Permission level checks
  const senderIsOwner    = checkOwner(sender);
  const senderIsDeployer = checkDeployer(sender);

  const msgContent = rawMsg.message;
  const body =
    msgContent?.conversation              ||
    msgContent?.extendedTextMessage?.text ||
    msgContent?.imageMessage?.caption     ||
    msgContent?.videoMessage?.caption     ||
    '';

  if (CONFIG.MODE === 'private' && !senderIsOwner) return;
  if (isGroup) registerCronGroup(from);

  // Fetch group metadata once — reused by event plugins and command handler
  let groupMetadata = null;
  try { if (isGroup) groupMetadata = await sock.groupMetadata(from).catch(() => null); } catch (_) {}

  // Run event plugins on all user messages
  // Bot messages never reach this point (blocked above)
  await runEventPlugins(sock, rawMsg, {
    from,
    sender,
    isGroup,
    senderIsOwner,
    senderIsDeployer,
    groupMetadata,
  });

  // Command handler — only runs for messages starting with prefix
  if (!body.startsWith(CONFIG.PREFIX)) return;

  const args    = body.slice(CONFIG.PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();
  if (!command) return;

  LOG.msg(sender?.split('@')[0] || 'unknown', command);

  const m = serialize(sock, rawMsg);
  if (!m) return;

  const senderIsGroupAdmin = isGroupAdmin(groupMetadata, sender);

  const pluginCtx = {
    sock,
    msg    : m,
    from   : m.from,
    sender : m.sender,
    args,
    text   : args.join(' '),
    conn      : sock,
    usedPrefix: CONFIG.PREFIX,
    command,
    isOwner   : senderIsOwner,
    isDeployer: senderIsDeployer,
    isAdmin   : senderIsGroupAdmin || senderIsDeployer,
    isGroup,
    key    : m.key,
    chat   : m.from,
    body   : m.body,
    type   : m.type,
    quoted : m.quoted,
    message: rawMsg.message,
    isSelfSender: m.isSelfSender,
    reply   : (...a) => m.reply(...a),
    react   : (...a) => m.react(...a),
    delete  : (...a) => m.delete?.(...a),
    download: (...a) => m.download?.(...a),
  };

  if (command === 'owner') { await cmdOwner(sock, from); return; }
  if (command === 'alive' || command === 'ping') { await cmdAlive(sock, from); return; }

  if (plugins.has(command)) {
    const handler = plugins.get(command);

    const mwResult = await runMiddleware({
      sender,
      from,
      command,
      cooldown        : handler.cooldown    || 3,
      ownerOnly       : handler.ownerOnly   || handler.owner || false,
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
      const handlerFn = handler.handler || handler.run || (typeof handler === 'function' ? handler : null);
      if (typeof handlerFn === 'function') {
        await handlerFn(pluginCtx, pluginCtx);
      }
    } catch (pluginErr) {
      LOG.error(`Plugin error [${command}]: ${pluginErr.message}`);
      try {
        await sock.sendMessage(from, {
          text: `❌ Error in *${command}*\n_${pluginErr.message}_${SYSTEM.SHORT_WATERMARK}`,
        }, { quoted: rawMsg });
      } catch (_) {}
    }
  }
}

async function cmdOwner(sock, from) {
  await sock.sendMessage(from, { text:
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
⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}*` });
}

async function cmdAlive(sock, from) {
  const uptime  = process.uptime();
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  await sock.sendMessage(from, { text:
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
⚡ *Powered by ${OWNER.FULL_NAME}*` });
}

process.on('uncaughtException',  (err)    => LOG.error(`Uncaught Exception: ${err.message}`));
process.on('unhandledRejection', (reason) => LOG.error(`Unhandled Rejection: ${reason}`));
process.on('SIGTERM', () => { LOG.warn('SIGTERM — shutting down...'); process.exit(0); });
process.on('SIGINT',  () => { LOG.warn('SIGINT — shutting down...');  process.exit(0); });

startBot().catch((err) => {
  LOG.error('Fatal startup error: ' + err.message);
  process.exit(1);
});
