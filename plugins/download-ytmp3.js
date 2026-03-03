/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube MP3 DL       ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import axios            from 'axios';
import yts              from 'yt-search';
import { sanitizeUrl }  from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'].includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
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

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    return Buffer.from(res.data);
  } catch { return Buffer.from(''); }
}

// ── METHOD 1: ytdl-core — Heroku par kaam karta hai ──────────────────────────
async function method_Ytdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      filter        : 'audioonly',
      quality       : 'highestaudio',
      requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } },
    });
    stream.on('data',  chunk => chunks.push(chunk));
    stream.on('end',   ()    => resolve(Buffer.concat(chunks)));
    stream.on('error', err   => reject(err));
  });
}

// ── METHOD 2: RapidAPI youtube-mp36 (needs RAPIDAPI_KEY) ─────────────────────
async function method_RapidAPI(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');
  const videoId = extractVideoId(videoUrl) || videoUrl;
  const res = await axios.get('https://youtube-mp36.p.rapidapi.com/dl', {
    params : { id: videoId },
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com' },
    timeout: 30000,
  });
  if (!res.data?.link) throw new Error('RapidAPI: no download link');
  const audio = await axios.get(res.data.link, {
    responseType: 'arraybuffer',
    timeout     : 60000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(audio.data);
}

// ── METHOD 3: RapidAPI ytjar ──────────────────────────────────────────────────
async function method_RapidAPI_ytjar(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('ytjar: invalid video ID');
  const res = await axios.get('https://ytjar.p.rapidapi.com/download/mp3', {
    params : { id: videoId, quality: '128' },
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'ytjar.p.rapidapi.com' },
    timeout: 30000,
  });
  if (!res.data?.link) throw new Error('ytjar: no download link');
  const audio = await axios.get(res.data.link, {
    responseType: 'arraybuffer',
    timeout     : 60000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(audio.data);
}

// ── METHOD 4: RapidAPI youtube-to-mp315 ──────────────────────────────────────
async function method_RapidAPI_yt15(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('yt15: invalid video ID');
  const res = await axios.get('https://youtube-to-mp315.p.rapidapi.com/mp3', {
    params : { id: videoId },
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com' },
    timeout: 30000,
  });
  if (!res.data?.link) throw new Error('yt15: no download link');
  const audio = await axios.get(res.data.link, {
    responseType: 'arraybuffer',
    timeout     : 60000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(audio.data);
}

// ── FALLBACK CHAIN ────────────────────────────────────────────────────────────
async function downloadAudio(videoUrl) {
  const methods = [
    { name: 'ytdl-core',        fn: () => method_Ytdl(videoUrl)           },
    { name: 'RapidAPI-mp36',    fn: () => method_RapidAPI(videoUrl)        },
    { name: 'RapidAPI-ytjar',   fn: () => method_RapidAPI_ytjar(videoUrl)  },
    { name: 'RapidAPI-yt15',    fn: () => method_RapidAPI_yt15(videoUrl)   },
  ];
  for (const method of methods) {
    try {
      console.log(`[YTMP3] Trying: ${method.name}`);
      const buffer = await method.fn();
      if (buffer && buffer.length > 1000) {
        console.log(`[YTMP3] Success: ${method.name}`);
        return buffer;
      }
      throw new Error('Buffer too small');
    } catch (err) {
      console.warn(`[YTMP3] ${method.name} failed: ${err.message}`);
    }
  }
  throw new Error('All download methods failed. Please try again later.');
}

export default {
  command    : ['ytmp3', 'yta', 'ytaudio'],
  name       : 'ytmp3',
  category   : 'Downloader',
  description: 'Download YouTube video as MP3 audio',
  usage      : '.ytmp3 <youtube url or search query>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Please provide a YouTube URL or search query!*\n\n*Examples:*\n.ytmp3 https://youtu.be/xxxxx\n.ytmp3 Despacito\n.yta Shape of You\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎵');
      const query = args.join(' ');

      let videoUrl;
      let videoInfo;

      if (isValidYouTubeUrl(query)) {
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo    = search;
        videoUrl     = query;
      } else {
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ No videos found! Try different keywords.');
        }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      }

      await msg.reply(`╭━━━『 *YOUTUBE MP3* 』━━━╮\n\n🎵 *Title:* ${videoInfo.title}\n👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}\n⏱️ *Duration:* ${videoInfo.timestamp}\n👁️ *Views:* ${formatNumber(videoInfo.views)}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading audio...*\n\n${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('⬇️');

      const audioBuffer = await downloadAudio(videoUrl);

      let thumbnailBuffer = Buffer.from('');
      if (videoInfo.thumbnail) {
        const safeThumb = sanitizeUrl(videoInfo.thumbnail);
        if (safeThumb) thumbnailBuffer = await getBuffer(safeThumb);
      }

      const safeVideoUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

      await sock.sendMessage(from, {
        audio   : audioBuffer,
        mimetype: 'audio/mp4',
        ptt     : false,
        contextInfo: {
          externalAdReply: {
            title    : videoInfo.title,
            body     : `${videoInfo.author?.name || 'Unknown'} • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            mediaUrl : safeVideoUrl,
            sourceUrl: safeVideoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('[YTMP3 ERROR]:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Download failed!*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
