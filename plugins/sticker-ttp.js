/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - TTP Sticker Plugin  ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { createSticker }  from '../lib/sticker.js';
import { createCanvas }   from 'canvas';
import { OWNER, CONFIG }  from '../config.js';

const STICKER_PACK   = `${OWNER.BOT_NAME} | +${OWNER.NUMBER}`;
const STICKER_AUTHOR = `${OWNER.FULL_NAME}`;

const STYLES = {
  1: { bg: '#000000', color: '#FFFFFF', name: 'Black & White'  },
  2: { bg: '#FFFFFF', color: '#000000', name: 'White & Black'  },
  3: { bg: '#FF0000', color: '#FFFFFF', name: 'Red & White'    },
  4: { bg: '#0000FF', color: '#FFFFFF', name: 'Blue & White'   },
  5: { bg: '#00AA00', color: '#FFFFFF', name: 'Green & White'  },
  6: { bg: '#FF6600', color: '#FFFFFF', name: 'Orange & White' },
  7: { bg: '#9900CC', color: '#FFFFFF', name: 'Purple & White' },
  8: { bg: '#FFD700', color: '#000000', name: 'Gold & Black'   },
};

async function createTextImage(text, style) {
  const size    = 512;
  const padding = 40;
  const canvas  = createCanvas(size, size);
  const ctx     = canvas.getContext('2d');

  ctx.fillStyle = style.bg;
  ctx.fillRect(0, 0, size, size);

  const fontSize = text.length <= 10 ? 72 :
                   text.length <= 20 ? 56 :
                   text.length <= 40 ? 40 : 28;

  ctx.fillStyle    = style.color;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = `bold ${fontSize}px Arial`;

  const maxWidth = size - padding * 2;
  const words    = text.split(' ');
  const lines    = [];
  let   line     = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  const lineHeight = fontSize + 12;
  const totalH     = lines.length * lineHeight;
  const startY     = (size - totalH) / 2 + fontSize / 2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], size / 2, startY + i * lineHeight);
  }

  return canvas.toBuffer('image/png');
}

export default {
  command    : ['ttp', 'tts2sticker', 'textsticker'],
  name       : 'ttp',
  category   : 'Sticker',
  description: 'Convert text to WhatsApp sticker',
  usage      : '.ttp <text> [style 1-8]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, args }) => {
    try {

      if (!args || args.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide text!*\n\n📌 *Usage:*\n${CONFIG.PREFIX}ttp Hello World\n${CONFIG.PREFIX}ttp Yousaf 3\n\n🎨 *Styles (1-8):*\n${Object.entries(STYLES).map(([k, v]) => `  ${k}. ${v.name}`).join('\n')}\n\n_Default: Style 1_`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });

      let styleNum = 1;
      let textArgs = [...args];
      const lastArg = textArgs[textArgs.length - 1];
      if (/^[1-8]$/.test(lastArg)) {
        styleNum = parseInt(lastArg);
        textArgs.pop();
      }

      const text  = textArgs.join(' ').trim();
      const style = STYLES[styleNum] || STYLES[1];

      if (!text) {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        return await sock.sendMessage(from, {
          text: `❌ *Text is empty!*\n\nExample: ${CONFIG.PREFIX}ttp Hello World`,
        }, { quoted: msg });
      }

      if (text.length > 100) {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        return await sock.sendMessage(from, {
          text: `❌ *Text too long! Max 100 characters.*\n\nYour text: ${text.length} characters`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `⏳ *Creating sticker...*\n\n📝 *Text:* ${text}\n🎨 *Style:* ${style.name}`,
      }, { quoted: msg });

      const imageBuffer   = await createTextImage(text, style);
      const stickerBuffer = await createSticker(imageBuffer, STICKER_PACK, STICKER_AUTHOR);

      if (!stickerBuffer) throw new Error('Sticker creation failed.');

      await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *TTP Sticker created!*\n\n📝 *Text:* ${text}\n🎨 *Style:* ${style.name}\n\n_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_`,
      }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error('[TTP ERROR]:', error.message);
      try {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        await sock.sendMessage(from, {
          text: `❌ *TTP failed!*\n_${error.message}_`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
