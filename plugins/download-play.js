/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Play         ┃
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

function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || null;
  } catch { return null; }
}

// ── METHOD 1: Cobalt API (free, no key) ───────────────────────────────────────
async function method_Cobalt(videoUrl) {
  const res = await axios.post(
    'https://api.cobalt.tools/',
    { url: videoUrl, downloadMode: 'audio', audioFormat: 'mp3', audioBitrate: '128', filenameStyle: 'basic' },
    { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
  );
  const dlUrl = res.data?.url || res.data?.audio;
  if (!dlUrl) throw new Error('Cobalt: no download URL');
  const audio = await axios.get(dlUrl, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  return Buffer.from(audio.data);
}

// ── METHOD 2: ytdl-core (no key needed) ───────────────────────────────────────
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

// ── METHOD 3: yt-dlp vercel API (free, no key) ────────────────────────────────
async function method_YtDlp(videoUrl) {
  const res = await axios.get(
    `https://yt-dlp-api.vercel.app/audio?url=${encodeURIComponent(videoUrl)}`,
    { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } }
  );
  if (!res.data || res.data.byteLength < 1000) throw new Error('yt-dlp API: empty response');
  return Buffer.from(res.data);
}

// ── METHOD 4: y2mate (free, no key) ───────────────────────────────────────────
async function method_Y2mate(videoUrl) {
  const videoId = extractVideoId(videoUrl);
  if (!videoId) throw new Error('y2mate: invalid video ID');
  const analyzeRes = await axios.post(
    'https://www.y2mate.com/mates/analyzeV2/ajax',
    new URLSearchParams({ k_query: videoUrl, k_page: 'home', hl: 'en', q_auto: '1' }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }
  );
  const links = analyzeRes.data?.links?.mp3;
  if (!links) throw new Error('y2mate: no mp3 links');
  const best = Object.values(links).find(l => l.q === '128kbps') || Object.values(links)[0];
  if (!best?.k) throw new Error('y2mate: no valid key');
  const convertRes = await axios.post(
    'https://www.y2mate.com/mates/convertV2/index',
    new URLSearchParams({ vid: videoId, k: best.k }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
  );
  if (!convertRes.data?.dlink) throw new Error('y2mate: no download link');
  const audio = await axios.get(convertRes.data.dlink, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  return Buffer.from(audio.data);
}

// ── METHOD 5: RapidAPI (needs RAPIDAPI_KEY) ───────────────────────────────────
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
  const audio = await axios.get(res.data.link, { responseType: 'arraybuffer', timeout: 60000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  return Buffer.from(audio.data);
}

// ── FALLBACK CHAIN ────────────────────────────────────────────────────────────
async function downloadAudio(videoUrl) {
  const methods = [
    { name: 'Cobalt',     fn: () => method_Cobalt(videoUrl)  },
    { name: 'ytdl-core',  fn: () => method_Ytdl(videoUrl)    },
    { name: 'yt-dlp API', fn: () => method_YtDlp(videoUrl)   },
    { name: 'y2mate',     fn: () => method_Y2mate(videoUrl)   },
    { name: 'RapidAPI',   fn: () => method_RapidAPI(videoUrl) },
  ];
  for (const method of methods) {
    try {
      console.log(`[PLAY] Trying: ${method.name}`);
      const buffer = await method.fn();
      if (buffer && buffer.length > 1000) {
        console.log(`[PLAY] Success: ${method.name}`);
        return buffer;
      }
      throw new Error('Buffer too small');
    } catch (err) {
      console.warn(`[PLAY] ${method.name} failed: ${err.message}`);
    }
  }
  throw new Error('All download methods failed. Please try again later.');
}

export default {
  command    : ['play', 'ytplay', 'ytp', 'music'],
  name       : 'play',
  category   : 'Downloader',
  description: 'Search and play YouTube music',
  usage      : '.play <song name>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Please provide a song name!*\n\n*Examples:*\n.play Despacito\n.play Shape of You\n.play Rahat Fateh Ali Khan\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No results found! Try different keywords.');
      }

      const videoInfo = search.videos[0];
      const videoUrl  = videoInfo.url;
      const title     = videoInfo.title        || 'Unknown';
      const artist    = videoInfo.author?.name || 'Unknown';
      const duration  = videoInfo.timestamp    || '?';
      const views     = formatNumber(videoInfo.views || 0);
      const ago       = videoInfo.ago          || '';
      const thumb     = videoInfo.thumbnail    || videoInfo.image || '';

      const caption = `╭━━━『 🎵 *YOUTUBE PLAY* 』━━━╮\n\n🎵 *Song:* ${title}\n👤 *Artist:* ${artist}\n⏱️ *Duration:* ${duration}\n👁️ *Views:* ${views}\n📅 *Uploaded:* ${ago}\n\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n⏳ *Downloading audio...*\n${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try {
          await sock.sendMessage(from, { image: { url: thumb }, caption }, { quoted: msg });
        } catch (_) { await msg.reply(caption); }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      const audioBuffer = await downloadAudio(videoUrl);

      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res   = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
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
            body     : `${artist} • ${duration}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            mediaUrl : videoUrl,
            sourceUrl: videoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('[PLAY ERROR]:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Play failed!*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
