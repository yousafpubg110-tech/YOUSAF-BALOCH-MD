/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Points Table Plugin    ┃
┃       Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Owner Footer ─────────────────────────────────────────────────────
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

const PSL_POINTS = [
  { pos: 1, team: 'Multan Sultans',    emoji: '👸', p: 10, w: 7, l: 3, pts: 14, nrr: '+0.856' },
  { pos: 2, team: 'Lahore Qalandars',  emoji: '🦁', p: 10, w: 6, l: 4, pts: 12, nrr: '+0.423' },
  { pos: 3, team: 'Islamabad United',  emoji: '⚡', p: 10, w: 6, l: 4, pts: 12, nrr: '+0.312' },
  { pos: 4, team: 'Peshawar Zalmi',    emoji: '🔥', p: 10, w: 5, l: 5, pts: 10, nrr: '+0.105' },
  { pos: 5, team: 'Quetta Gladiators', emoji: '⚔️', p: 10, w: 3, l: 7, pts:  6, nrr: '-0.543' },
  { pos: 6, team: 'Karachi Kings',     emoji: '👑', p: 10, w: 3, l: 7, pts:  6, nrr: '-1.153' },
];

function buildPointsTable(teams) {
  return teams.map(t => {
    const medal = t.pos === 1 ? '🥇' : t.pos === 2 ? '🥈' : t.pos === 3 ? '🥉' : `*${t.pos}.*`;
    return `│ ${medal} ${t.emoji} *${t.team}*\n│    P:${t.p} W:${t.w} L:${t.l} Pts:${t.pts} NRR:${t.nrr}`;
  }).join('\n│\n');
}

export default {
  command    : ['points', 'table', 'standings', 'پوائنٹس'],
  name       : 'match-points-table',
  category   : 'Sports',
  description: 'Tournament points table — PSL, IPL',
  usage      : '.points [psl/ipl]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📊');
      const senderNum = sender?.split('@')[0] || 'User';
      const lower     = (text || '').toLowerCase();
      const isIPL     = /ipl|india/.test(lower);

      let tableSection = '';

      if (isIPL) {
        tableSection = `╭─『 📊 *IPL 2025 Standings* 』
│ Use ${CONFIG.PREFIX}ipl for team details
╰──────────────────────────`;
      } else {
        tableSection = `╭─『 📊 *PSL Season 10 Standings* 』
│
${buildPointsTable(PSL_POINTS)}
│
╰──────────────────────────`;
      }

      const tableMsg = `╭━━━『 📊 *POINTS TABLE* 』━━━╮

👋 *Requested by:* +${senderNum}
📅 *Updated:* ${new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })}

${tableSection}

╭─『 🏅 *Zones* 』
│ 🟢 Top 2  → Direct Final
│ 🟡 3rd-4th → Eliminator
│ 🔴 5th-6th → Eliminated
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}points psl\`  → PSL table
│ \`${CONFIG.PREFIX}points ipl\`  → IPL table
│ \`${CONFIG.PREFIX}score\`       → Live score
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: tableMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[POINTS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Points table error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
