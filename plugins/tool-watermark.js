/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Watermark Plugin      ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { createCanvas, loadImage } from 'canvas';

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

async function addWatermark(imageBuffer, text, position = 'bottomright', opacity = 0.7) {
  const img    = await loadImage(imageBuffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx    = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  // Watermark style
  const fontSize = Math.max(20, Math.floor(img.width / 20));
  ctx.font      = `bold ${fontSize}px Arial`;
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
  ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.lineWidth   = 2;

  const textWidth  = ctx.measureText(text).width;
  const padding    = 20;

  let x, y;
  switch (position) {
    case 'topleft':     x = padding;                       y = fontSize + padding;           break;
    case 'topright':    x = img.width - textWidth - padding; y = fontSize + padding;          break;
    case 'center':      x = (img.width - textWidth) / 2;  y = img.height / 2;              break;
    case 'bottomleft':  x = padding;                       y = img.height - padding;         break;
    case 'bottomright':
    default:            x = img.width - textWidth - padding; y = img.height - padding;       break;
  }

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);

  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

export default {
  command    : ['watermark', 'wm', 'stamp'],
  name       : 'tool-watermark',
  category   : 'Tools',
  description: 'Add watermark text to images',
  usage      : '.watermark <text> [position]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💧');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg || !text?.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to an image with watermark text!*

📌 *Usage:*
Reply to image: \`${CONFIG.PREFIX}watermark Your Text\`

╭─『 📍 *Positions* 』
│ topleft  topright  center
│ bottomleft  bottomright (default)
╰──────────────────────────

💡 *Example:*
\`${CONFIG.PREFIX}wm © Yousaf Baloch bottomright\`

${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Parse position ────────────────────────────────────
      const positions = ['topleft','topright','center','bottomleft','bottomright'];
      const words     = text.trim().split(' ');
      const lastWord  = words[words.length - 1].toLowerCase();
      const position  = positions.includes(lastWord) ? lastWord : 'bottomright';
      const wmText    = positions.includes(lastWord) ? words.slice(0, -1).join(' ') : text.trim();

      await sock.sendMessage(from, {
        text: `💧 *Adding watermark...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const result = await addWatermark(buffer, wmText, position);

      await sock.sendMessage(from, {
        image  : result,
        caption: `✅ *Watermark Added!*\n\n👋 +${senderNum}\n💧 Text: "${wmText}"\n📍 Position: ${position}\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[WATERMARK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Watermark failed!*\n⚠️ ${error.message}\n\n💡 Install: \`npm install canvas\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
