/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Snapchat Downloader   ┃
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

// ─── Validate Snapchat URL ────────────────────────────────────────────────────
function isValidSnapchatUrl(url) {
  try {
    const parsed = new URL(url);
    return ['www.snapchat.com', 'snapchat.com', 't.snapchat.com'].includes(parsed.hostname);
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

// ─── Download via snapSave / rapid API ───────────────────────────────────────
async function downloadSnapchat(snapUrl) {
  // ✅ CodeQL Fix: URL() safe construction
  const apiUrl = new URL('https://snapsave.app/action.php');
  if (apiUrl.hostname !== 'snapsave.app') throw new Error('Invalid hostname.');

  const formData = new URLSearchParams();
  formData.append('url', snapUrl);

  const res = await fetchWithTimeout(apiUrl.toString(), {
    method : 'POST',
    headers: {
      'Content-Type'    : 'application/x-www-form-urlencoded',
      'User-Agent'      : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer'         : 'https://snapsave.app/',
      'Origin'          : 'https://snapsave.app',
    },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data;
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['snapchat', 'snap', 'sc', 'سنیپ'],
  name       : 'dl-snapchat',
  category   : 'Downloader',
  description: 'Download Snapchat videos and stories',
  usage      : '.snapchat <url>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('👻');

      const senderNum = sender?.split('@')[0] || 'User';
      const url       = (text || args?.[0] || '').trim();

      // ── No URL ──────────────────────────────────────────────
      if (!url) {
        return await sock.sendMessage(from, {
          text: `👻 *Snapchat Downloader*

📌 *Usage:*
\`${CONFIG.PREFIX}snapchat <url>\`

💡 *Example:*
▸ \`${CONFIG.PREFIX}snap https://www.snapchat.com/add/username\`
▸ \`${CONFIG.PREFIX}snap https://t.snapchat.com/xxxxxx\`

✅ *Supports:*
│ 👻 Snapchat Stories
│ 🎬 Snapchat Videos
│ 📸 Snapchat Spotlights

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Validate URL ────────────────────────────────────────
      if (!isValidSnapchatUrl(url)) {
        return await sock.sendMessage(from, {
          text: `❌ *Invalid Snapchat URL!*\n\n💡 Snapchat link hona chahiye\n🔗 Example: https://www.snapchat.com/...\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Processing ──────────────────────────────────────────
      await sock.sendMessage(from, {
        text: `👻 *Downloading Snapchat...*\n🔗 ${url.substring(0, 50)}...\n⏳ Please wait...`,
      }, { quoted: msg });

      const data = await downloadSnapchat(url);

      // ── Parse result ─────────────────────────────────────────
      const videoUrl = data?.data?.[0]?.url
        || data?.url
        || data?.video
        || null;

      if (!videoUrl) {
        return await sock.sendMessage(from, {
          text: `❌ *Download failed!*\n\n⚠️ Could not extract media from this Snapchat link.\n💡 Make sure the story/video is public.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Download video buffer ────────────────────────────────
      const videoRes = await fetchWithTimeout(videoUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (!videoRes.ok) throw new Error(`Video fetch error: ${videoRes.status}`);

      const contentType = videoRes.headers.get('content-type') || '';
      const isVideo     = contentType.includes('video');
      const buffer      = Buffer.from(await videoRes.arrayBuffer());

      if (buffer.length === 0) throw new Error('Empty media file!');

      // ── Send media ───────────────────────────────────────────
      if (isVideo) {
        await sock.sendMessage(from, {
          video  : buffer,
          caption: `✅ *Snapchat Video Downloaded!*

👋 *Requested by:* +${senderNum}
📦 *Size:* ${(buffer.length / 1024 / 1024).toFixed(2)} MB

${ownerFooter()}`,
          mimetype: 'video/mp4',
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          image  : buffer,
          caption: `✅ *Snapchat Image Downloaded!*

👋 *Requested by:* +${senderNum}
📦 *Size:* ${(buffer.length / 1024).toFixed(0)} KB

${ownerFooter()}`,
        }, { quoted: msg });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SNAPCHAT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Snapchat download failed!*\n⚠️ ${error.message}\n\n💡 Make sure:\n▸ Link is public\n▸ Story is still active\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
