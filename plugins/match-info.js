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

export default {
  command    : ['matchinfo', 'minfo', 'result', 'lastmatch'],
  name       : 'match-info',
  category   : 'Sports',
  description: 'Match summary and recent results',
  usage      : '.matchinfo',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏏');
      const senderNum = sender?.split('@')[0] || 'User';

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🏏 *Fetching match info...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const url  = new URL('https://api.cricapi.com/v1/matches');
      url.searchParams.set('apikey', CRICAPI_KEY);
      url.searchParams.set('offset', '0');
      if (url.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const data      = await fetchData(url.toString());
      const completed = data?.data?.filter(m => m.matchEnded).slice(0, 4) || [];
      const upcoming  = data?.data?.filter(m => !m.matchStarted).slice(0, 3) || [];

      let completedSection = '';
      for (const match of completed) {
        completedSection += `│ 🏆 *${match.teams?.[0]} vs ${match.teams?.[1]}*\n│    ↳ ${match.status || 'Result N/A'}\n│\n`;
      }

      let upcomingSection = '';
      for (const match of upcoming) {
        const date = match.date ? new Date(match.date).toLocaleDateString('en-PK') : 'TBA';
        upcomingSection += `│ 📅 *${match.teams?.[0]} vs ${match.teams?.[1]}*\n│    ↳ ${date}\n│\n`;
      }

      const infoMsg = `╭━━━『 🏏 *MATCH INFO & RESULTS* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 ✅ *Recent Results* 』
│
${completedSection || '│ No recent results\n│\n'}╰──────────────────────────

╭─『 📅 *Upcoming Matches* 』
│
${upcomingSection || '│ No upcoming matches\n│\n'}╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}score\`     → Live scores
│ \`${CONFIG.PREFIX}schedule\`  → Full schedule
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: infoMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[MATCH-INFO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Match info failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
