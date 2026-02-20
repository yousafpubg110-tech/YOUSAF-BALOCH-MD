/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Play         ┃
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
  command: ['play', 'ytplay', 'ytp', 'music'],
  name: 'play',
  category: 'Downloader',
  description: 'Search and play YouTube music',
  usage: '.play <song name>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a song name!

*Example:*
.play Despacito
.play Shape of You
.play Rahat Fateh Ali Khan

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No songs found! Try different keywords.');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      const caption = `╭━━━『 *YOUTUBE PLAY* 』━━━╮

🎵 *Song:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading audio...*

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

      const rawApiUrl = `https://api.nexoracle.com/downloader/ytmp3?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result?.download) {
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
              body: `${videoInfo.author?.name || 'Unknown'} • ${videoInfo.timestamp}`,
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
      console.error('Play error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};

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
