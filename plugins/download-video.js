/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
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

// ── FREE METHOD 1: ytdl-core ──────────────────────────────────────────────────
async function method_Ytdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      quality       : '18',
      filter        : format => format.container === 'mp4' && format.hasVideo && format.hasAudio,
      requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } },
    });
    stream.on('data',  chunk => chunks.push(chunk));
    stream.on('end',   ()    => resolve(Buffer.concat(chunks)));
    stream.on('error', err   => reject(err));
  });
}

// ── FREE METHOD 2: deline API (no key needed) ─────────────────────────────────
async function method_Deline(videoUrl) {
  const res = await axios.get(
    `https://api.deline.web.id/downloader/ytmp4?url=${encodeURIComponent(videoUrl)}`,
    { timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
  );
  if (res.data?.status === false) throw new Error('Deline API rejected video');
  const dlUrl = res.data?.result?.dlink;
  if (!dlUrl) throw new Error('Deline: no download link');
  const video = await axios.get(dlUrl, {
    responseType: 'arraybuffer',
    timeout     : 120000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(video.data);
}

// ── FREE METHOD 3: invidious public instances (no key needed) ─────────────────
async function method_Invidious(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('Invidious: invalid video ID');
  const instances = [
    'https://invidious.snopyta.org',
    'https://vid.puffyan.us',
    'https://invidious.kavin.rocks',
  ];
  for (const instance of instances) {
    try {
      const res = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: 15000 });
      const formats = res.data?.formatStreams || [];
      const mp4 = formats.find(f => f.container === 'mp4') || formats[0];
      if (!mp4?.url) continue;
      const video = await axios.get(mp4.url, {
        responseType: 'arraybuffer',
        timeout     : 120000,
        headers     : { 'User-Agent': 'Mozilla/5.0' },
      });
      const buf = Buffer.from(video.data);
      if (buf.length > 1000) return buf;
    } catch (_) { continue; }
  }
  throw new Error('Invidious: all instances failed');
}

// ── OPTIONAL METHOD 4: RapidAPI (needs RAPIDAPI_KEY) ─────────────────────────
async function method_RapidAPI(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');
  const videoId = extractVideoId(videoUrl) || videoUrl;
  const res = await axios.get('https://youtube-video-download-info.p.rapidapi.com/dl', {
    params : { id: videoId },
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com' },
    timeout: 30000,
  });
  const formats = res.data?.link;
  if (!formats) throw new Error('RapidAPI: no formats found');
  const mp4  = formats['18'] || formats['22'] || Object.values(formats)[0];
  const link = Array.isArray(mp4) ? mp4[0] : mp4?.url || mp4;
  if (!link) throw new Error('RapidAPI: no mp4 link');
  const video = await axios.get(link, {
    responseType: 'arraybuffer',
    timeout     : 120000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(video.data);
}

// ── FALLBACK CHAIN: free first, RapidAPI last ─────────────────────────────────
async function downloadVideo(videoUrl) {
  const methods = [
    { name: 'ytdl-core',  fn: () => method_Ytdl(videoUrl)      },
    { name: 'deline-api', fn: () => method_Deline(videoUrl)     },
    { name: 'Invidious',  fn: () => method_Invidious(videoUrl)  },
    { name: 'RapidAPI',   fn: () => method_RapidAPI(videoUrl)   },
  ];
  for (const method of methods) {
    try {
      console.log(`[YT VIDEO] Trying: ${method.name}`);
      const buffer = await method.fn();
      if (buffer && buffer.length > 1000) {
        console.log(`[YT VIDEO] Success: ${method.name}`);
        return buffer;
      }
      throw new Error('Buffer too small');
    } catch (err) {
      console.warn(`[YT VIDEO] ${method.name} failed: ${err.message}`);
    }
  }
  throw new Error('All download methods failed. Please try again later.');
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
        return await msg.reply(`❌ *Please provide a YouTube URL or search query!*\n\n*Examples:*\n.video https://youtu.be/xxxxx\n.video Despacito\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoUrl;
      let videoInfo;

      if (!isValidYouTubeUrl(query)) {
        const search = await yts(query);
        if (!search.videos || search.videos.length === 0) {
          await msg.react('❌');
          return await msg.reply('❌ No video found!');
        }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      } else {
        videoUrl      = query;
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo    = search;
      }

      const title    = videoInfo.title        || 'Unknown';
      const channel  = videoInfo.author?.name || 'Unknown';
      const duration = videoInfo.timestamp    || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago          || '';
      const thumb    = videoInfo.thumbnail    || videoInfo.image || '';

      const caption = `╭━━━『 🎥 *YOUTUBE VIDEO* 』━━━╮\n\n📌 *Title:* ${title}\n👤 *Channel:* ${channel}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n📅 *Uploaded:* ${ago}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading video (360p)...*\n${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try {
          await sock.sendMessage(from, { image: { url: thumb }, caption }, { quoted: msg });
        } catch (_) { await msg.reply(caption); }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      const videoBuffer = await downloadVideo(videoUrl);

      if (videoBuffer.length > 100 * 1024 * 1024) {
        await msg.react('⚠️');
        return await msg.reply(`⚠️ *File too large!*\n\nVideo exceeds 100MB WhatsApp limit.\n\n💡 Try audio instead:\n*.ytmp3 ${videoUrl}*\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res   = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
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
      console.error('[YT VIDEO ERROR]:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Video error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
