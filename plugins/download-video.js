/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command : ['video', 'ytv', 'ytvideo', 'ytmp4'],
  name    : 'video',
  category: 'Downloader',
  description: 'Download YouTube videos',
  usage   : '.video <youtube url or search query>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *YouTube URL یا search query دیں!*

*مثال:*
.video https://youtu.be/xxxxx
.video Despacito
.ytmp4 Avengers trailer

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoUrl;
      let videoInfo;

      // ── Search or direct URL ──────────────────────────────
      if (!isValidYouTubeUrl(query)) {
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ کوئی video نہیں ملی! دوسرے keywords try کریں۔');
        }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      } else {
        videoUrl = query;
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo = search;
      }

      const title    = videoInfo.title         || 'Unknown';
      const channel  = videoInfo.author?.name  || 'Unknown';
      const duration = videoInfo.timestamp     || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago           || '';
      const thumb    = videoInfo.thumbnail     || videoInfo.image || '';

      const caption = `╭━━━『 🎥 *YOUTUBE VIDEO* 』━━━╮

📌 *Title:* ${title}
👤 *Channel:* ${channel}
⏱️ *Duration:* ${duration}
👁️ *Views:* ${views}
📅 *Uploaded:* ${ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
⏳ *Downloading video...*
${SYSTEM.SHORT_WATERMARK}`;

      // ── Send thumbnail + info ─────────────────────────────
      if (thumb) {
        try {
          await sock.sendMessage(from, { image: { url: thumb }, caption }, { quoted: msg });
        } catch (_) { await msg.reply(caption); }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // ✅ FIX: cobalt.tools API — Heroku پر کام کرتی ہے
      const cobaltRes = await axios.post('https://api.cobalt.tools/', {
        url         : videoUrl,
        downloadMode: 'auto',
        videoQuality: '720',
      }, {
        headers: {
          'Accept'      : 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      if (!cobaltRes.data?.url) {
        await msg.react('❌');
        return await msg.reply('❌ Video download ناکام! دوبارہ try کریں۔');
      }

      const videoRes = await axios.get(cobaltRes.data.url, {
        responseType: 'arraybuffer',
        timeout     : 120000,
      });

      const videoBuffer = Buffer.from(videoRes.data);

      if (!videoBuffer || videoBuffer.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Video download ناکام! دوبارہ try کریں۔');
      }

      // ── Thumbnail buffer ──────────────────────────────────
      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      // ── Send video ────────────────────────────────────────
      await sock.sendMessage(from, {
        video   : videoBuffer,
        mimetype: 'video/mp4',
        caption : `🎥 *${title}*\n\n📺 ${channel}\n⏱️ ${duration}\n\n${SYSTEM.SHORT_WATERMARK}`,
        contextInfo: {
          externalAdReply: {
            title    : title,
            body     : `🎥 YouTube Video • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            sourceUrl: videoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Video download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Video download error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com']
      .includes(parsed.hostname);
  } catch { return false; }
}

function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || null;
  } catch { return null; }
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000)    return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
