/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Khuwab Plugin     ┃
┃        Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

const GROQ_KEY   = process.env.GROQ_API_KEY  || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

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

// ─── AI Request ───────────────────────────────────────────────────────────────
async function askAI(prompt, timeoutMs = 30000) {
  if (GROQ_KEY) {
    try {
      const url = new URL('https://api.groq.com/openai/v1/chat/completions');
      if (url.hostname !== 'api.groq.com') throw new Error('Invalid hostname.');
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url.toString(), {
        method : 'POST',
        signal : controller.signal,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body   : JSON.stringify({
          model      : 'llama3-70b-8192',
          messages   : [
            {
              role   : 'system',
              content: 'You are an Islamic dream interpreter (Tabeer-ul-Ruya). Interpret dreams based on Islamic traditions and Ibn Sirin\'s classical dream interpretation. Provide interpretations in a respectful, Islamic manner. Support both Urdu and English.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens : 1200,
          temperature: 0.5,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.choices?.[0]?.message?.content || null;
      }
    } catch { /* fallthrough */ }
  }

  if (GEMINI_KEY) {
    try {
      const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
      url.searchParams.set('key', GEMINI_KEY);
      if (url.hostname !== 'generativelanguage.googleapis.com') throw new Error('Invalid hostname.');
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url.toString(), {
        method : 'POST',
        signal : controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.5 },
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch { /* fallthrough */ }
  }

  throw new Error('No AI key set. Add GROQ_API_KEY to .env');
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['khuwab', 'dream', 'tabeer', 'خواب', 'تعبیر'],
  name       : 'ai-khuwab',
  category   : 'AI',
  description: 'Islamic dream interpretation — Tabeer-ul-Ruya',
  usage      : '.khuwab <describe your dream>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🌙');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `🌙 *خواب کی تعبیر — AI Tabeer*

📌 *Usage:* ${CONFIG.PREFIX}khuwab <apna khuwab likhein>

💡 *Examples:*
▸ \`${CONFIG.PREFIX}khuwab Maine sapne mein saanp dekha\`
▸ \`${CONFIG.PREFIX}khuwab I saw myself flying\`
▸ \`${CONFIG.PREFIX}khuwab خواب میں پانی دیکھا\`
▸ \`${CONFIG.PREFIX}khuwab main kaaba dekh raha tha\`

☪️ *Based on:*
│ Ibn Sirin's dream interpretations
│ Islamic traditions & Hadith

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🌙 *Interpreting your dream...*\n☪️ Based on Islamic traditions\n⏳ Please wait...`,
      }, { quoted: msg });

      const tabeer = await askAI(
        `Dream to interpret: ${text}\n\nProvide Islamic interpretation based on Ibn Sirin and classical Islamic dream interpretation. Include:\n1. Main interpretation\n2. Possible meanings\n3. Islamic context\n4. Dua or advice if relevant\n\nNote: Be respectful and remind that only Allah knows the true meaning of dreams.`
      );

      if (!tabeer) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not interpret dream!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const truncated = tabeer.length > 2000
        ? tabeer.substring(0, 1900) + '\n\n_...اللہ بہتر جانتا ہے۔_'
        : tabeer;

      const khuwabMsg = `╭━━━『 🌙 *خواب کی تعبیر* 』━━━╮

👋 *Requested by:* +${senderNum}
☪️ *Based on:* Ibn Sirin & Islamic Traditions

╭─『 💭 *Apka Khuwab* 』
│ ${text.length > 80 ? text.substring(0, 80) + '...' : text}
╰──────────────────────────

╭─『 ✨ *Tabeer* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 ☪️ *Note* 』
│ خوابوں کی حقیقی تعبیر
│ صرف اللہ تعالیٰ جانتا ہے۔
│ *بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: khuwabMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[KHUWAB ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Tabeer failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
