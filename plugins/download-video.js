/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM } from '../config.js';

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000)    return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

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

// METHOD 1: RapidAPI video download
async function downloadVideoRapidAPI(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');

  const videoId = extractVideoId(videoUrl) || videoUrl;

  const res = await axios.get('https://youtube-video-download-info.p.rapidapi.com/dl', {
    params : { id: videoId },
    headers: {
      'X-RapidAPI-Key' : apiKey,
      'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com',
    },
    timeout: 30000,
  });

  // Get 360p link
  const formats = res.data?.link;
  if (!formats) throw new Error('RapidAPI: no formats found');

  const mp4 = formats['18'] || formats['22'] || Object.values(formats)[0];
  const link = Array.isArray(mp4) ? mp4[0] : mp4?.url || mp4;
  if (!link) throw new Error('RapidAPI: no mp4 link');

  const videoRes = await axios.get(link, {
    responseType: 'arraybuffer',
    timeout     : 120000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });

  return Buffer.from(videoRes.data);
}

// METHOD 2: @distube/ytdl-core video download
async function downloadVideoYtdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      quality       : '18',
      filter        : format => format.container === 'mp4' && format.hasVideo && format.hasAudio,
      requestOptions: {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      },
    });
    stream.on('data',  chunk => chunks.push(chunk));
    stream.on('end',   ()    => resolve(Buffer.concat(chunks)));
    stream.on('error', err   => reject(err));
  });
}

export default {
  command    : ['video', 'ytv', 'ytvideo', 'ytmp4'],
  name       : 'video',
  category   : 'Downloader',
  description: 'Download YouTube videos',
  usage      : '.video <youtube url or search query>',
  cooldown   : 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *YouTube URL یا search query دیں!*\n\n*مثال:*\n.video https://youtu.be/xxxxx\n.video Despacito\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoUrl;
      let videoInfo;

      if (!isValidYouTubeUrl(query)) {
        const search = await yts(query);
        if (!search.videos || search.videos.length === 0) { await msg.react('❌'); return await msg.reply('❌ No video found!'); }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      } else {
        videoUrl = query;
        const videoId = extractVideoId(query);
        if (!videoId) { await msg.react('❌'); return await msg.reply('❌ Invalid YouTube URL!'); }
        const search = await yts({ videoId });
        videoInfo = search;
      }

      const title    = videoInfo.title        || 'Unknown';
      const channel  = videoInfo.author?.name || 'Unknown';
      const duration = videoInfo.timestamp    || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago          || '';
      const thumb    = videoInfo.thumbnail    || videoInfo.image || '';

      const caption = `╭━━━『 🎥 *YOUTUBE VIDEO* 』━━━╮\n\n📌 *Title:* ${title}\n👤 *Channel:* ${channel}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n📅 *Uploaded:* ${ago}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading video (360p)...*\n${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try { await sock.sendMessage(from, { image: { url: thumb }, caption }, { quoted: msg }); }
        catch (_) { await msg.reply(caption); }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // Try METHOD 1 first, then METHOD 2
      let videoBuffer = null;

      try {
        videoBuffer = await downloadVideoRapidAPI(videoUrl);
        console.log('[YT VIDEO] Downloaded via RapidAPI');
      } catch (e1) {
        console.warn('[YT VIDEO] RapidAPI failed:', e1.message, '— trying ytdl...');
        try {
          videoBuffer = await downloadVideoYtdl(videoUrl);
          console.log('[YT VIDEO] Downloaded via ytdl-core');
        } catch (e2) {
          console.error('[YT VIDEO] Both methods failed:', e2.message);
        }
      }

      if (!videoBuffer || videoBuffer.length < 1000) {
        await msg.react('❌');
        return await msg.reply(`❌ *Video download ناکام!*\n\nدونوں methods fail ہوئے۔ RAPIDAPI_KEY set کریں یا دوبارہ try کریں۔\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      await sock.sendMessage(from, {
        video   : videoBuffer,
        mimetype: 'video/mp4',
        caption : `🎥 *${title}*\n\n📺 ${channel}\n⏱️ ${duration}\n👁️ ${views} views\n\n${SYSTEM.SHORT_WATERMARK}`,
        contextInfo: {
          externalAdReply: {
            title    : title.substring(0, 30),
            body     : `🎥 YouTube Video • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            sourceUrl: videoUrl,
            mediaType: 1,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Video download error:', error.message);
      try { await msg.react('❌'); await msg.reply(`❌ *Video error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`); } catch (_) {}
    }
  },
};
