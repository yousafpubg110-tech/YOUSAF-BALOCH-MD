/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║         YOUSAF-BALOCH-MD — MAIN BOT ENGINE                      ║
 * ║         Created by: Muhammad Yousaf Baloch                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import {
  makeWASocket, DisconnectReason, useMultiFileAuthState,
  fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, proto,
} from '@whiskeysockets/baileys';
import { Boom }        from '@hapi/boom';
import pino            from 'pino';
import chalk           from 'chalk';
import figlet          from 'figlet';
import gradient        from 'gradient-string';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname }   from 'path';
import { fileURLToPath }   from 'url';
import express             from 'express';

import {
  OWNER, CONFIG, SYSTEM,
  validateConfig, initDatabase,
  isOwner as checkOwner,
} from './config.js';

import { startCronJobs, registerCronGroup } from './lib/cron.js';
import { runMiddleware }                    from './lib/middleware.js';
import { serialize }                        from './lib/serialize.js';

// FIX: Single unified plugin system
import { loadPlugins, plugins, getPlugin }  from './lib/pluginLoader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('YOUSAF-BALOCH-MD is running! ✅'));
app.listen(PORT, () => console.log(`✅ Express server on port ${PORT}`));

const logger       = pino({ level: 'silent' });
const messageCache = new Map();

function checkDeployer(sender) {
  const raw = process.env.DEPLOYER_NUMBER || '';
  if (!raw) return false;
  const nums = raw.split(',').map(n => n.trim().replace(/[^0-9]/g, ''));
  return nums.includes(sender?.replace(/[^0-9]/g, ''));
}

[SYSTEM.SESSION_DIR, SYSTEM.TEMP_DIR, SYSTEM.PLUGINS_DIR, SYSTEM.DB_DIR, SYSTEM.LOGS_DIR].forEach(dir => {
  try { if (!existsSync(dir)) mkdirSync(dir, { recursive: true }); }
  catch (err) { console.error(`Failed to create ${dir}: ${err.message}`); }
});

