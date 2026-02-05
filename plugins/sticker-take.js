import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.quoted) return m.reply(`❌ *Reply to a sticker!*\n\n*Example:*\n${usedPrefix + command} Yousaf | Baloch`);
  if (!/webp/.test(m.quoted.mimetype)) return m.reply('❌ *That is not a sticker!*');
  
  let [packname, author] = text.split('|');
  if (!packname) packname = global.packname;
  if (!author) author = global.author;
  
  m.reply('⏳ *Changing sticker info...*');
  
  let media = await m.quoted.download();
  let stiker = await sticker(media, false, packname.trim(), author.trim());
  
  if (stiker) {
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
  } else {
    return m.reply('❌ *Failed to change sticker!*');
  }
};

handler.help = ['take'];
handler.tags = ['sticker'];
handler.command = /^(take|steal|wm)$/i;

export default handler;
