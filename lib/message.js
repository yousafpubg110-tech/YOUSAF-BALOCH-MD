/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Message Handler   ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { getContentType, downloadMediaMessage } from '@whiskeysockets/baileys';
import pino from 'pino';
import { OWNER } from '../config.js';

const logger = pino({ level: 'silent' });

export class Message {
  constructor(conn, msg) {
    this.conn = conn;
    this.msg = msg;
    this.key = msg.key;
    this.from = msg.key.remoteJid;
    this.isGroup = this.from?.endsWith('@g.us') || false;
    this.chat = this.from;

    // FIX: sender extraction safe
    this.sender = msg.key.fromMe
      ? conn.user?.id?.split(':')[0] + '@s.whatsapp.net'
      : this.isGroup
      ? msg.key.participant || ''
      : this.from;

    // FIX: getContentType from baileys — no manual Object.keys
    this.type = getContentType(msg.message || {});
    this.body = this.getMessageBody();
    this.text = this.body;

    // Context info
    const contextInfo = msg.message?.[this.type]?.contextInfo
      || msg.message?.extendedTextMessage?.contextInfo;

    this.quoted = contextInfo?.quotedMessage || null;
    this.quotedId = contextInfo?.stanzaId || null;
    this.quotedSender = contextInfo?.participant || null;
    this.mentionedJid = contextInfo?.mentionedJid || [];

    this.timestamp = msg.messageTimestamp;
    this.messageId = msg.key.id;

    // FIX: isOwner as property not method — consistent with rest of system
    this.isOwnerBool = this.sender?.replace(/[^0-9]/g, '') === OWNER.NUMBER;
  }

  getMessageBody() {
    const message = this.msg.message;
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

  async reply(text, options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { text: String(text), ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ reply error:', err.message);
    }
  }

  async react(emoji) {
    try {
      return await this.conn.sendMessage(this.from, {
        react: { text: emoji, key: this.key },
      });
    } catch (err) {
      console.error('❌ react error:', err.message);
    }
  }

  async sendImage(buffer, caption = '', options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { image: buffer, caption, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendImage error:', err.message);
    }
  }

  async sendVideo(buffer, caption = '', options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { video: buffer, caption, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendVideo error:', err.message);
    }
  }

  async sendAudio(buffer, options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { audio: buffer, mimetype: 'audio/mp4', ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendAudio error:', err.message);
    }
  }

  async sendDocument(buffer, filename, mimetype, caption = '', options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { document: buffer, fileName: filename, mimetype, caption, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendDocument error:', err.message);
    }
  }

  async sendSticker(buffer, options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { sticker: buffer, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendSticker error:', err.message);
    }
  }

  async sendContact(jid, name, options = {}) {
    try {
      const number = jid.split('@')[0];
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
      return await this.conn.sendMessage(
        this.from,
        { contacts: { displayName: name, contacts: [{ vcard }] }, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendContact error:', err.message);
    }
  }

  async sendLocation(lat, long, options = {}) {
    try {
      return await this.conn.sendMessage(
        this.from,
        { location: { degreesLatitude: lat, degreesLongitude: long }, ...options },
        { quoted: this.msg }
      );
    } catch (err) {
      console.error('❌ sendLocation error:', err.message);
    }
  }

  async delete() {
    try {
      return await this.conn.sendMessage(this.from, { delete: this.key });
    } catch (err) {
      console.error('❌ delete error:', err.message);
    }
  }

  async forward(jid) {
    try {
      return await this.conn.sendMessage(jid, { forward: this.msg });
    } catch (err) {
      console.error('❌ forward error:', err.message);
    }
  }

  async edit(newText) {
    try {
      return await this.conn.sendMessage(this.from, {
        text: newText,
        edit: this.key,
      });
    } catch (err) {
      console.error('❌ edit error:', err.message);
    }
  }

  async download() {
    const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];
    if (!mediaTypes.includes(this.type)) return null;
    try {
      return await downloadMediaMessage(
        this.msg,
        'buffer',
        {},
        { logger, reuploadRequest: this.conn.updateMediaMessage }
      );
    } catch (err) {
      console.error('❌ download error:', err.message);
      return null;
    }
  }

  getQuoted() {
    if (!this.quoted) return null;
    return {
      id: this.quotedId,
      sender: this.quotedSender,
      type: getContentType(this.quoted),
      message: this.quoted,
      text: this.quoted.conversation || this.quoted.extendedTextMessage?.text || '',
    };
  }

  // FIX: isOwner now a method AND property both available
  isOwner() {
    return this.isOwnerBool;
  }

  async isAdmin() {
    if (!this.isGroup) return false;
    try {
      const groupMetadata = await this.conn.groupMetadata(this.from);
      const admins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id);
      return admins.includes(this.sender);
    } catch {
      return false;
    }
  }

  async isBotAdmin() {
    if (!this.isGroup) return false;
    try {
      const groupMetadata = await this.conn.groupMetadata(this.from);
      const botId = this.conn.user?.id?.split(':')[0] + '@s.whatsapp.net';
      const admins = groupMetadata.participants
        .filter(p => p.admin)
        .map(p => p.id);
      return admins.includes(botId);
    } catch {
      return false;
    }
  }
}

export default Message;
