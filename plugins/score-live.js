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

// ─── Constants ────────────────────────────────────────────────────────────────
const CRICAPI_KEY = process.env.CRICAPI_KEY || '';
const API_BASE    = 'https://api.cricapi.com/v1';

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

// ─── Helper: Validate URL ─────────────────────────────────────────────────────
function buildApiUrl(endpoint, params = {}) {
  // ✅ CodeQL Fix: Use URL() for safe URL construction
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set('apikey', CRICAPI_KEY);
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  if (url.hostname !== 'api.cricapi.com') {
    throw new Error('Invalid API hostname.');
  }
  return url.toString();
}

// ─── Helper: Format score ─────────────────────────────────────────────────────
function formatScore(match) {
  try {
    const team1   = match.teamInfo?.[0]?.name || match.teams?.[0] || 'Team 1';
    const team2   = match.teamInfo?.[1]?.name || match.teams?.[1] || 'Team 2';
    const score1  = match.score?.[0] ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o} ov)` : 'Yet to bat';
    const score2  = match.score?.[1] ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o} ov)` : 'Yet to bat';
    const status  = match.status  || 'Live';
    const matchType = match.matchType?.toUpperCase() || 'CRICKET';
    const venue   = match.venue   || 'Unknown Venue';

    return { team1, team2, score1, score2, status, matchType, venue };
  } catch {
    return null;
  }
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

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('🏏');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── API key check ───────────────────────────────────────────
      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CricAPI key not set!*\n\n📌 Add *CRICAPI_KEY* to your .env file\n🔗 Get free key: https://cricapi.com`,
        }, { quoted: msg });
      }

      // ── Send loading message ────────────────────────────────────
      await sock.sendMessage(from, {
        text: `🏏 *Fetching live scores...*\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Fetch live matches ──────────────────────────────────────
      const apiUrl = buildApiUrl('currentMatches', { offset: 0 });
      const data   = await fetchData(apiUrl);

      if (!data?.data || data.data.length === 0) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *No live matches right now!*\n\n💡 Try:\n▸ ${CONFIG.PREFIX}schedule — upcoming matches\n▸ ${CONFIG.PREFIX}matchinfo — recent results`,
        }, { quoted: msg });
      }

      // ── Filter live matches ─────────────────────────────────────
      const liveMatches = data.data
        .filter(m => m.matchStarted && !m.matchEnded)
        .slice(0, 5); // Max 5 matches

      if (liveMatches.length === 0) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No matches currently live!*\n\n💡 Use ${CONFIG.PREFIX}schedule to see upcoming matches.`,
        }, { quoted: msg });
      }

      // ── Build score message ─────────────────────────────────────
      let scoreSection = '';
      let matchNum     = 1;

      for (const match of liveMatches) {
        const info = formatScore(match);
        if (!info) continue;

        scoreSection += `
╭─『 🏏 *Match ${matchNum} — ${info.matchType}* 』
│ 🏟️  *Venue:* ${info.venue}
│
│ 🔵 *${info.team1}*
│    ${info.score1}
│
│ 🔴 *${info.team2}*
│    ${info.score2}
│
│ 📊 *Status:* ${info.status}
╰──────────────────────────
`;
        matchNum++;
      }

      const scoreMsg = `
╭━━━『 🏏 *LIVE CRICKET SCORES* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Updated:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

${scoreSection}
╭─『 💡 *More Commands* 』
│ \`${CONFIG.PREFIX}schedule\`    → Upcoming matches
│ \`${CONFIG.PREFIX}scorecard\`   → Full scorecard
│ \`${CONFIG.PREFIX}points\`      → Points table
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: scoreMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SCORE-LIVE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Failed to fetch scores!*\n\n⚠️ *Error:* ${error.message}\n\n💡 Try again in a few seconds.`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
