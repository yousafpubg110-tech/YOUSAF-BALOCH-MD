/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Pairing Plugin    ┃
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

// ─── Pairing Server URL ───────────────────────────────────────────────────────
// Change this to your deployed YOUSAF-PAIRING-V1 URL
const PAIRING_URL = process.env.PAIRING_URL ||
  'https://yousaf-pairing-v1.onrender.com';

// ─── Thumbnail for link preview ───────────────────────────────────────────────
const THUMBNAIL_URL =
  'https://telegra.ph/file/2b4a4a84f8cc6e01be97a.jpg';

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['pairing', 'pair', 'code', 'getcode', 'pairingcode'],
  name       : 'pairing',
  category   : 'Info',
  description: 'Get free pairing code for bot session',
  usage      : '.pairing',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('🔗');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Build pairing message ───────────────────────────────────
      const pairingMsg = `
╭━━━『 🔗 *FREE PAIRING CODE* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 🌐 *Pairing Website* 』
│ ${PAIRING_URL}
╰──────────────────────────

╭─『 📝 *How To Get Code* 』
│
│ *Step 1:* Open the link above 👆
│
│ *Step 2:* Enter your number
│    • Include country code
│    • Example: 923710636110
│
│ *Step 3:* Click "Get Pairing Code"
│    • You'll get an 8-digit code
│    • Example: ABCD-EFGH
│
│ *Step 4:* Open WhatsApp
│    • Go to ⚙️ Settings
│    • Tap "Linked Devices"
│    • Tap "Link a Device"
│    • Choose "Link with phone number"
│
│ *Step 5:* Enter the code
│    • Input 8-digit code
│    • Wait for connection ✅
│
╰──────────────────────────

╭─『 ⚡ *Why Pairing Code?* 』
│ ✅ No QR scan needed
│ ✅ Works from any device
│ ✅ Instant generation
│ ✅ 100% secure
│ ✅ No data stored
│ ✅ Easy to use
╰──────────────────────────

╭─『 ⚠️ *Important Notes* 』
│ ⏱️ Code expires in 60 seconds
│ 🔄 Request new code anytime
│ 📵 Keep WhatsApp open while pairing
╰──────────────────────────

╭─『 💬 *Need Help?* 』
│ 👑 *Owner:* ${OWNER.FULL_NAME}
│ 📱 *Contact:* wa.me/${OWNER.NUMBER}
│ 📢 *Channel:* ${OWNER.CHANNEL}
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Created with ❤️ by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send with link preview ──────────────────────────────────
      await sock.sendMessage(from, {
        text: pairingMsg,
        contextInfo: {
          externalAdReply: {
            title               : '🔗 GET FREE PAIRING CODE',
            body                : 'Click to open pairing website →',
            thumbnailUrl        : THUMBNAIL_URL,
            sourceUrl           : PAIRING_URL,
            mediaType           : 1,
            renderLargerThumbnail: true,
            showAdAttribution   : true,
          },
        },
      }, { quoted: msg });

      // ── Log usage ───────────────────────────────────────────────
      console.log(`[PAIRING] +${senderNum} requested pairing code`);

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PAIRING ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Pairing command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Pairing command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
