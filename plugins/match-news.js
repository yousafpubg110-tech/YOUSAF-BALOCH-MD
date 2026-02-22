/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Match News Plugin ┃
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

const NEWS_KEY = process.env.NEWS_API_KEY || '';

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

async function fetchNews(query, timeoutMs = 15000) {
  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.set('q',        query);
  url.searchParams.set('language', 'en');
  url.searchParams.set('sortBy',   'publishedAt');
  url.searchParams.set('pageSize', '5');
  url.searchParams.set('apiKey',   NEWS_KEY);
  if (url.hostname !== 'newsapi.org') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) throw new Error(`News API error: ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

function detectTopic(input) {
  const lower = (input || '').toLowerCase();
  if (/psl/.test(lower))            return 'PSL cricket Pakistan';
  if (/ipl/.test(lower))            return 'IPL cricket India';
  if (/football|soccer/.test(lower)) return 'football soccer';
  if (/pak|pakistan/.test(lower))   return 'Pakistan cricket';
  return 'cricket sports news';
}

function formatNewsDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      timeZone: 'Asia/Karachi', day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return 'Recent'; }
}

export default {
  command    : ['news', 'sportnews', 'khabar', 'خبر'],
  name       : 'match-news',
  category   : 'Sports',
  description: 'Latest sports and cricket news',
  usage      : '.news [psl/ipl/football/pak]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📰');
      const senderNum = sender?.split('@')[0] || 'User';
      const topic     = detectTopic(text);

      if (!NEWS_KEY) {
        return await sock.sendMessage(from, {
          text: `❌ *NEWS_API_KEY not set!*\n\n📌 Add to .env\n🔗 Free: https://newsapi.org\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📰 *Fetching sports news...*\n🔍 Topic: ${topic}\n⏳ Please wait...`,
      }, { quoted: msg });

      const data     = await fetchNews(topic);
      const articles = data?.articles || [];

      if (articles.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *No news found for: ${topic}*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      let newsSection = '';
      articles.slice(0, 5).forEach((article, i) => {
        const title  = (article.title  || 'No title').slice(0, 80);
        const source = article.source?.name || 'Unknown';
        const date   = formatNewsDate(article.publishedAt);
        newsSection += `│ *${i + 1}.* 📰 ${title}\n│    📡 ${source} | 📅 ${date}\n│\n`;
      });

      const newsMsg = `╭━━━『 📰 *SPORTS NEWS* 』━━━╮

👋 *Requested by:* +${senderNum}
🔍 *Topic:* ${topic}

╭─『 📰 *Latest Headlines* 』
│
${newsSection}╰──────────────────────────

╭─『 💡 *Filter Options* 』
│ \`${CONFIG.PREFIX}news psl\`      → PSL news
│ \`${CONFIG.PREFIX}news ipl\`      → IPL news
│ \`${CONFIG.PREFIX}news pak\`      → Pakistan cricket
│ \`${CONFIG.PREFIX}news football\` → Football
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: newsMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[NEWS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *News fetch failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
