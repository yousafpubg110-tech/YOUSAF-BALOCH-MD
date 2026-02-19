/*
═══════════════════════════════════════════════════
📁 LIB/CONNECTION.JS
═══════════════════════════════════════════════════
Purpose: Baileys WhatsApp Connection Handler
Version: Based on @whiskeysockets/baileys@^6.7.9
Node.js: 20.11.0 LTS
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
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
  makeInMemoryStore,
  proto,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OWNER, CONFIG, SYSTEM } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// FIX: Silent logger ایک بار بناؤ، بار بار نہیں
const logger = pino({ level: 'silent' });

// FIX: In-memory store یہاں بھی بناؤ
const store = makeInMemoryStore({ logger });

/**
 * Create WhatsApp Connection
 * @returns {Promise<Object>} Socket instance
 */
export async function createConnection() {
  // FIX: Session path اب config.js سے آئے گی — consistent رہے گا
  const sessionPath = path.join(__dirname, '..', SYSTEM.SESSION_DIR);

  // FIX: try-catch لگایا تاکہ directory error سے crash نہ ہو
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
    // FIX: printQRInTerminal false — ہم pairing سے connect کرتے ہیں QR سے نہیں
    printQRInTerminal: false,
    // FIX: Browser config index.js سے match کرتا ہے
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
    // FIX: getMessage میں store use کریں
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  // FIX: Store کو socket سے bind کریں
  store?.bind(sock.ev);

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
        // FIX: setTimeout لگایا تاکہ reconnect loop میں crash نہ ہو
        setTimeout(() => createConnection(), 5000);
      } else {
        console.log('❌ Logged out. Get new SESSION_ID from:');
        console.log('https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1');
        process.exit(1);
      }
    }
  });

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);

  // Handle messages upsert
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg?.message) return;

    // index.js کا message handler call ہوگا
    if (typeof global.msgHandler === 'function') {
      try {
        await global.msgHandler(sock, msg);
      } catch (err) {
        console.error('❌ Message handler error:', err.message);
      }
    }
  });

  // Store socket globally
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
