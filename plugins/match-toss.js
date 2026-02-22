/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Toss Plugin       ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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
  command    : ['toss', 'ٹاس'],
  name       : 'match-toss',
  category   : 'Sports',
  description: 'Latest toss update from live match',
  usage      : '.toss',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🪙');
      const senderNum = sender?.split('@')[0] || 'User';

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🪙 *Fetching toss info...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const url = new URL('https://api.cricapi.com/v1/currentMatches');
      url.searchParams.set('apikey', CRICAPI_KEY);
      url.searchParams.set('offset', '0');
      if (url.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const data    = await fetchData(url.toString());
      const matches = data?.data?.filter(m => m.tossWinner || m.matchStarted) || [];

      if (matches.length === 0) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No toss info available right now!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      let tossSection = '';
      for (const match of matches.slice(0, 3)) {
        const t1         = match.teams?.[0]   || 'Team 1';
        const t2         = match.teams?.[1]   || 'Team 2';
        const tossWinner = match.tossWinner   || 'Not decided';
        const tossChoice = match.tossChoice   || 'N/A';
        const venue      = match.venue        || 'Unknown';
        const type       = match.matchType?.toUpperCase() || 'MATCH';
        tossSection += `╭─『 🪙 *${t1} vs ${t2}* [${type}]』
│ 🏟️  *Venue:*       ${venue}
│ 🪙 *Toss Winner:* ${tossWinner}
│ 🏏 *Elected:*     ${tossChoice}
│ 📢 *Status:*      ${match.status || 'Live'}
╰──────────────────────────\n`;
      }

      const tossMsg = `╭━━━『 🪙 *TOSS UPDATE* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Time:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

${tossSection}
╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}score\`    → Live score
│ \`${CONFIG.PREFIX}schedule\` → Upcoming
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: tossMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[TOSS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Toss failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
