/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Coin Flip Plugin      ┃
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

// ─── Coin flip stats per user ─────────────────────────────────────────────────
const userStats = new Map(); // userJid → { heads, tails, streak, lastResult }

export default {
  command    : ['coin', 'flip', 'coinflip', 'toss'],
  name       : 'game-coin',
  category   : 'Games',
  description: 'Flip a coin — heads or tails',
  usage      : '.coin [heads/tails] [bet <amount>]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🪙');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      // ── Show stats ────────────────────────────────────────
      if (input === 'stats' || input === 'history') {
        const stats  = userStats.get(sender) || { heads: 0, tails: 0, streak: 0, lastResult: null };
        const total  = stats.heads + stats.tails;
        const hPct   = total > 0 ? Math.round((stats.heads / total) * 100) : 0;
        const tPct   = total > 0 ? Math.round((stats.tails / total) * 100) : 0;

        await sock.sendMessage(from, {
          text: `╭━━━『 🪙 *COIN FLIP STATS* 』━━━╮

👋 *Player:* +${senderNum}

╭─『 📊 *Your Stats* 』
│ 🪙 *Total Flips:* ${total}
│ ⬆️ *Heads:* ${stats.heads} (${hPct}%)
│ ⬇️ *Tails:* ${stats.tails} (${tPct}%)
│ 🔥 *Current Streak:* ${Math.abs(stats.streak)}x ${stats.streak > 0 ? '⬆️ Heads' : stats.streak < 0 ? '⬇️ Tails' : ''}
│ 📌 *Last Result:* ${stats.lastResult || 'N/A'}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        return;
      }

      // ── Detect prediction ─────────────────────────────────
      const prediction = input.includes('head') ? 'heads'
        : input.includes('tail')  ? 'tails'
        : null;

      // ── Flip coin ─────────────────────────────────────────
      const result  = Math.random() < 0.5 ? 'heads' : 'tails';
      const isHeads = result === 'heads';
      const face    = isHeads ? '⬆️ HEADS' : '⬇️ TAILS';
      const emoji   = isHeads ? '🌟' : '💫';

      // ── Update stats ──────────────────────────────────────
      if (!userStats.has(sender)) userStats.set(sender, { heads: 0, tails: 0, streak: 0, lastResult: null });
      const stats = userStats.get(sender);
      if (isHeads) {
        stats.heads++;
        stats.streak = stats.streak > 0 ? stats.streak + 1 : 1;
      } else {
        stats.tails++;
        stats.streak = stats.streak < 0 ? stats.streak - 1 : -1;
      }
      stats.lastResult = result;

      // ── Check prediction result ───────────────────────────
      let predMsg = '';
      if (prediction) {
        const correct = prediction === result;
        predMsg = correct
          ? `\n╭─『 🎯 *Prediction* 』\n│ ✅ *Correct!* You guessed ${prediction}!\n│ 💰 *Reward:* +15 coins\n╰──────────────────────────`
          : `\n╭─『 🎯 *Prediction* 』\n│ ❌ *Wrong!* You guessed ${prediction}\n│ 💸 *Lost:* -5 coins\n╰──────────────────────────`;
      }

      const streakMsg = Math.abs(stats.streak) >= 3
        ? `\n🔥 *${Math.abs(stats.streak)}x Streak!*`
        : '';

      await sock.sendMessage(from, {
        text: `╭━━━『 🪙 *COIN FLIP* 』━━━╮

👋 *Flipped by:* +${senderNum}

╭─『 🪙 *Result* 』
│
│      ${emoji}  ${face}  ${emoji}
│
╰──────────────────────────
${predMsg}${streakMsg}

╭─『 💡 *Options* 』
│ \`${CONFIG.PREFIX}coin heads\` → Predict heads
│ \`${CONFIG.PREFIX}coin tails\` → Predict tails
│ \`${CONFIG.PREFIX}coin stats\` → Your stats
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react(isHeads ? '⬆️' : '⬇️');

    } catch (error) {
      console.error('[COIN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Coin flip error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
