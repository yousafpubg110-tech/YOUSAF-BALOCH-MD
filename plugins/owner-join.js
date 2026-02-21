/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Join Group Plugin ┃
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

// ─── Helper: Validate WhatsApp invite link ────────────────────────────────────
function extractInviteCode(text) {
  try {
    // ✅ CodeQL Fix: Use URL() for proper validation — not .includes()
    const match = text?.match(
      /https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]{10,})/i
    );
    if (!match) return null;

    const url      = new URL(match[0]);
    const hostname = url.hostname;

    // Strict hostname check — prevent subdomain attacks
    if (hostname !== 'chat.whatsapp.com') return null;

    return match[1]; // Return only the invite code
  } catch {
    return null;
  }
}

// ─── Helper: Get timestamp ────────────────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['join', 'joingroup'],
  name       : 'join',
  category   : 'Owner',
  description: 'Join a WhatsApp group via invite link',
  usage      : '.join https://chat.whatsapp.com/xxxxx',
  cooldown   : 10,
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

      // ── Extract & validate invite code ──────────────────────────
      const inviteCode = extractInviteCode(text);

      if (!inviteCode) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *Invalid or missing WhatsApp invite link!*\n\n📌 *Usage:*\n${CONFIG.PREFIX}join https://chat.whatsapp.com/xxxxx\n\n✅ *Valid format:*\nhttps://chat.whatsapp.com/AbCdEfGhIjK`,
        }, { quoted: msg });
      }

      // ── Send joining notification ───────────────────────────────
      await sock.sendMessage(from, {
        text: `🔄 *Joining group...*\n\n🔗 *Code:* ${inviteCode}\n⏳ *Please wait...*`,
      }, { quoted: msg });

      // ── Accept invite ───────────────────────────────────────────
      const groupId = await sock.groupAcceptInvite(inviteCode);

      // ── Success message ─────────────────────────────────────────
      const successMsg = `
╭━━━『 ✅ *GROUP JOINED* 』━━━╮

✅ *Successfully joined the group!*

╭─『 📋 *Group Details* 』
│ 🆔 *Group ID:*
│ ${groupId}
│
│ 🔗 *Invite Code:* ${inviteCode}
│ 📅 *Joined At:*   ${getTimestamp()}
│ 👑 *By:*          ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 💡 *Quick Commands* 』
│ \`${CONFIG.PREFIX}groups\`  → List all groups
│ \`${CONFIG.PREFIX}leave\`   → Leave a group
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: successMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[JOIN ERROR]:', error.message);

      // ── Handle specific error types ─────────────────────────────
      let errorMsg = '❌ *Failed to join group!*\n\n';

      if (error.message?.toLowerCase().includes('already')) {
        errorMsg += '⚠️ *Bot is already in this group!*';
      } else if (error.message?.toLowerCase().includes('invalid')) {
        errorMsg += '⚠️ *Invalid invite link — link may be expired or revoked!*';
      } else if (error.message?.toLowerCase().includes('forbidden')) {
        errorMsg += '⚠️ *Bot was banned from this group!*';
      } else if (error.message?.toLowerCase().includes('not-authorized')) {
        errorMsg += '⚠️ *Not authorized — link may have expired!*';
      } else {
        errorMsg += `⚠️ *Error:* ${error.message}`;
      }

      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: errorMsg,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
