/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Lawyer Plugin    ┃
┃        Created by MR YOUSAF BALOCH       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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
              content: 'You are a legal information assistant familiar with Pakistani law. Provide general legal information and guidance. ALWAYS remind users to consult a qualified lawyer for legal matters. Support English and Urdu.',
            },
            { role: 'user', content: prompt },
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

  throw new Error('No AI key set. Add GROQ_API_KEY to .env');
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['lawyer', 'law', 'legal', 'qanoon', 'قانون', 'وکیل'],
  name       : 'ai-lawyer',
  category   : 'AI',
  description: 'AI legal advisor for Pakistani law',
  usage      : '.lawyer <your legal question>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('⚖️');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `⚖️ *AI Legal Advisor*

📌 *Usage:* ${CONFIG.PREFIX}lawyer <legal question>

💡 *Examples:*
▸ \`${CONFIG.PREFIX}lawyer property dispute kaise hal karein\`
▸ \`${CONFIG.PREFIX}lawyer FIR kaise darj karein\`
▸ \`${CONFIG.PREFIX}lawyer tenant rights in Pakistan\`
▸ \`${CONFIG.PREFIX}lawyer divorce procedure Pakistan\`

📚 *Topics Covered:*
│ 🏠 Property Law    👨‍👩‍👧 Family Law
│ 📋 Contract Law    💼 Labor Law
│ 🚗 Traffic Laws    🏦 Banking Law
│ ⚖️ Criminal Law    🌐 Cyber Law

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `⚖️ *Analyzing legal question...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const advice = await askAI(
        `Legal question (Pakistan context): ${text}\n\nProvide:\n1. Relevant Pakistani laws/sections\n2. General legal guidance\n3. Steps to take\n4. Important rights to know\n5. When to hire a lawyer\n\nIMPORTANT: Always remind to consult a qualified lawyer.`
      );

      if (!advice) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not get legal advice!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const truncated = advice.length > 2500
        ? advice.substring(0, 2400) + '\n\n_...Consult a lawyer for complete advice._'
        : advice;

      const lawyerMsg = `╭━━━『 ⚖️ *AI LEGAL ADVISOR* 』━━━╮

👋 *Requested by:* +${senderNum}
🌍 *Jurisdiction:* Pakistan 🇵🇰

╭─『 ❓ *Legal Question* 』
│ ${text.length > 80 ? text.substring(0, 80) + '...' : text}
╰──────────────────────────

╭─『 ⚖️ *Legal Guidance* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 ⚠️ *Disclaimer* 』
│ This is general info only.
│ Consult a qualified lawyer
│ for proper legal advice!
│ 📞 Legal Aid: 042-99205690
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: lawyerMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[LAWYER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Legal advisor failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
