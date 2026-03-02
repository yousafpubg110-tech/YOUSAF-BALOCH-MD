/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Anti View Once Plugin ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }         from '../config.js';
import { downloadMediaMessage }  from '@whiskeysockets/baileys';

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
  usage      : '.antivv [on/off] OR reply to view-once message',
  cooldown   : 5,
  groupOnly  : true,

  autoHandle: async ({ sock, msg, from }) => {
    try {
      if (!antivvGroups.has(from)) return;

      const viewOnce = msg.message?.viewOnceMessage?.message
        || msg.message?.viewOnceMessageV2?.message
        || msg.message?.viewOnceMessageV2Extension?.message;

      if (!viewOnce) return;

      const isImage = !!viewOnce.imageMessage;
      const isVideo = !!viewOnce.videoMessage;
      if (!isImage && !isVideo) return;

      const buffer = await downloadMediaMessage(
        { message: viewOnce },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!Buffer.isBuffer(buffer) || buffer.length === 0) return;

      const senderNum = msg.key.participant?.split('@')[0] || 'User';

      if (isImage) {
        await sock.sendMessage(from, {
          image  : buffer,
          caption: `👁️ *View Once Image Revealed!*\n\n👤 *Sender:* +${senderNum}\n\n${ownerFooter()}`,
        });
      } else if (isVideo) {
        await sock.sendMessage(from, {
          video  : buffer,
          caption: `👁️ *View Once Video Revealed!*\n\n👤 *Sender:* +${senderNum}\n\n${ownerFooter()}`,
          mimetype: 'video/mp4',
        });
      }
    } catch (e) {
      console.error('[ANTIVV AUTO ERROR]:', e.message);
    }
  },

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      // ✅ FIX: react via sock.sendMessage
      await sock.sendMessage(from, { react: { text: '👁️', key: msg.key } });

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();

      // ── Reply to view-once ────────────────────────────────
      const quoted   = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const viewOnce = quoted?.viewOnceMessage?.message
        || quoted?.viewOnceMessageV2?.message
        || quoted?.viewOnceMessageV2Extension?.message;

      if (viewOnce) {
        const isImage = !!viewOnce.imageMessage;
        const isVideo = !!viewOnce.videoMessage;

        if (isImage || isVideo) {
          const buffer = await downloadMediaMessage(
            { message: viewOnce },
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
                video  : buffer,
                caption: `👁️ *View Once Video Revealed!*\n\n👋 *By:* +${senderNum}\n\n${ownerFooter()}`,
                mimetype: 'video/mp4',
              }, { quoted: msg });
            }
            // ✅ FIX: react via sock.sendMessage
            await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
            return;
          }
        }
      }

      // ✅ FIX: isAdmin check ہٹا دی — سب users toggle کر سکتے ہیں
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
        const status = antivvGroups.has(from) ? '✅ ON' : '❌ OFF';
        await sock.sendMessage(from, {
          text: `╭━━━『 👁️ *ANTI VIEW ONCE* 』━━━╮

📊 *Status:* ${status}

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}antivv on\`  → چالو کریں
│ \`${CONFIG.PREFIX}antivv off\` → بند کریں
│ Reply to VV msg → reveal کریں
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ✅ FIX: react via sock.sendMessage
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