async function restoreSessionFromId(sessionPath) {
  if (!CONFIG.SESSION_ID) return false;
  try {
    const credsPath = join(sessionPath, 'creds.json');
    if (existsSync(credsPath)) return true;
    const decoded = Buffer.from(CONFIG.SESSION_ID, 'base64').toString('utf-8');
    writeFileSync(credsPath, JSON.stringify(JSON.parse(decoded), null, 2));
    LOG.success('Session restored!');
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
  const label = t => chalk.hex('#00FFFF').bold(t);
  const value = t => chalk.hex('#FFFFFF')(t);
  const accent= t => chalk.hex('#FFD700').bold(t);
  const green = t => chalk.hex('#39FF14').bold(t);
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
  console.log(label('  🗄️  DATABASE   : ') + (dbType === 'mongodb' ? green('✅ MongoDB') : chalk.hex('#FFD700').bold('📁 JSON Local')));
  console.log(cyber(line) + '\n');
}

const LOG = {
  success: m => console.log(chalk.hex('#39FF14').bold('  ✅  ') + chalk.hex('#FFFFFF')(m)),
  error:   m => console.log(chalk.hex('#FF1744').bold('  ❌  ') + chalk.hex('#FF6B6B')(m)),
  warn:    m => console.log(chalk.hex('#FFD700').bold('  ⚠️   ') + chalk.hex('#FFA500')(m)),
  info:    m => console.log(chalk.hex('#00BFFF').bold('  ℹ️   ') + chalk.hex('#87CEEB')(m)),
  msg:     (from, cmd) => console.log(
    chalk.hex('#00FF7F').bold('  💬  ') +
    chalk.hex('#00FFFF')('From: ') + chalk.hex('#FFD700').bold(from) +
    chalk.hex('#00FFFF')(' | CMD: ') + chalk.hex('#FF6F00').bold(cmd)
  ),
  divider: () => console.log(chalk.hex('#333333')('  ' + '─'.repeat(68))),
};

function isGroupAdmin(groupMetadata, sender) {
  if (!groupMetadata || !sender) return false;
  return groupMetadata.participants?.some(
    p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
  ) || false;
}

function isBotMessage(sock, rawMsg) {
  const from = rawMsg.key?.remoteJid || '';
  const isGroup = from.endsWith('@g.us');
  const msgContent = rawMsg.message;
  const body =
    msgContent?.conversation ||
    msgContent?.extendedTextMessage?.text ||
    msgContent?.imageMessage?.caption ||
    msgContent?.videoMessage?.caption || '';
  if (body.startsWith(CONFIG.PREFIX)) return false;
  if (isGroup && rawMsg.key?.fromMe === true) return true;
  const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
  const sender = rawMsg.key?.participant || '';
  if (isGroup && sender === botJid) return true;
  return false;
}

async function runEventPlugins(sock, rawMsg, { from, sender, isGroup, senderIsOwner, senderIsDeployer, groupMetadata }) {
  // FIX: plugins Map from pluginLoader — single source of truth
  for (const [, handler] of plugins) {
    if (typeof handler.autoDeleteLinks === 'function' && isGroup) {
      try {
        await handler.autoDeleteLinks({
          sock, msg: rawMsg, from, sender,
          isAdmin: isGroupAdmin(groupMetadata, sender) || senderIsDeployer,
          isOwner: senderIsOwner,
        });
      } catch (_) {}
    }
    if (typeof handler.autoDeleteBadWords === 'function' && isGroup) {
      try {
        await handler.autoDeleteBadWords({
          sock, msg: rawMsg, from, sender,
          isAdmin: isGroupAdmin(groupMetadata, sender) || senderIsDeployer,
          isOwner: senderIsOwner,
        });
      } catch (_) {}
    }
    if (typeof handler.autoViewOnce === 'function') {
      try { await handler.autoViewOnce({ sock, msg: rawMsg, from, sender }); } catch (_) {}
    }
    if (typeof handler.autoReact === 'function') {
      try { await handler.autoReact({ sock, msg: rawMsg, from, sender }); } catch (_) {}
    }
    if (typeof handler.onMessage === 'function') {
      try { await handler.onMessage({ sock, msg: rawMsg, from, sender, isOwner: senderIsOwner }); } catch (_) {}
    }
  }
}

async function startBot() {
  let dbType = 'json';
  try { dbType = await initDatabase(); }
  catch (e) { LOG.warn('Database error: ' + e.message); }

  printBanner(dbType);

  const configErrors = validateConfig();
  if (configErrors.length > 0) { configErrors.forEach(e => LOG.error(e)); process.exit(1); }

  // FIX: Single loadPlugins call — pluginLoader is sole authority
  await loadPlugins();
  LOG.success(`Plugins loaded: ${plugins.size} commands`);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  LOG.info(`Baileys v${version.join('.')} | Latest: ${isLatest ? '✅' : '⚠️'}`);

  const sessionPath = join(__dirname, SYSTEM.SESSION_DIR);
  if (!existsSync(sessionPath)) mkdirSync(sessionPath, { recursive: true });
  await restoreSessionFromId(sessionPath);

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    version, logger,
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
      const cached = messageCache.get(`${key.remoteJid}_${key.id}`);
      return cached || proto.Message.fromObject({});
    },
  });

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'connecting') LOG.info('Connecting...');
    if (connection === 'open') {
      LOG.divider();
      LOG.success('YOUSAF-BALOCH-MD CONNECTED! 🚀');
      LOG.success(`Logged in: ${sock.user?.name || sock.user?.id}`);
      LOG.divider();
      try { startCronJobs(sock); LOG.success('Cron jobs started!'); }
      catch (e) { LOG.warn('Cron error: ' + e.message); }
      try {
        await sock.sendMessage(OWNER.JID, { text:
`╔══════════════════════════════════╗
║  ⚡ YOUSAF-BALOCH-MD ONLINE! ⚡  ║
╚══════════════════════════════════╝

✅ *Bot Started!*
🤖 *Bot:* ${OWNER.BOT_NAME}
👑 *Owner:* ${OWNER.FULL_NAME}
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
🗄️ *DB:* ${dbType === 'mongodb' ? 'MongoDB ✅' : 'JSON 📁'}
🔌 *Plugins:* ${plugins.size} loaded
📅 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Powered by ${OWNER.FULL_NAME} © ${OWNER.YEAR}*` });
      } catch (_) {}
    }
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      LOG.warn(`Closed. Reason: ${reason}`);
      if (reason !== DisconnectReason.loggedOut) {
        LOG.info('Reconnecting in 5s...');
        setTimeout(startBot, 5000);
      } else {
        LOG.error('Logged out. Generate new SESSION_ID.');
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('groups.update', async (updates) => {
    for (const u of updates) { if (u.id) registerCronGroup(u.id); }
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
      catch (err) { LOG.error(`Handler error: ${err.message}`); }
    }
  });

  return sock;
}

