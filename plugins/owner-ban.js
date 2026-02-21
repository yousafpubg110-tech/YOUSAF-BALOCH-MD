/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Ban User Plugin   ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER } from '../config.js';

// ─── Helper: Resolve target JID ──────────────────────────────────────────────
function resolveTarget(msg, text) {
  // Priority 1: Mentioned user
  if (msg.mentionedJid && msg.mentionedJid.length > 0) {
    return msg.mentionedJid[0];
  }
  // Priority 2: Quoted message sender
  if (msg.quoted && msg.quoted.sender) {
    return msg.quoted.sender;
  }
  // Priority 3: Plain number in text
  const num = text?.replace(/[^0-9]/g, '');
  if (num && num.length >= 10) {
    return `${num}@s.whatsapp.net`;
  }
  return null;
}

// ─── Helper: Format ban timestamp ───────────────────────────────────────────
function getBanTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['ban', 'banuser', 'block'],
  name       : 'ban',
  category   : 'Owner',
  description: 'Ban a user from using the bot',
  usage      : '.ban @user [reason]',
  cooldown   : 3,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender, text, args }) => {
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

      // ── Resolve target ──────────────────────────────────────────
      const target = resolveTarget(msg, text);

      if (!target) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Please tag a user to ban!*\n\n📌 *Usage:* .ban @user [reason]\n📌 *Example:* .ban @user Spamming`,
        }, { quoted: msg });
      }

      // ── Prevent self-ban ────────────────────────────────────────
      if (target === sender) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *You cannot ban yourself!*`,
        }, { quoted: msg });
      }

      // ── Prevent banning owner ───────────────────────────────────
      const targetNum = target.split('@')[0];
      if (targetNum === String(OWNER.NUMBER)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *You cannot ban the bot owner!*`,
        }, { quoted: msg });
      }

      // ── Get ban reason ──────────────────────────────────────────
      const reason = args?.slice(1).join(' ').trim() || 'No reason provided';

      // ── Apply ban to database ───────────────────────────────────
      if (global.db?.data?.users) {
        if (!global.db.data.users[target]) {
          global.db.data.users[target] = {};
        }
        global.db.data.users[target].banned       = true;
        global.db.data.users[target].bannedReason  = reason;
        global.db.data.users[target].bannedBy      = sender;
        global.db.data.users[target].bannedAt      = getBanTimestamp();
        global.db.data.users[target].bannedCount   =
          (global.db.data.users[target].bannedCount || 0) + 1;
      }

      // ── Build ban message ───────────────────────────────────────
      const banMsg = `
╭━━━『 🚫 *USER BANNED* 』━━━╮

✅ *Ban Applied Successfully!*

╭─『 👤 *Target Info* 』
│ 📱 *User:*    @${targetNum}
│ 🔢 *Number:*  +${targetNum}
│ 📝 *Reason:*  ${reason}
│ 📅 *Time:*    ${getBanTimestamp()}
│ 👑 *Banned By:* ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 ⚠️ *Ban Effects* 』
│ ❌ Bot commands disabled
│ ❌ Cannot use any features
│ ❌ All requests blocked
╰──────────────────────────

_Use .unban @user to remove ban_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send ban notification ───────────────────────────────────
      await sock.sendMessage(from, {
        text     : banMsg,
        mentions : [target],
      }, { quoted: msg });

      // ── Notify banned user via DM ───────────────────────────────
      try {
        await sock.sendMessage(target, {
          text: `⚠️ *You have been banned from using ${OWNER.BOT_NAME}!*\n\n📝 *Reason:* ${reason}\n\n_Contact owner to appeal: +${OWNER.NUMBER}_`,
        });
      } catch (_) {
        // Ignore if DM fails — user may have bot blocked
      }

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BAN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Ban command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Ban command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
