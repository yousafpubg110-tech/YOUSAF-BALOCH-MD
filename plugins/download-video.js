/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import ytdl from '@distube/ytdl-core';
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

      // ── Video info ────────────────────────────────────────
      const title    = videoInfo.title    || 'Unknown';
      const channel  = videoInfo.author?.name || videoInfo.channel || 'Unknown';
      const duration = videoInfo.timestamp || videoInfo.duration?.timestamp || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago || '';
      const thumb    = videoInfo.thumbnail || videoInfo.image || '';

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
          await sock.sendMessage(from, {
            image  : { url: thumb },
            caption,
          }, { quoted: msg });
        } catch (_) {
          await msg.reply(caption);
        }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // ── Download via @distube/ytdl-core ───────────────────
      // Size check: skip videos > 15 minutes (WhatsApp limit)
      const info     = await ytdl.getInfo(videoUrl);
      const formats  = ytdl.filterFormats(info.formats, 'videoandaudio');
      const format   = formats.sort((a, b) => (b.height || 0) - (a.height || 0))
                              .find(f => (f.height || 0) <= 720) || formats[0];

      if (!format) {
        await msg.react('❌');
        return await msg.reply('❌ کوئی downloadable format نہیں ملا!');
      }

      // Download buffer
      const chunks = [];
      await new Promise((resolve, reject) => {
        const stream = ytdl(videoUrl, { format });
        stream.on('data',  chunk => chunks.push(chunk));
        stream.on('end',   resolve);
        stream.on('error', reject);
      });

      const videoBuffer = Buffer.concat(chunks);

      if (!videoBuffer || videoBuffer.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Video download ناکام! دوبارہ try کریں۔');
      }

      // ── Send video ────────────────────────────────────────
      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      await sock.sendMessage(from, {
        video  : videoBuffer,
        mimetype: 'video/mp4',
        caption: `🎥 *${title}*\n\n📺 ${channel}\n⏱️ ${duration}\n\n${SYSTEM.SHORT_WATERMARK}`,
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

// ── Helpers ───────────────────────────────────────────────────────────────────
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
