/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Search & DL  ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM, CONFIG } from '../config.js';

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

// METHOD 1: RapidAPI
async function downloadAudioRapidAPI(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');

  const videoId = extractVideoId(videoUrl) || videoUrl;

  const res = await axios.get('https://youtube-mp36.p.rapidapi.com/dl', {
    params : { id: videoId },
    headers: {
      'X-RapidAPI-Key' : apiKey,
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
    },
    timeout: 30000,
  });

  if (!res.data?.link) throw new Error('RapidAPI: no download link');

  const audioRes = await axios.get(res.data.link, {
    responseType: 'arraybuffer',
    timeout     : 60000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });

  return Buffer.from(audioRes.data);
}

// METHOD 2: @distube/ytdl-core
async function downloadAudioYtdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      filter        : 'audioonly',
      quality       : 'highestaudio',
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
  command    : ['yt', 'youtube', 'ytsearch', 'ytmp3', 'audio', 'song', 'play'],
  name       : 'youtube',
  category   : 'Downloader',
  description: 'Search YouTube and download audio',
  usage      : '.yt <search query or youtube url>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Search query یا YouTube URL دیں!*\n\n*مثال:*\n.yt Despacito\n.yt https://youtu.be/xxxxx\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoInfo;
      let videoUrl;

      if (isValidYouTubeUrl(query)) {
        videoUrl = query;
        const videoId = extractVideoId(query);
        if (!videoId) { await msg.react('❌'); return await msg.reply('❌ Invalid YouTube URL!'); }
        const search = await yts({ videoId });
        videoInfo = search;
      } else {
        const search = await yts(query);
        if (!search.videos.length) { await msg.react('❌'); return await msg.reply('❌ کوئی نتیجہ نہیں ملا!'); }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      }

      if (!videoInfo) { await msg.react('❌'); return await msg.reply('❌ Video info نہیں مل سکی!'); }

      const title    = videoInfo.title        || 'Unknown';
      const channel  = videoInfo.author?.name || 'Unknown';
      const duration = videoInfo.timestamp    || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago          || '';
      const thumb    = videoInfo.thumbnail    || videoInfo.image || '';

      const infoText = `╭━━━『 🎵 *YOUTUBE AUDIO* 』━━━╮\n\n📌 *Title:* ${title}\n👤 *Channel:* ${channel}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n📅 *Uploaded:* ${ago}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading audio...*\n${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try { await sock.sendMessage(from, { image: { url: thumb }, caption: infoText }, { quoted: msg }); }
        catch (_) { await msg.reply(infoText); }
      } else {
        await msg.reply(infoText);
      }

      await msg.react('⬇️');

      // Try METHOD 1 first, then METHOD 2
      let audioBuffer = null;
      let usedMethod  = '';

      try {
        audioBuffer = await downloadAudioRapidAPI(videoUrl);
        usedMethod  = 'RapidAPI';
        console.log('[YT AUDIO] Downloaded via RapidAPI');
      } catch (e1) {
        console.warn('[YT AUDIO] RapidAPI failed:', e1.message, '— trying ytdl...');
        try {
          audioBuffer = await downloadAudioYtdl(videoUrl);
          usedMethod  = 'ytdl-core';
          console.log('[YT AUDIO] Downloaded via ytdl-core');
        } catch (e2) {
          console.error('[YT AUDIO] Both methods failed:', e2.message);
        }
      }

      if (!audioBuffer || audioBuffer.length < 1000) {
        await msg.react('❌');
        return await msg.reply(`❌ *Audio download ناکام!*\n\nدونوں methods fail ہوئے۔ دوبارہ try کریں یا RAPIDAPI_KEY set کریں۔\n\n${SYSTEM.SHORT_WATERMARK}`);
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
        mimetype: 'audio/mpeg',
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
      console.error('YouTube audio error:', error.message);
      try { await msg.react('❌'); await msg.reply(`❌ *YouTube error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`); } catch (_) {}
    }
  },
};
