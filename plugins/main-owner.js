/*
 * YOUSAF-BALOCH-MD - Owner Info Plugin
 * Created by MR YOUSAF BALOCH
 *
 * WhatsApp : +923710636110
 * YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 * TikTok   : https://tiktok.com/@loser_boy.110
 * GitHub   : https://github.com/musakhanbaloch03-sad
 * Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 * Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
 */

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Build vCard string ──────────────────────────────────────────────
function buildVCard() {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${OWNER.FULL_NAME}`,
    `ORG:${OWNER.BOT_NAME};`,
    `TEL;type=CELL;type=VOICE;waid=${OWNER.NUMBER}:+${OWNER.NUMBER}`,
    `X-WA-BIZ-NAME:${OWNER.FULL_NAME} Tech`,
    `X-WA-BIZ-DESCRIPTION:WhatsApp Bot Developer`,
    'END:VCARD',
  ].join('\n');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['owner', 'creator', 'developer', 'dev'],
  name       : 'owner',
  category   : 'Info',
  description: 'Show bot owner information and contact card',
  usage      : '.owner',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('👑');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Build owner info message ────────────────────────────────
      const ownerMsg = `
╭━━━『 👑 *OWNER INFO* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 👤 *Personal Info* 』
│ 🧑  *Name:*      ${OWNER.FULL_NAME}
│ 📱  *Number:*    +${OWNER.NUMBER}
│ 💼  *Role:*      Developer & Creator
│ 🌍  *Country:*   Pakistan 🇵🇰
│ 🤖  *Bot:*       ${OWNER.BOT_NAME}
│ ✨  *Version:*   ${OWNER.VERSION || '2.0.0'}
│ 🔧  *Prefix:*    \`${CONFIG.PREFIX}\`
╰──────────────────────────

╭─『 🔗 *Social Links* 』
│ 📺 *YouTube:*
│ ${OWNER.YOUTUBE}
│
│ 🎵 *TikTok:*
│ ${OWNER.TIKTOK}
│
│ 💻 *GitHub:*
│ https://github.com/musakhanbaloch03-sad
│
│ 📢 *WhatsApp Channel:*
│ ${OWNER.CHANNEL}
╰──────────────────────────

╭─『 💬 *Support* 』
│ 📩 *DM for bot support & queries*
│ ⏰ *Response time: Within 24 hours*
│ 🛠️  *Custom bot development available*
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send owner info text ────────────────────────────────────
      await sock.sendMessage(from, {
        text: ownerMsg,
      }, { quoted: msg });

      // ── Send vCard contact ──────────────────────────────────────
      const vcard = buildVCard();

      await sock.sendMessage(from, {
        contacts: {
          displayName : OWNER.FULL_NAME,
          contacts    : [{ vcard }],
        },
      }, { quoted: msg });

      // ── Send channel link ───────────────────────────────────────
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
