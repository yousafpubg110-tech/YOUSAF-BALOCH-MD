import { sticker } from '../lib/sticker.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let name = await conn.getName(who);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!mime) return m.reply(`❌ *Reply to an image or video!*\n\n*Example:*\nSend image/video then reply with:\n${usedPrefix + command}`);
  
  if (!/image|video/.test(mime)) return m.reply('❌ *Only images and videos are supported!*');
  if (/video/.test(mime) && (q.msg || q).seconds > 10) return m.reply('❌ *Video must be less than 10 seconds!*');
  
  m.reply('⏳ *Creating sticker...*');
  
  let media = await q.download();
  let stiker = await sticker(media, false, global.packname, global.author);
  
  if (stiker) {
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
  } else {
    return m.reply('❌ *Failed to create sticker!*');
  }
};

handler.help = ['sticker', 's'];
handler.tags = ['sticker'];
handler.command = /^(sticker|s|stiker)$/i;

export default handler;
