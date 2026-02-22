/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - IPL Match Plugin   ┃
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

const IPL_TEAMS = {
  csk : { name: 'Chennai Super Kings',           emoji: '🦁', captain: 'MS Dhoni',         titles: 5, keywords: ['csk','chennai','چینائی'] },
  mi  : { name: 'Mumbai Indians',                emoji: '🔵', captain: 'Hardik Pandya',     titles: 5, keywords: ['mi','mumbai','ممبئی'] },
  rcb : { name: 'Royal Challengers Bengaluru',   emoji: '🔴', captain: 'Faf du Plessis',    titles: 0, keywords: ['rcb','royal','bangalore'] },
  kkr : { name: 'Kolkata Knight Riders',         emoji: '🟣', captain: 'Shreyas Iyer',      titles: 3, keywords: ['kkr','kolkata','کولکتہ'] },
  dc  : { name: 'Delhi Capitals',                emoji: '🔵', captain: 'Rishabh Pant',      titles: 0, keywords: ['dc','delhi','دہلی'] },
  pbks: { name: 'Punjab Kings',                  emoji: '🔴', captain: 'Shikhar Dhawan',    titles: 1, keywords: ['pbks','punjab','پنجاب'] },
  rr  : { name: 'Rajasthan Royals',              emoji: '🩷', captain: 'Sanju Samson',      titles: 2, keywords: ['rr','rajasthan','راجستھان'] },
  srh : { name: 'Sunrisers Hyderabad',           emoji: '🟠', captain: 'Pat Cummins',       titles: 1, keywords: ['srh','sunrisers','hyderabad'] },
  lsg : { name: 'Lucknow Super Giants',          emoji: '🔵', captain: 'KL Rahul',          titles: 0, keywords: ['lsg','lucknow'] },
  gt  : { name: 'Gujarat Titans',                emoji: '🟦', captain: 'Shubman Gill',      titles: 2, keywords: ['gt','gujarat','گجرات'] },
};

function detectTeam(input) {
  const lower = (input || '').toLowerCase();
  for (const [key, team] of Object.entries(IPL_TEAMS)) {
    if (team.keywords.some(kw => lower.includes(kw))) return { key, ...team };
  }
  return null;
}

async function fetchIPLScore() {
  try {
    if (!CRICAPI_KEY) return null;
    const url = new URL('https://api.cricapi.com/v1/currentMatches');
    url.searchParams.set('apikey', CRICAPI_KEY);
    url.searchParams.set('offset', '0');
    if (url.hostname !== 'api.cricapi.com') return null;
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 15000);
    const res        = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.find(m => (m.name || '').toLowerCase().includes('ipl')) || null;
  } catch { return null; }
}

export default {
  command    : ['ipl', 'IPL'],
  name       : 'match-ipl',
  category   : 'Sports',
  description: 'IPL complete info — teams, scores, history',
  usage      : '.ipl [team / score]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏏');
      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();
      const team      = detectTeam(input);

      // ── CASE 1: Team detail ─────────────────────────────────────
      if (team) {
        const teamMsg = `╭━━━『 ${team.emoji} *${team.name.toUpperCase()}* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📋 *Team Info* 』
│ 🏏 *Team:*    ${team.name}
│ 👑 *Captain:* ${team.captain}
│ 🏆 *Titles:*  ${team.titles}
╰──────────────────────────

╭─『 💡 *More Commands* 』
│ \`${CONFIG.PREFIX}ipl score\` → Live score
│ \`${CONFIG.PREFIX}ipl\`       → All teams
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

        await sock.sendMessage(from, { text: teamMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 2: Live score ──────────────────────────────────────
      if (/score|live|skor/.test(input)) {
        await sock.sendMessage(from, {
          text: `🏏 *Fetching IPL live score...*\n⏳ Please wait...`,
        }, { quoted: msg });

        const live = await fetchIPLScore();
        if (!live) {
          await sock.sendMessage(from, {
            text: `⚠️ *No IPL match live right now!*\n\n💡 IPL season may not be active.\n\n${ownerFooter()}`,
          }, { quoted: msg });
          if (typeof msg.react === 'function') await msg.react('✅');
          return;
        }

        const t1 = live.teams?.[0] || 'Team 1';
        const t2 = live.teams?.[1] || 'Team 2';
        const s1 = live.score?.[0] ? `${live.score[0].r}/${live.score[0].w} (${live.score[0].o} ov)` : 'Yet to bat';
        const s2 = live.score?.[1] ? `${live.score[1].r}/${live.score[1].w} (${live.score[1].o} ov)` : 'Yet to bat';

        await sock.sendMessage(from, {
          text: `╭━━━『 🏏 *IPL LIVE SCORE* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

╭─『 📊 *Score* 』
│ 🔵 *${t1}:* ${s1}
│ 🔴 *${t2}:* ${s2}
│ 📢 *${live.status || 'Live'}*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim(),
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── CASE 3: General IPL info ────────────────────────────────
      const teamsSection = Object.values(IPL_TEAMS)
        .map(t => `│ ${t.emoji} *${t.name}* — 🏆 ${t.titles}`).join('\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 🏏 *IPL COMPLETE INFO* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 👥 *All IPL Teams* 』
${teamsSection}
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}ipl csk\`   → Chennai
│ \`${CONFIG.PREFIX}ipl mi\`    → Mumbai
│ \`${CONFIG.PREFIX}ipl rcb\`   → Bangalore
│ \`${CONFIG.PREFIX}ipl score\` → Live score
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim(),
      }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[IPL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *IPL error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
