/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube MP4 DL       ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import axios             from 'axios';
import yts               from 'yt-search';
import { sanitizeUrl }   from '../lib/utils.js';
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

// ── FREE METHOD 1: ytdl-core ──────────────────────────────────────────────────
async function method_Ytdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      filter  : format => format.container === 'mp4' && format.hasVideo && format.hasAudio,
      quality : 'highestvideo',
      requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } },
    });
    stream.on('data',  chunk => chunks.push(chunk));
    stream.on('end',   ()    => resolve(Buffer.concat(chunks)));
    stream.on('error', err   => reject(err));
  });
}

// ── FREE METHOD 2: invidious public API (no key needed) ───────────────────────
async function method_Invidious(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('Invidious: invalid video ID');

  // Multiple public invidious instances as fallback
  const instances = [
    'https://invidious.snopyta.org',
    'https://vid.puffyan.us',
    'https://invidious.kavin.rocks',
    'https://y.com.sb',
  ];

  for (const instance of instances) {
    try {
      const res = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: 15000 });
      const formats = res.data?.adaptiveFormats || res.data?.formatStreams || [];
      const mp4 = formats.find(f =>
        f.container === 'mp4' && f.type?.includes('video') && !f.type?.includes('audio/mp4')
      ) || formats.find(f => f.container === 'mp4');
      if (!mp4?.url) continue;
      const safeUrl = sanitizeUrl(mp4.url);
      if (!safeUrl) continue;
      const video = await axios.get(safeUrl, {
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

// ── FREE METHOD 3: ndownloader (no key needed) ────────────────────────────────
async function method_Ndownloader(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('ndownloader: invalid video ID');
  const res = await axios.get(
    `https://ndownloader.xyz/api?url=${encodeURIComponent(videoUrl)}&format=mp4`,
    { timeout: 30000, headers: { 'User-Agent': 'Mozilla/5.0' } }
  );
  const dlUrl = res.data?.url || res.data?.download_url;
  if (!dlUrl) throw new Error('ndownloader: no download URL');
  const safeUrl = sanitizeUrl(dlUrl);
  if (!safeUrl) throw new Error('ndownloader: unsafe URL');
  const video = await axios.get(safeUrl, {
    responseType: 'arraybuffer',
    timeout     : 120000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(video.data);
}

// ── FREE METHOD 4: yt-dlp vercel API (no key needed) ─────────────────────────
async function method_YtDlp(videoUrl) {
  const res = await axios.get(
    `https://yt-dlp-api.vercel.app/video?url=${encodeURIComponent(videoUrl)}&quality=720`,
    { responseType: 'arraybuffer', timeout: 120000, headers: { 'User-Agent': 'Mozilla/5.0' } }
  );
  if (!res.data || res.data.byteLength < 1000) throw new Error('yt-dlp API: empty response');
  return Buffer.from(res.data);
}

// ── OPTIONAL METHOD 5: RapidAPI (needs RAPIDAPI_KEY) ─────────────────────────
async function method_RapidAPI(videoUrl) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY not set');
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('RapidAPI: invalid video ID');
  const res = await axios.get('https://youtube-video-download-info.p.rapidapi.com/dl', {
    params : { id: videoId },
    headers: { 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com' },
    timeout: 30000,
  });
  const formats = res.data?.formats || [];
  const mp4 = formats.find(f => f.ext === 'mp4' && f.height <= 720) || formats[0];
  if (!mp4?.url) throw new Error('RapidAPI: no mp4 format');
  const safeUrl = sanitizeUrl(mp4.url);
  if (!safeUrl) throw new Error('RapidAPI: unsafe URL');
  const video = await axios.get(safeUrl, {
    responseType: 'arraybuffer',
    timeout     : 120000,
    headers     : { 'User-Agent': 'Mozilla/5.0' },
  });
  return Buffer.from(video.data);
}

// ── FALLBACK CHAIN: free first, RapidAPI last ─────────────────────────────────
async function downloadVideo(videoUrl) {
  const methods = [
    { name: 'ytdl-core',    fn: () => method_Ytdl(videoUrl)        },
    { name: 'Invidious',    fn: () => method_Invidious(videoUrl)    },
    { name: 'ndownloader',  fn: () => method_Ndownloader(videoUrl)  },
    { name: 'yt-dlp API',   fn: () => method_YtDlp(videoUrl)       },
    { name: 'RapidAPI',     fn: () => method_RapidAPI(videoUrl)     },
  ];
  for (const method of methods) {
    try {
      console.log(`[YTMP4] Trying: ${method.name}`);
      const buffer = await method.fn();
      if (buffer && buffer.length > 1000) {
        console.log(`[YTMP4] Success: ${method.name}`);
        return buffer;
      }
      throw new Error('Buffer too small');
    } catch (err) {
      console.warn(`[YTMP4] ${method.name} failed: ${err.message}`);
    }
  }
  throw new Error('All download methods failed. Please try again later.');
}

export default {
  command    : ['ytmp4', 'ytvid', 'ytvideo'],
  name       : 'ytmp4',
  category   : 'Downloader',
  description: 'Download YouTube video as MP4',
  usage      : '.ytmp4 <youtube url or search query>',
  cooldown   : 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Please provide a YouTube URL or search query!*\n\n*Examples:*\n.ytmp4 https://youtu.be/xxxxx\n.ytmp4 Despacito\n.ytvideo Avengers trailer\n\n*Note:* Videos over 100MB cannot be sent via WhatsApp.\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎬');
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

      await msg.reply(`╭━━━『 *YOUTUBE MP4* 』━━━╮\n\n🎬 *Title:* ${videoInfo.title}\n👤 *Channel:* ${videoInfo.author?.name || 'Unknown'}\n⏱️ *Duration:* ${videoInfo.timestamp}\n👁️ *Views:* ${formatNumber(videoInfo.views)}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading video...*\n\n${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('⬇️');

      const videoBuffer = await downloadVideo(videoUrl);

      if (videoBuffer.length > 100 * 1024 * 1024) {
        await msg.react('⚠️');
        return await msg.reply(`⚠️ *File too large!*\n\nVideo exceeds 100MB WhatsApp limit.\n\n💡 Try audio instead:\n*.ytmp3 ${videoUrl}*\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      let thumbnailBuffer = Buffer.from('');
      if (videoInfo.thumbnail) {
        const safeThumb = sanitizeUrl(videoInfo.thumbnail);
        if (safeThumb) thumbnailBuffer = await getBuffer(safeThumb);
      }

      const safeVideoUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

      await sock.sendMessage(from, {
        video   : videoBuffer,
        mimetype: 'video/mp4',
        caption : `🎬 *${videoInfo.title}*\n\n👤 ${videoInfo.author?.name || 'Unknown'}\n⏱️ ${videoInfo.timestamp}\n\n${SYSTEM.SHORT_WATERMARK}`,
        contextInfo: {
          externalAdReply: {
            title    : videoInfo.title,
            body     : `🎬 YouTube MP4 • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            mediaType: 1,
            mediaUrl : safeVideoUrl,
            sourceUrl: safeVideoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('[YTMP4 ERROR]:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Download failed!*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
