import { Boom } from '@hapi/boom';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileTypeFromBuffer } from 'file-type';

const {
  default: _makeWaSocket,
  proto,
  jidDecode,
  jidNormalizedUser,
  downloadContentFromMessage,
  generateWAMessageFromContent,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType
} = await import('@whiskeysockets/baileys');

export async function makeWASocket(connectionOptions, options = {}) {
  let conn = _makeWaSocket(connectionOptions);
  
  conn.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return decode.user && decode.server && decode.user + '@' + decode.server || jid;
    } else return jid;
  };

  conn.getName = async (jid, withoutContact = false) => {
    jid = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (jid.endsWith('@g.us')) {
      return new Promise(async (resolve) => {
        v = conn.chats[jid] || {};
        if (!(v.name || v.subject)) v = await conn.groupMetadata(jid) || {};
        resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'));
      });
    } else {
      v = jid === '0@s.whatsapp.net' ? {
        jid,
        vname: 'WhatsApp'
      } : areJidsSameUser(jid, conn.user.id) ? conn.user : (conn.chats[jid] || {});
    }
    return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
  };

  conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await conn.getName(i),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(i)}\nFN:${await conn.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
      });
    }
    return conn.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted });
  };

  conn.downloadMediaMessage = async (message) => {
    let quoted = message.msg ? message.msg : message;
    let mtype = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mtype.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  conn.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
    let type = await fileTypeFromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    };
    if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data));
    return {
      res,
      filename,
      ...type,
      data
    };
  };

  conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
    let type = await conn.getFile(path, true);
    let { res, data: file, filename: pathFile } = type;
    
    if (res && res.status !== 200 || file.length <= 65536) {
      try {
        throw { json: JSON.parse(file.toString()) };
      } catch (e) {
        if (e.json) throw e.json;
      }
    }
    
    let opt = { filename };
    if (quoted) opt.quoted = quoted;
    if (!type) options.asDocument = true;
    
    let mtype = '', mimetype = type.mime;
    
    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
    else if (/video/.test(type.mime)) mtype = 'video';
    else if (/audio/.test(type.mime)) {
      mtype = 'audio';
      mimetype = 'audio/mpeg';
    } else mtype = 'document';
    
    if (options.asDocument) mtype = 'document';

    delete options.asSticker;
    delete options.asLocation;
    delete options.asVideo;
    delete options.asDocument;
    delete options.asImage;

    let message = {
      ...options,
      caption,
      ptt,
      [mtype]: { url: pathFile },
      mimetype
    };
    
    let m;
    try {
      m = await conn.sendMessage(jid, message, { ...opt, ...options });
    } catch (e) {
      console.error(e);
      m = null;
    } finally {
      if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
      file = null;
      return m;
    }
  };

  conn.sendButton = async (jid, text = '', footer = '', buffer, buttons, quoted, options) => {
    let type;
    if (Array.isArray(buffer)) (options = quoted, quoted = buttons, buttons = buffer, buffer = null);
    else if (buffer) try {
      type = await conn.getFile(buffer);
      buffer = type.data;
    } catch {
      buffer = null;
    }
    
    let message = {
      ...options,
      [buffer ? 'caption' : 'text']: text || '',
      footer,
      buttons: buttons.map(btn => ({
        buttonId: btn[1] || btn[0] || '',
        buttonText: { displayText: btn[0] || btn[1] || '' },
        type: 1
      })),
      ...(buffer ? { [/image/.test(type?.mime) ? 'image' : /video/.test(type?.mime) ? 'video' : 'document']: buffer } : {})
    };
    
    return await conn.sendMessage(jid, message, { quoted, ...options });
  };

  conn.sendList = async (jid, title, text, footer, buttonText, listSections, quoted, options) => {
    let message = {
      ...options,
      text,
      footer,
      title,
      buttonText,
      sections: listSections
    };
    return await conn.sendMessage(jid, message, { quoted, ...options });
  };

  conn.reply = async (jid, text, quoted, options) => {
    return await conn.sendMessage(jid, { text: text }, { quoted, ...options });
  };

  conn.sendImage = async (jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
  };

  conn.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted });
  };

  conn.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted });
  };

  conn.sendSticker = async (jid, path, quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { sticker: buffer, ...options }, { quoted });
  };

  return conn;
}

export function serialize() {
  return;
}

export function protoType() {
  return;
}

export default { makeWASocket, serialize, protoType };
