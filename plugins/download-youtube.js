/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Search & DL  ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command : ['yt', 'youtube', 'ytsearch'],
  name    : 'youtube',
  category: 'Downloader',
  description: 'Search YouTube and download audio',
  usage   : '.yt <search query or youtube url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Search query یا YouTube URL دیں!*

*مثال:*
.yt Despacito
.yt https://youtu.be/xxxxx
.youtube Shape of You

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoInfo;
      let videoUrl;

      // ── Search or direct URL ──────────────────────────────
      if (isValidYouTubeUrl(query)) {
        videoUrl = query;
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo = search;
      } else {
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ کوئی نتیجہ نہیں ملا! دوسرے keywords try کریں۔');
        }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      }

      if (!videoInfo) {
        await msg.react('❌');
        return await msg.reply('❌ Video info نہیں مل سکی!');
      }

      const title   = videoInfo.title        || 'Unknown';
      const channel = videoInfo.author?.name  || 'Unknown';
      const duration= videoInfo.timestamp    || '?';
      const views   = formatNumber(videoInfo.views || 0);
      const ago     = videoInfo.ago          || '';
      const thumb   = videoInfo.thumbnail    || videoInfo.image || '';

      const infoText = `╭━━━『 📺 *YOUTUBE* 』━━━╮

📺 *Title:* ${title}
⏱️ *Duration:* ${duration}
👁️ *Views:* ${views}
📅 *Uploaded:* ${ago}
📢 *Channel:* ${channel}
🔗 *Link:* ${videoUrl}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
⏳ *Downloading audio...*
${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try {
          await sock.sendMessage(from, { image: { url: thumb }, caption: infoText }, { quoted: msg });
        } catch (_) { await msg.reply(infoText); }
      } else {
        await msg.reply(infoText);
      }

      await msg.react('⬇️');

      // ✅ FIX: cobalt.tools API — Heroku پر کام کرتی ہے
      const cobaltRes = await axios.post('https://api.cobalt.tools/', {
        url         : videoUrl,
        downloadMode: 'audio',
        audioFormat : 'mp3',
        audioBitrate: '128',
      }, {
        headers: {
          'Accept'      : 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      if (!cobaltRes.data?.url) {
        await msg.react('❌');
        return await msg.reply('❌ Download ناکام! دوبارہ try کریں۔');
      }

      const audioRes = await axios.get(cobaltRes.data.url, {
        responseType: 'arraybuffer',
        timeout     : 60000,
      });

      const audioBuffer = Buffer.from(audioRes.data);

      if (!audioBuffer || audioBuffer.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Audio download ناکام! دوبارہ try کریں۔');
      }

      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      await sock.sendMessage(from, {
        audio   : audioBuffer,
        mimetype: 'audio/mp4',
        ptt     : false,
        contextInfo: {
          externalAdReply: {
            title    : title,
            body     : `${channel} • ${duration}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            mediaUrl : videoUrl,
            sourceUrl: videoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('YouTube download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *YouTube error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'].includes(parsed.hostname);
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
