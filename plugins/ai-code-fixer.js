/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Code Fixer Plugin  ┃
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

const GROQ_KEY   = process.env.GROQ_API_KEY  || '';
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
          model    : 'llama3-70b-8192',
          messages : [
            { role: 'system', content: 'You are an expert code reviewer and debugger. Find bugs, explain what is wrong, and provide the corrected code. Be concise but thorough.' },
            { role: 'user',   content: prompt },
          ],
          max_tokens : 2000,
          temperature: 0.2,
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
          generationConfig: { maxOutputTokens: 2000, temperature: 0.2 },
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
      }
    } catch { /* fallthrough */ }
  }

  throw new Error('No AI API key set. Add GROQ_API_KEY to .env (free: console.groq.com)');
}

// ─── Detect language ──────────────────────────────────────────────────────────
function detectLang(code) {
  if (/import|export|const|let|async|await|\.js/.test(code)) return 'JavaScript';
  if (/def |import |print\(|\.py/.test(code))                return 'Python';
  if (/public class|System\.out|\.java/.test(code))          return 'Java';
  if (/#include|int main|cout|\.cpp/.test(code))             return 'C++';
  if (/<\?php|echo |\.php/.test(code))                       return 'PHP';
  if (/<html|<div|<body/.test(code))                         return 'HTML';
  if (/SELECT|INSERT|UPDATE|DELETE/.test(code))              return 'SQL';
  if (/func |var |println/.test(code))                       return 'Go';
  return 'Unknown';
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['codefixer', 'fixcode', 'debug', 'codefix', 'کوڈ'],
  name       : 'ai-code-fixer',
  category   : 'AI',
  description: 'Fix programming errors with AI',
  usage      : '.codefixer <your code or error>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💻');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide code or error message!*

📌 *Usage:* ${CONFIG.PREFIX}codefixer <code/error>

💡 *Examples:*
▸ Paste your broken code
▸ Share your error message
▸ Ask: "how to fix undefined is not a function"

🖥️ *Languages Supported:*
│ JavaScript  Python   Java
│ C++         PHP      HTML
│ SQL         Go       + More

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const detectedLang = detectLang(text);

      await sock.sendMessage(from, {
        text: `💻 *Analyzing code...*\n🔍 Language: ${detectedLang}\n⏳ Please wait...`,
      }, { quoted: msg });

      const answer = await askAI(
        `Language: ${detectedLang}\n\nCode/Error:\n${text}\n\nPlease:\n1. Identify what is wrong\n2. Explain the bug clearly\n3. Provide the corrected code\n4. Give tips to avoid this error`
      );

      if (!answer) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not analyze code!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const truncated = answer.length > 3000
        ? answer.substring(0, 2900) + '\n\n_...Truncated. Ask for more details._'
        : answer;

      const fixMsg = `╭━━━『 💻 *AI CODE FIXER* 』━━━╮

👋 *Requested by:* +${senderNum}
🖥️ *Language:* ${detectedLang}

╭─『 🔴 *Your Code/Error* 』
│ ${text.length > 80 ? text.substring(0, 80) + '...' : text}
╰──────────────────────────

╭─『 ✅ *AI Analysis & Fix* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: fixMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[CODE-FIXER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Code fixer failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
