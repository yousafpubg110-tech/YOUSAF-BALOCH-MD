/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Economy Daily Plugin    ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }    from '../config.js';
import { getWallet, addCoins } from './economy-balance.js';

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

// ─── Daily claim tracking ─────────────────────────────────────────────────────
const lastClaim = new Map(); // userJid → timestamp

const DAILY_REWARD  = parseInt(process.env.DAILY_REWARD || '200');
const COOLDOWN_MS   = 24 * 60 * 60 * 1000; // 24 hours

// ─── Daily bonus messages ─────────────────────────────────────────────────────
const DAILY_MSGS = [
  'Great start to your day! Keep grinding! 💪',
  'Every day is a new opportunity! 🌟',
  'Consistency is key! Keep coming back! 🔑',
  'You are on a roll! Don\'t break the streak! 🔥',
  'Your dedication is paying off! 💎',
];

export default {
  command    : ['daily', 'claim', 'reward'],
  name       : 'economy-daily',
  category   : 'Economy',
  description: 'Claim your daily coin reward (24h cooldown)',
  usage      : '.daily',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎁');

      const senderNum = sender?.split('@')[0] || 'User';
      const now       = Date.now();
      const last      = lastClaim.get(sender) || 0;
      const elapsed   = now - last;
      const remaining = COOLDOWN_MS - elapsed;

      // ── Cooldown check ────────────────────────────────────
      if (remaining > 0) {
        const hrs  = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);

        return await sock.sendMessage(from, {
          text: `╭━━━『 ⏰ *DAILY COOLDOWN* 』━━━╮

👋 *Player:* +${senderNum}

╭─『 ⏳ *Come back in* 』
│ ⏰ *Time Left:* ${hrs}h ${mins}m ${secs}s
│
│ 💡 Your next reward: *${DAILY_REWARD} coins*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Calculate streak bonus ────────────────────────────
      const w         = getWallet(sender);
      const streak    = (w.dailyStreak || 0) + 1;
      w.dailyStreak   = streak;

      const streakBonus = Math.min(streak - 1, 7) * 20; // Max +140 for 7 day streak
      const totalReward = DAILY_REWARD + streakBonus;

      // ── Claim reward ──────────────────────────────────────
      lastClaim.set(sender, now);
      addCoins(sender, totalReward);

      const randomMsg = DAILY_MSGS[Math.floor(Math.random() * DAILY_MSGS.length)];
      const streakBar = '🔥'.repeat(Math.min(streak, 7)) + '⬜'.repeat(Math.max(0, 7 - streak));

      await sock.sendMessage(from, {
        text: `╭━━━『 🎁 *DAILY REWARD CLAIMED!* 』━━━╮

👋 *Player:* +${senderNum}

╭─『 💰 *Reward* 』
│ 🎁 *Base Reward:*   +${DAILY_REWARD} coins
│ 🔥 *Streak Bonus:*  +${streakBonus} coins
│ 💰 *Total Earned:*  *+${totalReward} coins*
│ 💳 *New Balance:*   ${w.coins.toLocaleString()} coins
╰──────────────────────────

╭─『 🔥 *Daily Streak* 』
│ 📆 *Day:* ${streak}
│ ${streakBar}
│ 💡 ${streak >= 7 ? 'Max streak bonus reached!' : `Come back tomorrow for +${(Math.min(streak, 7)) * 20} bonus!`}
╰──────────────────────────

╭─『 ✨ *Message* 』
│ ${randomMsg}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('🎁');

    } catch (error) {
      console.error('[DAILY ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Daily claim error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
