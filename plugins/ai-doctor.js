/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Doctor Plugin    ┃
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
              content: 'You are a medical information assistant. Provide general health information and home remedies. ALWAYS remind users to consult a real doctor for serious conditions. Never diagnose definitively. Support English and Urdu.',
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
  command    : ['doctor', 'doc', 'health', 'bimari', 'دوائی', 'علاج'],
  name       : 'ai-doctor',
  category   : 'AI',
  description: 'AI health advisor — symptoms and home remedies',
  usage      : '.doctor <symptoms>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏥');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `🏥 *AI Health Advisor*

📌 *Usage:* ${CONFIG.PREFIX}doctor <symptoms>

💡 *Examples:*
▸ \`${CONFIG.PREFIX}doctor sir dard aur bukhaar hai\`
▸ \`${CONFIG.PREFIX}doctor I have fever and cold\`
▸ \`${CONFIG.PREFIX}doctor pet mein dard\`
▸ \`${CONFIG.PREFIX}doctor khansee nahi ruk rahi\`

⚠️ *Disclaimer:*
│ This is general information only.
│ Always consult a real doctor
│ for serious health issues.

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🏥 *Analyzing symptoms...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const advice = await askAI(
        `Patient symptoms: ${text}\n\nPlease provide:\n1. Possible causes (general)\n2. Home remedies and self-care tips\n3. When to see a doctor immediately\n4. Precautions\n\nIMPORTANT: Always remind to consult a real doctor. Do not provide definitive diagnosis.`
      );

      if (!advice) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not get health advice!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const truncated = advice.length > 2500
        ? advice.substring(0, 2400) + '\n\n_...Consult a doctor for more._'
        : advice;

      const doctorMsg = `╭━━━『 🏥 *AI HEALTH ADVISOR* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 🤒 *Symptoms* 』
│ ${text.length > 80 ? text.substring(0, 80) + '...' : text}
╰──────────────────────────

╭─『 💊 *Health Advice* 』
│
${truncated.split('\n').map(l => `│ ${l}`).join('\n')}
│
╰──────────────────────────

╭─『 ⚠️ *Disclaimer* 』
│ This is general info only.
│ Please consult a real doctor
│ for proper diagnosis!
│ 🏥 Nearest hospital: 1122 (Pakistan)
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: doctorMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[DOCTOR ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Health advisor failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
