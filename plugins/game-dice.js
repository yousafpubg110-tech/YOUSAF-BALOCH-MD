/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Dice Game Plugin      ┃
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

const DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

export default {
  command    : ['dice', 'roll', 'rolldice'],
  name       : 'game-dice',
  category   : 'Games',
  description: 'Roll dice — single, double or bet',
  usage      : '.dice [sides] [bet <amount>]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎲');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      // ── Double dice (vs bot) ──────────────────────────────
      if (input === 'vs' || input === 'battle' || input === 'duel') {
        const playerRoll = rollDice();
        const botRoll    = rollDice();
        const playerFace = DICE_FACES[playerRoll - 1];
        const botFace    = DICE_FACES[botRoll - 1];

        let result = '';
        let emoji  = '';
        if (playerRoll > botRoll)      { result = `🏆 *You Win! +20 coins*`; emoji = '🏆'; }
        else if (playerRoll < botRoll) { result = `💀 *Bot Wins! -10 coins*`; emoji = '😢'; }
        else                           { result = `🤝 *It's a Draw!*`;        emoji = '🤝'; }

        await sock.sendMessage(from, {
          text: `╭━━━『 🎲 *DICE BATTLE* 』━━━╮

👋 *Player:* +${senderNum}
🤖 *Opponent:* ${OWNER.BOT_NAME}

╭─『 🎲 *Roll Result* 』
│ 👤 *Your Roll:* ${playerFace} (${playerRoll})
│ 🤖 *Bot Roll:*  ${botFace} (${botRoll})
╰──────────────────────────

╭─『 🏆 *Result* 』
│ ${result}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react(emoji);
        return;
      }

      // ── Multi dice ─────────────────────────────────────────
      const sidesMatch = input.match(/(\d+)d(\d+)/i);
      if (sidesMatch) {
        const count  = Math.min(parseInt(sidesMatch[1]) || 1, 10);
        const sides  = Math.min(parseInt(sidesMatch[2]) || 6, 100);
        const rolls  = Array.from({ length: count }, () => rollDice(sides));
        const total  = rolls.reduce((a, b) => a + b, 0);
        const faces  = sides === 6
          ? rolls.map(r => DICE_FACES[r - 1]).join(' ')
          : rolls.map(r => `[${r}]`).join(' ');

        await sock.sendMessage(from, {
          text: `╭━━━『 🎲 *MULTI DICE ROLL* 』━━━╮

👋 *Rolled by:* +${senderNum}
🎲 *Dice:* ${count}d${sides}

╭─『 🎲 *Results* 』
│ ${faces}
│ 🔢 *Values:* ${rolls.join(', ')}
│ ➕ *Total:*  ${total}
│ 📊 *Avg:*   ${(total / count).toFixed(1)}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Simple single dice roll ───────────────────────────
      const sides  = Math.min(parseInt(input) || 6, 100);
      const result = rollDice(sides);
      const face   = sides === 6 ? DICE_FACES[result - 1] : `[${result}]`;
      const isMax  = result === sides;
      const isMin  = result === 1;

      await sock.sendMessage(from, {
        text: `╭━━━『 🎲 *DICE ROLL* 』━━━╮

👋 *Rolled by:* +${senderNum}
🎲 *Dice:* D${sides}

╭─『 🎲 *Result* 』
│
│      ${face}
│   *Result: ${result}*
│
╰──────────────────────────

${isMax ? '🎉 *Maximum Roll! Lucky!*' : isMin ? '💀 *Minimum Roll! Unlucky!*' : ''}

╭─『 💡 *Modes* 』
│ \`${CONFIG.PREFIX}dice\`       → D6 roll
│ \`${CONFIG.PREFIX}dice 20\`    → D20 roll
│ \`${CONFIG.PREFIX}dice 3d6\`   → 3 dice
│ \`${CONFIG.PREFIX}dice vs\`    → Battle bot
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react(isMax ? '🎉' : '🎲');

    } catch (error) {
      console.error('[DICE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Dice error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
