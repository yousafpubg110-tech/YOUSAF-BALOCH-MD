/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Private Mode Switch  ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { CONFIG } from '../config.js';

let handler = async (m, { conn }) => {
  
  // Check if already private
  if (CONFIG.BOT_MODE === 'private') {
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║     ℹ️ *ALREADY PRIVATE MODE* ℹ️      ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `🌐 Bot is already in *PRIVATE* mode\n`
          + `👑 Only owner can use bot commands\n\n`
          + `_⚡ YOUSAF-BALOCH-MD_`,
    }, { quoted: m });
  }

  // Switch to private mode
  CONFIG.BOT_MODE = 'private';
  
  // Success message with fancy design
  await conn.sendMessage(m.chat, {
    text: `╔══════════════════════════════════════╗\n`
        + `║     🔒 *PRIVATE MODE ACTIVATED* 🔒    ║\n`
        + `╚══════════════════════════════════════╝\n\n`
        + `🌐 *Mode:* PRIVATE\n`
        + `👑 *Access:* Only owner can use bot\n`
        + `👑 *Owner:* MR YOUSAF BALOCH\n`
        + `📱 *Number:* +923710636110\n\n`
        + `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`
        + `┃  🔐 Bot is now restricted to owner  🔐 ┃\n`
        + `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`
        + `_⚡ YOUSAF-BALOCH-MD — Private Mode Enabled_`,
  }, { quoted: m });

  // Optional: Send channel button after mode change
  try {
    await conn.sendMessage(m.chat, {
      text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃     📢 *YOUSAF-BALOCH-MD OFFICIAL* ┃\n┃         ✨ *CHANNEL* ✨             ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n👆 *Click the button below to join* 👆`,
      contextInfo: {
        externalAdReply: {
          title: `📢 Join YOUSAF-BALOCH-MD Channel`,
          body: 'Click here to join WhatsApp Channel',
          thumbnail: (() => { try { return require('fs').readFileSync('./assets/menu-thumb.png'); } catch { return Buffer.from(''); } })(),
          mediaType: 1,
          mediaUrl: 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
          sourceUrl: 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
        },
      },
    }, { quoted: m });
  } catch (e) {}
};

handler.help = ['private'];
handler.tags = ['main'];
handler.command = /^(private)$/i;
handler.owner = true; // Only owner can change mode

export default handler;
