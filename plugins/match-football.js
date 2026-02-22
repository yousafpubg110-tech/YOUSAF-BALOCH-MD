/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Football Score Plugin ┃
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

const FOOTBALL_KEY = process.env.FOOTBALL_API_KEY || '';
const API_BASE     = 'https://v3.football.api-sports.io';

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

// ─── Helper: Fetch football API ───────────────────────────────────────────────
async function fetchFootball(endpoint, params = {}, timeoutMs = 15000) {
  // ✅ CodeQL Fix: URL() for safe construction
  const url = new URL(`${API_BASE}/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (url.hostname !== 'v3.football.api-sports.io') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url.toString(), {
      signal  : controller.signal,
      headers : { 'x-apisports-key': FOOTBALL_KEY },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

// ─── Helper: Detect league ────────────────────────────────────────────────────
function detectLeague(input) {
  const lower = (input || '').toLowerCase();
  if (/premier|epl|england/.test(lower))     return { id: 39,  name: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿' };
  if (/laliga|la liga|spain/.test(lower))    return { id: 140, name: 'La Liga 🇪🇸' };
  if (/serie a|italy/.test(lower))           return { id: 135, name: 'Serie A 🇮🇹' };
  if (/bundesliga|germany/.test(lower))      return { id: 78,  name: 'Bundesliga 🇩🇪' };
  if (/ligue|france/.test(lower))            return { id: 61,  name: 'Ligue 1 🇫🇷' };
  if (/champions|ucl/.test(lower))           return { id: 2,   name: 'Champions League 🏆' };
  if (/europa/.test(lower))                  return { id: 3,   name: 'Europa League 🏆' };
  return { id: 39, name: 'Premier League 🏴󠁧󠁢󠁥󠁮󠁧󠁿' };
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['football', 'soccer', 'epl', 'laliga', 'ucl', 'فٹبال'],
  name       : 'match-football',
  category   : 'Sports',
  description: 'Live football scores from all major leagues',
  usage      : '.football [league name]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('⚽');
      const senderNum = sender?.split('@')[0] || 'User';
      const league    = detectLeague(text);

      if (!FOOTBALL_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *FOOTBALL_API_KEY not set!*\n\n📌 Add to .env\n🔗 Free: https://api-football.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `⚽ *Fetching ${league.name} scores...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const today = new Date().toISOString().split('T')[0];
      const data  = await fetchFootball('fixtures', {
        league: league.id,
        season: new Date().getFullYear(),
        date  : today,
        live  : 'all',
      });

      const fixtures = data?.response || [];

      if (fixtures.length === 0) {
        const todayData     = await fetchFootball('fixtures', {
          league: league.id,
          season: new Date().getFullYear(),
          date  : today,
        });
        const todayFixtures = todayData?.response?.slice(0, 5) || [];

        if (todayFixtures.length === 0) {
          return await sock.sendMessage(from, {
            text: `⚽ *No ${league.name} matches today!*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        let fixtureSection = '';
        for (const f of todayFixtures) {
          const home   = f.teams?.home?.name || 'Home';
          const away   = f.teams?.away?.name || 'Away';
          const hGoal  = f.goals?.home ?? '-';
          const aGoal  = f.goals?.away ?? '-';
          const status = f.fixture?.status?.short || 'NS';
          const time   = f.fixture?.date
            ? new Date(f.fixture.date).toLocaleTimeString('en-PK', {
                timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true,
              })
            : 'TBA';
          fixtureSection += `│ ⚽ *${home}* ${hGoal} - ${aGoal} *${away}*\n│    ⏰ ${time} | 📊 ${status}\n│\n`;
        }

        await sock.sendMessage(from, {
          text: `╭━━━『 ⚽ *${league.name} TODAY* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📅 *Today Fixtures* 』
│
${fixtureSection}╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim(),
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      let liveSection = '';
      for (const f of fixtures.slice(0, 6)) {
        const home    = f.teams?.home?.name || 'Home';
        const away    = f.teams?.away?.name || 'Away';
        const hGoal   = f.goals?.home ?? 0;
        const aGoal   = f.goals?.away ?? 0;
        const minute  = f.fixture?.status?.elapsed ? `${f.fixture.status.elapsed}'` : 'FT';
        liveSection  += `│ 🔴 LIVE | ${minute}\n│ ⚽ *${home}* ${hGoal} - ${aGoal} *${away}*\n│\n`;
      }

      const footballMsg = `╭━━━『 ⚽ *LIVE FOOTBALL* 』━━━╮

👋 *Requested by:* +${senderNum}
🏆 *League:* ${league.name}
🕐 *Updated:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

╭─『 🔴 *Live Matches* 』
│
${liveSection}╰──────────────────────────

╭─『 💡 *Leagues* 』
│ \`${CONFIG.PREFIX}football epl\`        → Premier League
│ \`${CONFIG.PREFIX}football laliga\`     → La Liga
│ \`${CONFIG.PREFIX}football ucl\`        → Champions League
│ \`${CONFIG.PREFIX}football bundesliga\` → Bundesliga
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: footballMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[FOOTBALL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Football fetch failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
