/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Threads Downloader    ┃
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

// ─── Validate Threads URL ─────────────────────────────────────────────────────
function isValidThreadsUrl(url) {
  try {
    const parsed = new URL(url);
    return ['www.threads.net', 'threads.net'].includes(parsed.hostname);
  } catch { return false; }
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

// ─── Extract Threads post ID from URL ────────────────────────────────────────
function extractPostId(url) {
  try {
    const match = url.match(/\/p\/([A-Za-z0-9_-]+)/);
    return match?.[1] || null;
  } catch { return null; }
}

// ─── Download via savethreads / threadsave ────────────────────────────────────
async function downloadThreads(threadUrl) {
  // ✅ CodeQL Fix
  const apiUrl = new URL('https://threadsave.com/download');
  if (apiUrl.hostname !== 'threadsave.com') throw new Error('Invalid hostname.');

  const formData = new URLSearchParams();
  formData.append('url', threadUrl);

  const res = await fetchWithTimeout(apiUrl.toString(), {
    method : 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent'  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer'     : 'https://threadsave.com/',
      'Origin'      : 'https://threadsave.com',
    },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error(`Threads API error: ${res.status}`);

  const html = await res.text();

  // Extract video/image URLs from HTML response
  const videoMatch = html.match(/href="(https?:\/\/[^"]+\.mp4[^"]*)"/);
  const imageMatch = html.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/);

  return {
    video: videoMatch?.[1] || null,
    image: imageMatch?.[1] || null,
  };
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['threads', 'thread', 'تھریڈز'],
  name       : 'dl-threads',
  category   : 'Downloader',
  description: 'Download videos and images from Threads',
  usage      : '.threads <url>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🧵');

      const senderNum = sender?.split('@')[0] || 'User';
      const url       = (text || args?.[0] || '').trim();

      // ── No URL ──────────────────────────────────────────────
      if (!url) {
        return await sock.sendMessage(from, {
          text: `🧵 *Threads Downloader*

📌 *Usage:*
\`${CONFIG.PREFIX}threads <url>\`

💡 *Example:*
▸ \`${CONFIG.PREFIX}threads https://www.threads.net/@user/post/xxx\`

✅ *Supports:*
│ 🎬 Threads Videos
│ 📸 Threads Images
│ 🧵 Thread Posts

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Validate URL ────────────────────────────────────────
      if (!isValidThreadsUrl(url)) {
        return await sock.sendMessage(from, {
          text: `❌ *Invalid Threads URL!*\n\n💡 Threads.net link hona chahiye\n🔗 Example: https://www.threads.net/@user/post/...\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Processing ──────────────────────────────────────────
      await sock.sendMessage(from, {
        text: `🧵 *Downloading from Threads...*\n🔗 ${url.substring(0, 50)}...\n⏳ Please wait...`,
      }, { quoted: msg });

      const data = await downloadThreads(url);

      if (!data.video && !data.image) {
        return await sock.sendMessage(from, {
          text: `❌ *No media found!*\n\n⚠️ Could not extract media from this Threads post.\n💡 Make sure the post is public and contains video/image.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Download & send video ────────────────────────────────
      if (data.video) {
        const videoRes = await fetchWithTimeout(data.video, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!videoRes.ok) throw new Error(`Video fetch error: ${videoRes.status}`);
        const buffer = Buffer.from(await videoRes.arrayBuffer());

        if (buffer.length === 0) throw new Error('Empty video file!');

        await sock.sendMessage(from, {
          video  : buffer,
          caption: `✅ *Threads Video Downloaded!*

👋 *Requested by:* +${senderNum}
📦 *Size:* ${(buffer.length / 1024 / 1024).toFixed(2)} MB

${ownerFooter()}`,
          mimetype: 'video/mp4',
        }, { quoted: msg });

        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Download & send image ────────────────────────────────
      if (data.image) {
        const imageRes = await fetchWithTimeout(data.image, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (!imageRes.ok) throw new Error(`Image fetch error: ${imageRes.status}`);
        const buffer = Buffer.from(await imageRes.arrayBuffer());

        await sock.sendMessage(from, {
          image  : buffer,
          caption: `✅ *Threads Image Downloaded!*

👋 *Requested by:* +${senderNum}
📦 *Size:* ${(buffer.length / 1024).toFixed(0)} KB

${ownerFooter()}`,
        }, { quoted: msg });

        if (typeof msg.react === 'function') await msg.react('✅');
      }

    } catch (error) {
      console.error('[THREADS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Threads download failed!*\n⚠️ ${error.message}\n\n💡 Make sure:\n▸ Post is public\n▸ Link is correct\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
