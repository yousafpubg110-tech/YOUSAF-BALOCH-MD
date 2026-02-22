/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Banned List Plugin    ┃
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

// ─── Banned list store ────────────────────────────────────────────────────────
const bannedList = new Map(); // groupJid → Map(userJid → { reason, bannedAt, bannedBy })

// ─── Exports for use in other files ──────────────────────────────────────────
export function addBan(groupJid, userJid, reason, bannedBy) {
  if (!bannedList.has(groupJid)) bannedList.set(groupJid, new Map());
  bannedList.get(groupJid).set(userJid, {
    reason  : reason || 'No reason',
    bannedAt: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    bannedBy,
  });
}

export function removeBan(groupJid, userJid) {
  bannedList.get(groupJid)?.delete(userJid);
}

export function isBanned(groupJid, userJid) {
  return bannedList.get(groupJid)?.has(userJid) || false;
}

export default {
  command    : ['bannedlist', 'blist', 'banned', 'بین لسٹ'],
  name       : 'group-banned-list',
  category   : 'Group',
  description: 'View and manage banned members list',
  usage      : '.bannedlist [add/remove @user]',
  cooldown   : 5,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin, isBotAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🚫');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin banned list دیکھ سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const target = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || msg.message?.extendedTextMessage?.contextInfo?.participant;

      // ── Add to ban list ────────────────────────────────────
      if (/^(add|ban)/.test(input) && target) {
        const reason = input.replace(/^(add|ban)\s*/, '').replace(/@\d+/g, '').trim() || 'No reason';
        addBan(from, target, reason, sender);

        if (isBotAdmin) {
          await sock.groupParticipantsUpdate(from, [target], 'remove');
        }

        await sock.sendMessage(from, {
          text: `🚫 *@${target.split('@')[0]} کو ban کر دیا گیا!*\n\n📋 *وجہ:* ${reason}\n👑 *By:* ${OWNER.FULL_NAME}\n\n${ownerFooter()}`,
          mentions: [target],
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Remove from ban list ───────────────────────────────
      if (/^(remove|unban)/.test(input) && target) {
        removeBan(from, target);
        await sock.sendMessage(from, {
          text: `✅ *@${target.split('@')[0]} کو ban list سے ہٹا دیا!*\n\n${ownerFooter()}`,
          mentions: [target],
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Show list ──────────────────────────────────────────
      const groupBans = bannedList.get(from);

      if (!groupBans || groupBans.size === 0) {
        return await sock.sendMessage(from, {
          text: `✅ *اس گروپ میں کوئی banned member نہیں!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const banSection = [...groupBans.entries()].map(([jid, data], i) => {
        const num = jid.split('@')[0];
        return `│ ${i + 1}. 🚫 +${num}\n│    📋 ${data.reason}\n│    📅 ${data.bannedAt}`;
      }).join('\n│\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 🚫 *BANNED LIST* 』━━━╮

👑 *${OWNER.BOT_NAME}*
🚫 *Total Banned:* ${groupBans.size}

╭─『 🚫 *Banned Members* 』
│
${banSection}
│
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}bannedlist add @user\`    → Ban
│ \`${CONFIG.PREFIX}bannedlist remove @user\` → Unban
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BANNED-LIST ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Banned list error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
