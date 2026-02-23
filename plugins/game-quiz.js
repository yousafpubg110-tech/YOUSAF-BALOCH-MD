/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Quiz Game Plugin      ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
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

// ─── Quiz questions database ──────────────────────────────────────────────────
const QUIZ_DB = {
  general: [
    { q: 'What is the capital of Pakistan?',     options: ['A) Karachi','B) Lahore','C) Islamabad','D) Peshawar'], answer: 'C', reward: 15 },
    { q: 'How many planets are in our solar system?', options: ['A) 7','B) 8','C) 9','D) 10'], answer: 'B', reward: 15 },
    { q: 'What is the largest ocean on Earth?',  options: ['A) Atlantic','B) Indian','C) Arctic','D) Pacific'], answer: 'D', reward: 15 },
    { q: 'Who invented the telephone?',          options: ['A) Edison','B) Tesla','C) Bell','D) Marconi'], answer: 'C', reward: 20 },
    { q: 'What is the chemical symbol for Gold?',options: ['A) Go','B) Gd','C) Au','D) Ag'], answer: 'C', reward: 20 },
    { q: 'Which country has the largest population?', options: ['A) USA','B) India','C) China','D) Russia'], answer: 'B', reward: 15 },
    { q: 'How many sides does a hexagon have?',  options: ['A) 5','B) 6','C) 7','D) 8'], answer: 'B', reward: 10 },
    { q: 'What is the speed of light (approx)?', options: ['A) 200,000 km/s','B) 300,000 km/s','C) 400,000 km/s','D) 500,000 km/s'], answer: 'B', reward: 25 },
  ],
  pakistan: [
    { q: 'In which year did Pakistan gain independence?', options: ['A) 1945','B) 1946','C) 1947','D) 1948'], answer: 'C', reward: 15 },
    { q: 'Who is the founder of Pakistan?',      options: ['A) Allama Iqbal','B) Liaquat Ali','C) Quaid-e-Azam','D) Fatima Jinnah'], answer: 'C', reward: 10 },
    { q: 'What is the national language of Pakistan?', options: ['A) Punjabi','B) Sindhi','C) Urdu','D) Pashto'], answer: 'C', reward: 10 },
    { q: 'Which river is the longest in Pakistan?', options: ['A) Chenab','B) Jhelum','C) Ravi','D) Indus'], answer: 'D', reward: 20 },
    { q: 'What is the national animal of Pakistan?', options: ['A) Lion','B) Snow Leopard','C) Markhor','D) Ibex'], answer: 'C', reward: 20 },
    { q: 'Where is K2 mountain located?',        options: ['A) KPK','B) Balochistan','C) Gilgit-Baltistan','D) AJK'], answer: 'C', reward: 25 },
  ],
  cricket: [
    { q: 'How many players are in a cricket team?', options: ['A) 9','B) 10','C) 11','D) 12'], answer: 'C', reward: 10 },
    { q: 'What is the highest score in ODI cricket?', options: ['A) 263','B) 264','C) 278','D) 290'], answer: 'B', reward: 25 },
    { q: 'Which country won the first Cricket World Cup?', options: ['A) Australia','B) England','C) West Indies','D) India'], answer: 'C', reward: 20 },
    { q: 'How many balls are in one over?',       options: ['A) 4','B) 5','C) 6','D) 8'], answer: 'C', reward: 10 },
    { q: 'Who has the most Test cricket centuries?', options: ['A) Ricky Ponting','B) Sachin Tendulkar','C) Virat Kohli','D) Steve Smith'], answer: 'B', reward: 20 },
  ],
  islam: [
    { q: 'How many pillars of Islam are there?', options: ['A) 4','B) 5','C) 6','D) 7'], answer: 'B', reward: 15 },
    { q: 'What is the holy book of Islam?',      options: ['A) Bible','B) Torah','C) Quran','D) Zaboor'], answer: 'C', reward: 10 },
    { q: 'How many Surahs are in the Quran?',    options: ['A) 110','B) 114','C) 116','D) 120'], answer: 'B', reward: 20 },
    { q: 'In which city was the Prophet Muhammad (PBUH) born?', options: ['A) Madina','B) Taif','C) Mecca','D) Jerusalem'], answer: 'C', reward: 15 },
    { q: 'How many times must Muslims pray daily?', options: ['A) 3','B) 4','C) 5','D) 6'], answer: 'C', reward: 10 },
  ],
};

// ─── Active quizzes ───────────────────────────────────────────────────────────
const activeQuizzes = new Map();

export default {
  command    : ['quiz', 'trivia', 'q'],
  name       : 'game-quiz',
  category   : 'Games',
  description: 'Quiz game with multiple categories',
  usage      : '.quiz [general/pakistan/cricket/islam]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('❓');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      // ── Check if answering A/B/C/D ────────────────────────
      const existing = activeQuizzes.get(from);
      if (existing && ['a','b','c','d'].includes(input)) {
        const elapsed = Math.round((Date.now() - existing.startedAt) / 1000);

        if (elapsed > 30) {
          activeQuizzes.delete(from);
          return await sock.sendMessage(from, {
            text: `⏰ *Time's up!*\n\n✅ *Answer was:* ${existing.answer}) ${existing.options.find(o => o.startsWith(existing.answer)).slice(3)}\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        if (input.toUpperCase() === existing.answer) {
          activeQuizzes.delete(from);
          await sock.sendMessage(from, {
            text: `╭━━━『 🏆 *CORRECT!* 』━━━╮

✅ *Right Answer!*
👋 *Winner:* +${senderNum}

╭─『 📊 *Result* 』
│ ❓ ${existing.q}
│ ✅ *Answer:* ${existing.answer}) ${existing.options.find(o => o.startsWith(existing.answer)).slice(3)}
│ ⏱️ *Time:*   ${elapsed}s
│ 💰 *Reward:* +${existing.reward} coins
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });
          if (typeof msg.react === 'function') await msg.react('🏆');
        } else {
          await sock.sendMessage(from, {
            text: `❌ *Wrong! Try again!*\n⏳ ${30 - elapsed}s remaining\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
        return;
      }

      // ── Start new quiz ────────────────────────────────────
      const categories = Object.keys(QUIZ_DB);
      const category   = categories.includes(input) ? input : categories[Math.floor(Math.random() * categories.length)];
      const pool       = QUIZ_DB[category];
      const question   = pool[Math.floor(Math.random() * pool.length)];

      activeQuizzes.set(from, { ...question, category, startedAt: Date.now() });

      // Auto-expire after 30s
      setTimeout(() => activeQuizzes.delete(from), 30000);

      const catEmoji = { general: '🌍', pakistan: '🇵🇰', cricket: '🏏', islam: '☪️' };
      const optSection = question.options.map(o => `│ ${o}`).join('\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 ❓ *QUIZ TIME!* 』━━━╮

${catEmoji[category] || '❓'} *Category:* ${category.toUpperCase()}
💰 *Reward:* ${question.reward} coins
⏱️ *Time:* 30 seconds

╭─『 ❓ *Question* 』
│ ${question.q}
╰──────────────────────────

╭─『 🔤 *Options* 』
${optSection}
╰──────────────────────────

💡 Reply A, B, C or D

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('❓');

    } catch (error) {
      console.error('[QUIZ ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Quiz error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
