/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Meme Generator        ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { createCanvas, loadImage, registerFont } from 'canvas';

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

async function generateMeme(imageBuffer, topText, bottomText) {
  const img    = await loadImage(imageBuffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx    = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  const fontSize = Math.max(30, Math.floor(img.width / 10));
  ctx.font      = `bold ${fontSize}px Impact, Arial`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth   = fontSize / 8;

  const wrapText = (text, maxWidth) => {
    const words = text.split(' ');
    const lines  = [];
    let   line   = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Top text
  if (topText) {
    const lines = wrapText(topText.toUpperCase(), img.width - 40);
    lines.forEach((line, i) => {
      const y = fontSize + (i * fontSize * 1.2) + 10;
      ctx.strokeText(line, img.width / 2, y);
      ctx.fillText(line, img.width / 2, y);
    });
  }

  // Bottom text
  if (bottomText) {
    const lines = wrapText(bottomText.toUpperCase(), img.width - 40);
    lines.reverse().forEach((line, i) => {
      const y = img.height - 10 - (i * fontSize * 1.2);
      ctx.strokeText(line, img.width / 2, y);
      ctx.fillText(line, img.width / 2, y);
    });
  }

  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

// ─── Popular Meme Templates ───────────────────────────────────────────────────
const MEME_TEMPLATES = {
  drake   : 'https://i.imgflip.com/30b1gx.jpg',
  doge    : 'https://i.imgflip.com/4t0m5.jpg',
  distracted: 'https://i.imgflip.com/1ur9b0.jpg',
  button  : 'https://i.imgflip.com/1g8my4.jpg',
  change  : 'https://i.imgflip.com/24y43o.jpg',
  brain   : 'https://i.imgflip.com/1jwhww.jpg',
  fine    : 'https://i.imgflip.com/wxica.jpg',
  wink    : 'https://i.imgflip.com/1bhk.jpg',
};

export default {
  command    : ['meme', 'memegen', 'makememe'],
  name       : 'tool-meme-gen',
  category   : 'Tools',
  description: 'Generate memes with top/bottom text',
  usage      : '.meme <top text> | <bottom text>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('😂');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!input) {
        const templateList = Object.keys(MEME_TEMPLATES)
          .map(t => `│ \`${CONFIG.PREFIX}meme ${t} Top Text | Bottom Text\``)
          .join('\n');

        return await sock.sendMessage(from, {
          text: `╭━━━『 😂 *MEME GENERATOR* 』━━━╮

📌 *With your image:*
Reply to image: \`${CONFIG.PREFIX}meme Top | Bottom\`

📌 *With template:*
\`${CONFIG.PREFIX}meme drake Yes | No\`

╭─『 🖼️ *Templates* 』
${templateList}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Check for template ────────────────────────────────
      const words    = input.split(' ');
      const template = MEME_TEMPLATES[words[0].toLowerCase()];
      let   imageBuffer;

      if (template) {
        const templateText = words.slice(1).join(' ');
        const parts        = templateText.split('|').map(p => p.trim());
        const topText      = parts[0] || '';
        const bottomText   = parts[1] || '';

        const controller = new AbortController();
        const timer      = setTimeout(() => controller.abort(), 15000);
        const res        = await fetch(template, { signal: controller.signal });
        clearTimeout(timer);
        imageBuffer = Buffer.from(await res.arrayBuffer());

        const memeBuffer = await generateMeme(imageBuffer, topText, bottomText);
        await sock.sendMessage(from, {
          image  : memeBuffer,
          caption: `😂 *Meme Generated!*\n\n👋 +${senderNum}\n🖼️ Template: ${words[0]}\n\n${ownerFooter()}`,
        }, { quoted: msg });

      } else if (imgMsg) {
        // ── Custom image ──────────────────────────────────
        const parts      = input.split('|').map(p => p.trim());
        const topText    = parts[0] || '';
        const bottomText = parts[1] || '';

        imageBuffer = await downloadMediaMessage(
          { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
          'buffer', {},
          { logger: console, reuploadRequest: sock.updateMediaMessage }
        );

        const memeBuffer = await generateMeme(imageBuffer, topText, bottomText);
        await sock.sendMessage(from, {
          image  : memeBuffer,
          caption: `😂 *Meme Generated!*\n\n👋 +${senderNum}\n\n${ownerFooter()}`,
        }, { quoted: msg });

      } else {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to an image or use a template!*\n\n💡 Templates: drake, doge, distracted, button, brain, fine\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[MEME ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Meme failed!*\n⚠️ ${error.message}\n\n💡 Install: \`npm install canvas\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
