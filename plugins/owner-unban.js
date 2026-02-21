/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Unban User Plugin ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Resolve target JID ──────────────────────────────────────────────
function resolveTarget(msg, text) {
  if (msg.mentionedJid && msg.mentionedJid.length > 0) {
    return msg.mentionedJid[0];
  }
  if (msg.quoted && msg.quoted.sender) {
    return msg.quoted.sender;
  }
  const num = text?.replace(/[^0-9]/g, '');
  if (num && num.length >= 10) {
    return `${num}@s.whatsapp.net`;
  }
  return null;
}

// ─── Helper: Get timestamp ────────────────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['unban', 'unbanuser', 'pardon'],
  name       : 'unban',
  category   : 'Owner',
  description: 'Unban a user from using the bot',
  usage      : '.unban @user',
  cooldown   : 3,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender, text }) => {
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
          text: `❌ *Please tag a user to unban!*\n\n📌 *Usage:* ${CONFIG.PREFIX}unban @user\n📌 *Example:* ${CONFIG.PREFIX}unban @user`,
        }, { quoted: msg });
      }

      const targetNum = target.split('@')[0];

      // ── Check database ──────────────────────────────────────────
      if (!global.db?.data?.users) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Database not loaded!*\n\n⚠️ Please wait for bot to fully start.`,
        }, { quoted: msg });
      }

      const user = global.db.data.users[target];

      if (!user) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *User not found in database!*\n\n⚠️ @${targetNum} has never used the bot.`,
          mentions: [target],
        }, { quoted: msg });
      }

      // ── Check if actually banned ────────────────────────────────
      if (!user.banned) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *This user is not banned!*\n\n📱 *User:* @${targetNum}\n✅ *Status:* Already active`,
          mentions: [target],
        }, { quoted: msg });
      }

      // ── Store old ban info for report ───────────────────────────
      const oldReason   = user.bannedReason  || 'No reason recorded';
      const oldBannedAt = user.bannedAt      || 'Unknown';
      const oldBanCount = user.bannedCount   || 1;

      // ── Remove ban ──────────────────────────────────────────────
      user.banned       = false;
      user.bannedReason = '';
      user.bannedAt     = '';
      user.unbannedAt   = getTimestamp();
      user.unbannedBy   = sender;

      // ── Build success message ───────────────────────────────────
      const unbanMsg = `
╭━━━『 ✅ *USER UNBANNED* 』━━━╮

✅ *Unban Applied Successfully!*

╭─『 👤 *User Info* 』
│ 📱 *User:*       @${targetNum}
│ 🔢 *Number:*     +${targetNum}
│ 📅 *Unbanned:*   ${getTimestamp()}
│ 👑 *By:*         ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 📋 *Previous Ban Info* 』
│ 📝 *Reason:*     ${oldReason}
│ 📅 *Banned At:*  ${oldBannedAt}
│ 🔢 *Ban Count:*  ${oldBanCount}
╰──────────────────────────

╭─『 ✅ *Restored Access* 』
│ ✅ Bot commands enabled
│ ✅ All features accessible
│ ✅ User active again
╰──────────────────────────

_Use ${CONFIG.PREFIX}ban @user to ban again_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text     : unbanMsg,
        mentions : [target],
      }, { quoted: msg });

      // ── Notify user via DM ──────────────────────────────────────
      try {
        await sock.sendMessage(target, {
          text: `✅ *You have been unbanned from ${OWNER.BOT_NAME}!*\n\n🎉 *You can now use all bot features again.*\n\n_Contact owner: +${OWNER.NUMBER}_`,
        });
      } catch (_) {
        // Ignore if DM fails
      }

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UNBAN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Unban error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Unban error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
