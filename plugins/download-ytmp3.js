/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube MP3 DL       ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import axios from 'axios';
import yts from 'yt-search';
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['ytmp3', 'yta', 'ytaudio'],
  name: 'ytmp3',
  category: 'Downloader',
  description: 'Download YouTube video as MP3 audio',
  usage: '.ytmp3 <youtube url or search query>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a YouTube URL or search query!

*Example:*
.ytmp3 https://youtu.be/xxxxx
.ytmp3 Despacito
.yta Shape of You

${SYSTEM.SHORT_WATERMARK}`);
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
        videoInfo = search;
        videoUrl = query;
      } else {
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ No videos found! Try different keywords.');
        }
        videoInfo = search.videos[0];
        videoUrl = videoInfo.url;
      }

      await msg.reply(`╭━━━『 *YOUTUBE MP3* 』━━━╮

🎵 *Title:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading audio...*

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('⬇️');

      // FIX: ytdl-core removed — YouTube blocks it
      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/downloader/ytmp3?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result?.download) {
        // FIX: sanitizeUrl on download URL — CodeQL High error fix
        const safeDownloadUrl = sanitizeUrl(response.data.result.download);

        if (!safeDownloadUrl) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid download URL received!');
        }

        const audioRes = await axios.get(safeDownloadUrl, {
          responseType: 'arraybuffer',
          timeout: 60000,
        });

        const audioBuffer = Buffer.from(audioRes.data);

        let thumbnailBuffer = Buffer.from('');
        if (videoInfo.thumbnail) {
          const safeThumbnailUrl = sanitizeUrl(videoInfo.thumbnail);
          if (safeThumbnailUrl) {
            thumbnailBuffer = await getBuffer(safeThumbnailUrl);
          }
        }

        const safeVideoUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

        await sock.sendMessage(from, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: videoInfo.title,
              body: `${videoInfo.author?.name || 'Unknown'} • ${OWNER.BOT_NAME}`,
              thumbnail: thumbnailBuffer,
              mediaType: 2,
              mediaUrl: safeVideoUrl,
              sourceUrl: safeVideoUrl,
            },
          },
        }, { quoted: msg });

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download audio. Try again later!');
      }

    } catch (error) {
      console.error('ytmp3 download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Download failed!\n\n' + error.message);
      } catch (_) {}
    }
  },
};

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'].includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}

function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || null;
  } catch {
    return null;
  }
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function getBuffer(safeUrl) {
  try {
    const response = await axios.get(safeUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
    });
    return Buffer.from(response.data);
  } catch {
    return Buffer.from('');
  }
}
