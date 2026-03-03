/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Make Sticker Plugin ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

// FIX: createSticker — lib/sticker.js میں function کا صحیح نام
import { createSticker } from '../lib/sticker.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { OWNER, CONFIG } from '../config.js';
import pino from 'pino';

const logger = pino({ level: 'silent' });

const STICKER_PACK   = `${OWNER.BOT_NAME} | +${OWNER.NUMBER}`;
const STICKER_AUTHOR = `${OWNER.FULL_NAME}`;
const MAX_VIDEO_SECONDS = 10;

// FIX: mime صحیح طریقے سے نکالنا
function getMime(msg) {
  const m = msg?.message;
  if (!m) return '';
  return (
    m?.imageMessage?.mimetype     ||
    m?.videoMessage?.mimetype     ||
    m?.stickerMessage?.mimetype   ||
    m?.documentMessage?.mimetype  ||
    ''
  );
}

function isValidMime(mime) {
  if (!mime || typeof mime !== 'string') return false;
  return /^(image|video)\//i.test(mime) || mime === 'image/webp';
}

function isVideo(mime) {
  return /^video\//i.test(mime);
}

// FIX: media download — downloadMediaMessage directly use کرنا
async function downloadMedia(sock, rawMsg) {
  try {
    return await downloadMediaMessage(
      rawMsg,
      'buffer',
      {},
      { logger, reuploadRequest: sock.updateMediaMessage }
    );
  } catch (err) {
    throw new Error('Media download failed: ' + err.message);
  }
}

export default {
  command    : ['sticker', 's', 'stiker', 'stic'],
  name       : 'sticker',
  category   : 'Sticker',
  description: 'Convert image or video to WhatsApp sticker',
  usage      : '.sticker (reply to image/video)',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      if (typeof msg.react === 'function') await msg.react('⏳');

      // FIX: quoted raw message یا direct message
      const isQuoted   = !!msg.quoted;
      const targetMsg  = isQuoted ? msg.quoted : msg;

      // FIX: raw message object — serialize سے باہر کا original message
      const rawTarget = isQuoted
        ? {
            key    : {
              remoteJid  : msg.from,
              id         : msg.quoted?.id,
              participant: msg.quoted?.sender,
            },
            message: msg.quoted?.message,
          }
        : msg; // msg already has raw structure via serialize

      // FIX: mime صحیح path سے نکالنا
      const mime =
        targetMsg?.message?.imageMessage?.mimetype    ||
        targetMsg?.message?.videoMessage?.mimetype    ||
        targetMsg?.message?.stickerMessage?.mimetype  ||
        targetMsg?.mimetype                           ||
        getMime(targetMsg)                            ||
        '';

      if (!mime || !isValidMime(mime)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Please reply to an image or video!*\n\n📌 *Usage:*\n1. Send or reply to an image/video\n2. Type \`${CONFIG.PREFIX}sticker\`\n\n✅ *Supported:* JPEG, PNG, WEBP, MP4, GIF`,
        }, { quoted: msg });
      }

      if (isVideo(mime)) {
        const seconds =
          targetMsg?.message?.videoMessage?.seconds ||
          targetMsg?.seconds || 0;
        if (seconds > MAX_VIDEO_SECONDS) {
          if (typeof msg.react === 'function') await msg.react('❌');
          return await sock.sendMessage(from, {
            text: `❌ *Video too long!*\n\n⏱️ *Max:* ${MAX_VIDEO_SECONDS}s\n📹 *Your video:* ${seconds}s\n\n💡 Trim and try again.`,
          }, { quoted: msg });
        }
      }

      await sock.sendMessage(from, {
        text: `⏳ *Creating sticker...*\n\n🎨 *Pack:* ${STICKER_PACK}\n✍️ *Author:* ${STICKER_AUTHOR}`,
      }, { quoted: msg });

      // FIX: downloadMediaMessage سے download کرنا
      const media = await downloadMedia(sock, rawTarget);

      if (!media || !Buffer.isBuffer(media)) {
        throw new Error('Downloaded media is empty or invalid.');
      }

      // FIX: createSticker — صحیح function name
      const stickerBuffer = await createSticker(
        media,
        STICKER_PACK,
        STICKER_AUTHOR,
      );

      if (!stickerBuffer) {
        throw new Error('Sticker creation returned empty result.');
      }

      await sock.sendMessage(from, {
        sticker: stickerBuffer,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *Sticker created!*\n\n🎨 *Pack:* ${STICKER_PACK}\n✍️ *Author:* ${STICKER_AUTHOR}\n\n_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[STICKER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply(`❌ Sticker error: ${error.message}`);
        } else {
          await sock.sendMessage(from, {
            text: `❌ *Failed!*\n⚠️ *Error:* ${error.message}`,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
