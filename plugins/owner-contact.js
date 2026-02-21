/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Owner Info Plugin ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Build vCard ──────────────────────────────────────────────────────
function buildVCard() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${OWNER.FULL_NAME}`,
    `ORG:${OWNER.BOT_NAME} Developer`,
    `TEL;type=CELL;type=VOICE;waid=${OWNER.NUMBER}:+${OWNER.NUMBER}`,
    `X-WA-BIZ-NAME:${OWNER.FULL_NAME}`,
    `X-WA-BIZ-DESCRIPTION:WhatsApp Bot Developer & Creator`,
    'END:VCARD',
  ].join('\n');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['owner', 'creator', 'developer', 'dev'],
  name       : 'owner',
  category   : 'Info',
  description: 'Show bot owner info and save contact',
  usage      : '.owner',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('👑');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Send vCard contact first ────────────────────────────────
      await sock.sendMessage(from, {
        contacts: {
          displayName : OWNER.FULL_NAME,
          contacts    : [{ vcard: buildVCard() }],
        },
      }, { quoted: msg });

      // ── Build owner info message ────────────────────────────────
      const ownerMsg = `
╭━━━『 👑 *OWNER INFO* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 👤 *Personal Info* 』
│ 🧑  *Name:*     ${OWNER.FULL_NAME}
│ 📱  *Number:*   +${OWNER.NUMBER}
│ 💼  *Role:*     Developer & Creator
│ 🌍  *Country:*  ${OWNER.COUNTRY || 'Pakistan'} 🇵🇰
│ 🤖  *Bot:*      ${OWNER.BOT_NAME}
│ ✨  *Version:*  ${OWNER.VERSION}
│ 🔧  *Prefix:*   \`${CONFIG.PREFIX}\`
│ 🌐  *Status:*   Active Developer ✅
╰──────────────────────────

╭─『 🔗 *Social Links* 』
│ 📺 *YouTube:*
│ ${OWNER.YOUTUBE}
│
│ 🎵 *TikTok:*
│ ${OWNER.TIKTOK}
│
│ 💻 *GitHub:*
│ ${OWNER.GITHUB}
│
│ 📢 *WhatsApp Channel:*
│ ${OWNER.CHANNEL}
╰──────────────────────────

╭─『 💬 *Support* 』
│ 📩 *DM for bot support*
│ ⏰ *Response: Within 24h*
│ 📱 *Contact saved above!*
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send owner info ─────────────────────────────────────────
      await sock.sendMessage(from, {
        text: ownerMsg,
      }, { quoted: msg });

      // ── Send channel link separately ────────────────────────────
      await sock.sendMessage(from, {
        text: `📢 *Join our WhatsApp Channel:*\n${OWNER.CHANNEL}`,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[OWNER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Owner command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Owner command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
