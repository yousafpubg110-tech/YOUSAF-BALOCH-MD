/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Public Mode Switch   ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { CONFIG } from '../config.js';

let handler = async (m, { conn }) => {
  
  // Check if already public
  if (CONFIG.BOT_MODE === 'public') {
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║     ℹ️ *ALREADY PUBLIC MODE* ℹ️       ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `🌐 Bot is already in *PUBLIC* mode\n`
          + `👥 Everyone can use bot commands\n\n`
          + `_⚡ YOUSAF-BALOCH-MD_`,
    }, { quoted: m });
  }

  // Switch to public mode
  CONFIG.BOT_MODE = 'public';
  
  // Success message with fancy design
  await conn.sendMessage(m.chat, {
    text: `╔══════════════════════════════════════╗\n`
        + `║     ✅ *PUBLIC MODE ACTIVATED* ✅     ║\n`
        + `╚══════════════════════════════════════╝\n\n`
        + `🌐 *Mode:* PUBLIC\n`
        + `👥 *Access:* Everyone can use bot\n`
        + `👑 *Owner:* MR YOUSAF BALOCH\n`
        + `📱 *Number:* +923710636110\n\n`
        + `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`
        + `┃  ✨ Bot is now accessible to all  ✨  ┃\n`
        + `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`
        + `_⚡ YOUSAF-BALOCH-MD — Public Mode Enabled_`,
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

handler.help = ['public'];
handler.tags = ['main'];
handler.command = /^(public)$/i;
handler.owner = true; // Only owner can change mode

export default handler;
