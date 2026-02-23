/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — OCR Urdu Plugin       ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

async function ocrImage(imageBuffer, lang = 'urd+eng') {
  const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

  if (GEMINI_KEY) {
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
    url.searchParams.set('key', GEMINI_KEY);
    if (url.hostname !== 'generativelanguage.googleapis.com') throw new Error('Invalid hostname.');

    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url.toString(), {
        method : 'POST',
        signal : controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          contents: [{
            parts: [
              { text: 'Extract ALL text from this image. Include Urdu, English, or any other language text exactly as written. Return only the extracted text.' },
              { inline_data: { mime_type: 'image/jpeg', data: imageBuffer.toString('base64') } },
            ],
          }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0 },
        }),
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Gemini OCR error: ${res.status}`);
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } finally { clearTimeout(timer); }
  }

  throw new Error('GEMINI_API_KEY not set in .env');
}

export default {
  command    : ['ocr', 'readtext', 'urduscan', 'scan'],
  name       : 'tool-ocr-urdu',
  category   : 'Tools',
  description: 'Extract Urdu/English text from images',
  usage      : '.ocr [reply to image]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔍');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to an image!*\n\n📌 Usage: Reply to image with \`${CONFIG.PREFIX}ocr\`\n✅ Supports: Urdu + English text\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🔍 *Reading text from image...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const text = await ocrImage(buffer);
      if (!text?.trim()) throw new Error('No text found in image');

      await sock.sendMessage(from, {
        text: `╭━━━『 🔍 *OCR RESULT* 』━━━╮

👋 *Requested by:* +${senderNum}
📝 *Characters:* ${text.length}

╭─『 📄 *Extracted Text* 』
│
${text.split('\n').slice(0, 30).map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[OCR ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *OCR failed!*\n⚠️ ${error.message}\n\n💡 Add GEMINI_API_KEY to .env\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
