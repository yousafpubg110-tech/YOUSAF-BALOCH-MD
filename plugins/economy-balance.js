/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Economy Balance Plugin  ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

// ─── Economy store (in-memory — use DB for production) ────────────────────────
// wallet.get(userJid) → { coins, bank, level, xp, joinedAt }
export const wallet = new Map();

const START_BALANCE = parseInt(process.env.START_BALANCE || '500');
const TAX_RATE      = parseFloat(process.env.TAX_RATE    || '0.05');

// ─── Helper: Get or create wallet ─────────────────────────────────────────────
export function getWallet(userJid) {
  if (!wallet.has(userJid)) {
    wallet.set(userJid, {
      coins   : START_BALANCE,
      bank    : 0,
      level   : 1,
      xp      : 0,
      joinedAt: new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' }),
    });
  }
  return wallet.get(userJid);
}

// ─── Helper: Add coins ────────────────────────────────────────────────────────
export function addCoins(userJid, amount) {
  const w = getWallet(userJid);
  w.coins = Math.max(0, w.coins + amount);
  return w;
}

// ─── Helper: Remove coins ─────────────────────────────────────────────────────
export function removeCoins(userJid, amount) {
  const w = getWallet(userJid);
  if (w.coins < amount) return false;
  w.coins -= amount;
  return true;
}

// ─── Helper: Get level info ───────────────────────────────────────────────────
function getLevelInfo(level) {
  const levels = {
    1: 'Beginner 🌱', 2: 'Rookie 🌿', 3: 'Player 🎮',
    4: 'Gamer 🕹️',   5: 'Pro 🏆',    6: 'Elite ⭐',
    7: 'Master 💎',  8: 'Legend 👑',  9: 'GOD 🌟',
  };
  return levels[Math.min(level, 9)] || 'Legend 👑';
}

export default {
  command    : ['balance', 'bal', 'wallet', 'coins', 'money'],
  name       : 'economy-balance',
  category   : 'Economy',
  description: 'Check your wallet balance and economy stats',
  usage      : '.balance [@user]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💰');

      // ── Check mentioned user or self ──────────────────────
      const target    = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
      const targetNum = target.split('@')[0];
      const isSelf    = target === sender;

      const w         = getWallet(target);
      const total     = w.coins + w.bank;
      const levelName = getLevelInfo(w.level);

      // ── Coin bar ──────────────────────────────────────────
      const maxBar   = 5000;
      const barFill  = Math.min(10, Math.round((w.coins / maxBar) * 10));
      const coinBar  = '█'.repeat(barFill) + '░'.repeat(10 - barFill);

      await sock.sendMessage(from, {
        text: `╭━━━『 💰 *WALLET* 』━━━╮

👤 *${isSelf ? 'Your' : `@${targetNum}'s`} Wallet*
📅 *Joined:* ${w.joinedAt}

╭─『 💵 *Balance* 』
│ 💰 *Cash:*    ${w.coins.toLocaleString()} coins
│ 🏦 *Bank:*    ${w.bank.toLocaleString()} coins
│ 📊 *Total:*   ${total.toLocaleString()} coins
│ 📈 *Meter:*   ${coinBar}
╰──────────────────────────

╭─『 🏆 *Profile* 』
│ ⭐ *Level:*   ${w.level} — ${levelName}
│ 📊 *XP:*     ${w.xp} / ${w.level * 100}
│ 💹 *Tax Rate:* ${(TAX_RATE * 100)}%
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}daily\`    → Daily reward
│ \`${CONFIG.PREFIX}work\`     → Earn coins
│ \`${CONFIG.PREFIX}deposit\`  → Save to bank
│ \`${CONFIG.PREFIX}shop\`     → Buy items
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: isSelf ? [] : [target],
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BALANCE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Balance error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
