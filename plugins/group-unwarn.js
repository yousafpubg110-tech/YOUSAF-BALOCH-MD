/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Unwarn Plugin   ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }                    from '../config.js';
import { getUserWarns, resetWarnings }      from './group-warn.js';

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
  command    : ['unwarn', 'uw', 'clearwarn', 'وارننگ ہٹاؤ'],
  name       : 'group-unwarn',
  category   : 'Group',
  description: 'Remove warnings from a group member',
  usage      : '.unwarn @user',
  cooldown   : 3,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('✅');

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin warn ہٹا سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (!target) {
        return await sock.sendMessage(from, {
          text: `❌ *کسی کو mention کریں!*\n\n📌 *Usage:* \`${CONFIG.PREFIX}unwarn @user\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const warnData  = getUserWarns(from, target);
      const targetNum = target.split('@')[0];

      if (warnData.count === 0) {
        return await sock.sendMessage(from, {
          text: `ℹ️ *@${targetNum} کے پاس کوئی warning نہیں ہے!*\n\n${ownerFooter()}`,
          mentions: [target],
        }, { quoted: msg });
      }

      const prevCount = warnData.count;
      resetWarnings(from, target);

      await sock.sendMessage(from, {
        text: `╭━━━『 ✅ *WARNING CLEARED* 』━━━╮

👑 *${OWNER.FULL_NAME} کی طرف سے معافی*

╭─『 👤 *Member* 』
│ @${targetNum}
╰──────────────────────────

╭─『 ✅ *Action* 』
│ 🗑️ *Removed:* ${prevCount} warning(s)
│ 📊 *New Count:* 0/3
│ ✅ آپ کی تمام warnings صاف ہو گئیں
│ 🤝 آئندہ rules follow کریں
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [target],
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UNWARN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Unwarn failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
