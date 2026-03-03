/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Anti View Once Plugin ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

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

// Store auto-reveal status per group/chat
const antivvEnabled = new Map();

// Extract view-once message from quoted context
function extractViewOnce(msg) {
  const ctx = msg?.message?.extendedTextMessage?.contextInfo;
  if (!ctx) return null;
  const quoted = ctx.quotedMessage;
  if (!quoted) return null;
  return quoted?.viewOnceMessage?.message
      || quoted?.viewOnceMessageV2?.message
      || quoted?.viewOnceMessageV2Extension?.message
      || null;
}

// Reveal view-once media and send it
async function revealViewOnce(sock, msg, from, sender, viewOnceMsg) {
  const senderNum = sender.split('@')[0];
  try {
    const ctx = msg.message.extendedTextMessage.contextInfo;
    const fakeMsg = {
      key: {
        remoteJid  : from,
        id         : ctx.stanzaId,
        participant: ctx.participant,
      },
      message: ctx.quotedMessage,
    };

    const buffer = await downloadMediaMessage(fakeMsg, 'buffer', {}, { logger: console });

    if (!buffer || buffer.length === 0) {
      await sock.sendMessage(from, { text: `❌ Could not download media.\n\n${ownerFooter()}` }, { quoted: msg });
      return;
    }

    const isImage = !!viewOnceMsg.imageMessage;
    const isVideo = !!viewOnceMsg.videoMessage;
    const caption = `👁️ *View Once Revealed*\n👤 By: @${senderNum}\n\n${ownerFooter()}`;

    if (isImage) {
      await sock.sendMessage(from, { image: buffer, caption, mentions: [sender] }, { quoted: msg });
    } else if (isVideo) {
      await sock.sendMessage(from, { video: buffer, caption, mentions: [sender] }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `❌ Unknown media type.\n\n${ownerFooter()}` }, { quoted: msg });
    }

  } catch (err) {
    console.error('[VV REVEAL ERROR]:', err.message);
    await sock.sendMessage(from, { text: `❌ Reveal failed: ${err.message}\n\n${ownerFooter()}` }, { quoted: msg });
  }
}

export default {
  command    : ['vv', 'antivv', 'antiviewonce'],
  name       : 'antivv',
  category   : 'Group',
  description: 'Reveal view-once photos and videos',
  usage      : '.vv [on/off] OR reply to view-once message',
  cooldown   : 3,
  groupOnly  : false,

  handler: async ({ sock, msg, from, sender, text, args, isAdmin, isOwner }) => {
    try {
      const input     = (text || args?.[0] || '').toLowerCase().trim();
      const senderNum = sender.split('@')[0];

      // ── CASE 1: Toggle ON ────────────────────────────────────
      if (input === 'on') {
        if (!isAdmin && !isOwner) {
          return await sock.sendMessage(from, {
            text: `❌ Only admins or owner can change this setting!\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
        antivvEnabled.set(from, true);
        return await sock.sendMessage(from, {
          text: `╔══════════════════════════════════════╗\n`
              + `║     ✅ *ANTI VV ENABLED* ✅          ║\n`
              + `╚══════════════════════════════════════╝\n\n`
              + `👁️ View-once media will now be auto-revealed.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── CASE 2: Toggle OFF ───────────────────────────────────
      if (input === 'off') {
        if (!isAdmin && !isOwner) {
          return await sock.sendMessage(from, {
            text: `❌ Only admins or owner can change this setting!\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
        antivvEnabled.set(from, false);
        return await sock.sendMessage(from, {
          text: `╔══════════════════════════════════════╗\n`
              + `║     ❌ *ANTI VV DISABLED* ❌         ║\n`
              + `╚══════════════════════════════════════╝\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── CASE 3: Reply to a message with .vv ─────────────────
      const viewOnceMsg = extractViewOnce(msg);

      if (viewOnceMsg) {
        // It's a reply to a view-once message — reveal it
        await sock.sendMessage(from, { react: { text: '👁️', key: msg.key } });
        await revealViewOnce(sock, msg, from, sender, viewOnceMsg);
        await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
        return;
      }

      // ── CASE 4: .vv with reply but NOT view-once ─────────────
      const isReply = !!msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (isReply) {
        return await sock.sendMessage(from, {
          text: `❌ *This is not a view-once message!*\n\nReply to a 👁️ view-once photo or video with .vv to reveal it.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── CASE 5: .vv alone — show status ─────────────────────
      const status = antivvEnabled.get(from) ? '✅ ON' : '❌ OFF';
      return await sock.sendMessage(from, {
        text: `╔══════════════════════════════════════╗\n`
            + `║     👁️ *ANTI VIEW ONCE SETTINGS*     ║\n`
            + `╚══════════════════════════════════════╝\n\n`
            + `📊 *Status:* ${status}\n\n`
            + `📌 *Commands:*\n`
            + `┃ .vv on      » Enable auto-reveal\n`
            + `┃ .vv off     » Disable auto-reveal\n`
            + `┃ .vv (reply) » Manually reveal view-once\n\n`
            + `${ownerFooter()}`,
      }, { quoted: msg });

    } catch (error) {
      console.error('[ANTIVV ERROR]:', error.message);
      await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
      await sock.sendMessage(from, {
        text: `❌ Error: ${error.message}\n\n${ownerFooter()}`,
      }, { quoted: msg });
    }
  },

  // ── Auto-reveal — runs on every message via index.js ────────
  autoViewOnce: async ({ sock, msg, from, sender }) => {
    try {
      if (!antivvEnabled.get(from)) return;

      const msgContent = msg?.message;
      if (!msgContent) return;

      const viewOnceMsg =
        msgContent?.viewOnceMessage?.message         ||
        msgContent?.viewOnceMessageV2?.message       ||
        msgContent?.viewOnceMessageV2Extension?.message;

      if (!viewOnceMsg) return;

      const senderNum = sender?.split('@')[0] || 'unknown';
      const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console });

      if (!buffer || buffer.length === 0) return;

      const isImage = !!viewOnceMsg.imageMessage;
      const isVideo = !!viewOnceMsg.videoMessage;
      const caption = `👁️ *View Once Auto-Revealed*\n👤 Sent by: @${senderNum}\n\n${ownerFooter()}`;

      if (isImage) {
        await sock.sendMessage(from, { image: buffer, caption, mentions: [sender] });
      } else if (isVideo) {
        await sock.sendMessage(from, { video: buffer, caption, mentions: [sender] });
      }

      console.log(`[ANTIVV] Auto-revealed view-once from ${senderNum}`);
    } catch (err) {
      console.error('[ANTIVV AUTO ERROR]:', err.message);
    }
  },
};
