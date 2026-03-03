/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube MP3 DL       ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import yts from 'yt-search';
import { sanitizeUrl } from '../lib/utils.js';
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
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function getBuffer(url) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    return Buffer.from(res.data);
  } catch { return Buffer.from(''); }
}

/* ───────── FALLBACK METHODS ───────── */

// 1️⃣ YTDL CORE
async function method_Ytdl(videoUrl) {
  const { default: ytdl } = await import('@distube/ytdl-core');
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'highestaudio',
      requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0' } }
    });
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', err => reject(err));
  });
}

// 2️⃣ DELINE API (from play command)
async function method_Deline(videoUrl) {
  const apiUrl = `https://api.deline.web.id/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`;

  const res = await axios.get(apiUrl, {
    timeout: 60000,
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const data = res.data;

  if (data.status === false)
    throw new Error('Deline API rejected video');

  if (!data.result || !data.result.dlink)
    throw new Error('No audio link from Deline');

  const audio = await axios.get(data.result.dlink, {
    responseType: 'arraybuffer',
    timeout: 60000
  });

  return Buffer.from(audio.data);
}

/* ───────── DOWNLOAD CHAIN ───────── */

async function downloadAudio(videoUrl) {
  const methods = [
    { name: 'ytdl-core', fn: () => method_Ytdl(videoUrl) },
    { name: 'deline-api', fn: () => method_Deline(videoUrl) }
  ];

  for (const method of methods) {
    try {
      console.log(`[YTMP3] Trying: ${method.name}`);
      const buffer = await method.fn();
      if (buffer && buffer.length > 1000) {
        console.log(`[YTMP3] Success: ${method.name}`);
        return buffer;
      }
    } catch (err) {
      console.warn(`[YTMP3] ${method.name} failed: ${err.message}`);
    }
  }

  throw new Error('All download methods failed.');
}

/* ───────── COMMAND EXPORT ───────── */

export default {
  command: ['ytmp3', 'yta', 'ytaudio', 'play', 'music'],
  name: 'ytmp3',
  category: 'Downloader',
  description: 'Download YouTube video as MP3 audio',
  usage: '.ytmp3 <youtube url or search query>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {

      if (!args.length)
        return await msg.reply(`❌ *YouTube link ya search query do!*\n\n${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('🎵');

      const query = args.join(' ');
      let videoUrl;
      let videoInfo;

      if (isValidYouTubeUrl(query)) {
        const videoId = extractVideoId(query);
        if (!videoId) return await msg.reply('❌ Invalid YouTube URL!');
        const search = await yts({ videoId });
        videoInfo = search;
        videoUrl = query;
      } else {
        const search = await yts(query);
        if (!search.videos.length)
          return await msg.reply('❌ No videos found!');
        videoInfo = search.videos[0];
        videoUrl = videoInfo.url;
      }

      await msg.reply(`╭━━━『 *YOUTUBE MP3* 』━━━╮
🎵 *Title:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
⏳ Downloading audio...

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('⬇️');

      const audioBuffer = await downloadAudio(videoUrl);

      let thumbnailBuffer = Buffer.from('');
      if (videoInfo.thumbnail) {
        const safeThumb = sanitizeUrl(videoInfo.thumbnail);
        if (safeThumb) thumbnailBuffer = await getBuffer(safeThumb);
      }

      const safeVideoUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

      await sock.sendMessage(from, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: videoInfo.title,
            body: `${videoInfo.author?.name || 'Unknown'} • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            mediaUrl: safeVideoUrl,
            sourceUrl: safeVideoUrl
          }
        }
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('[YTMP3 ERROR]:', error.message);
      await msg.react('❌');
      await msg.reply(`❌ Download failed!\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
    }
  }
};
