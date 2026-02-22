/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ringtone Downloader   ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Owner Footer ─────────────────────────────────────────────────────────────
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

// ─── Fetch with timeout ───────────────────────────────────────────────────────
async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally { clearTimeout(timer); }
}

// ─── Ringtone Categories ──────────────────────────────────────────────────────
const RINGTONE_CATS = {
  islamic  : ['اذان', 'Surah Rahman', 'Allahu Akbar', 'Islamic ringtone', 'Quran ringtone'],
  bollywood: ['Bollywood ringtone 2024', 'Hindi song ringtone', 'Arijit Singh ringtone'],
  funny    : ['Funny ringtone', 'Comedy notification', 'Funny alert tone'],
  iphone   : ['iPhone ringtone', 'iPhone default marimba', 'iPhone opening'],
  nature   : ['Nature ringtone rain', 'Birds chirping', 'Forest ambient'],
  classic  : ['Piano classic', 'Violin ringtone', 'Classical music tone'],
  pakistan : ['Pakistani ringtone', 'Punjabi ringtone', 'Urdu song ringtone'],
  whatsapp : ['WhatsApp notification', 'Message tone', 'Chat notification'],
};

// ─── Search ringtone via Zedge / freesound ────────────────────────────────────
async function searchRingtone(query) {
  // Using Freesound API (free, no key for basic search)
  // ✅ CodeQL Fix: URL() safe construction
  const url = new URL('https://freesound.org/apiv2/search/text/');
  url.searchParams.set('query',    query);
  url.searchParams.set('fields',   'id,name,previews,duration,username,tags');
  url.searchParams.set('filter',   'duration:[0 TO 30]'); // Max 30 seconds
  url.searchParams.set('page_size','5');
  url.searchParams.set('format',   'json');

  const FREESOUND_KEY = process.env.FREESOUND_KEY || '';

  if (FREESOUND_KEY) {
    url.searchParams.set('token', FREESOUND_KEY);
  }

  if (url.hostname !== 'freesound.org') throw new Error('Invalid hostname.');

  const res = await fetchWithTimeout(url.toString(), {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!res.ok) throw new Error(`Search error: ${res.status}`);
  return await res.json();
}

// ─── Alternative: YouTube to ringtone ────────────────────────────────────────
async function searchYTRingtone(query) {
  // YouTube search for ringtone audio
  const ytUrl = new URL('https://www.youtube.com/results');
  ytUrl.searchParams.set('search_query', `${query} ringtone free download`);
  if (ytUrl.hostname !== 'www.youtube.com') throw new Error('Invalid hostname.');

  const res = await fetchWithTimeout(ytUrl.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!res.ok) throw new Error(`YouTube search error: ${res.status}`);
  const html = await res.text();

  // Extract video IDs from YouTube page
  const videoIds = [...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)]
    .map(m => m[1])
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);

  // Extract titles
  const titles = [...html.matchAll(/"title":{"runs":\[{"text":"([^"]+)"/g)]
    .map(m => m[1])
    .slice(0, 3);

  return videoIds.map((id, i) => ({
    id   : id,
    title: titles[i] || `Ringtone ${i + 1}`,
    url  : `https://www.youtube.com/watch?v=${id}`,
  }));
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['ringtone', 'ring', 'tone', 'رنگٹون', 'rington'],
  name       : 'dl-ringtone',
  category   : 'Downloader',
  description: 'Search and download ringtones by name or category',
  usage      : '.ringtone <name or category>',
  cooldown   : 8,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎵');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || args?.join(' ') || '').trim().toLowerCase();

      // ── No input — show categories ───────────────────────
      if (!input) {
        const catList = Object.keys(RINGTONE_CATS)
          .map(c => `│ 🎵 \`${CONFIG.PREFIX}ringtone ${c}\``)
          .join('\n');

        return await sock.sendMessage(from, {
          text: `🎵 *Ringtone Downloader*

📌 *Usage:*
\`${CONFIG.PREFIX}ringtone <category or name>\`

╭─『 📂 *Categories* 』
${catList}
╰──────────────────────────

💡 *Custom Search:*
▸ \`${CONFIG.PREFIX}ring azan fajr\`
▸ \`${CONFIG.PREFIX}ring iphone marimba\`
▸ \`${CONFIG.PREFIX}ring batman theme\`
▸ \`${CONFIG.PREFIX}ring punjabi dhol\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Map category ─────────────────────────────────────
      const catQueries = RINGTONE_CATS[input];
      const query      = catQueries
        ? catQueries[Math.floor(Math.random() * catQueries.length)]
        : input;

      await sock.sendMessage(from, {
        text: `🎵 *Searching ringtones...*\n🔍 Query: ${query}\n⏳ Please wait...`,
      }, { quoted: msg });

      // ── Try Freesound first ──────────────────────────────
      let sent = false;

      try {
        const data    = await searchRingtone(query);
        const results = data?.results || [];

        if (results.length > 0) {
          // Pick random result
          const pick    = results[Math.floor(Math.random() * Math.min(results.length, 3))];
          const audioUrl = pick.previews?.['preview-hq-mp3']
            || pick.previews?.['preview-lq-mp3']
            || null;

          if (audioUrl) {
            const audioRes = await fetchWithTimeout(audioUrl, {
              headers: { 'User-Agent': 'Mozilla/5.0' },
            });

            if (audioRes.ok) {
              const buffer = Buffer.from(await audioRes.arrayBuffer());

              if (buffer.length > 0) {
                await sock.sendMessage(from, {
                  audio   : buffer,
                  mimetype: 'audio/mpeg',
                  ptt     : false,
                }, { quoted: msg });

                await sock.sendMessage(from, {
                  text: `✅ *Ringtone Downloaded!*

👋 *Requested by:* +${senderNum}
🎵 *Name:* ${pick.name || query}
👤 *By:* ${pick.username || 'Unknown'}
⏱️ *Duration:* ${Math.round(pick.duration || 0)}s
📦 *Size:* ${(buffer.length / 1024).toFixed(0)} KB
🔍 *Search:* ${input}

💡 *Save as ringtone:*
Android: Settings → Sound → Ringtone
iPhone: GarageBand method

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
                }, { quoted: msg });

                sent = true;
              }
            }
          }
        }
      } catch (e) {
        console.error('[FREESOUND ERROR]:', e.message);
      }

      // ── Fallback: Show YouTube links ─────────────────────
      if (!sent) {
        try {
          const ytResults = await searchYTRingtone(query);

          if (ytResults.length === 0) {
            return await sock.sendMessage(from, {
              text: `❌ *No ringtones found for: ${input}*\n\n💡 Try different keywords.\n\n${ownerFooter()}`,
            }, { quoted: msg });
          }

          const ytSection = ytResults.map((r, i) =>
            `│ *${i + 1}.* 🎵 ${r.title.substring(0, 50)}\n│    🔗 ${r.url}`
          ).join('\n│\n');

          await sock.sendMessage(from, {
            text: `🎵 *Ringtone Results*

👋 *Requested by:* +${senderNum}
🔍 *Search:* ${input}

╭─『 🎵 *Found Ringtones* 』
│
${ytSection}
│
╰──────────────────────────

╭─『 💡 *How to Download* 』
│ 1. Open link above
│ 2. Use ${CONFIG.PREFIX}ytaudio <url>
│    to download as audio
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });
        } catch (e) {
          return await sock.sendMessage(from, {
            text: `❌ *Ringtone search failed!*\n⚠️ ${e.message}\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[RINGTONE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Ringtone download failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
