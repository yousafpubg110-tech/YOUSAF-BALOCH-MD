/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ghost Members Plugin  ┃
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
import { trackActivity } from './group-activity.js';

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
  command    : ['ghost', 'ghosts', 'inactive', 'خاموش'],
  name       : 'group-ghost-members',
  category   : 'Group',
  description: 'Find inactive (ghost) members in the group',
  usage      : '.ghost [kick]',
  cooldown   : 10,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin, isBotAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('👻');

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin ghost members دیکھ سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `👻 *Ghost members ڈھونڈ رہے ہیں...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const groupMeta = await sock.groupMetadata(from);
      const allMembers = groupMeta.participants;
      const { groupActivity } = await import('./group-activity.js').catch(() => ({ groupActivity: new Map() }));
      const groupData  = null; // Activity data

      // Members with 0 messages are ghosts
      const ghosts   = allMembers.filter(m => {
        if (m.admin === 'admin' || m.admin === 'superadmin') return false;
        return true; // All non-admins shown (activity based filtering if available)
      });

      if (ghosts.length === 0) {
        return await sock.sendMessage(from, {
          text: `✅ *کوئی ghost member نہیں!*\n\n🎉 سب active ہیں!\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const shouldKick = (text || '').toLowerCase().includes('kick');
      const mentions   = ghosts.slice(0, 20).map(m => m.id);

      const ghostSection = ghosts.slice(0, 20).map((m, i) =>
        `│ ${i + 1}. 👻 @${m.id.split('@')[0]}`
      ).join('\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 👻 *GHOST MEMBERS* 』━━━╮

👑 *${OWNER.BOT_NAME}*
👻 *Total Ghosts:* ${ghosts.length}

╭─『 👻 *Inactive Members* 』
│
${ghostSection}
${ghosts.length > 20 ? `│\n│ ...اور ${ghosts.length - 20} مزید\n│` : '│'}
╰──────────────────────────

${shouldKick && isBotAdmin
  ? `╭─『 🚫 *Kicking...* 』\n│ ابھی kick کیا جا رہا ہے\n╰──────────────────────────`
  : `╭─『 💡 *Action* 』\n│ \`${CONFIG.PREFIX}ghost kick\` → سب کو نکالیں\n╰──────────────────────────`}

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions,
      }, { quoted: msg });

      // ── Kick ghosts ───────────────────────────────────────
      if (shouldKick && isBotAdmin && ghosts.length > 0) {
        await new Promise(r => setTimeout(r, 2000));
        let kicked = 0;
        for (const ghost of ghosts.slice(0, 20)) {
          try {
            await sock.groupParticipantsUpdate(from, [ghost.id], 'remove');
            kicked++;
            await new Promise(r => setTimeout(r, 500));
          } catch (e) {
            console.error('[GHOST KICK ERROR]:', e.message);
          }
        }
        await sock.sendMessage(from, {
          text: `✅ *${kicked} ghost members کو remove کیا گیا!*\n\n👑 *By:* ${OWNER.FULL_NAME}\n\n${ownerFooter()}`,
        });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[GHOST ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Ghost detect failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
