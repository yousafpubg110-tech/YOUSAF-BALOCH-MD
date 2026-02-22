/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Translator Plugin  ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

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

// ─── Supported Languages ──────────────────────────────────────────────────────
const LANGUAGES = {
  urdu       : { code: 'ur', flag: '🇵🇰', name: 'Urdu'       },
  english    : { code: 'en', flag: '🇬🇧', name: 'English'    },
  arabic     : { code: 'ar', flag: '🇸🇦', name: 'Arabic'     },
  hindi      : { code: 'hi', flag: '🇮🇳', name: 'Hindi'      },
  french     : { code: 'fr', flag: '🇫🇷', name: 'French'     },
  spanish    : { code: 'es', flag: '🇪🇸', name: 'Spanish'    },
  chinese    : { code: 'zh', flag: '🇨🇳', name: 'Chinese'    },
  russian    : { code: 'ru', flag: '🇷🇺', name: 'Russian'    },
  turkish    : { code: 'tr', flag: '🇹🇷', name: 'Turkish'    },
  german     : { code: 'de', flag: '🇩🇪', name: 'German'     },
  japanese   : { code: 'ja', flag: '🇯🇵', name: 'Japanese'   },
  korean     : { code: 'ko', flag: '🇰🇷', name: 'Korean'     },
  persian    : { code: 'fa', flag: '🇮🇷', name: 'Persian'    },
  portuguese : { code: 'pt', flag: '🇧🇷', name: 'Portuguese' },
  italian    : { code: 'it', flag: '🇮🇹', name: 'Italian'    },
  punjabi    : { code: 'pa', flag: '🇵🇰', name: 'Punjabi'    },
  sindhi     : { code: 'sd', flag: '🇵🇰', name: 'Sindhi'     },
  pashto     : { code: 'ps', flag: '🇵🇰', name: 'Pashto'     },
};

// ─── Detect target language from input ────────────────────────────────────────
function detectLang(input) {
  const lower = (input || '').toLowerCase();
  for (const [key, lang] of Object.entries(LANGUAGES)) {
    if (lower.startsWith(key) || lower.startsWith(lang.code)) {
      return lang;
    }
  }
  return null;
}

// ─── Translate using Google Translate (free) ──────────────────────────────────
async function translateText(text, targetLang, timeoutMs = 15000) {
  // ✅ CodeQL Fix: URL() for safe construction
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl',     'auto');
  url.searchParams.set('tl',     targetLang);
  url.searchParams.set('dt',     't');
  url.searchParams.set('q',      text);

  if (url.hostname !== 'translate.googleapis.com') {
    throw new Error('Invalid translation hostname.');
  }

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`Translation API error: ${res.status}`);
    const data = await res.json();

    // Google returns nested array — extract translated text
    const translated = data?.[0]
      ?.map(item => item?.[0])
      ?.filter(Boolean)
      ?.join('') || '';

    // Detect source language
    const sourceLang = data?.[2] || 'auto';

    return { translated, sourceLang };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['translate', 'tr', 'tarjuma', 'ترجمہ', 'lang'],
  name       : 'ai-translator',
  category   : 'AI',
  description: 'Translate text to any language',
  usage      : '.translate <language> <text>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🌍');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Validate input ────────────────────────────────────────
      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide language and text!*

📌 *Usage:*
\`${CONFIG.PREFIX}translate <language> <text>\`

💡 *Examples:*
▸ \`${CONFIG.PREFIX}translate urdu Hello how are you\`
▸ \`${CONFIG.PREFIX}translate arabic Good morning\`
▸ \`${CONFIG.PREFIX}translate hindi Pakistan zindabad\`
▸ \`${CONFIG.PREFIX}translate english میں ٹھیک ہوں\`

🌍 *Supported Languages:*
│ 🇵🇰 urdu    🇬🇧 english  🇸🇦 arabic
│ 🇮🇳 hindi   🇫🇷 french   🇪🇸 spanish
│ 🇨🇳 chinese 🇷🇺 russian  🇹🇷 turkish
│ 🇩🇪 german  🇯🇵 japanese 🇰🇷 korean
│ 🇮🇷 persian 🇧🇷 portuguese

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Parse language + text ─────────────────────────────────
      const parts  = text.trim().split(' ');
      const lang   = detectLang(parts[0]);
      let inputText = '';

      if (lang) {
        inputText = parts.slice(1).join(' ');
      } else {
        // No language given — default to English
        inputText = text.trim();
      }

      const targetLang = lang || LANGUAGES.english;

      if (!inputText.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide text to translate!*\n\n📌 Usage: ${CONFIG.PREFIX}translate ${targetLang.name.toLowerCase()} <your text>\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Loading message ───────────────────────────────────────
      await sock.sendMessage(from, {
        text: `🌍 *Translating...*\n🎯 Target: ${targetLang.flag} ${targetLang.name}\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Translate ─────────────────────────────────────────────
      const { translated, sourceLang } = await translateText(inputText, targetLang.code);

      if (!translated) {
        return await sock.sendMessage(from, {
          text: `❌ *Translation failed!*\n\n💡 Try again.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Find source lang name ─────────────────────────────────
      const srcLangEntry = Object.values(LANGUAGES).find(l => l.code === sourceLang);
      const srcDisplay   = srcLangEntry
        ? `${srcLangEntry.flag} ${srcLangEntry.name}`
        : `🌐 Auto-detected (${sourceLang})`;

      const translateMsg = `╭━━━『 🌍 *AI TRANSLATOR* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📝 *Original Text* 』
│ 🌐 *Language:* ${srcDisplay}
│
│ ${inputText}
╰──────────────────────────

╭─『 ✅ *Translation* 』
│ ${targetLang.flag} *Language:* ${targetLang.name}
│
│ ${translated}
╰──────────────────────────

╭─『 🌍 *More Languages* 』
│ \`${CONFIG.PREFIX}tr urdu <text>\`     → 🇵🇰 Urdu
│ \`${CONFIG.PREFIX}tr arabic <text>\`   → 🇸🇦 Arabic
│ \`${CONFIG.PREFIX}tr english <text>\`  → 🇬🇧 English
│ \`${CONFIG.PREFIX}tr hindi <text>\`    → 🇮🇳 Hindi
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: translateMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[TRANSLATOR ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Translation failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
