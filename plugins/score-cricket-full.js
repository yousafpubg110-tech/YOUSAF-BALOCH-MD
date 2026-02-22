/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Full Scorecard Plugin   ┃
┃       Created by MR YOUSAF BALOCH            ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

const CRICAPI_KEY = process.env.CRICAPI_KEY || '';

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

async function fetchData(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

function buildBatting(batsmen) {
  if (!batsmen || batsmen.length === 0) return '│ No batting data\n';
  return batsmen.slice(0, 6).map(b =>
    `│ 🏏 *${b.batsman || b.name || 'N/A'}*\n│    R:${b.r ?? '-'} B:${b.b ?? '-'} 4s:${b['4s'] ?? '-'} 6s:${b['6s'] ?? '-'} SR:${b.sr ?? '-'}`
  ).join('\n') + '\n';
}

function buildBowling(bowlers) {
  if (!bowlers || bowlers.length === 0) return '│ No bowling data\n';
  return bowlers.slice(0, 5).map(b =>
    `│ 🎳 *${b.bowler || b.name || 'N/A'}*\n│    O:${b.o ?? '-'} M:${b.m ?? '-'} R:${b.r ?? '-'} W:${b.w ?? '-'} Eco:${b.eco ?? '-'}`
  ).join('\n') + '\n';
}

export default {
  command    : ['scorecard', 'fullscore', 'card', 'sc'],
  name       : 'score-cricket-full',
  category   : 'Sports',
  description: 'Full cricket scorecard with batting and bowling',
  usage      : '.scorecard',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📊');
      const senderNum = sender?.split('@')[0] || 'User';

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📊 *Fetching full scorecard...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const listUrl = new URL('https://api.cricapi.com/v1/currentMatches');
      listUrl.searchParams.set('apikey', CRICAPI_KEY);
      listUrl.searchParams.set('offset', '0');
      if (listUrl.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const listData  = await fetchData(listUrl.toString());
      const liveMatch = listData?.data?.find(m => m.matchStarted && !m.matchEnded);

      if (!liveMatch) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No live match right now!*\n\n💡 Use ${CONFIG.PREFIX}schedule\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const cardUrl = new URL('https://api.cricapi.com/v1/match_scorecard');
      cardUrl.searchParams.set('apikey', CRICAPI_KEY);
      cardUrl.searchParams.set('id', liveMatch.id);
      if (cardUrl.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const cardData = await fetchData(cardUrl.toString());
      const match    = cardData?.data || liveMatch;

      const t1     = match.teams?.[0] || 'Team 1';
      const t2     = match.teams?.[1] || 'Team 2';
      const status = match.status     || 'Live';
      const venue  = match.venue      || 'Unknown';
      const type   = match.matchType?.toUpperCase() || 'CRICKET';
      const s1     = match.score?.[0] ? `${match.score[0].inning}: ${match.score[0].r}/${match.score[0].w} (${match.score[0].o} ov)` : `${t1}: Yet to bat`;
      const s2     = match.score?.[1] ? `${match.score[1].inning}: ${match.score[1].r}/${match.score[1].w} (${match.score[1].o} ov)` : `${t2}: Yet to bat`;

      const batting  = buildBatting(match.scorecard?.[0]?.batting || match.batting);
      const bowling  = buildBowling(match.scorecard?.[0]?.bowling || match.bowling);

      const cardMsg = `╭━━━『 📊 *FULL SCORECARD* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Updated:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

╭─『 🏏 *Match Info* 』
│ 🎯 *Type:*   ${type}
│ 🏟️  *Venue:*  ${venue}
│ 📢 *Status:* ${status}
╰──────────────────────────

╭─『 📊 *Score Summary* 』
│ 🔵 ${s1}
│ 🔴 ${s2}
╰──────────────────────────

╭─『 🏏 *Batting* 』
${batting}╰──────────────────────────

╭─『 🎳 *Bowling* 』
${bowling}╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: cardMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SCORECARD ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Scorecard failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
