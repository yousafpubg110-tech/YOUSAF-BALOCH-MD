/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Resume Builder      ┃
┃        Created by MR YOUSAF BALOCH          ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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
            { role: 'system', content: 'You are a professional CV/Resume writer. Create well-structured, ATS-friendly resumes. Format clearly with sections.' },
            { role: 'user',   content: prompt },
          ],
          max_tokens : 2000,
          temperature: 0.4,
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
          generationConfig: { maxOutputTokens: 2000, temperature: 0.4 },
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
  command    : ['resume', 'cv', 'cvmaker', 'resumebuilder', 'سی وی'],
  name       : 'ai-resume-builder',
  category   : 'AI',
  description: 'AI-powered professional CV/Resume maker',
  usage      : '.resume <your info>',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📄');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `📄 *AI Resume Builder — How to use:*

📌 *Usage:* ${CONFIG.PREFIX}resume <your details>

💡 *Example — Type like this:*

\`${CONFIG.PREFIX}resume
Name: Muhammad Ali
Age: 25
Education: BS Computer Science, FAST University
Skills: Python, JavaScript, React, Node.js
Experience: 2 years web developer at XYZ Company
Languages: Urdu, English
Job Target: Senior Software Engineer\`

✅ AI will generate a professional CV for you!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📄 *Building your professional CV...*\n⏳ Please wait 10-15 seconds...`,
      }, { quoted: msg });

      const resume = await askAI(
        `Create a professional, ATS-friendly CV/Resume based on this information:\n\n${text}\n\nFormat it with clear sections:\n- Personal Info\n- Professional Summary\n- Education\n- Work Experience\n- Skills\n- Languages\n- References (if available)\n\nMake it look professional and suitable for job applications in Pakistan.`
      );

      if (!resume) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not generate CV!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const truncated = resume.length > 3000
        ? resume.substring(0, 2900) + '\n\n_...Send more details for complete CV._'
        : resume;

      const cvMsg = `╭━━━『 📄 *AI RESUME BUILDER* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 ✅ *Your Professional CV* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 💡 *Tip* 』
│ Copy this CV and format in MS Word
│ or Google Docs for better design!
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: cvMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[RESUME ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Resume builder failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
