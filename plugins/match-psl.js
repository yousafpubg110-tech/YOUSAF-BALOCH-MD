/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - PSL Match Plugin   ┃
┃       Created by MR YOUSAF BALOCH       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

// ─── PSL Teams ────────────────────────────────────────────────────────────────
const PSL_TEAMS = {
  karachi: {
    name: 'Karachi Kings', emoji: '👑', color: '🔵',
    captain: 'Imad Wasim', coach: 'Aqib Javed',
    homeGround: 'National Stadium, Karachi', titles: 2, founded: 2016,
    players: ['Imad Wasim', 'Sharjeel Khan', 'Joe Clarke', 'Mohammad Amir'],
    keywords: ['karachi', 'kings', 'kk', 'کراچی', 'کنگز'],
  },
  lahore: {
    name: 'Lahore Qalandars', emoji: '🦁', color: '🟢',
    captain: 'Shaheen Afridi', coach: 'Aaqib Javed',
    homeGround: 'Gaddafi Stadium, Lahore', titles: 2, founded: 2016,
    players: ['Shaheen Afridi', 'Fakhar Zaman', 'Abdullah Shafique', 'Rashid Khan'],
    keywords: ['lahore', 'qalandars', 'lq', 'لاہور', 'قلندرز'],
  },
  islamabad: {
    name: 'Islamabad United', emoji: '⚡', color: '🔴',
    captain: 'Shadab Khan', coach: 'Mike Hesson',
    homeGround: 'Rawalpindi Cricket Stadium', titles: 3, founded: 2016,
    players: ['Shadab Khan', 'Paul Stirling', 'Colin Munro', 'Naseem Shah'],
    keywords: ['islamabad', 'united', 'iu', 'اسلام آباد', 'یونائیٹڈ'],
  },
  peshawar: {
    name: 'Peshawar Zalmi', emoji: '🔥', color: '🟡',
    captain: 'Babar Azam', coach: 'Daren Sammy',
    homeGround: 'Arbab Niaz Stadium, Peshawar', titles: 1, founded: 2016,
    players: ['Babar Azam', 'Mohammad Haris', 'Wahab Riaz', 'Luke Wood'],
    keywords: ['peshawar', 'zalmi', 'pz', 'پشاور', 'ظلمی', 'زلمی'],
  },
  quetta: {
    name: 'Quetta Gladiators', emoji: '⚔️', color: '🟣',
    captain: 'Sarfaraz Ahmed', coach: 'Moin Khan',
    homeGround: 'Bugti Stadium, Quetta', titles: 2, founded: 2016,
    players: ['Sarfaraz Ahmed', 'Jason Roy', 'Rilee Rossouw', 'Mohammad Nawaz'],
    keywords: ['quetta', 'gladiators', 'qg', 'کوئٹہ', 'گلیڈی ایٹرز'],
  },
  multan: {
    name: 'Multan Sultans', emoji: '👸', color: '🔵',
    captain: 'Mohammad Rizwan', coach: 'Andy Flower',
    homeGround: 'Multan Cricket Stadium', titles: 2, founded: 2018,
    players: ['Mohammad Rizwan', 'Shan Masood', 'Tim David', 'Ihsanullah'],
    keywords: ['multan', 'sultans', 'ms', 'ملتان', 'سلطانز'],
  },
};

const PSL_INFO = {
  season: 10, year: 2025,
  startDate: '14 February 2025', endDate: '18 March 2025',
  teams: 6, totalMatches: 34, defending: 'Multan Sultans',
  pastWinners: {
    'PSL 1 (2016)': 'Islamabad United', 'PSL 2 (2017)': 'Peshawar Zalmi',
    'PSL 3 (2018)': 'Islamabad United', 'PSL 4 (2019)': 'Quetta Gladiators',
    'PSL 5 (2020)': 'Karachi Kings',    'PSL 6 (2021)': 'Islamabad United',
    'PSL 7 (2022)': 'Lahore Qalandars', 'PSL 8 (2023)': 'Lahore Qalandars',
    'PSL 9 (2024)': 'Multan Sultans',
  },
};

function detectTeam(input) {
  const lower = (input || '').toLowerCase().trim();
  for (const [key, team] of Object.entries(PSL_TEAMS)) {
    if (team.keywords.some(kw => lower.includes(kw))) return { key, ...team };
  }
  return null;
}

function detectIntent(input) {
  const lower = (input || '').toLowerCase();
  if (/score|skor|result|نتیجہ|اسکور|live|لائیو/.test(lower)) return 'score';
  if (/schedule|میچ|ٹائم|time|date|تاریخ/.test(lower))        return 'schedule';
  if (/point|table|standing|پوائنٹ|ٹیبل/.test(lower))         return 'points';
  return 'general';
}

