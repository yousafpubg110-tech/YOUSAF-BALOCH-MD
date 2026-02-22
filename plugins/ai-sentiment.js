/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — AI Sentiment Plugin    ┃
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

const GROQ_KEY = process.env.GROQ_API_KEY || '';

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

// ─── Simple local sentiment (no API needed) ───────────────────────────────────
function localSentiment(text) {
  const lower = text.toLowerCase();

  const positiveWords = [
    'happy', 'good', 'great', 'excellent', 'love', 'amazing', 'wonderful',
    'خوش', 'اچھا', 'بہترین', 'محبت', 'زبردست', 'مزہ', 'شکریہ',
    'alhamdulillah', 'masha allah', 'nice', 'beautiful', 'awesome',
    'khush', 'acha', 'zabardast', 'mast', 'shukriya',
  ];

  const negativeWords = [
    'sad', 'bad', 'terrible', 'hate', 'awful', 'horrible', 'worst',
    'اداس', 'برا', 'نفرت', 'مصیبت', 'تکلیف', 'رونا', 'غصہ',
    'dukh', 'bura', 'nafrat', 'ghussa', 'takleef', 'rona', 'problem',
    'cry', 'angry', 'upset', 'worried', 'stress', 'depressed',
  ];

  const neutralWords = [
    'okay', 'fine', 'normal', 'ठीक', 'theek', 'thik', 'normal', 'usually',
  ];

  let posScore = 0;
  let negScore = 0;

  for (const word of positiveWords) {
    if (lower.includes(word)) posScore += 1;
  }
  for (const word of negativeWords) {
    if (lower.includes(word)) negScore += 1;
  }

  const total = posScore + negScore;
  if (total === 0) return { mood: 'Neutral 😐', score: 50, emoji: '😐', color: '🟡' };

  const posPercent = Math.round((posScore / total) * 100);

  if (posPercent >= 70) return { mood: 'Very Happy 😄',    score: posPercent, emoji: '😄', color: '🟢' };
  if (posPercent >= 50) return { mood: 'Happy 🙂',          score: posPercent, emoji: '🙂', color: '🟢' };
  if (posPercent >= 40) return { mood: 'Neutral 😐',        score: 50,         emoji: '😐', color: '🟡' };
  if (posPercent >= 20) return { mood: 'Sad 😢',            score: posPercent, emoji: '😢', color: '🔴' };
  return                       { mood: 'Very Sad 😭',        score: posPercent, emoji: '😭', color: '🔴' };
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['mood', 'sentiment', 'feeling', 'analyze', 'موڈ'],
  name       : 'ai-sentiment',
  category   : 'AI',
  description: 'Detect mood and sentiment from text',
  usage      : '.mood <text>',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎭');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `🎭 *AI Mood Detector*

📌 *Usage:* ${CONFIG.PREFIX}mood <text>

💡 *Examples:*
▸ \`${CONFIG.PREFIX}mood I am very happy today!\`
▸ \`${CONFIG.PREFIX}mood main bahut udaas hoon\`
▸ \`${CONFIG.PREFIX}mood آج بہت اچھا لگ رہا ہے\`
▸ \`${CONFIG.PREFIX}mood life is so stressful\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const result    = localSentiment(text);
      const wordCount = text.trim().split(/\s+/).length;

      // ── Mood bar ────────────────────────────────────────────────
      const barFilled = Math.round(result.score / 10);
      const barEmpty  = 10 - barFilled;
      const moodBar   = '█'.repeat(barFilled) + '░'.repeat(barEmpty);

      const sentimentMsg = `╭━━━『 🎭 *AI MOOD DETECTOR* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📝 *Input Text* 』
│ ${text.length > 80 ? text.substring(0, 80) + '...' : text}
│ 📊 *Words:* ${wordCount}
╰──────────────────────────

╭─『 🎭 *Mood Analysis* 』
│ ${result.color} *Mood:*    ${result.mood}
│ 📊 *Score:*   ${result.score}%
│ 🎯 *Meter:*   ${moodBar}
╰──────────────────────────

╭─『 💡 *Mood Key* 』
│ 🟢 70-100% → Happy / Positive
│ 🟡 40-69%  → Neutral
│ 🔴 0-39%   → Sad / Negative
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: sentimentMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react(result.emoji);

    } catch (error) {
      console.error('[SENTIMENT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Mood detection failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
