/*
═══════════════════════════════════════════════════
📁 LIB/CONNECTION.JS
═══════════════════════════════════════════════════
Purpose: Baileys WhatsApp Connection Handler
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  Browsers,
  downloadMediaMessage,
  proto,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OWNER, CONFIG, SYSTEM } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logger = pino({ level: 'silent' });

// FIX: makeInMemoryStore ہٹا دیا — نئے Baileys میں نہیں ہے
// Simple in-memory message cache بنایا
const messageCache = new Map();

/**
 * Create WhatsApp Connection
 * @returns {Promise<Object>} Socket instance
 */
export async function createConnection() {
  const sessionPath = path.join(__dirname, '..', SYSTEM.SESSION_DIR);

  try {
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }
  } catch (err) {
    console.error('❌ Session directory create failed:', err.message);
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`Using WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    fireInitQueries: true,
    shouldSyncHistoryMessage: () => false,
    // FIX: store کی جگہ messageCache use کریں
    getMessage: async (key) => {
      const cached = messageCache.get(`${key.remoteJid}_${key.id}`);
      return cached || proto.Message.fromObject({});
    },
  });

  // Connection update handler
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'connecting') {
      console.log('🔄 Connecting to WhatsApp...');
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
      console.log('Bot Number:', sock.user?.id?.split(':')[0] || 'Unknown');
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;

      console.log(`Connection closed. Reason: ${reason}. Reconnecting: ${shouldReconnect}`);

      if (shouldReconnect) {
        setTimeout(() => createConnection(), 5000);
      } else {
        console.log('❌ Logged out. Get new SESSION_ID from:');
        console.log('https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1');
        process.exit(1);
      }
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // FIX: messages cache میں save کریں
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg?.message) return;

    // Cache میں save کریں
    if (msg.key?.remoteJid && msg.key?.id) {
      messageCache.set(`${msg.key.remoteJid}_${msg.key.id}`, msg.message);
      // Cache بہت بڑا نہ ہو — 500 سے زیادہ ہو تو پرانے ہٹاؤ
      if (messageCache.size > 500) {
        const firstKey = messageCache.keys().next().value;
        messageCache.delete(firstKey);
      }
    }

    if (typeof global.msgHandler === 'function') {
      try {
        await global.msgHandler(sock, msg);
      } catch (err) {
        console.error('❌ Message handler error:', err.message);
      }
    }
  });

  global.sock = sock;

  return sock;
}

/**
 * Send message with typing simulation
 */
export async function sendMessage(jid, content, options = {}) {
  if (!global.sock) {
    throw new Error('Socket not initialized');
  }

  try {
    await global.sock.sendPresenceUpdate('composing', jid);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await global.sock.sendPresenceUpdate('paused', jid);
    return await global.sock.sendMessage(jid, content, options);
  } catch (err) {
    console.error('❌ sendMessage error:', err.message);
    throw err;
  }
}

/**
 * Download media from message
 */
export async function downloadMedia(message) {
  try {
    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger,
        reuploadRequest: global.sock?.updateMediaMessage,
      }
    );
    return buffer;
  } catch (error) {
    console.error('❌ Download media error:', error.message);
    return null;
  }
}

export default {
  createConnection,
  sendMessage,
  downloadMedia,
};
