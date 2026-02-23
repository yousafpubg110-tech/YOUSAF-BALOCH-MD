/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Economy Leaderboard      ┃
┃        Created by MR YOUSAF BALOCH            ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';
import { wallet }        from './economy-balance.js';

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

export default {
  command    : ['leaderboard', 'lb', 'top', 'richlist'],
  name       : 'economy-leaderboard',
  category   : 'Economy',
  description: 'Top richest players leaderboard',
  usage      : '.leaderboard [coins/bank/level]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏆');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      const sortBy = input === 'bank' ? 'bank'
        : input === 'level' ? 'level'
        : 'coins';

      // ── Build sorted leaderboard ──────────────────────────
      const entries = [...wallet.entries()]
        .map(([jid, w]) => ({
          jid,
          num: jid.split('@')[0],
          coins: w.coins,
          bank : w.bank,
          total: w.coins + w.bank,
          level: w.level,
        }))
        .sort((a, b) => {
          if (sortBy === 'bank')  return b.bank  - a.bank;
          if (sortBy === 'level') return b.level - a.level;
          return b.coins - a.coins;
        })
        .slice(0, 10);

      if (entries.length === 0) {
        return await sock.sendMessage(from, {
          text: `📊 *No players yet!*\n\n💡 Start playing: \`${CONFIG.PREFIX}daily\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Find sender rank ──────────────────────────────────
      const allSorted = [...wallet.entries()]
        .sort((a, b) => b[1].coins - a[1].coins);
      const myRank    = allSorted.findIndex(([jid]) => jid === sender) + 1;

      const mentions = entries.map(e => e.jid);

      const lbSection = entries.map((e, i) => {
        const medal   = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `*${i + 1}.*`;
        const value   = sortBy === 'bank'  ? `${e.bank.toLocaleString()} (bank)`
          : sortBy === 'level' ? `Lv.${e.level}`
          : `${e.coins.toLocaleString()} coins`;
        const isMe    = e.jid === sender;
        return `│ ${medal} @${e.num}${isMe ? ' ← You' : ''}\n│    💰 ${value}`;
      }).join('\n│\n');

      const sortLabel = sortBy === 'bank' ? '🏦 Bank Balance' : sortBy === 'level' ? '⭐ Level' : '💰 Cash Balance';

      await sock.sendMessage(from, {
        text: `╭━━━『 🏆 *LEADERBOARD* 』━━━╮

📊 *Sorted by:* ${sortLabel}
👥 *Total Players:* ${wallet.size}

╭─『 🏆 *Top 10 Players* 』
│
${lbSection}
│
╰──────────────────────────

╭─『 📌 *Your Rank* 』
│ 🏅 *Position:* #${myRank || 'N/A'} of ${wallet.size}
╰──────────────────────────

╭─『 💡 *Sort Options* 』
│ \`${CONFIG.PREFIX}lb\`       → By cash
│ \`${CONFIG.PREFIX}lb bank\`  → By bank
│ \`${CONFIG.PREFIX}lb level\` → By level
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('🏆');

    } catch (error) {
      console.error('[LEADERBOARD ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Leaderboard error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
