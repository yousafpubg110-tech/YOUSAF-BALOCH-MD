/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Anti View Once Plugin ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG }        from '../config.js';
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

const antivvGroups = new Set();

export default {
  command    : ['antivv', 'antiviewonce', 'vv', 'اینٹی وی وی'],
  name       : 'group-antivv',
  category   : 'Group',
  description: 'Reveal view-once photos and videos',
  usage      : '.vv [on/off] OR reply to view-once message',
  cooldown   : 5,
  // ✅ FIX: groupOnly ہٹا دی — private chat میں بھی کام کرے گی
  groupOnly  : false,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      await sock.sendMessage(from, { react: { text: '👁️', key: msg.key } });

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();

      // ✅ FIX: quoted message صحیح جگہ سے نکالیں
      const rawMsg   = msg.message || {};
      const ctxInfo  = rawMsg?.extendedTextMessage?.contextInfo
                    || rawMsg?.imageMessage?.contextInfo
                    || rawMsg?.videoMessage?.contextInfo
                    || rawMsg?.conversation && null
                    || Object.values(rawMsg)[0]?.contextInfo
                    || null;

      const quotedMsg = ctxInfo?.quotedMessage;

      // ✅ FIX: view-once message پہلے check کریں — input سے پہلے
      if (quotedMsg) {
        const viewOnce = quotedMsg?.viewOnceMessage?.message
          || quotedMsg?.viewOnceMessageV2?.message
          || quotedMsg?.viewOnceMessageV2Extension?.message;

        if (viewOnce) {
          const isImage = !!viewOnce.imageMessage;
          const isVideo = !!viewOnce.videoMessage;

          if (isImage || isVideo) {
            try {
              const fakeMsg = {
                key    : {
                  remoteJid  : from,
                  id         : ctxInfo.stanzaId,
                  participant: ctxInfo.participant,
                },
                message: quotedMsg,
              };

              const buffer = await downloadMediaMessage(
                fakeMsg,
                'buffer',
                {},
                { logger: console, reuploadRequest: sock.updateMediaMessage }
              );

              if (Buffer.isBuffer(buffer) && buffer.length > 0) {
                if (isImage) {
                  await sock.sendMessage(from, {
                    image  : buffer,
                    caption: `👁️ *View Once Revealed!*\n\n👋 *By:* +${senderNum}\n\n${ownerFooter()}`,
                  }, { quoted: msg });
                } else {
                  await sock.sendMessage(from, {
                    video   : buffer,
                    caption : `👁️ *View Once Video Revealed!*\n\n👋 *By:* +${senderNum}\n\n${ownerFooter()}`,
                    mimetype: 'video/mp4',
                  }, { quoted: msg });
                }
                await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
                return;
              }
            } catch (dlErr) {
              console.error('[ANTIVV DL ERROR]:', dlErr.message);
            }
          }
        }
      }

      // ── Toggle on/off ─────────────────────────────────────
      if (input === 'on' || input === 'enable') {
        antivvGroups.add(from);
        await sock.sendMessage(from, {
          text: `✅ *AntiVV چالو ہو گیا!*\n\n👁️ اب view-once media automatically reveal ہو گا۔\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } else if (input === 'off' || input === 'disable') {
        antivvGroups.delete(from);
        await sock.sendMessage(from, {
          text: `🔕 *AntiVV بند ہو گیا!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } else {
        // ── Status + help ──────────────────────────────────
        const status = antivvGroups.has(from) ? '✅ ON' : '❌ OFF';
        await sock.sendMessage(from, {
          text: `╭━━━『 👁️ *ANTI VIEW ONCE* 』━━━╮

📊 *Status:* ${status}

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}vv on\`  → چالو کریں
│ \`${CONFIG.PREFIX}vv off\` → بند کریں
│ Reply to VV msg → reveal کریں
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error('[ANTIVV ERROR]:', error.message);
      try {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        await sock.sendMessage(from, {
          text: `❌ *AntiVV error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
