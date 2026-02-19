/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Serializer        ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import {
  jidNormalizedUser,
  downloadMediaMessage,
  generateWAMessage,
  getContentType,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { OWNER } from '../config.js';

// FIX: Silent logger — console.log spam ختم
const logger = pino({ level: 'silent' });

export function serialize(conn, msg) {
  if (!msg) return msg;

  // Normalize message keys
  if (msg.key) {
    msg.id = msg.key.id;
    msg.isSelfSender = msg.key.fromMe || false;
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from?.endsWith('@g.us') || false;

    msg.sender = jidNormalizedUser(
      msg.isSelfSender
        ? conn.user?.id
        : msg.isGroup
        ? msg.key.participant
        : msg.from
    ) || '';
  }

  // FIX: isOwner check directly in serializer
  msg.isOwner = msg.sender?.replace(/[^0-9]/g, '') === OWNER.NUMBER;

  // Message content
  if (msg.message) {
    // FIX: getContentType imported from baileys — no custom function needed
    msg.type = getContentType(msg.message);
    msg.body = extractMessageBody(msg.message);

    // Media download helper
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];
    if (mediaTypes.includes(msg.type)) {
      msg.download = async () => {
        try {
          return await downloadMediaMessage(
            msg,
            'buffer',
            {},
            {
              logger,
              reuploadRequest: conn.updateMediaMessage,
            }
          );
        } catch (err) {
          console.error('❌ Media download error:', err.message);
          return null;
        }
      };
    }

    // Quoted message
    const contextInfo = msg.message?.[msg.type]?.contextInfo
      || msg.message?.extendedTextMessage?.contextInfo;

    const quoted = contextInfo?.quotedMessage;

    if (quoted && contextInfo) {
      const quotedType = getContentType(quoted);
      msg.quoted = {
        id: contextInfo.stanzaId,
        sender: jidNormalizedUser(contextInfo.participant || ''),
        from: msg.from,
        type: quotedType,
        message: quoted,
        body: extractMessageBody(quoted),
        download: async () => {
          try {
            const fakeMsg = {
              key: {
                remoteJid: msg.from,
                id: contextInfo.stanzaId,
                participant: contextInfo.participant,
              },
              message: quoted,
            };
            return await downloadMediaMessage(
              fakeMsg,
              'buffer',
              {},
              {
                logger,
                reuploadRequest: conn.updateMediaMessage,
              }
            );
          } catch (err) {
            console.error('❌ Quoted media download error:', err.message);
            return null;
          }
        },
      };
    } else {
      msg.quoted = null;
    }
  }

  // Reply helper
  msg.reply = async (text, options = {}) => {
    try {
      return await conn.sendMessage(msg.from, { text: String(text), ...options }, { quoted: msg });
    } catch (err) {
      console.error('❌ Reply error:', err.message);
    }
  };

  // React helper
  msg.react = async (emoji) => {
    try {
      return await conn.sendMessage(msg.from, {
        react: { text: emoji, key: msg.key },
      });
    } catch (err) {
      console.error('❌ React error:', err.message);
    }
  };

  // Delete helper
  msg.delete = async () => {
    try {
      return await conn.sendMessage(msg.from, {
        delete: msg.key,
      });
    } catch (err) {
      console.error('❌ Delete error:', err.message);
    }
  };

  return msg;
}

// FIX: isOwner and isAdmin exported properly for commandHandler.js
export function isOwner(sender) {
  return sender?.replace(/[^0-9]/g, '') === OWNER.NUMBER;
}

export async function isAdmin(sock, groupJid, senderJid) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);
    return admins.includes(jidNormalizedUser(senderJid));
  } catch {
    return false;
  }
}

export async function isBotAdmin(sock, groupJid) {
  try {
    const metadata = await sock.groupMetadata(groupJid);
    const botJid = jidNormalizedUser(sock.user?.id);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);
    return admins.includes(botJid);
  } catch {
    return false;
  }
}

function extractMessageBody(message) {
  if (!message) return '';
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    message.templateButtonReplyMessage?.selectedId ||
    ''
  );
}

export default serialize;
