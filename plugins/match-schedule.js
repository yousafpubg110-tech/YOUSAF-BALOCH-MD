/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Match Schedule Plugin ┃
┃       Created by MR YOUSAF BALOCH          ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      timeZone: 'Asia/Karachi', weekday: 'short', day: 'numeric',
      month: 'short', year: 'numeric',
    });
  } catch { return dateStr || 'TBA'; }
}

function formatTime(dateStr) {
  try {
    return new Date(dateStr).toLocaleTimeString('en-PK', {
      timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true,
    }) + ' PKT';
  } catch { return 'Time TBA'; }
}

function detectFilter(input) {
  const lower = (input || '').toLowerCase();
  if (/psl/.test(lower))      return 'psl';
  if (/ipl/.test(lower))      return 'ipl';
  if (/test/.test(lower))     return 'test';
  if (/odi/.test(lower))      return 'odi';
  if (/t20/.test(lower))      return 't20';
  if (/pak|pakistan/.test(lower)) return 'pakistan';
  return 'all';
}

export default {
  command    : ['schedule', 'fixtures', 'upcoming', 'شیڈول'],
  name       : 'match-schedule',
  category   : 'Sports',
  description: 'Upcoming cricket match schedule',
  usage      : '.schedule [psl/ipl/pak/t20/test/odi]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📅');
      const senderNum = sender?.split('@')[0] || 'User';
      const filter    = detectFilter(text);

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📅 *Fetching schedule...*\n🔍 Filter: ${filter.toUpperCase()}\n⏳ Please wait...`,
      }, { quoted: msg });

      const url = new URL('https://api.cricapi.com/v1/matches');
      url.searchParams.set('apikey', CRICAPI_KEY);
      url.searchParams.set('offset', '0');
      if (url.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const data = await fetchData(url.toString());
      let upcoming = data?.data?.filter(m => !m.matchStarted) || [];

      if (filter !== 'all') {
        upcoming = upcoming.filter(m => {
          const name = (m.name || '').toLowerCase();
          const type = (m.matchType || '').toLowerCase();
          if (filter === 'psl')      return name.includes('psl');
          if (filter === 'ipl')      return name.includes('ipl');
          if (filter === 'test')     return type === 'test';
          if (filter === 'odi')      return type === 'odi';
          if (filter === 't20')      return type === 't20';
          if (filter === 'pakistan') return name.includes('pakistan');
          return true;
        });
      }

      upcoming = upcoming.slice(0, 10);

      if (upcoming.length === 0) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No upcoming matches for: ${filter.toUpperCase()}*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      let scheduleSection = '';
      upcoming.forEach((match, i) => {
        const t1    = match.teams?.[0] || 'TBA';
        const t2    = match.teams?.[1] || 'TBA';
        const date  = formatDate(match.date);
        const time  = formatTime(match.dateTimeGMT || match.date);
        const type  = match.matchType?.toUpperCase() || 'MATCH';
        scheduleSection += `│ *${i + 1}.* 🏏 *${t1} vs ${t2}* [${type}]\n│    📅 ${date} | ⏰ ${time}\n│\n`;
      });

      const scheduleMsg = `╭━━━『 📅 *MATCH SCHEDULE* 』━━━╮

👋 *Requested by:* +${senderNum}
🔍 *Filter:* ${filter.toUpperCase()}

╭─『 🏏 *Upcoming Matches* 』
│
${scheduleSection}╰──────────────────────────

╭─『 💡 *Filter Options* 』
│ \`${CONFIG.PREFIX}schedule psl\`  → PSL
│ \`${CONFIG.PREFIX}schedule pak\`  → Pakistan
│ \`${CONFIG.PREFIX}schedule t20\`  → T20
│ \`${CONFIG.PREFIX}schedule test\` → Test
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: scheduleMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SCHEDULE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Schedule failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
