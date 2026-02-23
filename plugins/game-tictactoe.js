/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Tic Tac Toe Game       ┃
┃        Created by MR YOUSAF BALOCH          ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

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

// ─── Active games store ───────────────────────────────────────────────────────
// games.get(chatJid) → { board, players, currentTurn, status }
const games = new Map();

// ─── Helper: Empty board ──────────────────────────────────────────────────────
function emptyBoard() {
  return ['1','2','3','4','5','6','7','8','9'];
}

// ─── Helper: Render board ─────────────────────────────────────────────────────
function renderBoard(board) {
  const cell = (v) => v === 'X' ? '❌' : v === 'O' ? '⭕' : `*${v}*`;
  return `│ ${cell(board[0])} │ ${cell(board[1])} │ ${cell(board[2])} │
│─────────────│
│ ${cell(board[3])} │ ${cell(board[4])} │ ${cell(board[5])} │
│─────────────│
│ ${cell(board[6])} │ ${cell(board[7])} │ ${cell(board[8])} │`;
}

// ─── Helper: Check winner ─────────────────────────────────────────────────────
function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diagonals
  ];
  for (const [a,b,c] of lines) {
    if (board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return null;
}

// ─── Helper: Check draw ───────────────────────────────────────────────────────
function isDraw(board) {
  return board.every(cell => cell === 'X' || cell === 'O');
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['tictactoe', 'ttt', 'xo'],
  name       : 'game-tictactoe',
  category   : 'Games',
  description: 'Play Tic Tac Toe with another player',
  usage      : '.ttt [@opponent] OR .ttt <1-9>',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎮');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      // ── Check for move (number input) ─────────────────────
      const moveNum = parseInt(input);
      if (!isNaN(moveNum) && moveNum >= 1 && moveNum <= 9) {
        const game = games.get(from);

        if (!game) {
          return await sock.sendMessage(from, {
            text: `❌ *No active game!*\n\n💡 Start: \`${CONFIG.PREFIX}ttt @opponent\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        if (game.currentTurn !== sender) {
          return await sock.sendMessage(from, {
            text: `⏳ *Wait for your turn!*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const idx = moveNum - 1;
        if (game.board[idx] === 'X' || game.board[idx] === 'O') {
          return await sock.sendMessage(from, {
            text: `❌ *Cell ${moveNum} is already taken! Choose another.*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        // Make move
        const symbol    = sender === game.players.X ? 'X' : 'O';
        game.board[idx] = symbol;

        const winner = checkWinner(game.board);
        const draw   = isDraw(game.board);
        const board  = renderBoard(game.board);

        if (winner) {
          const winnerJid = game.players[winner];
          const winNum    = winnerJid.split('@')[0];
          games.delete(from);

          await sock.sendMessage(from, {
            text: `╭━━━『 🏆 *TIC TAC TOE — WINNER!* 』━━━╮

${board}

🏆 *Winner: @${winNum}* (${winner === 'X' ? '❌' : '⭕'})
🎉 Congratulations!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            mentions: [winnerJid],
          }, { quoted: msg });
          return;
        }

        if (draw) {
          games.delete(from);
          await sock.sendMessage(from, {
            text: `╭━━━『 🤝 *TIC TAC TOE — DRAW!* 』━━━╮

${board}

🤝 *It's a Draw!*
Good game both players!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });
          return;
        }

        // Switch turn
        game.currentTurn = sender === game.players.X ? game.players.O : game.players.X;
        const nextNum    = game.currentTurn.split('@')[0];

        await sock.sendMessage(from, {
          text: `╭━━━『 🎮 *TIC TAC TOE* 』━━━╮

${board}

▶️ *Next Turn:* @${nextNum}
💡 Send a number (1-9) to play

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          mentions: [game.currentTurn],
        }, { quoted: msg });
        return;
      }

      // ── Start new game ────────────────────────────────────
      const opponent = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

      if (!opponent) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 🎮 *TIC TAC TOE* 』━━━╮

📌 *How to Play:*
1. \`${CONFIG.PREFIX}ttt @opponent\` → Challenge someone
2. Send number 1-9 to place your mark

╭─『 📐 *Board Layout* 』
│ *1* │ *2* │ *3*
│─────────────
│ *4* │ *5* │ *6*
│─────────────
│ *7* │ *8* │ *9*
╰──────────────────────────

❌ = Player 1 | ⭕ = Player 2

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      if (opponent === sender) {
        return await sock.sendMessage(from, {
          text: `❌ *You cannot play against yourself!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // Create new game
      games.set(from, {
        board      : emptyBoard(),
        players    : { X: sender, O: opponent },
        currentTurn: sender,
        startedAt  : Date.now(),
      });

      const p1Num = sender.split('@')[0];
      const p2Num = opponent.split('@')[0];
      const board = renderBoard(emptyBoard());

      await sock.sendMessage(from, {
        text: `╭━━━『 🎮 *TIC TAC TOE — NEW GAME!* 』━━━╮

❌ *Player 1:* @${p1Num}
⭕ *Player 2:* @${p2Num}

${board}

▶️ *First Turn:* @${p1Num} (❌)
💡 Send number 1-9 to place your mark!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [sender, opponent],
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[TTT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Game error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
