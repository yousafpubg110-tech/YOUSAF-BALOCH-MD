/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Math Game Plugin      ┃
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

// ─── Active challenges store ──────────────────────────────────────────────────
const activeChallenges = new Map();
// chatJid → { question, answer, difficulty, startedAt, reward }

// ─── Difficulty levels ────────────────────────────────────────────────────────
const DIFFICULTIES = {
  easy  : { range: 20,  ops: ['+', '-'],         reward: 10,  time: 30 },
  medium: { range: 50,  ops: ['+', '-', '*'],     reward: 25,  time: 25 },
  hard  : { range: 100, ops: ['+', '-', '*', '/'],reward: 50,  time: 20 },
};

// ─── Generate math question ───────────────────────────────────────────────────
function generateQuestion(difficulty = 'easy') {
  const config = DIFFICULTIES[difficulty] || DIFFICULTIES.easy;
  const op     = config.ops[Math.floor(Math.random() * config.ops.length)];

  let a, b, answer, question;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * config.range) + 1;
      b = Math.floor(Math.random() * config.range) + 1;
      answer   = a + b;
      question = `${a} + ${b}`;
      break;
    case '-':
      a = Math.floor(Math.random() * config.range) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer   = a - b;
      question = `${a} - ${b}`;
      break;
    case '*':
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer   = a * b;
      question = `${a} × ${b}`;
      break;
    case '/':
      b = Math.floor(Math.random() * 10) + 2;
      answer   = Math.floor(Math.random() * 10) + 2;
      a        = b * answer;
      question = `${a} ÷ ${b}`;
      break;
    default:
      a = 5; b = 3; answer = 8; question = '5 + 3';
  }

  return { question, answer, op, difficulty, reward: config.reward, time: config.time };
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['math', 'mathgame', 'calculate'],
  name       : 'game-math',
  category   : 'Games',
  description: 'Fast math challenge game — answer to win coins',
  usage      : '.math [easy/medium/hard]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🧮');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      // ── Check if answering existing question ──────────────
      const existing = activeChallenges.get(from);
      if (existing && !isNaN(parseInt(input))) {
        const userAnswer = parseInt(input);
        const elapsed    = Math.round((Date.now() - existing.startedAt) / 1000);

        if (elapsed > existing.time) {
          activeChallenges.delete(from);
          return await sock.sendMessage(from, {
            text: `⏰ *Time's up!*\n\n✅ Answer was: *${existing.answer}*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        if (userAnswer === existing.answer) {
          activeChallenges.delete(from);
          const speed = elapsed <= 5 ? '🚀 Lightning Fast!' : elapsed <= 10 ? '⚡ Very Fast!' : '✅ Correct!';

          await sock.sendMessage(from, {
            text: `╭━━━『 🏆 *CORRECT ANSWER!* 』━━━╮

${speed}
👋 *Winner:* +${senderNum}

╭─『 📊 *Result* 』
│ ❓ *Question:* ${existing.question} = ?
│ ✅ *Answer:*   ${existing.answer}
│ ⏱️ *Time:*     ${elapsed}s
│ 💰 *Reward:*   +${existing.reward} coins
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });
          if (typeof msg.react === 'function') await msg.react('🏆');
          return;
        } else {
          return await sock.sendMessage(from, {
            text: `❌ *Wrong! Try again!*\n⏳ ${existing.time - elapsed}s left\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
      }

      // ── Start new challenge ───────────────────────────────
      const difficulty = ['easy','medium','hard'].includes(input) ? input : 'easy';
      const challenge  = generateQuestion(difficulty);

      activeChallenges.set(from, { ...challenge, startedAt: Date.now() });

      // Auto-expire
      setTimeout(() => {
        const c = activeChallenges.get(from);
        if (c && c.startedAt === activeChallenges.get(from)?.startedAt) {
          activeChallenges.delete(from);
        }
      }, challenge.time * 1000);

      const diffEmoji = difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴';

      await sock.sendMessage(from, {
        text: `╭━━━『 🧮 *MATH CHALLENGE* 』━━━╮

${diffEmoji} *Difficulty:* ${difficulty.toUpperCase()}
💰 *Reward:*     ${challenge.reward} coins
⏱️ *Time Limit:* ${challenge.time} seconds

╭─『 ❓ *Question* 』
│
│   *${challenge.question} = ?*
│
╰──────────────────────────

💡 Reply with the answer!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('🧮');

    } catch (error) {
      console.error('[MATH ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Math game error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
