/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Remini Enhancer       ┃
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

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally { clearTimeout(timer); }
}

async function enhanceImage(imageBuffer) {
  // Using Remini API via RapidAPI
  const RAPID_KEY = process.env.RAPIDAPI_KEY || '';

  if (!RAPID_KEY) throw new Error('RAPIDAPI_KEY not set in .env\n🔗 Get free key: rapidapi.com');

  const url = new URL('https://ai-picture-upscaler.p.rapidapi.com/upscale-picture');
  if (url.hostname !== 'ai-picture-upscaler.p.rapidapi.com') throw new Error('Invalid hostname.');

  const base64 = imageBuffer.toString('base64');
  const res    = await fetchWithTimeout(url.toString(), {
    method : 'POST',
    headers: {
      'Content-Type'      : 'application/json',
      'X-RapidAPI-Key'    : RAPID_KEY,
      'X-RapidAPI-Host'   : 'ai-picture-upscaler.p.rapidapi.com',
    },
    body: JSON.stringify({ image: base64, scale: 2 }),
  });

  if (!res.ok) throw new Error(`Enhance API error: ${res.status}`);
  const data = await res.json();

  const resultBase64 = data?.output || data?.image || data?.result || null;
  if (!resultBase64) throw new Error('No output from API');

  return Buffer.from(resultBase64, 'base64');
}

export default {
  command    : ['remini', 'enhance', 'hd', 'sharpen'],
  name       : 'tool-remini',
  category   : 'Tools',
  description: 'Enhance photo quality using AI (Remini-style)',
  usage      : '.remini [reply to image]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('✨');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Please reply to an image!*\n\n📌 *Usage:* Reply to any image with \`${CONFIG.PREFIX}remini\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `✨ *Enhancing your photo...*\n🤖 AI Processing\n⏳ Please wait 15-30 seconds...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new Error('Could not download image!');

      const enhanced = await enhanceImage(buffer);

      await sock.sendMessage(from, {
        image  : enhanced,
        caption: `✅ *Photo Enhanced!*

👋 *Requested by:* +${senderNum}
🤖 *Powered by:* AI Enhancer
📊 *Original:* ${(buffer.length / 1024).toFixed(0)} KB
📈 *Enhanced:* ${(enhanced.length / 1024).toFixed(0)} KB

${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[REMINI ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Enhancement failed!*\n⚠️ ${error.message}\n\n💡 Add RAPIDAPI_KEY to .env\n🔗 rapidapi.com (free tier available)\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
