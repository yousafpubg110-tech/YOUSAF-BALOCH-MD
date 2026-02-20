/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Islamic Content DL   ┃
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
  command: ['islamic', 'islamicvideo', 'islamiccontent'],
  name: 'islamic',
  category: 'Islamic',
  description: 'Download Islamic videos from YouTube',
  usage: '.islamic <topic>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an Islamic topic!

*Example:*
.islamic Jummah Mubarak
.islamic Ramadan
.islamic Hajj
.islamic Namaz

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('☪️');
      const query = args.join(' ') + ' islamic';

      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No Islamic content found! Try different keywords.');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      const caption = `╭━━━『 *ISLAMIC CONTENT* 』━━━╮

☪️ *Title:* ${videoInfo.title}
📺 *Channel:* ${videoInfo.author?.name || 'Unknown'}
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

      const rawApiUrl = `https://api.nexoracle.com/downloader/youtube?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result?.url) {
        const safeVideoUrl = sanitizeUrl(response.data.result.url);

        if (!safeVideoUrl) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid download URL received!');
        }

        const videoRes = await axios.get(safeVideoUrl, {
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
          caption: `☪️ *${videoInfo.title}*\n\n📺 Channel: ${videoInfo.author?.name || 'Unknown'}\n⏱️ Duration: ${videoInfo.timestamp}\n\n${SYSTEM.SHORT_WATERMARK}`,
          contextInfo: {
            externalAdReply: {
              title: videoInfo.title,
              body: `☪️ Islamic Content • ${OWNER.BOT_NAME}`,
              thumbnail: thumbnailBuffer,
              sourceUrl: safeSourceUrl,
            },
          },
        }, { quoted: msg });

        await msg.react('✅');
        await msg.reply('☪️ *السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ* ☪️\n\n_May Allah bless you_');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download video. Try again later!');
      }

    } catch (error) {
      console.error('Islamic content download error:', error.message);
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
