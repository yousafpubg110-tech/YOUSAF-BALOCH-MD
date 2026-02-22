/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — BG Remover Plugin     ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const REMOVEBG_KEY = process.env.REMOVEBG_API_KEY || '';

// ─── Owner Footer ─────────────────────────────────────────────────────────────
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

// ─── Remove background using remove.bg API ───────────────────────────────────
async function removeBg(imageBuffer, timeoutMs = 30000) {
  if (!REMOVEBG_KEY) throw new Error('REMOVEBG_API_KEY not set in .env\n🔗 Free: https://www.remove.bg/api');

  // ✅ CodeQL Fix: URL() safe construction
  const url = new URL('https://api.remove.bg/v1.0/removebg');
  if (url.hostname !== 'api.remove.bg') throw new Error('Invalid hostname.');

  const FormData = (await import('form-data')).default;
  const form     = new FormData();
  form.append('image_file', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
  form.append('size',       'auto');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method : 'POST',
      signal : controller.signal,
      headers: { 'X-Api-Key': REMOVEBG_KEY, ...form.getHeaders() },
      body   : form,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.errors?.[0]?.title || `remove.bg error: ${res.status}`);
    }
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['rembg', 'removebg', 'bgremove', 'nobg', 'بیک گراؤنڈ'],
  name       : 'ai-bg-remover',
  category   : 'AI',
  description: 'Remove background from images using AI',
  usage      : '.rembg [reply to image]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('✂️');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Check for image ───────────────────────────────────────
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Please send or reply to an image!*

📌 *How to use:*
1. Send image with caption: ${CONFIG.PREFIX}rembg
2. OR reply to image with: ${CONFIG.PREFIX}rembg

✅ *Result:* Image with transparent background (PNG)

💡 *Add API key to .env:*
\`REMOVEBG_API_KEY=your_key\`
🔗 Free: https://www.remove.bg/api

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      if (!REMOVEBG_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *REMOVEBG_API_KEY not set!*\n\n📌 Add to .env file:\n\`REMOVEBG_API_KEY=your_key\`\n\n🔗 Get free API key:\nhttps://www.remove.bg/api\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `✂️ *Removing background...*\n🤖 AI processing\n⏳ Please wait 10-20 seconds...`,
      }, { quoted: msg });

      // ── Download image ────────────────────────────────────────
      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer',
        {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not download image!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Remove background ─────────────────────────────────────
      const resultBuffer = await removeBg(buffer);

      // ── Send result image ─────────────────────────────────────
      await sock.sendMessage(from, {
        image  : resultBuffer,
        caption: `✅ *Background Removed!*

👋 *Requested by:* +${senderNum}
🤖 *Powered by:* remove.bg AI

${ownerFooter()}`,
        mimetype: 'image/png',
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[REMBG ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Background removal failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
