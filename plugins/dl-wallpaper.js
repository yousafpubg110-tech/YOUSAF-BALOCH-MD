/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Wallpaper Downloader  ┃
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
async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally { clearTimeout(timer); }
}

// ─── Wallpaper categories ─────────────────────────────────────────────────────
const CATEGORIES = {
  nature     : 'nature landscape',
  city       : 'city skyline night',
  cars       : 'sports car',
  anime      : 'anime wallpaper 4k',
  islam      : 'islamic calligraphy mosque',
  pakistan   : 'pakistan landscape mountains',
  space      : 'galaxy space nebula',
  abstract   : 'abstract colorful art',
  mountains  : 'mountain peaks snow',
  ocean      : 'ocean waves sunset',
  flowers    : 'flowers garden colorful',
  dark       : 'dark minimalist wallpaper',
  forest     : 'forest trees misty',
  football   : 'football stadium soccer',
  cricket    : 'cricket stadium pakistan',
  lion       : 'lion wildlife',
  tiger      : 'tiger wildlife',
  landscape  : 'landscape photography',
  black      : 'black wallpaper minimalist',
  white      : 'white clean minimal',
};

// ─── Fetch from Unsplash (free, no key needed for basic) ─────────────────────
async function fetchWallpaper(query, page = 1) {
  // ✅ CodeQL Fix: URL() safe construction
  const url = new URL('https://api.unsplash.com/photos/random');
  url.searchParams.set('query',       query);
  url.searchParams.set('orientation', 'portrait');
  url.searchParams.set('count',       '3');

  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

  if (url.hostname !== 'api.unsplash.com') throw new Error('Invalid hostname.');

  if (UNSPLASH_KEY) {
    // ── With API key — better results ─────────────────────
    const res = await fetchWithTimeout(url.toString(), {
      headers: { 'Authorization': `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res.ok) throw new Error(`Unsplash error: ${res.status}`);
    return await res.json();
  }

  // ── Without API key — use picsum or similar ───────────
  // Fallback: Use Pixabay free API
  const pixUrl = new URL('https://pixabay.com/api/');
  pixUrl.searchParams.set('key',          process.env.PIXABAY_KEY || '44996331-cd5ee38a4e4da3d32df5d0e7e');
  pixUrl.searchParams.set('q',            query);
  pixUrl.searchParams.set('image_type',   'photo');
  pixUrl.searchParams.set('orientation',  'vertical');
  pixUrl.searchParams.set('safesearch',   'true');
  pixUrl.searchParams.set('per_page',     '5');
  pixUrl.searchParams.set('min_width',    '1080');

  if (pixUrl.hostname !== 'pixabay.com') throw new Error('Invalid hostname.');

  const pixRes = await fetchWithTimeout(pixUrl.toString());
  if (!pixRes.ok) throw new Error(`Pixabay error: ${pixRes.status}`);
  const pixData = await pixRes.json();

  // Map Pixabay format to Unsplash-like format
  return (pixData.hits || []).slice(0, 3).map(hit => ({
    urls  : { full: hit.largeImageURL, regular: hit.webformatURL },
    user  : { name: hit.user },
    width : hit.imageWidth,
    height: hit.imageHeight,
  }));
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['wallpaper', 'wp', 'wall', 'وال پیپر', 'تصویر'],
  name       : 'dl-wallpaper',
  category   : 'Downloader',
  description: 'Download HD wallpapers by category or search',
  usage      : '.wallpaper <category/search>',
  cooldown   : 8,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🖼️');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || args?.join(' ') || '').trim().toLowerCase();

      // ── No input — show categories ───────────────────────
      if (!input) {
        const catList = Object.keys(CATEGORIES)
          .map((c, i) => `│ ${i % 2 === 0 ? '🏔️' : '🌊'} \`${CONFIG.PREFIX}wp ${c}\``)
          .join('\n');

        return await sock.sendMessage(from, {
          text: `🖼️ *HD Wallpaper Downloader*

📌 *Usage:*
\`${CONFIG.PREFIX}wallpaper <category or search>\`

╭─『 📂 *Categories* 』
${catList}
╰──────────────────────────

💡 *Custom Search:*
▸ \`${CONFIG.PREFIX}wp sunset beach\`
▸ \`${CONFIG.PREFIX}wp pakistan flag\`
▸ \`${CONFIG.PREFIX}wp messi football\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Map category or use raw search ──────────────────
      const query = CATEGORIES[input] || input;

      await sock.sendMessage(from, {
        text: `🖼️ *Searching HD wallpapers...*\n🔍 Query: ${query}\n⏳ Please wait...`,
      }, { quoted: msg });

      const photos = await fetchWallpaper(query);

      if (!photos || photos.length === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *No wallpapers found for: ${input}*\n\n💡 Try another keyword.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Send top 3 wallpapers ────────────────────────────
      let sent = 0;
      for (const photo of photos.slice(0, 3)) {
        try {
          const imageUrl = photo.urls?.full || photo.urls?.regular;
          if (!imageUrl) continue;

          const imageRes = await fetchWithTimeout(imageUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          if (!imageRes.ok) continue;

          const buffer = Buffer.from(await imageRes.arrayBuffer());
          if (buffer.length === 0) continue;

          sent++;
          await sock.sendMessage(from, {
            image  : buffer,
            caption: sent === 1
              ? `🖼️ *HD Wallpaper ${sent}/3*

👋 *Requested by:* +${senderNum}
🔍 *Category:* ${input}
📦 *Size:* ${(buffer.length / 1024 / 1024).toFixed(2)} MB
📐 *Resolution:* ${photo.width || 'HD'} x ${photo.height || 'HD'}
📸 *By:* ${photo.user?.name || 'Unknown'}

${ownerFooter()}`
              : `🖼️ *HD Wallpaper ${sent}/3*\n📸 *By:* ${photo.user?.name || 'Unknown'}`,
          }, { quoted: sent === 1 ? msg : undefined });

          // Small delay between sends
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {
          console.error('[WALLPAPER SEND ERROR]:', e.message);
        }
      }

      if (sent === 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Could not download wallpapers!*\n\n💡 Try again.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[WALLPAPER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Wallpaper download failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
