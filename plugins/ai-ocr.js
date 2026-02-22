/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI OCR Plugin       ┃
┃        Created by MR YOUSAF BALOCH       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }         from '../config.js';
import { downloadMediaMessage }  from '@whiskeysockets/baileys';
import { writeFile, unlink }     from 'fs/promises';
import { join }                  from 'path';
import { tmpdir }                from 'os';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

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

// ─── OCR via Gemini Vision ────────────────────────────────────────────────────
async function ocrWithGemini(imageBuffer, timeoutMs = 30000) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not set in .env');

  const base64Image = imageBuffer.toString('base64');
  const url         = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
  url.searchParams.set('key', GEMINI_KEY);
  if (url.hostname !== 'generativelanguage.googleapis.com') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method : 'POST',
      signal : controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        contents: [{
          parts: [
            { text: 'Extract ALL text from this image. If Urdu text is present, include it as-is. Return only the extracted text, nothing else.' },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
          ],
        }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0 },
      }),
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } finally {
    clearTimeout(timer);
  }
}

// ─── OCR via free OCR.space API ───────────────────────────────────────────────
async function ocrWithOCRSpace(imageBuffer, timeoutMs = 30000) {
  const url = new URL('https://api.ocr.space/parse/image');
  if (url.hostname !== 'api.ocr.space') throw new Error('Invalid hostname.');

  const FormData = (await import('form-data')).default;
  const form     = new FormData();
  form.append('file',        imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
  form.append('apikey',      'helloworld'); // Free demo key
  form.append('language',    'ara');        // Arabic supports Urdu
  form.append('isOverlayRequired', 'false');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method : 'POST',
      signal : controller.signal,
      body   : form,
      headers: form.getHeaders(),
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`OCR.space error: ${res.status}`);
    const data = await res.json();
    return data?.ParsedResults?.[0]?.ParsedText || '';
  } finally {
    clearTimeout(timer);
  }
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['ocr', 'readtext', 'imagetext', 'scan', 'سکین'],
  name       : 'ai-ocr',
  category   : 'AI',
  description: 'Extract text from images (supports Urdu)',
  usage      : '.ocr [reply to image]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔍');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Check for image ───────────────────────────────────────
      const quoted  = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg  = msg.message?.imageMessage
        || quoted?.imageMessage
        || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Please send or reply to an image!*

📌 *How to use:*
1. Send an image with caption: ${CONFIG.PREFIX}ocr
2. OR reply to an image with: ${CONFIG.PREFIX}ocr

💡 *Use cases:*
▸ Extract Urdu text from images
▸ Read text from screenshots
▸ Copy text from photos
▸ Scan documents

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🔍 *Reading text from image...*\n⏳ Please wait...`,
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
          text: `❌ *Could not download image!*\n\n💡 Try again.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Try Gemini first, then OCR.space ─────────────────────
      let extractedText = '';
      let method        = '';

      if (GEMINI_KEY) {
        try {
          extractedText = await ocrWithGemini(buffer);
          method        = 'Gemini Vision AI';
        } catch (e) {
          console.error('[OCR Gemini fail]:', e.message);
        }
      }

      if (!extractedText && !GEMINI_KEY) {
        try {
          extractedText = await ocrWithOCRSpace(buffer);
          method        = 'OCR.space (Free)';
        } catch (e) {
          console.error('[OCR Space fail]:', e.message);
        }
      }

      if (!extractedText || extractedText.trim().length < 3) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No text found in image!*\n\n💡 Make sure the image has clear, readable text.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const ocrMsg = `╭━━━『 🔍 *AI TEXT SCANNER* 』━━━╮

👋 *Requested by:* +${senderNum}
🤖 *Method:* ${method}

╭─『 📄 *Extracted Text* 』
│
${extractedText.split('\n').slice(0, 30).map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 📊 *Stats* 』
│ 📝 *Characters:* ${extractedText.length}
│ 📖 *Lines:* ${extractedText.split('\n').length}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: ocrMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[OCR ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *OCR failed!*\n⚠️ ${error.message}\n\n💡 Add GEMINI_API_KEY to .env for best results.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
