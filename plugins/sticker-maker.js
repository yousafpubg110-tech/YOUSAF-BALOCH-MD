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

import { sticker }  from '../lib/sticker.js';
import { OWNER, CONFIG } from '../config.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_VIDEO_SECONDS = 10;

// ─── Helper: Validate mime type ───────────────────────────────────────────────
function isValidMime(mime) {
  if (!mime || typeof mime !== 'string') return false;
  return /^(image|video)\//i.test(mime);
}

// ─── Helper: Check if mime is video ──────────────────────────────────────────
function isVideo(mime) {
  return /^video\//i.test(mime);
}

// ─── Helper: Check if mime is image ──────────────────────────────────────────
function isImage(mime) {
  return /^image\//i.test(mime);
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['sticker', 's', 'stiker', 'stic'],
  name       : 'sticker',
  category   : 'Sticker',
  description: 'Convert image or video to WhatsApp sticker',
  usage      : '.sticker (reply to image/video)',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⏳');

      // ── Get target media ────────────────────────────────────────
      const target = msg.quoted || msg;
      const mime   = target?.msg?.mimetype ||
                     target?.mimetype       || '';

      // ── Validate media ──────────────────────────────────────────
      if (!mime || !isValidMime(mime)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Please reply to an image or video!*\n\n📌 *Usage:*\n1. Send or reply to an image/video\n2. Type \`${CONFIG.PREFIX}sticker\`\n\n✅ *Supported:* JPEG, PNG, WEBP, MP4, GIF`,
        }, { quoted: msg });
      }

      // ── Video length check ──────────────────────────────────────
      if (isVideo(mime)) {
        const seconds = target?.msg?.seconds || target?.seconds || 0;
        if (seconds > MAX_VIDEO_SECONDS) {
          if (typeof msg.react === 'function') await msg.react('❌');
          return await sock.sendMessage(from, {
            text: `❌ *Video too long!*\n\n⏱️ *Max Duration:* ${MAX_VIDEO_SECONDS} seconds\n📹 *Your Video:* ${seconds} seconds\n\n💡 *Tip:* Trim your video and try again.`,
          }, { quoted: msg });
        }
      }

      // ── Send processing message ─────────────────────────────────
      await sock.sendMessage(from, {
        text: `⏳ *Creating sticker...*\n\n🎨 *Pack:* ${OWNER.BOT_NAME}\n✍️ *Author:* ${OWNER.FULL_NAME}`,
      }, { quoted: msg });

      // ── Download media ──────────────────────────────────────────
      let media;
      try {
        media = await target.download();
      } catch (dlErr) {
        throw new Error('Failed to download media: ' + dlErr.message);
      }

      if (!media || !Buffer.isBuffer(media)) {
        throw new Error('Downloaded media is invalid or empty.');
      }

      // ── Create sticker ──────────────────────────────────────────
      const stickerBuffer = await sticker(
        media,
        false,
        OWNER.BOT_NAME,   // Pack name — from config
        OWNER.FULL_NAME,  // Author  — from config
      );

      if (!stickerBuffer) {
        throw new Error('Sticker creation returned empty result.');
      }

      // ── Send sticker ────────────────────────────────────────────
      await sock.sendMessage(from, {
        sticker: stickerBuffer,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[STICKER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Sticker error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: `❌ *Failed to create sticker!*\n\n⚠️ *Error:* ${error.message}`,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
