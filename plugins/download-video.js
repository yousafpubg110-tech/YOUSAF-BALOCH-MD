/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
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
  command: ['video', 'ytv', 'ytvideo', 'ytmp4'],
  name: 'video',
  category: 'Downloader',
  description: 'Download YouTube videos',
  usage: '.video <youtube url or search query>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a YouTube URL or search query!

*Example:*
.video https://youtu.be/xxxxx
.video Despacito
.ytmp4 Avengers trailer

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoUrl = query;
      let videoInfo;

      if (!isValidYouTubeUrl(query)) {
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ No videos found! Try different keywords.');
        }
        videoInfo = search.videos[0];
        videoUrl = videoInfo.url;
      } else {
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo = search;
      }

      const caption = `╭━━━『 *YOUTUBE VIDEO* 』━━━╮

📌 *Title:* ${videoInfo.title}
👤 *Channel:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading video...*

${SYSTEM.SHORT_WATERMARK}`;

      if (videoInfo.thumbnail) {
        const safeThumbnail = sanitizeUrl(videoInfo.thumbnail);
        if (safeThumbnail) {
          await sock.sendMessage(from, {
            image: { url: safeThumbnail },
            caption,
          }, { quoted: msg });
        } else {
          await msg.reply(caption);
        }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/downloader/youtube?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result?.url) {
        // FIX: sanitizeUrl on download URL — CodeQL High error fix
        const safeDownloadUrl = sanitizeUrl(response.data.result.url);

        if (!safeDownloadUrl) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid download URL received!');
        }

        const videoRes = await axios.get(safeDownloadUrl, {
          responseType: 'arraybuffer',
          timeout: 120000,
        });

        const videoBuffer = Buffer.from(videoRes.data);

        let thumbnailBuffer = Buffer.from('');
        if (videoInfo.thumbnail) {
          const safeThumbnailUrl = sanitizeUrl(videoInfo.thumbnail);
          if (safeThumbnailUrl) {
            thumbnailBuffer = await getBuffer(safeThumbnailUrl);
          }
        }

        const safeSourceUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

        await sock.sendMessage(from, {
          video: videoBuffer,
          mimetype: 'video/mp4',
          caption: `🎥 *${videoInfo.title}*\n\n📺 ${videoInfo.author?.name || 'Unknown'}\n⏱️ ${videoInfo.timestamp}\n\n${SYSTEM.SHORT_WATERMARK}`,
          contextInfo: {
            externalAdReply: {
              title: videoInfo.title,
              body: `🎥 YouTube Video • ${OWNER.BOT_NAME}`,
              thumbnail: thumbnailBuffer,
              sourceUrl: safeSourceUrl,
            },
          },
        }, { quoted: msg });

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download video. Try again later!');
      }

    } catch (error) {
      console.error('Video download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error downloading video: ' + error.message);
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
