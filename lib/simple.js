/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Simple Socket     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { Boom } from '@hapi/boom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fileTypeFromBuffer } from 'file-type';
import axios from 'axios';
import {
  makeWASocket as _makeWaSocket,
  proto,
  jidDecode,
  jidNormalizedUser,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} from '@whiskeysockets/baileys';
import { sanitizeUrl } from './utils.js';
import { SYSTEM } from '../config.js';

// FIX: __dirname defined — ES module mein zaruri hai
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// FIX: top-level await removed — await import() ES module mein crash karta tha
// Sab kuch direct import ho gaya upar

export function makeWASocket(connectionOptions, options = {}) {
  let conn = _makeWaSocket(connectionOptions);

  // Decode JID
  conn.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (decode.user && decode.server)
        ? `${decode.user}@${decode.server}`
        : jid;
    }
    return jid;
  };

  // Get contact name
  conn.getName = async (jid, withoutContact = false) => {
    try {
      jid = conn.decodeJid(jid);
      let v;
      if (jid.endsWith('@g.us')) {
        v = conn.chats?.[jid] || {};
        if (!v.name && !v.subject) {
          v = await conn.groupMetadata(jid).catch(() => ({}));
        }
        return v.name || v.subject || jid.split('@')[0];
      } else {
        v = jid === '0@s.whatsapp.net'
          ? { vname: 'WhatsApp' }
          : areJidsSameUser(jid, conn.user?.id)
          ? conn.user
          : conn.chats?.[jid] || {};
      }
      return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || jid.split('@')[0];
    } catch {
      return jid?.split('@')[0] || 'Unknown';
    }
  };

  // Send contact card
  conn.sendContact = async (jid, numbers, quoted = '', opts = {}) => {
    try {
      const list = [];
      for (const num of numbers) {
        const name = await conn.getName(num);
        list.push({
          displayName: name,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nitem1.TEL;waid=${num}:${num}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
        });
      }
      return conn.sendMessage(jid, {
        contacts: { displayName: `${list.length} Contact`, contacts: list },
        ...opts,
      }, { quoted });
    } catch (err) {
      console.error('❌ sendContact error:', err.message);
    }
  };

  // Download media from message
  conn.downloadMediaMessage = async (message) => {
    try {
      const quoted = message.msg || message;
      const mtype = quoted.mimetype || '';
      const messageType = message.mtype
        ? message.mtype.replace(/Message/gi, '')
        : mtype.split('/')[0];

      const stream = await downloadContentFromMessage(quoted, messageType);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }
      return buffer;
    } catch (err) {
      console.error('❌ downloadMediaMessage error:', err.message);
      return null;
    }
  };

  // Get file from path/url/buffer
  // FIX: fetch replaced with axios + sanitizeUrl — CodeQL URL sanitization fix
  conn.getFile = async (PATH, returnAsFilename) => {
    try {
      let res, filename;
      let data;

      if (Buffer.isBuffer(PATH)) {
        data = PATH;
      } else if (/^data:.*?\/.*?;base64,/i.test(PATH)) {
        data = Buffer.from(PATH.split(',')[1], 'base64');
      } else if (/^https?:\/\//.test(PATH)) {
        // FIX: URL sanitized before fetch
        const safeUrl = sanitizeUrl(PATH);
        if (!safeUrl) throw new Error('Invalid or unsafe URL');
        res = await axios.get(safeUrl, { responseType: 'arraybuffer', timeout: 30000 });
        data = Buffer.from(res.data);
      } else if (fs.existsSync(PATH)) {
        filename = PATH;
        data = fs.readFileSync(PATH);
      } else if (typeof PATH === 'string') {
        data = Buffer.from(PATH);
      } else {
        data = Buffer.alloc(0);
      }

      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');

      const type = await fileTypeFromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: 'bin',
      };

      if (data && returnAsFilename && !filename) {
        filename = path.join(__dirname, '..', SYSTEM.TEMP_DIR, `${Date.now()}.${type.ext}`);
        await fs.promises.writeFile(filename, data);
      }

      return { res, filename, ...type, data };
    } catch (err) {
      console.error('❌ getFile error:', err.message);
      throw err;
    }
  };

  // Send any file
  conn.sendFile = async (jid, filePath, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    try {
      const type = await conn.getFile(filePath, true);
      const { data: file, filename: pathFile } = type;

      let mtype = '';
      const mimetype = type.mime;

      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
      else if (/image/.test(type.mime)) mtype = 'image';
      else if (/video/.test(type.mime)) mtype = 'video';
      else if (/audio/.test(type.mime)) mtype = 'audio';
      else mtype = 'document';

      if (options.asDocument) mtype = 'document';

      delete options.asSticker;
      delete options.asDocument;
      delete options.asImage;

      const opt = { filename };
      if (quoted) opt.quoted = quoted;

      const message = {
        ...options,
        caption,
        ptt,
        [mtype]: { url: pathFile },
        mimetype,
      };

      try {
        return await conn.sendMessage(jid, message, { ...opt, ...options });
      } catch {
        return await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
      }
    } catch (err) {
      console.error('❌ sendFile error:', err.message);
    }
  };

  // Reply text
  conn.reply = async (jid, text, quoted, options = {}) => {
    try {
      return await conn.sendMessage(jid, { text: String(text) }, { quoted, ...options });
    } catch (err) {
      console.error('❌ reply error:', err.message);
    }
  };

  // FIX: sendImage — fetch replaced with axios + sanitizeUrl
  conn.sendImage = async (jid, filePath, caption = '', quoted = '', options = {}) => {
    try {
      let buffer;
      if (Buffer.isBuffer(filePath)) {
        buffer = filePath;
      } else if (/^https?:\/\//.test(filePath)) {
        const safeUrl = sanitizeUrl(filePath);
        if (!safeUrl) throw new Error('Invalid URL');
        const res = await axios.get(safeUrl, { responseType: 'arraybuffer', timeout: 30000 });
        buffer = Buffer.from(res.data);
      } else if (fs.existsSync(filePath)) {
        buffer = fs.readFileSync(filePath);
      } else {
        buffer = Buffer.alloc(0);
      }
      return await conn.sendMessage(jid, { image: buffer, caption, ...options }, { quoted });
    } catch (err) {
      console.error('❌ sendImage error:', err.message);
    }
  };

  // FIX: sendVideo — fetch replaced with axios + sanitizeUrl
  conn.sendVideo = async (jid, filePath, caption = '', quoted = '', gif = false, options = {}) => {
    try {
      let buffer;
      if (Buffer.isBuffer(filePath)) {
        buffer = filePath;
      } else if (/^https?:\/\//.test(filePath)) {
        const safeUrl = sanitizeUrl(filePath);
        if (!safeUrl) throw new Error('Invalid URL');
        const res = await axios.get(safeUrl, { responseType: 'arraybuffer', timeout: 30000 });
        buffer = Buffer.from(res.data);
      } else if (fs.existsSync(filePath)) {
        buffer = fs.readFileSync(filePath);
      } else {
        buffer = Buffer.alloc(0);
      }
      return await conn.sendMessage(jid, { video: buffer, caption, gifPlayback: gif, ...options }, { quoted });
    } catch (err) {
      console.error('❌ sendVideo error:', err.message);
    }
  };

  // FIX: sendAudio — fetch replaced with axios + sanitizeUrl
  conn.sendAudio = async (jid, filePath, quoted = '', ptt = false, options = {}) => {
    try {
      let buffer;
      if (Buffer.isBuffer(filePath)) {
        buffer = filePath;
      } else if (/^https?:\/\//.test(filePath)) {
        const safeUrl = sanitizeUrl(filePath);
        if (!safeUrl) throw new Error('Invalid URL');
        const res = await axios.get(safeUrl, { responseType: 'arraybuffer', timeout: 30000 });
        buffer = Buffer.from(res.data);
      } else if (fs.existsSync(filePath)) {
        buffer = fs.readFileSync(filePath);
      } else {
        buffer = Buffer.alloc(0);
      }
      return await conn.sendMessage(jid, { audio: buffer, ptt, ...options }, { quoted });
    } catch (err) {
      console.error('❌ sendAudio error:', err.message);
    }
  };

  // FIX: sendSticker — fetch replaced with axios + sanitizeUrl
  conn.sendSticker = async (jid, filePath, quoted = '', options = {}) => {
    try {
      let buffer;
      if (Buffer.isBuffer(filePath)) {
        buffer = filePath;
      } else if (/^https?:\/\//.test(filePath)) {
        const safeUrl = sanitizeUrl(filePath);
        if (!safeUrl) throw new Error('Invalid URL');
        const res = await axios.get(safeUrl, { responseType: 'arraybuffer', timeout: 30000 });
        buffer = Buffer.from(res.data);
      } else if (fs.existsSync(filePath)) {
        buffer = fs.readFileSync(filePath);
      } else {
        buffer = Buffer.alloc(0);
      }
      return await conn.sendMessage(jid, { sticker: buffer, ...options }, { quoted });
    } catch (err) {
      console.error('❌ sendSticker error:', err.message);
    }
  };

  return conn;
}

export default { makeWASocket };
