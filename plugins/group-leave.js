/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Leave Plugin    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

function ownerFooter() {
  const year = OWNER.YEAR || new Date().getFullYear();
  return `╭─『 👑 *${OWNER.BOT_NAME}* 』
│ 👤 *Owner:*   ${OWNER.FULL_NAME}
│ 📱 *Number:*  +${OWNER.NUMBER}
│ 📢 *Channel:* ${OWNER.CHANNEL}
│ 📺 *YouTube:* ${OWNER.YOUTUBE}
│ 🎵 *TikTok:*  ${OWNER.TIKTOK}
╰──────────────────────────
_© ${year} ${OWNER.BOT_NAME}_`;
}

export default {
  command    : ['leave', 'leavegroup', 'botleave', 'چھوڑو'],
  name       : 'group-leave',
  category   : 'Group',
  description: 'Bot leaves the group (owner only)',
  usage      : '.leave',
  cooldown   : 5,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, isBotOwner }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('👋');

      const senderNum = sender?.split('@')[0] || 'User';
      const ownerNum  = OWNER.NUMBER;

      // ── Only bot owner can make bot leave ─────────────────
      if (!isBotOwner && senderNum !== ownerNum) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Bot Owner یہ command دے سکتا ہے!*\n\n👑 Owner: ${OWNER.FULL_NAME}\n📱 +${OWNER.NUMBER}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const groupMeta = await sock.groupMetadata(from);

      await sock.sendMessage(from, {
        text: `╭━━━『 👋 *BOT LEAVING* 』━━━╮

💔 *الوداع ${groupMeta.subject}!*

👑 *Owner:* ${OWNER.FULL_NAME}
📱 *Contact:* +${OWNER.NUMBER}
📢 *Channel:* ${OWNER.CHANNEL}

╭─『 💬 *خدا حافظ* 』
│ اس گروپ سے bot کو ہٹایا جا رہا ہے۔
│ دوبارہ add کرنے کے لیے owner سے
│ رابطہ کریں۔
╰──────────────────────────

_🤖 ${OWNER.BOT_NAME} — Goodbye!_

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      });

      await new Promise(r => setTimeout(r, 2000));
      await sock.groupLeave(from);

    } catch (error) {
      console.error('[LEAVE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Leave failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
