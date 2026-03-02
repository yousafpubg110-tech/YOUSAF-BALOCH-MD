/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - TTP Sticker Plugin  ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import Jimp          from 'jimp';
import { sticker }   from '../lib/sticker.js';
import { OWNER, CONFIG } from '../config.js';

const STICKER_PACK   = `${OWNER.BOT_NAME} | +${OWNER.NUMBER}`;
const STICKER_AUTHOR = `${OWNER.FULL_NAME}`;

// ── Available styles ──────────────────────────────────────────────────────────
const STYLES = {
  1: { bg: '#000000', color: '#FFFFFF', name: 'Black & White' },
  2: { bg: '#FFFFFF', color: '#000000', name: 'White & Black' },
  3: { bg: '#FF0000', color: '#FFFFFF', name: 'Red & White'   },
  4: { bg: '#0000FF', color: '#FFFFFF', name: 'Blue & White'  },
  5: { bg: '#00AA00', color: '#FFFFFF', name: 'Green & White' },
  6: { bg: '#FF6600', color: '#FFFFFF', name: 'Orange & White'},
  7: { bg: '#9900CC', color: '#FFFFFF', name: 'Purple & White'},
  8: { bg: '#FFD700', color: '#000000', name: 'Gold & Black'  },
};

export default {
  command    : ['ttp', 'tts2sticker', 'textsticker'],
  name       : 'ttp',
  category   : 'Sticker',
  description: 'Text کو sticker میں تبدیل کریں',
  usage      : '.ttp <text> [style 1-8]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, args }) => {
    try {

      // ── Validate args ─────────────────────────────────────
      if (!args || args.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Text دیں!*\n\n📌 *Usage:*\n${CONFIG.PREFIX}ttp Hello World\n${CONFIG.PREFIX}ttp Yousaf Baloch 3\n\n🎨 *Styles (1-8):*\n${Object.entries(STYLES).map(([k, v]) => `┃ ${k}. ${v.name}`).join('\n')}\n\n_Default: Style 1 (Black & White)_`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });

      // ── Parse text and style ──────────────────────────────
      let styleNum = 1;
      let textArgs = [...args];

      // آخری argument اگر 1-8 number ہو تو style ہے
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
          text: `❌ *Text خالی ہے!*\n\nمثال: ${CONFIG.PREFIX}ttp Hello World`,
        }, { quoted: msg });
      }

      if (text.length > 100) {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        return await sock.sendMessage(from, {
          text: `❌ *Text بہت لمبا ہے!*\n\n📏 *Max:* 100 characters\n📝 *آپ کا text:* ${text.length} characters`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `⏳ *Sticker بن رہا ہے...*\n\n📝 *Text:* ${text}\n🎨 *Style:* ${style.name}`,
      }, { quoted: msg });

      // ── Create image with Jimp ────────────────────────────
      const size     = 512;
      const padding  = 40;
      const fontSize = text.length <= 10 ? 64 :
                       text.length <= 20 ? 48 :
                       text.length <= 40 ? 32 : 24;

      // Background color parse
      const bgHex    = style.bg.replace('#', '');
      const textHex  = style.color.replace('#', '');

      const bgR  = parseInt(bgHex.slice(0, 2), 16);
      const bgG  = parseInt(bgHex.slice(2, 4), 16);
      const bgB  = parseInt(bgHex.slice(4, 6), 16);

      const textR = parseInt(textHex.slice(0, 2), 16);
      const textG = parseInt(textHex.slice(2, 4), 16);
      const textB = parseInt(textHex.slice(4, 6), 16);

      // ── Image بنائیں ──────────────────────────────────────
      const image = new Jimp(size, size, Jimp.rgbaToInt(bgR, bgG, bgB, 255));

      // Font load کریں (size کے مطابق)
      let font;
      try {
        if (fontSize >= 64) font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        else if (fontSize >= 48) font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        else font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
      } catch (_) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      }

      // Text کو lines میں تقسیم کریں
      const maxCharsPerLine = Math.floor((size - padding * 2) / (fontSize * 0.6));
      const words  = text.split(' ');
      const lines  = [];
      let   line   = '';

      for (const word of words) {
        if ((line + ' ' + word).trim().length <= maxCharsPerLine) {
          line = (line + ' ' + word).trim();
        } else {
          if (line) lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);

      // Text print کریں — center میں
      const lineHeight = fontSize + 10;
      const totalH     = lines.length * lineHeight;
      let   startY     = (size - totalH) / 2;

      for (const ln of lines) {
        const textW = Jimp.measureText(font, ln);
        const startX = (size - textW) / 2;
        image.print(font, startX, startY, ln);
        startY += lineHeight;
      }

      // ── اگر text color white نہیں — color بدلیں ─────────
      if (style.color !== '#FFFFFF') {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
          const r = this.bitmap.data[idx + 0];
          const g = this.bitmap.data[idx + 1];
          const b = this.bitmap.data[idx + 2];
          // White pixels کو target color میں بدلیں
          if (r > 200 && g > 200 && b > 200) {
            this.bitmap.data[idx + 0] = textR;
            this.bitmap.data[idx + 1] = textG;
            this.bitmap.data[idx + 2] = textB;
          }
        });
      }

      // ── Buffer بنائیں ─────────────────────────────────────
      const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

      // ── Sticker بنائیں ────────────────────────────────────
      const stickerBuffer = await sticker(
        imageBuffer,
        false,
        STICKER_PACK,
        STICKER_AUTHOR,
      );

      if (!stickerBuffer) {
        throw new Error('Sticker creation failed.');
      }

      // ── Send sticker ──────────────────────────────────────
      await sock.sendMessage(from, {
        sticker: stickerBuffer,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *TTP Sticker بن گیا!*\n\n📝 *Text:* ${text}\n🎨 *Style:* ${style.name}\n\n_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_`,
      }, { quoted: msg });

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error('[TTP ERROR]:', error.message);
      try {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        await sock.sendMessage(from, {
          text: `❌ *TTP error:*\n_${error.message}_`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