async function fetchLiveScore(teamName) {
  try {
    const apiKey = process.env.CRICAPI_KEY || '';
    if (!apiKey) return null;
    const url = new URL('https://api.cricapi.com/v1/currentMatches');
    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('offset', '0');
    if (url.hostname !== 'api.cricapi.com') return null;
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 15000);
    const res        = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.find(m => {
      const name = (m.name || '').toLowerCase();
      return name.includes('psl') || (teamName && name.includes(teamName.toLowerCase()));
    }) || null;
  } catch { return null; }
}

export default {
  command    : ['psl', 'PSL'],
  name       : 'match-psl',
  category   : 'Sports',
  description: 'PSL complete info — teams, scores, schedule, history',
  usage      : '.psl [team / score / info]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏏');
      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();
      const intent    = detectIntent(input);
      const team      = detectTeam(input);

      // ── CASE 1: Team detail ─────────────────────────────────────
      if (team && intent !== 'score') {
        const playerList = team.players.map((p, i) => `│ ${i + 1}. ${p}`).join('\n');
        const teamMsg    = `╭━━━『 ${team.emoji} *${team.name.toUpperCase()}* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📋 *Team Info* 』
│ ${team.color} *Team:*       ${team.name}
│ 👑 *Captain:*    ${team.captain}
│ 🎓 *Coach:*      ${team.coach}
│ 🏟️  *Home Ground:* ${team.homeGround}
│ 🏆 *PSL Titles:* ${team.titles}
│ 📅 *Founded:*    ${team.founded}
╰──────────────────────────

╭─『 👥 *Key Players* 』
${playerList}
╰──────────────────────────

╭─『 🏆 *PSL ${PSL_INFO.season} Info* 』
│ 📅 ${PSL_INFO.startDate} → ${PSL_INFO.endDate}
│ 🏆 *Defending:* ${PSL_INFO.defending}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

        await sock.sendMessage(from, { text: teamMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 2: Live score ──────────────────────────────────────
      if (intent === 'score') {
        await sock.sendMessage(from, {
          text: `🏏 *Fetching PSL live score...*\n⏳ Please wait...`,
        }, { quoted: msg });

        const live = await fetchLiveScore(team?.name || 'PSL');
        if (!live) {
          await sock.sendMessage(from, {
            text: `⚠️ *No PSL match live right now!*\n\n💡 Use ${CONFIG.PREFIX}schedule\n\n${ownerFooter()}`,
          }, { quoted: msg });
          if (typeof msg.react === 'function') await msg.react('✅');
          return;
        }

        const t1 = live.teams?.[0] || 'Team 1';
        const t2 = live.teams?.[1] || 'Team 2';
        const s1 = live.score?.[0] ? `${live.score[0].r}/${live.score[0].w} (${live.score[0].o} ov)` : 'Yet to bat';
        const s2 = live.score?.[1] ? `${live.score[1].r}/${live.score[1].w} (${live.score[1].o} ov)` : 'Yet to bat';

        const scoreMsg = `╭━━━『 🏏 *PSL LIVE SCORE* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

╭─『 📊 *Scorecard* 』
│ 🔵 *${t1}:* ${s1}
│ 🔴 *${t2}:* ${s2}
│ 📢 *${live.status || 'Live'}*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

        await sock.sendMessage(from, { text: scoreMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 3: General PSL info ────────────────────────────────
      const winnersSection = Object.entries(PSL_INFO.pastWinners)
        .map(([s, w]) => `│ 🏆 ${s}: *${w}*`).join('\n');
      const teamsSection = Object.values(PSL_TEAMS)
        .map(t => `│ ${t.emoji} *${t.name}* — ${t.captain}`).join('\n');

      const generalMsg = `╭━━━『 🏏 *PSL ${PSL_INFO.season} COMPLETE INFO* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📋 *Tournament* 』
│ 📅 ${PSL_INFO.startDate} → ${PSL_INFO.endDate}
│ 👥 *Teams:* ${PSL_INFO.teams} | 🎮 *Matches:* ${PSL_INFO.totalMatches}
│ 🏆 *Defending:* ${PSL_INFO.defending}
╰──────────────────────────

╭─『 👥 *Teams & Captains* 』
${teamsSection}
╰──────────────────────────

╭─『 🏆 *PSL Champions* 』
${winnersSection}
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}psl karachi\`   → Karachi Kings
│ \`${CONFIG.PREFIX}psl lahore\`    → Lahore Qalandars
│ \`${CONFIG.PREFIX}psl islamabad\` → Islamabad United
│ \`${CONFIG.PREFIX}psl peshawar\`  → Peshawar Zalmi
│ \`${CONFIG.PREFIX}psl quetta\`    → Quetta Gladiators
│ \`${CONFIG.PREFIX}psl multan\`    → Multan Sultans
│ \`${CONFIG.PREFIX}psl score\`     → Live score
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: generalMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PSL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *PSL error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
