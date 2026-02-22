/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Members Plugin  ┃
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
  command    : ['members', 'tagall', 'everyone', 'ممبر', 'سب'],
  name       : 'group-members',
  category   : 'Group',
  description: 'Tag all group members',
  usage      : '.tagall [message]',
  cooldown   : 15,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📢');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin سب کو tag کر سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const groupMeta  = await sock.groupMetadata(from);
      const members    = groupMeta.participants;
      const admins     = members.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
      const normalMems = members.filter(p => !p.admin);
      const mentions   = members.map(m => m.id);

      const extraMsg = text?.trim()
        ? `╭─『 💬 *Message* 』\n│ ${text.trim()}\n╰──────────────────────────\n\n`
        : '';

      // Send in chunks of 50 to avoid WhatsApp limits
      const chunkSize = 50;
      let   sentCount = 0;

      for (let i = 0; i < members.length; i += chunkSize) {
        const chunk        = members.slice(i, i + chunkSize);
        const chunkMention = chunk.map(m => m.id);
        const memberList   = chunk.map(m => {
          const num  = m.id.split('@')[0];
          const role = m.admin === 'superadmin' ? '👑' : m.admin === 'admin' ? '🛡️' : '👤';
          return `${role} @${num}`;
        }).join('\n');

        const isFirst = i === 0;
        const msgText = isFirst
          ? `╭━━━『 📢 *TAG ALL MEMBERS* 』━━━╮

👋 *Called by:* +${senderNum}
👥 *Total Members:* ${members.length}
🛡️ *Admins:* ${admins.length}
👤 *Members:* ${normalMems.length}

${extraMsg}╭─『 👥 *Members ${i + 1}-${Math.min(i + chunkSize, members.length)}* 』
${memberList}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
          : `╭─『 👥 *Members ${i + 1}-${Math.min(i + chunkSize, members.length)}* 』\n${memberList}\n╰──────────────────────────`;

        await sock.sendMessage(from, {
          text    : msgText,
          mentions: chunkMention,
        }, { quoted: isFirst ? msg : undefined });

        sentCount += chunk.length;
        // Delay to prevent flood
        if (i + chunkSize < members.length) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[MEMBERS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Members tag failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
