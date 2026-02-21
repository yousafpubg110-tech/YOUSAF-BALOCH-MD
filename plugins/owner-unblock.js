/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Unblock User Plugin ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

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
  command    : ['unblock', 'unblockuser', 'ub'],
  name       : 'unblock',
  category   : 'Owner',
  description: 'Unblock a user on WhatsApp',
  usage      : '.unblock @user',
  cooldown   : 5,
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
          text: `⚠️ *Please mention or reply to a user to unblock!*\n\n📌 *Usage:* ${CONFIG.PREFIX}unblock @user\n📌 *Or reply to a message and type* ${CONFIG.PREFIX}unblock`,
        }, { quoted: msg });
      }

      // ── Prevent unblocking self ─────────────────────────────────
      if (target === sender) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *You cannot unblock yourself!*`,
        }, { quoted: msg });
      }

      const targetNum = target.split('@')[0];

      // ── Execute unblock ─────────────────────────────────────────
      await sock.updateBlockStatus(target, 'unblock');

      // ── Success message ─────────────────────────────────────────
      const unblockMsg = `
╭━━━『 ✅ *USER UNBLOCKED* 』━━━╮

✅ *Unblocked Successfully!*

╭─『 👤 *User Info* 』
│ 📱 *User:*         @${targetNum}
│ 🔢 *Number:*       +${targetNum}
│ 📅 *Unblocked At:* ${getTimestamp()}
│ 👑 *By:*           ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 ✅ *Restored Access* 』
│ ✅ Can message bot owner
│ ✅ Calls allowed again
│ ✅ Status visible again
╰──────────────────────────

_Use ${CONFIG.PREFIX}block @user to block again_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text     : unblockMsg,
        mentions : [target],
      }, { quoted: msg });

      // ── Notify unblocked user via DM ────────────────────────────
      try {
        await sock.sendMessage(target, {
          text: `✅ *You have been unblocked by ${OWNER.FULL_NAME}!*\n\n🎉 *You can now contact and interact again.*\n\n_${OWNER.BOT_NAME}_`,
        });
      } catch (_) {
        // Ignore if DM fails
      }

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UNBLOCK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Unblock error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Unblock error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
