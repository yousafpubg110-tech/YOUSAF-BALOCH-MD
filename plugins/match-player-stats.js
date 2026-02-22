/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Player Stats Plugin    ┃
┃       Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

const PAK_PLAYERS = {
  'babar azam'     : { role: 'Batsman',               country: 'Pakistan 🇵🇰', tests: 'Avg: 45.12', odis: 'Avg: 57.43', t20s: 'Avg: 44.21' },
  'shaheen afridi' : { role: 'Bowler',                 country: 'Pakistan 🇵🇰', tests: 'Wkts: 100+', odis: 'Eco: 5.1',  t20s: 'Eco: 7.2'  },
  'fakhar zaman'   : { role: 'Batsman',                country: 'Pakistan 🇵🇰', tests: 'Avg: 36.1',  odis: 'Avg: 43.21', t20s: 'Avg: 33.1' },
  'shadab khan'    : { role: 'All-rounder',            country: 'Pakistan 🇵🇰', tests: 'Avg: 28',    odis: 'Eco: 4.9',  t20s: 'Eco: 7.1'  },
  'mohammad rizwan': { role: 'Wicket-keeper Batsman',  country: 'Pakistan 🇵🇰', tests: 'Avg: 46.2',  odis: 'Avg: 52.1', t20s: 'Avg: 48.3' },
  'naseem shah'    : { role: 'Bowler',                 country: 'Pakistan 🇵🇰', tests: 'Wkts: 60+',  odis: 'Eco: 5.3',  t20s: 'Eco: 7.8'  },
};

export default {
  command    : ['player', 'stats', 'playerstats', 'کھلاڑی'],
  name       : 'match-player-stats',
  category   : 'Sports',
  description: 'Cricket player stats and history',
  usage      : '.player <name>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏏');
      const senderNum  = sender?.split('@')[0] || 'User';
      const playerName = (text || args?.join(' ') || '').trim().toLowerCase();

      if (!playerName) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a player name!*\n\n📌 *Usage:* ${CONFIG.PREFIX}player <name>\n\n💡 *Examples:*\n▸ ${CONFIG.PREFIX}player Babar Azam\n▸ ${CONFIG.PREFIX}player Shaheen Afridi\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🔍 *Searching: ${playerName}...*\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Quick Pakistan players lookup ───────────────────────────
      const quickMatch = Object.entries(PAK_PLAYERS).find(([name]) =>
        playerName.includes(name) || name.includes(playerName)
      );

      if (quickMatch) {
        const [name, info] = quickMatch;
        const displayName  = name.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

        const playerMsg = `╭━━━『 🏏 *PLAYER STATS* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 👤 *Player Info* 』
│ 🧑 *Name:*    ${displayName}
│ 🌍 *Country:* ${info.country}
│ 🏏 *Role:*    ${info.role}
╰──────────────────────────

╭─『 📊 *Career Stats* 』
│ 📋 *Tests:* ${info.tests}
│ 📋 *ODIs:*  ${info.odis}
│ 📋 *T20Is:* ${info.t20s}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

        await sock.sendMessage(from, { text: playerMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── API search ──────────────────────────────────────────────
      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `⚠️ *Player not in quick database.*\n\n📌 Add CRICAPI_KEY to .env for full search.\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const searchUrl = new URL('https://api.cricapi.com/v1/players');
      searchUrl.searchParams.set('apikey',  CRICAPI_KEY);
      searchUrl.searchParams.set('offset',  '0');
      searchUrl.searchParams.set('search',  playerName);
      if (searchUrl.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const searchData = await fetchData(searchUrl.toString());
      const players    = searchData?.data || [];

      if (players.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Player "${playerName}" not found!*\n\n💡 Try full name.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const p = players[0];
      await sock.sendMessage(from, {
        text: `╭━━━『 🏏 *PLAYER STATS* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 👤 *Player Info* 』
│ 🧑 *Name:*    ${p.name     || 'N/A'}
│ 🌍 *Country:* ${p.country  || 'N/A'}
│ 🏏 *Role:*    ${p.role     || 'N/A'}
│ 🤚 *Batting:* ${p.battingStyle  || 'N/A'}
│ 🎳 *Bowling:* ${p.bowlingStyle  || 'N/A'}
│ 🎂 *Born:*    ${p.dateOfBirth   || 'N/A'}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim(),
      }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PLAYER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Player search failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
