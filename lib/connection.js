/*
═══════════════════════════════════════════════════
📁 LIB/CONNECTION.JS
═══════════════════════════════════════════════════
Purpose: Baileys WhatsApp Connection Handler
Version: Based on @whiskeysockets/baileys@^6.7.8
Node.js: 20.11.0 LTS
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason, Browsers } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create WhatsApp Connection
 * @returns {Promise<Object>} Socket instance
 */
export async function createConnection() {
  const sessionPath = path.join(__dirname, '../session');
  
  // Ensure session directory exists
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`Using WhatsApp v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS('YOUSAF-BALOCH-MD'),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false,
    fireInitQueries: true,
    shouldSyncHistoryMessage: msg => false,
    getMessage: async (key) => {
      return { conversation: 'YOUSAF-BALOCH-MD' };
    }
  });

  // Connection update handler
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('QR Code:', qr);
    }

    if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
      console.log('Bot Number:', sock.user.id.split(':')[0]);
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('Connection closed. Reconnecting:', shouldReconnect);

      if (shouldReconnect) {
        await createConnection();
      } else {
        console.log('Logged out. Delete session folder and scan QR again.');
      }
    }
  });

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);

  // Handle messages upsert
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    
    const msg = messages[0];
    if (!msg.message) return;

    // This will be handled by command handler
    global.msgHandler?.(sock, msg);
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

  // Simulate typing
  await global.sock.sendPresenceUpdate('composing', jid);
  await new Promise(resolve => setTimeout(resolve, 1000));
  await global.sock.sendPresenceUpdate('paused', jid);

  return await global.sock.sendMessage(jid, content, options);
}

/**
 * Download media from message
 */
export async function downloadMedia(message) {
  const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
  
  try {
    const buffer = await downloadMediaMessage(
      message,
      'buffer',
      {},
      {
        logger: pino({ level: 'silent' }),
        reuploadRequest: global.sock.updateMediaMessage
      }
    );
    return buffer;
  } catch (error) {
    console.error('Download media error:', error);
    return null;
  }
}

export default {
  createConnection,
  sendMessage,
  downloadMedia
};
