/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Block User Plugin ┃
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

// ─── Helper: Get current timestamp ───────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['block', 'blockuser'],
  name       : 'block',
  category   : 'Owner',
  description: 'Block a user on WhatsApp',
  usage      : '.block @user',
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
          text: `⚠️ *Please mention or reply to a user!*\n\n📌 *Usage:* .block @user\n📌 *Example:* .block @user`,
        }, { quoted: msg });
      }

      // ── Prevent self-block ──────────────────────────────────────
      if (target === sender) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *You cannot block yourself!*`,
        }, { quoted: msg });
      }

      // ── Prevent blocking owner ──────────────────────────────────
      const targetNum = target.split('@')[0];
      if (targetNum === String(OWNER.NUMBER)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *You cannot block the bot owner!*`,
        }, { quoted: msg });
      }

      // ── Execute block ───────────────────────────────────────────
      await sock.updateBlockStatus(target, 'block');

      // ── Success message ─────────────────────────────────────────
      const blockMsg = `
╭━━━『 🚫 *USER BLOCKED* 』━━━╮

✅ *Blocked Successfully!*

╭─『 👤 *Target Info* 』
│ 📱 *User:*       @${targetNum}
│ 🔢 *Number:*     +${targetNum}
│ 📅 *Blocked At:* ${getTimestamp()}
│ 👑 *Blocked By:* ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 🚫 *Block Effects* 』
│ ❌ Cannot message bot owner
│ ❌ Calls blocked
│ ❌ Status hidden
╰──────────────────────────

_Use .unblock @user to reverse_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text     : blockMsg,
        mentions : [target],
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BLOCK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Block command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Block command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
