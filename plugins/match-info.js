/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Match Info Plugin   ┃
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

// ─── Helper: Build safe API URL ───────────────────────────────────────────────
function buildApiUrl(endpoint, params = {}) {
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set('apikey', CRICAPI_KEY);
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  if (url.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');
  return url.toString();
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['matchinfo', 'minfo', 'result', 'lastmatch'],
  name       : 'match-info',
  category   : 'Sports',
  description: 'Get match summary and recent results',
  usage      : '.matchinfo',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      if (typeof msg.react === 'function') await msg.react('🏏');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set in .env!*\n🔗 Get free key: https://cricapi.com`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🏏 *Fetching match info...*\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Fetch recent matches ────────────────────────────────────
      const apiUrl = buildApiUrl('matches', { offset: 0 });
      const data   = await fetchData(apiUrl);

      if (!data?.data || data.data.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *No match data available!*`,
        }, { quoted: msg });
      }

      // ── Get completed matches ───────────────────────────────────
      const completed = data.data
        .filter(m => m.matchEnded)
        .slice(0, 4);

      // ── Get upcoming matches ────────────────────────────────────
      const upcoming = data.data
        .filter(m => !m.matchStarted)
        .slice(0, 3);

      // ── Build completed section ─────────────────────────────────
      let completedSection = '';
      for (const match of completed) {
        const t1     = match.teams?.[0] || 'Team 1';
        const t2     = match.teams?.[1] || 'Team 2';
        const status = match.status     || 'Result N/A';
        const type   = match.matchType?.toUpperCase() || 'MATCH';
        completedSection += `│ 🏆 *${t1} vs ${t2}* [${type}]\n│    ↳ ${status}\n│\n`;
      }

      // ── Build upcoming section ──────────────────────────────────
      let upcomingSection = '';
      for (const match of upcoming) {
        const t1   = match.teams?.[0] || 'Team 1';
        const t2   = match.teams?.[1] || 'Team 2';
        const date = match.date
          ? new Date(match.date).toLocaleDateString('en-PK')
          : 'TBA';
        const type = match.matchType?.toUpperCase() || 'MATCH';
        upcomingSection += `│ 📅 *${t1} vs ${t2}* [${type}]\n│    ↳ Date: ${date}\n│\n`;
      }

      const infoMsg = `
╭━━━『 🏏 *MATCH INFO & RESULTS* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 ✅ *Recent Results* 』
│
${completedSection || '│ No recent results\n│\n'}╰──────────────────────────

╭─『 📅 *Upcoming Matches* 』
│
${upcomingSection || '│ No upcoming matches found\n│\n'}╰──────────────────────────

╭─『 💡 *More Commands* 』
│ \`${CONFIG.PREFIX}score\`      → Live scores
│ \`${CONFIG.PREFIX}schedule\`   → Full schedule
│ \`${CONFIG.PREFIX}scorecard\`  → Full scorecard
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, { text: infoMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[MATCH-INFO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Failed to fetch match info!*\n⚠️ ${error.message}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
