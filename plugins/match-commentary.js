/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Commentary Plugin    ┃
┃       Created by MR YOUSAF BALOCH         ┃
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

function addUrduFlair(text) {
  return text
    .replace(/six/gi,      'SIX! 🏏🔥 Chha!')
    .replace(/four/gi,     'FOUR! 🏏 Char!')
    .replace(/wicket/gi,   'WICKET! 🎉 Aout!')
    .replace(/out/gi,      'آؤٹ! 😱')
    .replace(/no ball/gi,  'No Ball! ⚠️')
    .replace(/wide/gi,     'Wide! ↔️')
    .replace(/dot ball/gi, 'Dot Ball 🎯')
    .replace(/century/gi,  'CENTURY! 💯🎊 Shatka!')
    .replace(/fifty/gi,    'FIFTY! ⭐ Panjah!')
    .replace(/caught/gi,   'CAUGHT! 🙌')
    .replace(/bowled/gi,   'BOWLED! 🎳')
    .replace(/lbw/gi,      'LBW! 🦵');
}

export default {
  command    : ['commentary', 'comm', 'کمنٹری'],
  name       : 'match-commentary',
  category   : 'Sports',
  description: 'Live match commentary in English and Urdu style',
  usage      : '.commentary',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎙️');
      const senderNum = sender?.split('@')[0] || 'User';

      if (!CRICAPI_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *CRICAPI_KEY not set!*\n🔗 https://cricapi.com\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🎙️ *Fetching live commentary...*\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Get live match ──────────────────────────────────────────
      const listUrl = new URL('https://api.cricapi.com/v1/currentMatches');
      listUrl.searchParams.set('apikey', CRICAPI_KEY);
      listUrl.searchParams.set('offset', '0');
      if (listUrl.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const listData  = await fetchData(listUrl.toString());
      const liveMatch = listData?.data?.find(m => m.matchStarted && !m.matchEnded);

      if (!liveMatch) {
        return await sock.sendMessage(from, {
          text: `⚠️ *No live match right now!*\n\n💡 Use ${CONFIG.PREFIX}schedule\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Get commentary ──────────────────────────────────────────
      const commUrl = new URL('https://api.cricapi.com/v1/match_bbb');
      commUrl.searchParams.set('apikey', CRICAPI_KEY);
      commUrl.searchParams.set('id',     liveMatch.id);
      if (commUrl.hostname !== 'api.cricapi.com') throw new Error('Invalid hostname.');

      const commData   = await fetchData(commUrl.toString());
      const commentary = commData?.data?.commentary || [];

      const t1 = liveMatch.teams?.[0] || 'Team 1';
      const t2 = liveMatch.teams?.[1] || 'Team 2';
      const s1 = liveMatch.score?.[0] ? `${liveMatch.score[0].r}/${liveMatch.score[0].w} (${liveMatch.score[0].o})` : 'TBD';
      const s2 = liveMatch.score?.[1] ? `${liveMatch.score[1].r}/${liveMatch.score[1].w} (${liveMatch.score[1].o})` : 'TBD';

      let commSection = '';
      if (commentary.length > 0) {
        commSection = commentary.slice(0, 8).map(c => {
          const over = c.over !== undefined ? c.over : '?';
          const runs = c.runs !== undefined ? c.runs : '?';
          const text = addUrduFlair(c.commentary || c.text || 'Ball played');
          return `│ *Over ${over}* → ${runs} run(s)\n│ 🎙️ ${text}`;
        }).join('\n│\n');
      } else {
        commSection = `│ 🎙️ Commentary loading...\n│ Use ${CONFIG.PREFIX}score for live score.`;
      }

      const commMsg = `╭━━━『 🎙️ *LIVE COMMENTARY* 』━━━╮

👋 *Requested by:* +${senderNum}
🕐 *Updated:* ${new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' })} PKT

╭─『 📊 *Live Score* 』
│ 🔵 *${t1}:* ${s1}
│ 🔴 *${t2}:* ${s2}
╰──────────────────────────

╭─『 🎙️ *Ball by Ball* 』
│
${commSection}
│
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}score\`     → Full score
│ \`${CONFIG.PREFIX}scorecard\` → Full scorecard
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: commMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[COMMENTARY ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Commentary failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
