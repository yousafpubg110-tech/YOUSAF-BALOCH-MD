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

import { jidNormalizedUser, extractMessageContent, downloadMediaMessage, generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys';
import { Message } from './message.js';

export function serialize(conn, msg) {
  if (!msg) return msg;
  
  // Normalize message
  if (msg.key) {
    msg.id = msg.key.id;
    msg.isSelfSender = msg.key.fromMe;
    msg.from = msg.key.remoteJid;
    msg.isGroup = msg.from?.endsWith('@g.us');
    
    msg.sender = jidNormalizedUser(
      msg.isSelfSender ? conn.user?.id : (msg.isGroup ? msg.key.participant : msg.from)
    );
  }

  // Message type
  if (msg.message) {
    msg.type = getContentType(msg.message);
    msg.body = extractMessageBody(msg.message);
    
    // Extract media
    if (msg.type === 'imageMessage' || msg.type === 'videoMessage' || msg.type === 'audioMessage' || msg.type === 'documentMessage' || msg.type === 'stickerMessage') {
      msg.download = async () => {
        return await downloadMediaMessage(msg, 'buffer', {}, { logger: console, reuploadRequest: conn.updateMediaMessage });
      };
    }

    // Quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted) {
      msg.quoted = {
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
        sender: jidNormalizedUser(msg.message.extendedTextMessage.contextInfo.participant),
        from: msg.from,
        type: getContentType(quoted),
        message: quoted,
        body: extractMessageBody(quoted),
        download: async () => {
          const quotedMsg = await generateWAMessage(msg.from, { forward: quoted }, { userJid: conn.user.id });
          return await downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: console, reuploadRequest: conn.updateMediaMessage });
        }
      };
    }
  }

  // Add helper methods
  msg.reply = async (text, options = {}) => {
    return await conn.sendMessage(msg.from, { text, ...options }, { quoted: msg });
  };

  msg.react = async (emoji) => {
    return await conn.sendMessage(msg.from, {
      react: { text: emoji, key: msg.key }
    });
  };

  return new Message(conn, msg);
}

function getContentType(message) {
  if (!message) return null;
  return Object.keys(message)[0];
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