async function handleMessage(sock, rawMsg) {
  const from    = rawMsg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  const sender  = isGroup ? rawMsg.key.participant : rawMsg.key.remoteJid;

  if (isBotMessage(sock, rawMsg)) return;

  const senderIsOwner    = checkOwner(sender);
  const senderIsDeployer = checkDeployer(sender);

  const msgContent = rawMsg.message;
  const body =
    msgContent?.conversation ||
    msgContent?.extendedTextMessage?.text ||
    msgContent?.imageMessage?.caption ||
    msgContent?.videoMessage?.caption || '';

  if (CONFIG.MODE === 'private' && !senderIsOwner) return;
  if (isGroup) registerCronGroup(from);

  let groupMetadata = null;
  try { if (isGroup) groupMetadata = await sock.groupMetadata(from).catch(() => null); } catch (_) {}

  await runEventPlugins(sock, rawMsg, {
    from, sender, isGroup, senderIsOwner, senderIsDeployer, groupMetadata,
  });

  if (!body.startsWith(CONFIG.PREFIX)) return;

  const args    = body.slice(CONFIG.PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();
  if (!command) return;

  LOG.msg(sender?.split('@')[0] || 'unknown', command);

  const m = serialize(sock, rawMsg);
  if (!m) return;

  const senderIsGroupAdmin = isGroupAdmin(groupMetadata, sender);

  const pluginCtx = {
    sock, msg: m,
    from: m.from, sender: m.sender,
    args, text: args.join(' '),
    conn: sock, usedPrefix: CONFIG.PREFIX, command,
    isOwner: senderIsOwner,
    isDeployer: senderIsDeployer,
    isAdmin: senderIsGroupAdmin || senderIsDeployer,
    isGroup,
    key: m.key, chat: m.from, body: m.body,
    type: m.type, quoted: m.quoted,
    message: rawMsg.message,
    isSelfSender: m.isSelfSender,
    reply:    (...a) => m.reply(...a),
    react:    (...a) => m.react(...a),
    delete:   (...a) => m.delete?.(...a),
    download: (...a) => m.download?.(...a),
  };

  if (command === 'owner') { await cmdOwner(sock, from); return; }
  if (command === 'alive' || command === 'ping') { await cmdAlive(sock, from); return; }

  // FIX: getPlugin() سے — single unified Map
  const handler = getPlugin(command);

  if (handler) {
    const mwResult = await runMiddleware({
      sender, from, command,
      cooldown:         handler.cooldown    || 3,
      ownerOnly:        handler.ownerOnly   || handler.owner || false,
      adminOnly:        handler.adminOnly   || false,
      groupOnlyCmd:     handler.groupOnly   || false,
      privateOnlyCmd:   handler.privateOnly || false,
      botAdminRequired: handler.botAdmin    || false,
      groupMetadata,
      botId: sock.user?.id,
    });

    if (!mwResult.pass) {
      await sock.sendMessage(from, {
        text: `❌ ${mwResult.reason}${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: rawMsg });
      return;
    }

    try {
      // FIX: handler / execute / run تینوں accept ہوتے ہیں
      const handlerFn = handler.handler || handler.execute || handler.run
        || (typeof handler === 'function' ? handler : null);

      if (typeof handlerFn === 'function') {
        await handlerFn(pluginCtx, pluginCtx);
      } else {
        LOG.warn(`Plugin "${command}" has no handler/execute/run.`);
      }
    } catch (pluginErr) {
      LOG.error(`Plugin [${command}]: ${pluginErr.message}`);
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
🌟 *${OWNER.FULL_NAME}*
📱 wa.me/${OWNER.NUMBER}
━━━━━━━━━━━━━━━━━━━━━━━━━
🎵 ${OWNER.TIKTOK}
🎬 ${OWNER.YOUTUBE}
📢 ${OWNER.CHANNEL}
💻 ${OWNER.GITHUB}
━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *${OWNER.BOT_NAME} v${OWNER.VERSION}*` });
}

async function cmdAlive(sock, from) {
  const u = process.uptime();
  const h = Math.floor(u / 3600);
  const m = Math.floor((u % 3600) / 60);
  const s = Math.floor(u % 60);
  await sock.sendMessage(from, { text:
`╔══════════════════════════════════════╗
║   ⚡ ${OWNER.BOT_NAME} IS ALIVE! ⚡   ║
╚══════════════════════════════════════╝
✅ *Online* 🟢
⏱️ *Uptime:* ${h}h ${m}m ${s}s
🔧 *Prefix:* \`${CONFIG.PREFIX}\`
🌐 *Mode:* ${CONFIG.MODE.toUpperCase()}
🔌 *Plugins:* ${plugins.size}
🕐 *Time:* ${new Date().toLocaleString('en-PK', { timeZone: CONFIG.TIMEZONE })}
━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *${OWNER.FULL_NAME}*` });
}

process.on('uncaughtException',  e => LOG.error(`Uncaught: ${e.message}`));
process.on('unhandledRejection', r => LOG.error(`Rejection: ${r}`));
process.on('SIGTERM', () => { LOG.warn('SIGTERM'); process.exit(0); });
process.on('SIGINT',  () => { LOG.warn('SIGINT');  process.exit(0); });

startBot().catch(err => {
  LOG.error('Fatal: ' + err.message);
  process.exit(1);
});
