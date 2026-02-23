/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — TTS Urdu Plugin       ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';

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

async function textToSpeech(text, lang = 'ur') {
  // Google TTS (free)
  const url = new URL('https://translate.google.com/translate_tts');
  url.searchParams.set('ie',     'UTF-8');
  url.searchParams.set('tl',     lang);
  url.searchParams.set('q',      text.substring(0, 200));
  url.searchParams.set('client', 'tw-ob');
  if (url.hostname !== 'translate.google.com') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), {
      signal : controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`TTS error: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally { clearTimeout(timer); }
}

const LANG_CODES = {
  urdu   : 'ur', english: 'en', hindi  : 'hi',
  arabic : 'ar', punjabi: 'pa', sindhi : 'sd',
  persian: 'fa', turkish: 'tr',
};

export default {
  command    : ['tts', 'speak', 'voice', 'say'],
  name       : 'tool-tts-urdu',
  category   : 'Tools',
  description: 'Convert text to speech in Urdu/English/Arabic',
  usage      : '.tts [lang] <text>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎙️');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 🎙️ *TEXT TO SPEECH* 』━━━╮

📌 *Usage:*
\`${CONFIG.PREFIX}tts <text>\`
\`${CONFIG.PREFIX}tts english Hello World\`
\`${CONFIG.PREFIX}tts arabic بِسْمِ اللهِ\`

🌍 *Languages:*
│ urdu english hindi arabic
│ punjabi sindhi persian turkish

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Parse language ────────────────────────────────────
      const words    = input.split(' ');
      const firstW   = words[0].toLowerCase();
      const langCode = LANG_CODES[firstW];
      const lang     = langCode || 'ur';
      const ttsText  = langCode ? words.slice(1).join(' ') : input;

      if (!ttsText.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide text!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🎙️ *Generating audio...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const audioBuffer = await textToSpeech(ttsText, lang);

      await sock.sendMessage(from, {
        audio   : audioBuffer,
        mimetype: 'audio/mpeg',
        ptt     : true,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *Audio Generated!*\n👋 +${senderNum}\n🌍 Language: ${firstW || 'urdu'}\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[TTS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *TTS failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
