/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Admins Plugin   ┃
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
  command    : ['admins', 'admin', 'tagadmin', 'ایڈمن'],
  name       : 'group-admins',
  category   : 'Group',
  description: 'Tag all group admins',
  usage      : '.admins [message]',
  cooldown   : 10,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('👑');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Fetch group metadata ──────────────────────────────
      const groupMeta = await sock.groupMetadata(from);
      const admins    = groupMeta.participants.filter(p =>
        p.admin === 'admin' || p.admin === 'superadmin'
      );

      if (admins.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *کوئی Admin نہیں ملا!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Build mention list ────────────────────────────────
      const mentions     = admins.map(a => a.id);
      const adminSection = admins.map((a, i) => {
        const num  = a.id.split('@')[0];
        const role = a.admin === 'superadmin' ? '👑 Owner' : '🛡️ Admin';
        return `│ ${i + 1}. @${num} — ${role}`;
      }).join('\n');

      const extraMsg = text?.trim() ? `\n╭─『 💬 *Message* 』\n│ ${text.trim()}\n╰──────────────────────────` : '';

      const adminMsg = `╭━━━『 👑 *GROUP ADMINS* 』━━━╮

👋 *Called by:* +${senderNum}
👥 *Total Admins:* ${admins.length}

╭─『 🛡️ *Admin List* 』
${adminSection}
╰──────────────────────────
${extraMsg}

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, {
        text    : adminMsg,
        mentions: mentions,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[ADMINS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Admins fetch failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
