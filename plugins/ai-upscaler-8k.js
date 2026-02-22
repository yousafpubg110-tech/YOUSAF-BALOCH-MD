/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Image Upscaler       ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const CLIPDROP_KEY = process.env.CLIPDROP_API_KEY || '';

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

// ─── Upscale via ClipDrop API ─────────────────────────────────────────────────
async function upscaleImage(imageBuffer, scale = 4, timeoutMs = 45000) {
  if (!CLIPDROP_KEY) throw new Error('CLIPDROP_API_KEY not set.\n🔗 Free: https://clipdrop.co/apis');

  // ✅ CodeQL Fix
  const url = new URL('https://clipdrop-api.co/image-upscaling/v1/upscale');
  if (url.hostname !== 'clipdrop-api.co') throw new Error('Invalid hostname.');

  const FormData = (await import('form-data')).default;
  const form     = new FormData();
  form.append('image_file',   imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
  form.append('target_width', String(2048));
  form.append('target_height', String(2048));

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method : 'POST',
      signal : controller.signal,
      headers: { 'x-api-key': CLIPDROP_KEY, ...form.getHeaders() },
      body   : form,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`ClipDrop error: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['upscale', 'hd', 'enhance', 'sharpen', 'اپسکیل'],
  name       : 'ai-upscaler-8k',
  category   : 'AI',
  description: 'AI image upscaler — low quality to HD',
  usage      : '.upscale [reply to image]',
  cooldown   : 20,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔭');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Check for image ───────────────────────────────────────
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Please send or reply to an image!*

📌 *How to use:*
1. Send low-quality image with: ${CONFIG.PREFIX}upscale
2. OR reply to image with: ${CONFIG.PREFIX}upscale

✅ *Result:* HD enhanced image

💡 *Setup:*
\`CLIPDROP_API_KEY=your_key\`
🔗 Free: https://clipdrop.co/apis

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      if (!CLIPDROP_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CLIPDROP_API_KEY not set!*\n\n📌 Add to .env:\n\`CLIPDROP_API_KEY=your_key\`\n\n🔗 Free key: https://clipdrop.co/apis\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🔭 *Enhancing image quality...*\n🤖 AI upscaling to HD\n⏳ Please wait 15-30 seconds...`,
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

      const resultBuffer = await upscaleImage(buffer);

      await sock.sendMessage(from, {
        image  : resultBuffer,
        caption: `✅ *Image Enhanced to HD!*

👋 *Requested by:* +${senderNum}
🤖 *Powered by:* ClipDrop AI
📊 *Scale:* 4x HD Enhancement

${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UPSCALER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Image upscaling failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
