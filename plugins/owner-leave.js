/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Leave Group Plugin ┃
┃       Created by MR YOUSAF BALOCH       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Delay ────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['leave', 'leavegroup', 'bye'],
  name       : 'leave',
  category   : 'Owner',
  description: 'Make bot leave the current group',
  usage      : '.leave',
  cooldown   : 10,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender, isGroup }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⚙️');

      // ── Owner check ─────────────────────────────────────────────
      const senderNum = sender?.split('@')[0] || '';
      const isOwner   = senderNum === String(OWNER.NUMBER);

      if (!isOwner) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *This command is for owner only!*\n\n👑 *Owner:* ${OWNER.FULL_NAME}`,
        }, { quoted: msg });
      }

      // ── Group check ─────────────────────────────────────────────
      const inGroup = isGroup || from?.endsWith('@g.us');

      if (!inGroup) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *This command only works in groups!*\n\n💡 Use this command inside a group chat.`,
        }, { quoted: msg });
      }

      // ── Send goodbye message ────────────────────────────────────
      const goodbyeMsg = `
╭━━━『 👋 *GOODBYE* 』━━━╮

🤖 *${OWNER.BOT_NAME}* is leaving...

╭─『 📋 *Info* 』
│ 👑 *Owner:*    ${OWNER.FULL_NAME}
│ 🔧 *Prefix:*   \`${CONFIG.PREFIX}\`
│ ⏱️  *Leaving in:* 3 seconds...
╰──────────────────────────

╭─『 🔗 *Stay Connected* 』
│ 📢 ${OWNER.CHANNEL}
│ 📺 ${OWNER.YOUTUBE}
╰──────────────────────────

_Thanks for using ${OWNER.BOT_NAME}!_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: goodbyeMsg,
      }, { quoted: msg });

      // ── React: bye ──────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('👋');

      // ── Wait then leave ─────────────────────────────────────────
      await delay(3000);
      await sock.groupLeave(from);

    } catch (error) {
      console.error('[LEAVE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Leave command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Leave command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
