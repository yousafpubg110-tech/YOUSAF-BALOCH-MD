/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Steal Sticker Plugin ┃
┃       Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { sticker }        from '../lib/sticker.js';
import { OWNER, CONFIG }  from '../config.js';

// ─── Constants — Owner info locked into every sticker ────────────────────────
// These appear in WhatsApp sticker info when user long-presses any sticker
const STICKER_PACK   = `${OWNER.BOT_NAME} | +${OWNER.NUMBER}`;
const STICKER_AUTHOR = `${OWNER.FULL_NAME}`;

// ─── Helper: Parse custom pack/author from user text ─────────────────────────
function parseCustomInfo(text) {
  if (!text || !text.trim()) {
    return { packname: STICKER_PACK, author: STICKER_AUTHOR };
  }

  const parts    = text.split('|');
  const packname = parts[0]?.trim() || STICKER_PACK;

  // ✅ Always keep owner name in author — even if user sets custom pack
  const author   = parts[1]?.trim()
    ? `${parts[1].trim()} | ${OWNER.FULL_NAME}`
    : STICKER_AUTHOR;

  return { packname, author };
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['take', 'steal', 'wm', 'addwm'],
  name       : 'take',
  category   : 'Sticker',
  description: 'Steal/rename a sticker with custom pack info',
  usage      : '.take [PackName | AuthorName]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⏳');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Check quoted message ────────────────────────────────────
      if (!msg.quoted) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Please reply to a sticker!*\n\n📌 *Usage:*\n${CONFIG.PREFIX}take\n${CONFIG.PREFIX}take MyPack | MyName\n\n💡 *Reply to any sticker and type the command.*`,
        }, { quoted: msg });
      }

      // ── Validate sticker mime ───────────────────────────────────
      const mime = msg.quoted?.msg?.mimetype ||
                   msg.quoted?.mimetype       || '';

      if (!/webp/i.test(mime)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *That is not a sticker!*\n\n💡 *Tip:* Reply to a WhatsApp sticker (WebP format) and use ${CONFIG.PREFIX}take`,
        }, { quoted: msg });
      }

      // ── Parse pack/author info ──────────────────────────────────
      const { packname, author } = parseCustomInfo(text);

      // ── Send processing message ─────────────────────────────────
      await sock.sendMessage(from, {
        text: `⏳ *Repackaging sticker...*\n\n🎨 *Pack:* ${packname}\n✍️ *Author:* ${author}`,
      }, { quoted: msg });

      // ── Download sticker ────────────────────────────────────────
      let media;
      try {
        media = await msg.quoted.download();
      } catch (dlErr) {
        throw new Error('Failed to download sticker: ' + dlErr.message);
      }

      if (!media || !Buffer.isBuffer(media)) {
        throw new Error('Downloaded sticker is invalid or empty.');
      }

      // ── Create sticker with owner metadata ──────────────────────
      const stickerBuffer = await sticker(
        media,
        false,
        packname,  // Pack name (with owner bot name)
        author,    // Author (always includes owner name)
      );

      if (!stickerBuffer) {
        throw new Error('Sticker creation returned empty result.');
      }

      // ── Send sticker ────────────────────────────────────────────
      await sock.sendMessage(from, {
        sticker: stickerBuffer,
      }, { quoted: msg });

      // ── Send info message ───────────────────────────────────────
      await sock.sendMessage(from, {
        text: `✅ *Sticker repackaged!*\n\n🎨 *Pack:* ${packname}\n✍️ *Author:* ${author}\n\n_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_`,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[TAKE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Take error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: `❌ *Failed to steal sticker!*\n\n⚠️ *Error:* ${error.message}`,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
