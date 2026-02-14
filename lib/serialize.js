/*
═══════════════════════════════════════════════════
📁 LIB/SERIALIZE.JS
═══════════════════════════════════════════════════
Purpose: Message Serializer & Parser
Version: Based on @whiskeysockets/baileys@^6.7.8
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import { downloadContentFromMessage, jidNormalizedUser, extractMessageContent } from '@whiskeysockets/baileys';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Serialize message with helper methods
 */
export function serialize(msg, sock) {
  if (!msg) return msg;

  // Basic message info
  const m = {};
  
  m.message = msg;
  m.key = msg.key;
  m.from = jidNormalizedUser(msg.key.remoteJid);
  m.isGroup = m.from.endsWith('@g.us');
  m.sender = jidNormalizedUser(msg.key.fromMe ? sock.user.id : (m.isGroup ? msg.key.participant : m.from));
  
  // Message type
  m.mtype = Object.keys(msg.message || {})[0];
  m.msg = extractMessageContent(msg.message);
  
  // Message content
  m.body = 
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    msg.message?.documentMessage?.caption ||
    msg.message?.buttonsResponseMessage?.selectedButtonId ||
    msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.message?.templateButtonReplyMessage?.selectedId ||
    '';

  m.text = m.body;
  
  // Quoted message
  m.quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
  
  if (m.quoted) {
    m.quoted.key = {
      remoteJid: msg.message.extendedTextMessage.contextInfo.remoteJid || m.from,
      fromMe: msg.message.extendedTextMessage.contextInfo.participant === sock.user.id,
      id: msg.message.extendedTextMessage.contextInfo.stanzaId,
      participant: msg.message.extendedTextMessage.contextInfo.participant
    };
    
    m.quoted.message = extractMessageContent(m.quoted);
    m.quoted.mtype = Object.keys(m.quoted.message)[0];
    
    m.quoted.text = 
      m.quoted.message?.conversation ||
      m.quoted.message?.extendedTextMessage?.text ||
      m.quoted.message?.imageMessage?.caption ||
      m.quoted.message?.videoMessage?.caption ||
      '';
      
    m.quoted.sender = jidNormalizedUser(m.quoted.key.participant || m.quoted.key.remoteJid);
  }

  // Media info
  m.isMedia = !!(
    msg.message?.imageMessage ||
    msg.message?.videoMessage ||
    msg.message?.audioMessage ||
    msg.message?.documentMessage ||
    msg.message?.stickerMessage
  );

  /**
   * Reply to message
   */
  m.reply = async (text, options = {}) => {
    return await sock.sendMessage(m.from, { text }, {
      quoted: msg,
      ...options
    });
  };

  /**
   * Reply with media
   */
  m.replyWithMedia = async (buffer, type, caption = '', options = {}) => {
    const content = {};
    
    if (type === 'image') {
      content.image = buffer;
      content.caption = caption;
    } else if (type === 'video') {
      content.video = buffer;
      content.caption = caption;
    } else if (type === 'audio') {
      content.audio = buffer;
      content.mimetype = 'audio/mp4';
    } else if (type === 'sticker') {
      content.sticker = buffer;
    } else if (type === 'document') {
      content.document = buffer;
      content.mimetype = options.mimetype || 'application/octet-stream';
      content.fileName = options.fileName || 'file';
    }

    return await sock.sendMessage(m.from, content, {
      quoted: msg,
      ...options
    });
  };

  /**
   * React to message
   */
  m.react = async (emoji) => {
    return await sock.sendMessage(m.from, {
      react: {
        text: emoji,
        key: msg.key
      }
    });
  };

  /**
   * Download media from message
   */
  m.download = async () => {
    const messageType = Object.keys(msg.message)[0];
    const messageContent = msg.message[messageType];

    if (!['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(messageType)) {
      return null;
    }

    try {
      const stream = await downloadContentFromMessage(messageContent, messageType.replace('Message', ''));
      let buffer = Buffer.from([]);
      
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      return buffer;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  };

  /**
   * Download quoted media
   */
  m.downloadQuoted = async () => {
    if (!m.quoted) return null;
    
    const messageType = m.quoted.mtype;
    const messageContent = m.quoted.message[messageType];

    if (!['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(messageType)) {
      return null;
    }

    try {
      const stream = await downloadContentFromMessage(messageContent, messageType.replace('Message', ''));
      let buffer = Buffer.from([]);
      
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      return buffer;
    } catch (error) {
      console.error('Download quoted error:', error);
      return null;
    }
  };

  /**
   * Delete message
   */
  m.delete = async () => {
    return await sock.sendMessage(m.from, { delete: msg.key });
  };

  /**
   * Forward message
   */
  m.forward = async (jid) => {
    return await sock.sendMessage(jid, { forward: msg });
  };

  /**
   * Copy message (send without forwarded tag)
   */
  m.copy = async (jid) => {
    const content = extractMessageContent(msg.message);
    return await sock.sendMessage(jid, content);
  };

  return m;
}

/**
 * Get message type
 */
export function getContentType(content) {
  if (!content) return null;
  return Object.keys(content)[0];
}

/**
 * Check if user is owner
 */
export function isOwner(sender, ownerNumbers = []) {
  const senderNumber = sender.split('@')[0];
  return ownerNumbers.includes(senderNumber);
}

/**
 * Check if user is admin in group
 */
export async function isAdmin(sock, groupId, userId) {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const participant = groupMetadata.participants.find(p => p.id === userId);
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
  } catch {
    return false;
  }
}

/**
 * Check if bot is admin in group
 */
export async function isBotAdmin(sock, groupId) {
  return await isAdmin(sock, groupId, sock.user.id);
}

export default {
  serialize,
  getContentType,
  isOwner,
  isAdmin,
  isBotAdmin
};

