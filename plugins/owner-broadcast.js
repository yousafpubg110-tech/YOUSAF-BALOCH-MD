/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Broadcast Plugin     ┃
┃       Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Delay between messages (avoid WhatsApp ban) ─────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Helper: Filter valid chats ──────────────────────────────────────────────
function getValidChats(chats) {
  return Object.entries(chats)
    .filter(([id, chat]) => {
      if (!id || !chat) return false;
      if (id.includes('newsletter')) return false;
      if (id.includes('broadcast'))  return false;
      if (id.includes('status'))     return false;
      return true;
    })
    .map(([id]) => id);
}

// ─── Helper: Build broadcast message ─────────────────────────────────────────
function buildBroadcastMsg(message) {
  const year = OWNER.YEAR || new Date().getFullYear();
  return `
📢 *BROADCAST MESSAGE*
━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━
🤖 *${OWNER.BOT_NAME}*
👑 *By ${OWNER.FULL_NAME}*
📢 ${OWNER.CHANNEL}
_© ${year} ${OWNER.BOT_NAME}_
`.trim();
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['broadcast', 'bc', 'announce'],
  name       : 'broadcast',
  category   : 'Owner',
  description: 'Broadcast a message to all chats',
  usage      : '.broadcast <message>',
  cooldown   : 30,
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

      // ── Get broadcast message ───────────────────────────────────
      const message = args?.join(' ').trim() ||
        text?.replace(/^[.]?broadcast\s*/i, '').trim();

      if (!message) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *Please provide a message to broadcast!*\n\n📌 *Usage:* ${CONFIG.PREFIX}broadcast <message>\n📌 *Example:* ${CONFIG.PREFIX}broadcast Hello everyone!`,
        }, { quoted: msg });
      }

      // ── Get all valid chats ─────────────────────────────────────
      const allChats = sock.chats || sock.store?.chats || {};
      const chatList = getValidChats(allChats);

      if (chatList.length === 0) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *No chats found to broadcast!*\n\n⚠️ Chat store may not be loaded yet.`,
        }, { quoted: msg });
      }

      // ── Send start notification ─────────────────────────────────
      await sock.sendMessage(from, {
        text: `📢 *Starting Broadcast...*\n\n📊 *Total Chats:* ${chatList.length}\n⏳ *Please wait...*`,
      }, { quoted: msg });

      // ── Broadcast loop ──────────────────────────────────────────
      let success = 0;
      let failed  = 0;
      const broadcastText = buildBroadcastMsg(message);

      for (const chatId of chatList) {
        try {
          await sock.sendMessage(chatId, { text: broadcastText });
          success++;

          // Delay to avoid WhatsApp spam detection
          // 1.5 seconds between each message
          await delay(1500);

        } catch {
          failed++;
        }
      }

      // ── Send result report ──────────────────────────────────────
      const resultMsg = `
╭━━━『 📢 *BROADCAST COMPLETE* 』━━━╮

✅ *Broadcast finished successfully!*

╭─『 📊 *Stats* 』
│ 📨 *Total:*   ${chatList.length}
│ ✅ *Success:* ${success}
│ ❌ *Failed:*  ${failed}
│ 📈 *Rate:*    ${((success / chatList.length) * 100).toFixed(1)}%
╰──────────────────────────

╭─『 📝 *Message Preview* 』
│ ${message.slice(0, 60)}${message.length > 60 ? '...' : ''}
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: resultMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BROADCAST ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Broadcast error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Broadcast error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
