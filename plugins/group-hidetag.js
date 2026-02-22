/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Hide Tag Plugin       ┃
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
  command    : ['hidetag', 'htag', 'ht', 'ہائیڈ ٹیگ'],
  name       : 'group-hidetag',
  category   : 'Group',
  description: 'Tag all members silently (tag hidden)',
  usage      : '.hidetag <message>',
  cooldown   : 10,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📣');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin hidetag استعمال کر سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      if (!text?.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Message لازمی ہے!*\n\n📌 *Usage:* \`${CONFIG.PREFIX}hidetag <message>\`\n💡 *Example:* \`${CONFIG.PREFIX}hidetag آج کی میٹنگ 5 بجے ہے\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const groupMeta = await sock.groupMetadata(from);
      const members   = groupMeta.participants;
      const mentions  = members.map(m => m.id);

      // Hidetag: mentions in text but shown as invisible
      await sock.sendMessage(from, {
        text    : text.trim(),
        mentions: mentions,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[HIDETAG ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Hidetag failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
