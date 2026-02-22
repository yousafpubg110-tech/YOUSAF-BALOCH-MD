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

// ═══════════════════════════════════════════════════════════════════
// PSL TEAMS DATA — Complete Info
// ═══════════════════════════════════════════════════════════════════
const PSL_TEAMS = {
  // Karachi Kings
  karachi: {
    name     : 'Karachi Kings',
    emoji    : '👑',
    color    : '🔵',
    captain  : 'Imad Wasim',
    coach    : 'Aqib Javed',
    homeGround: 'National Stadium, Karachi',
    titles   : 2,
    founded  : 2016,
    players  : [
      'Imad Wasim', 'Sharjeel Khan', 'Joe Clarke',
      'Mohammad Amir', 'Tabraiz Shamsi', 'Mir Hamza',
    ],
    keywords : ['karachi', 'kings', 'kk', 'کراچی', 'کنگز'],
  },

  // Lahore Qalandars
  lahore: {
    name     : 'Lahore Qalandars',
    emoji    : '🦁',
    color    : '🟢',
    captain  : 'Shaheen Afridi',
    coach    : 'Aaqib Javed',
    homeGround: 'Gaddafi Stadium, Lahore',
    titles   : 2,
    founded  : 2016,
    players  : [
      'Shaheen Shah Afridi', 'Fakhar Zaman', 'Abdullah Shafique',
      'Zaman Khan', 'David Wiese', 'Rashid Khan',
    ],
    keywords : ['lahore', 'qalandars', 'lq', 'لاہور', 'قلندرز'],
  },

  // Islamabad United
  islamabad: {
    name     : 'Islamabad United',
    emoji    : '⚡',
    color    : '🔴',
    captain  : 'Shadab Khan',
    coach    : 'Mike Hesson',
    homeGround: 'Rawalpindi Cricket Stadium',
    titles   : 3,
    founded  : 2016,
    players  : [
      'Shadab Khan', 'Paul Stirling', 'Colin Munro',
      'Naseem Shah', 'Faheem Ashraf', 'Alex Hales',
    ],
    keywords : ['islamabad', 'united', 'iu', 'اسلام آباد', 'یونائیٹڈ'],
  },

  // Peshawar Zalmi
  peshawar: {
    name     : 'Peshawar Zalmi',
    emoji    : '🔥',
    color    : '🟡',
    captain  : 'Babar Azam',
    coach    : 'Daren Sammy',
    homeGround: 'Arbab Niaz Stadium, Peshawar',
    titles   : 1,
    founded  : 2016,
    players  : [
      'Babar Azam', 'Mohammad Haris', 'Bhanuka Rajapaksa',
      'Wahab Riaz', 'Luke Wood', 'Tom Kohler-Cadmore',
    ],
    keywords : ['peshawar', 'zalmi', 'pz', 'پشاور', 'ظلمی', 'زلمی'],
  },

  // Quetta Gladiators
  quetta: {
    name     : 'Quetta Gladiators',
    emoji    : '⚔️',
    color    : '🟣',
    captain  : 'Sarfaraz Ahmed',
    coach    : 'Moin Khan',
    homeGround: 'Bugti Stadium, Quetta',
    titles   : 2,
    founded  : 2016,
    players  : [
      'Sarfaraz Ahmed', 'Jason Roy', 'Rilee Rossouw',
      'Mohammad Nawaz', 'Naseem Shah', 'Sohail Khan',
    ],
    keywords : ['quetta', 'gladiators', 'qg', 'کوئٹہ', 'گلیڈی ایٹرز'],
  },

  // Multan Sultans
  multan: {
    name     : 'Multan Sultans',
    emoji    : '👸',
    color    : '🔵',
    captain  : 'Mohammad Rizwan',
    coach    : 'Andy Flower',
    homeGround: 'Multan Cricket Stadium',
    titles   : 2,
    founded  : 2018,
    players  : [
      'Mohammad Rizwan', 'Shan Masood', 'Tim David',
      'Khushdil Shah', 'Ihsanullah', 'Usama Mir',
    ],
    keywords : ['multan', 'sultans', 'ms', 'ملتان', 'سلطانز'],
  },
};

