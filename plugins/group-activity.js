/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Activity Plugin ┃
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

// ─── Activity tracker ─────────────────────────────────────────────────────────
// groupActivity.get(groupJid)?.get(userJid) → { messages, lastSeen }
const groupActivity = new Map();

// ─── Track message (call from message handler) ────────────────────────────────
export function trackActivity(groupJid, userJid) {
  if (!groupActivity.has(groupJid)) groupActivity.set(groupJid, new Map());
  const group = groupActivity.get(groupJid);
  if (!group.has(userJid)) group.set(userJid, { messages: 0, lastSeen: null });
  const data = group.get(userJid);
  data.messages++;
  data.lastSeen = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
}

export default {
  command    : ['activity', 'active', 'topmembers', 'سرگرمی'],
  name       : 'group-activity',
  category   : 'Group',
  description: 'Show most active members in the group',
  usage      : '.activity',
  cooldown   : 10,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📊');

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin activity دیکھ سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const groupData = groupActivity.get(from);

      if (!groupData || groupData.size === 0) {
        return await sock.sendMessage(from, {
          text: `📊 *ابھی تک کوئی activity record نہیں!*\n\n💡 Bot کے ہونے کے بعد سے messages track ہو رہے ہیں۔\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // Sort by messages (highest first)
      const sorted = [...groupData.entries()]
        .sort((a, b) => b[1].messages - a[1].messages)
        .slice(0, 10);

      const mentions   = sorted.map(([jid]) => jid);
      const topSection = sorted.map(([jid, data], i) => {
        const num   = jid.split('@')[0];
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `*${i + 1}.*`;
        const bar   = '█'.repeat(Math.min(10, Math.round(data.messages / 10))) || '░';
        return `│ ${medal} @${num}\n│    💬 ${data.messages} msgs | ${bar}`;
      }).join('\n│\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 📊 *GROUP ACTIVITY* 』━━━╮

👑 *${OWNER.BOT_NAME}*
👥 *Tracked Members:* ${groupData.size}

╭─『 🏆 *Top 10 Active Members* 』
│
${topSection}
│
╰──────────────────────────

💡 *Note:* صرف bot کے add ہونے کے بعد کی activity

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[ACTIVITY ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Activity error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
