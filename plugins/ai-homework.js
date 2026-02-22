/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Homework Plugin    ┃
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

const GROQ_KEY   = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY = process.env.GEMINI_API_KEY  || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY  || '';

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

// ─── AI Request — tries Groq first (fastest/free), then Gemini, then OpenAI ──
async function askAI(prompt, timeoutMs = 30000) {
  // ── Try Groq (llama3-70b — free & fast) ──────────────────────
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
            { role: 'system', content: 'You are a helpful homework and study assistant. Provide clear, step-by-step solutions. Keep answers concise but complete. Support both English and Urdu languages.' },
            { role: 'user',   content: prompt },
          ],
          max_tokens : 1500,
          temperature: 0.3,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.choices?.[0]?.message?.content || null;
      }
    } catch { /* fallthrough */ }
  }

  // ── Try Gemini ────────────────────────────────────────────────
  if (GEMINI_KEY) {
    try {
      const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`);
      url.searchParams.set('key', GEMINI_KEY);
      if (url.hostname !== 'generativelanguage.googleapis.com') throw new Error('Invalid hostname.');
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url.toString(), {
        method : 'POST',
        signal : controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          contents: [{ parts: [{ text: `You are a homework helper. Answer clearly and step by step.\n\n${prompt}` }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.3 },
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch { /* fallthrough */ }
  }

  // ── Try OpenAI ────────────────────────────────────────────────
  if (OPENAI_KEY) {
    try {
      const url = new URL('https://api.openai.com/v1/chat/completions');
      if (url.hostname !== 'api.openai.com') throw new Error('Invalid hostname.');
      const controller = new AbortController();
      const timer      = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(url.toString(), {
        method : 'POST',
        signal : controller.signal,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
        body   : JSON.stringify({
          model      : 'gpt-4o-mini',
          messages   : [
            { role: 'system', content: 'You are a homework helper. Answer step by step. Support English and Urdu.' },
            { role: 'user',   content: prompt },
          ],
          max_tokens : 1500,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.choices?.[0]?.message?.content || null;
      }
    } catch { /* fallthrough */ }
  }

  throw new Error('No AI API key set. Add GROQ_API_KEY, GEMINI_API_KEY or OPENAI_API_KEY to .env');
}

// ─── Detect subject ───────────────────────────────────────────────────────────
function detectSubject(text) {
  const lower = text.toLowerCase();
  if (/math|plus|minus|equation|حساب|ریاضی|\d+\s*[+\-*/]/.test(lower)) return '📐 Mathematics';
  if (/physics|force|energy|فزکس|طبیعیات/.test(lower))                   return '⚡ Physics';
  if (/chemistry|atom|molecule|کیمیا/.test(lower))                        return '🧪 Chemistry';
  if (/biology|cell|dna|جیوالوجی|حیاتیات/.test(lower))                   return '🧬 Biology';
  if (/history|تاریخ|mughal|british/.test(lower))                         return '📜 History';
  if (/english|grammar|essay|writing/.test(lower))                        return '✍️ English';
  if (/urdu|اردو|شاعری|مضمون/.test(lower))                               return '📖 Urdu';
  if (/computer|programming|code|کوڈ/.test(lower))                        return '💻 Computer';
  if (/islamic|quran|hadith|اسلام/.test(lower))                           return '☪️ Islamic Studies';
  return '📚 General';
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['homework', 'hw', 'solve', 'sawal', 'سوال', 'ghar'],
  name       : 'ai-homework',
  category   : 'AI',
  description: 'AI-powered homework and study helper',
  usage      : '.homework <your question>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📚');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide your homework question!*

📌 *Usage:* ${CONFIG.PREFIX}homework <question>

💡 *Examples:*
▸ \`${CONFIG.PREFIX}hw What is photosynthesis?\`
▸ \`${CONFIG.PREFIX}hw 2x + 5 = 15 solve karo\`
▸ \`${CONFIG.PREFIX}hw Mughal empire ke baare mein batao\`
▸ \`${CONFIG.PREFIX}hw Newton ka pehla qanoon kya hai\`

📚 *Subjects Supported:*
│ 📐 Mathematics  ⚡ Physics
│ 🧪 Chemistry   🧬 Biology
│ 📜 History     ✍️ English
│ 📖 Urdu        💻 Computer Science
│ ☪️ Islamic Studies

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const subject = detectSubject(text);

      await sock.sendMessage(from, {
        text: `📚 *Solving your question...*\n📖 Subject: ${subject}\n⏳ Please wait...`,
      }, { quoted: msg });

      const answer = await askAI(
        `Subject: ${subject}\nQuestion: ${text}\n\nProvide a clear, step-by-step answer. If it's a math problem, show all working steps. Keep it student-friendly.`
      );

      if (!answer) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not get answer!*\n\n💡 Try again or rephrase.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // Truncate if too long
      const truncated = answer.length > 3000
        ? answer.substring(0, 2900) + '\n\n_...Answer truncated. Ask for more details._'
        : answer;

      const hwMsg = `╭━━━『 📚 *AI HOMEWORK SOLVER* 』━━━╮

👋 *Requested by:* +${senderNum}
📖 *Subject:* ${subject}

╭─『 ❓ *Question* 』
│ ${text.length > 100 ? text.substring(0, 100) + '...' : text}
╰──────────────────────────

╭─『 ✅ *Answer* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 💡 *More AI Commands* 』
│ \`${CONFIG.PREFIX}translate\` → Translate text
│ \`${CONFIG.PREFIX}ai\`        → General AI chat
│ \`${CONFIG.PREFIX}codefixer\` → Fix code errors
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: hwMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[HOMEWORK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Homework solver failed!*\n\n⚠️ ${error.message}\n\n💡 Add GROQ_API_KEY to .env (free)\n🔗 https://console.groq.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