// ═══════════════════════════════════════════════════════════════════
// PSL SEASON DATA
// ═══════════════════════════════════════════════════════════════════
const PSL_INFO = {
  season      : 10,
  year        : 2025,
  fullName    : 'Pakistan Super League Season 10',
  startDate   : '14 February 2025',
  endDate     : '18 March 2025',
  teams       : 6,
  totalMatches: 34,
  format      : 'T20',
  organizer   : 'Pakistan Cricket Board (PCB)',
  defending   : 'Multan Sultans',
  venues      : [
    'National Stadium Karachi',
    'Gaddafi Stadium Lahore',
    'Rawalpindi Cricket Stadium',
    'Multan Cricket Stadium',
  ],
  pastWinners : {
    'PSL 1 (2016)' : 'Islamabad United',
    'PSL 2 (2017)' : 'Peshawar Zalmi',
    'PSL 3 (2018)' : 'Islamabad United',
    'PSL 4 (2019)' : 'Quetta Gladiators',
    'PSL 5 (2020)' : 'Karachi Kings',
    'PSL 6 (2021)' : 'Islamabad United',
    'PSL 7 (2022)' : 'Lahore Qalandars',
    'PSL 8 (2023)' : 'Lahore Qalandars',
    'PSL 9 (2024)' : 'Multan Sultans',
  },
};

// ─── Helper: Detect team from user input ─────────────────────────────────────
function detectTeam(input) {
  const lower = input.toLowerCase().trim();
  for (const [key, team] of Object.entries(PSL_TEAMS)) {
    if (team.keywords.some(kw => lower.includes(kw))) {
      return { key, ...team };
    }
  }
  return null;
}

// ─── Helper: Detect intent ───────────────────────────────────────────────────
function detectIntent(input) {
  const lower = input.toLowerCase();

  // Score intent
  if (/score|skor|result|نتیجہ|اسکور|live|لائیو/.test(lower)) {
    return 'score';
  }
  // Schedule intent
  if (/schedule|fixture|match|میچ|ٹائم|time|date|tarikh|تاریخ/.test(lower)) {
    return 'schedule';
  }
  // Points table intent
  if (/point|table|standing|پوائنٹ|ٹیبل/.test(lower)) {
    return 'points';
  }
  // Team detail intent
  if (/team|ٹیم|player|کھلاڑی|squad|detail|info|تفصیل/.test(lower)) {
    return 'team';
  }
  // General PSL info
  return 'general';
}

// ─── Helper: Fetch live PSL score from CricAPI ───────────────────────────────
async function fetchLiveScore(teamName) {
  try {
    const apiKey = process.env.CRICAPI_KEY || '';
    if (!apiKey) return null;

    // ✅ CodeQL Fix: URL() used for safe construction
    const url = new URL('https://api.cricapi.com/v1/currentMatches');
    url.searchParams.set('apikey', apiKey);
    url.searchParams.set('offset', '0');

    if (url.hostname !== 'api.cricapi.com') return null;

    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 15000);

    const res  = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();

    if (!data?.data) return null;

    // Find PSL match
    const pslMatch = data.data.find(m => {
      const name = (m.name || '').toLowerCase();
      return name.includes('psl') ||
             name.includes('pakistan super league') ||
             (teamName && name.includes(teamName.toLowerCase()));
    });

    return pslMatch || null;
  } catch {
    return null;
  }
}

