/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Warn List Plugin      ┃
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
import { warnings }      from './group-warn.js';

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
  command    : ['warnlist', 'warns', 'wl', 'وارننگ لسٹ'],
  name       : 'group-warnlist',
  category   : 'Group',
  description: 'Show all warned members in group',
  usage      : '.warnlist',
  cooldown   : 5,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📋');

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin warn list دیکھ سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const groupWarns = warnings.get(from);

      if (!groupWarns || groupWarns.size === 0) {
        return await sock.sendMessage(from, {
          text: `✅ *اس گروپ میں کوئی warned member نہیں ہے!*\n\n🎉 سب اچھے ہیں!\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const warnedMembers = [];
      const mentions      = [];

      for (const [jid, data] of groupWarns.entries()) {
        if (data.count > 0) {
          warnedMembers.push({ jid, data });
          mentions.push(jid);
        }
      }

      if (warnedMembers.length === 0) {
        return await sock.sendMessage(from, {
          text: `✅ *کوئی warned member نہیں!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // Sort by warn count (highest first)
      warnedMembers.sort((a, b) => b.data.count - a.data.count);

      const listSection = warnedMembers.map((m, i) => {
        const num     = m.jid.split('@')[0];
        const danger  = m.data.count >= 3 ? '🚫' : m.data.count === 2 ? '🔴' : '⚠️';
        const lastR   = m.data.reasons[m.data.reasons.length - 1] || 'N/A';
        return `│ ${i + 1}. ${danger} @${num}\n│    Warns: ${m.data.count}/3 | آخری: ${lastR.substring(0, 30)}`;
      }).join('\n│\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 📋 *WARN LIST* 』━━━╮

👑 *${OWNER.BOT_NAME}*
📊 *Warned Members:* ${warnedMembers.length}

╭─『 ⚠️ *Warned List* 』
│
${listSection}
│
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}warn @user\`   → warn دیں
│ \`${CONFIG.PREFIX}unwarn @user\` → warn ہٹائیں
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[WARNLIST ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Warnlist error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
