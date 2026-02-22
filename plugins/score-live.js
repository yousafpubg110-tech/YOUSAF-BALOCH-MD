/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Live Score Plugin   ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

// ─── Helper: Fetch with timeout ───────────────────────────────────────────────
async function fetchData(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ─── Helper: Build safe API URL ───────────────────────────────────────────────
function buildApiUrl(endpoint, params = {}) {
  const url = new URL(`https://api.cricapi.com/v1/${endpoint}`);
  url.searchParams.set('apikey', CRICAPI_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (url.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');
  return url.toString();
}

// ─── Helper: Format score ─────────────────────────────────────────────────────
function formatScore(match) {
  try {
    const team1     = match.teamInfo?.[0]?.name || match.teams?.[0] || 'Team 1';
    const team2     = match.teamInfo?.[1]?.name || match.teams?.[1] || 'Team 2';
    const score1    = match.score?.[0]
      ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o} ov)`
      : 'Yet to bat';
    const score2    = match.score?.[1]
      ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o} ov)`
      : 'Yet to bat';
    const status    = match.status    || 'Live';
    const matchType = match.matchType?.toUpperCase() || 'CRICKET';
    const venue     = match.venue     || 'Unknown Venue';
    return { team1, team2, score1, score2, status, matchType, venue };
  } catch { return null; }
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['score', 'livescore', 'live', 'cricket'],
  name       : 'score-live',
  category   : 'Sports',
  description: 'Get live cricket scores (ball by ball)',
  usage      : '.score',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏏');

      const senderNum = sender?.split('@')[0] || 'User';

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n\n📌 Add to .env file\n🔗 Free: https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🏏 *Fetching live scores...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const apiUrl = buildApiUrl('currentMatches', { offset: 0 });
      const data   = await fetchData(apiUrl);

      if (!data?.data || data.data.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *No live matches right now!*\n\n💡 Try:\n▸ ${CONFIG.PREFIX}schedule\n▸ ${CONFIG.PREFIX}matchinfo\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const liveMatches = data.data
        .filter(m => m.matchStarted && !m.matchEnded)
        .slice(0, 5);

      if (liveMatches.length === 0) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No matches live right now!*\n\n💡 Use ${CONFIG.PREFIX}schedule\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      let scoreSection = '';
      let matchNum     = 1;
      for (const match of liveMatches) {
        const info = formatScore(match);
        if (!info) continue;
        scoreSection += `╭─『 🏏 *Match ${matchNum} — ${info.matchType}* 』
│ 🏟️  *Venue:* ${info.venue}
│ 🔵 *${info.team1}:* ${info.score1}
│ 🔴 *${info.team2}:* ${info.score2}
│ 📊 *Status:* ${info.status}
╰──────────────────────────\n`;
        matchNum++;
      }

      const scoreMsg = `╭━━━『 🏏 *LIVE CRICKET SCORES* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Updated:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

${scoreSection}
╭─『 💡 *More Commands* 』
│ \`${CONFIG.PREFIX}schedule\`   → Upcoming
│ \`${CONFIG.PREFIX}scorecard\`  → Full scorecard
│ \`${CONFIG.PREFIX}points\`     → Points table
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: scoreMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SCORE-LIVE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Score fetch failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
