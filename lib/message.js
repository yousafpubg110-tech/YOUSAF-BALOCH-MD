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

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

export class Message {
  constructor(conn, msg) {
    this.conn = conn;
    this.msg = msg;
    this.key = msg.key;
    this.from = msg.key.remoteJid;
    this.sender = msg.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : msg.key.participant || this.from;
    this.isGroup = this.from.endsWith('@g.us');
    this.chat = this.from;
    
    // Message type detection
    this.type = Object.keys(msg.message || {})[0];
    this.body = this.getMessageBody();
    this.text = this.body;
    
    // Media detection
    this.quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    this.mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    // Timestamps
    this.timestamp = msg.messageTimestamp;
    this.messageId = msg.key.id;
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
      ''
    );
  }

  // Reply function
  async reply(text, options = {}) {
    return await this.conn.sendMessage(this.from, { 
      text, 
      ...options 
    }, { 
      quoted: this.msg 
    });
  }

  // React to message
  async react(emoji) {
    return await this.conn.sendMessage(this.from, {
      react: {
        text: emoji,
        key: this.key
      }
    });
  }

  // Send image
  async sendImage(buffer, caption = '', options = {}) {
    return await this.conn.sendMessage(this.from, {
      image: buffer,
      caption,
      ...options
    }, { quoted: this.msg });
  }

  // Send video
  async sendVideo(buffer, caption = '', options = {}) {
    return await this.conn.sendMessage(this.from, {
      video: buffer,
      caption,
      ...options
    }, { quoted: this.msg });
  }

  // Send audio
  async sendAudio(buffer, options = {}) {
    return await this.conn.sendMessage(this.from, {
      audio: buffer,
      mimetype: 'audio/mp4',
      ...options
    }, { quoted: this.msg });
  }

  // Send document
  async sendDocument(buffer, filename, mimetype, caption = '', options = {}) {
    return await this.conn.sendMessage(this.from, {
      document: buffer,
      fileName: filename,
      mimetype,
      caption,
      ...options
    }, { quoted: this.msg });
  }

  // Send sticker
  async sendSticker(buffer, options = {}) {
    return await this.conn.sendMessage(this.from, {
      sticker: buffer,
      ...options
    }, { quoted: this.msg });
  }

  // Send contact
  async sendContact(jid, name, options = {}) {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${jid.split('@')[0]}:+${jid.split('@')[0]}\nEND:VCARD`;
    return await this.conn.sendMessage(this.from, {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      },
      ...options
    }, { quoted: this.msg });
  }

  // Send location
  async sendLocation(lat, long, options = {}) {
    return await this.conn.sendMessage(this.from, {
      location: {
        degreesLatitude: lat,
        degreesLongitude: long
      },
      ...options
    }, { quoted: this.msg });
  }

  // Delete message
  async delete() {
    return await this.conn.sendMessage(this.from, { 
      delete: this.key 
    });
  }

  // Forward message
  async forward(jid) {
    return await this.conn.sendMessage(jid, { 
      forward: this.msg 
    });
  }

  // Edit message
  async edit(newText) {
    return await this.conn.sendMessage(this.from, {
      text: newText,
      edit: this.key
    });
  }

  // Download media
  async download() {
    const message = this.msg.message;
    const type = Object.keys(message)[0];
    
    if (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type === 'documentMessage' || type === 'stickerMessage') {
      return await this.conn.downloadMediaMessage(this.msg);
    }
    
    return null;
  }

  // Get quoted message
  getQuoted() {
    if (!this.quoted) return null;
    return {
      type: Object.keys(this.quoted)[0],
      message: this.quoted,
      text: this.quoted.conversation || this.quoted.extendedTextMessage?.text || ''
    };
  }

  // Check if message is from owner
  isOwner() {
    const ownerNumbers = ['923710636110@s.whatsapp.net'];
    return ownerNumbers.includes(this.sender);
  }

  // Check if sender is admin
  async isAdmin() {
    if (!this.isGroup) return false;
    const groupMetadata = await this.conn.groupMetadata(this.from);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    return admins.includes(this.sender);
  }

  // Check if bot is admin
  async isBotAdmin() {
    if (!this.isGroup) return false;
    const groupMetadata = await this.conn.groupMetadata(this.from);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    return admins.includes(this.conn.user.id);
  }
}

export default Message;