// ─── Build: Team Detail Message ──────────────────────────────────────────────
function buildTeamMsg(team, senderNum, year) {
  const playerList = team.players.map((p, i) => `│ ${i + 1}. ${p}`).join('\n');

  return `
╭━━━『 ${team.emoji} *${team.name.toUpperCase()}* 』━━━╮

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
│ 📅 *Season:*  PSL ${PSL_INFO.season} (${PSL_INFO.year})
│ 🗓️  *Period:*  ${PSL_INFO.startDate} → ${PSL_INFO.endDate}
│ 🏆 *Defending:* ${PSL_INFO.defending}
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();
}

// ─── Build: General PSL Info Message ─────────────────────────────────────────
function buildGeneralMsg(senderNum, year) {
  const winnersSection = Object.entries(PSL_INFO.pastWinners)
    .map(([season, winner]) => `│ 🏆 ${season}: *${winner}*`)
    .join('\n');

  const venuesSection = PSL_INFO.venues
    .map(v => `│ 🏟️  ${v}`)
    .join('\n');

  const teamsSection = Object.values(PSL_TEAMS)
    .map(t => `│ ${t.emoji} *${t.name}* — Captain: ${t.captain}`)
    .join('\n');

  return `
╭━━━『 🏏 *PSL ${PSL_INFO.season} COMPLETE INFO* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📋 *Tournament Details* 』
│ 🏏 *Name:*     ${PSL_INFO.fullName}
│ 📅 *Start:*    ${PSL_INFO.startDate}
│ 📅 *End:*      ${PSL_INFO.endDate}
│ 🎯 *Format:*   ${PSL_INFO.format}
│ 👥 *Teams:*    ${PSL_INFO.teams}
│ 🎮 *Matches:*  ${PSL_INFO.totalMatches}
│ 🏆 *Defending:* ${PSL_INFO.defending}
│ 📡 *Organizer:* ${PSL_INFO.organizer}
╰──────────────────────────

╭─『 👥 *All Teams & Captains* 』
${teamsSection}
╰──────────────────────────

╭─『 🏟️  *Venues* 』
${venuesSection}
╰──────────────────────────

╭─『 🏆 *PSL Champions History* 』
${winnersSection}
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}psl karachi\`   → Karachi Kings
│ \`${CONFIG.PREFIX}psl lahore\`    → Lahore Qalandars
│ \`${CONFIG.PREFIX}psl islamabad\` → Islamabad United
│ \`${CONFIG.PREFIX}psl peshawar\`  → Peshawar Zalmi
│ \`${CONFIG.PREFIX}psl quetta\`    → Quetta Gladiators
│ \`${CONFIG.PREFIX}psl multan\`    → Multan Sultans
│ \`${CONFIG.PREFIX}psl score\`     → Live PSL Score
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();
}

// ─── Build: Live Score Message ───────────────────────────────────────────────
function buildScoreMsg(match, senderNum, year) {
  if (!match) {
    return `
╭━━━『 🏏 *PSL LIVE SCORE* 』━━━╮

⚠️ *No PSL match live right now!*

💡 Try:
▸ \`${CONFIG.PREFIX}psl\`        → PSL info
▸ \`${CONFIG.PREFIX}schedule\`   → Upcoming matches

_© ${year} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();
  }

  const t1     = match.teams?.[0]  || 'Team 1';
  const t2     = match.teams?.[1]  || 'Team 2';
  const s1     = match.score?.[0]
    ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o} ov)`
    : 'Yet to bat';
  const s2     = match.score?.[1]
    ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o} ov)`
    : 'Yet to bat';
  const status = match.status || 'Live';
  const venue  = match.venue  || 'Pakistan';
  const time   = new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' });

  return `
╭━━━『 🏏 *PSL LIVE SCORE* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Updated:* ${time} PKT

╭─『 🏟️  *Match Details* 』
│ 🏟️  *Venue:* ${venue}
│ 🎯 *Format:* T20 | PSL ${PSL_INFO.season}
╰──────────────────────────

╭─『 📊 *Scorecard* 』
│
│ 🔵 *${t1}*
│    ${s1}
│
│ 🔴 *${t2}*
│    ${s2}
│
│ 📢 *Status:* ${status}
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command: [
    'psl', 'PSL',
    // Roman Urdu triggers
    'psl score', 'psl info', 'psl team',
  ],
  name       : 'match-psl',
  category   : 'Sports',
  description: 'PSL complete info — teams, scores, schedule, history',
  usage      : '.psl [team name / score / info]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('🏏');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();
      const input     = (text || args?.join(' ') || '').trim();

      // ── Detect intent ───────────────────────────────────────────
      const intent = detectIntent(input);
      const team   = detectTeam(input);

      // ── CASE 1: Team detail requested ───────────────────────────
      if (team && (intent === 'team' || intent === 'general')) {
        const teamMsg = buildTeamMsg(team, senderNum, year);
        await sock.sendMessage(from, { text: teamMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 2: Live score requested ────────────────────────────
      if (intent === 'score') {
        await sock.sendMessage(from, {
          text: `🏏 *Fetching PSL live score...*\n⏳ Please wait...`,
        }, { quoted: msg });

        const liveMatch = await fetchLiveScore(team?.name || 'PSL');
        const scoreMsg  = buildScoreMsg(liveMatch, senderNum, year);
        await sock.sendMessage(from, { text: scoreMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 3: Team name given but general info ─────────────────
      if (team) {
        const teamMsg = buildTeamMsg(team, senderNum, year);
        await sock.sendMessage(from, { text: teamMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 4: General PSL info (default) ──────────────────────
      const generalMsg = buildGeneralMsg(senderNum, year);
      await sock.sendMessage(from, { text: generalMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PSL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *PSL command error!*\n\n⚠️ ${error.message}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
