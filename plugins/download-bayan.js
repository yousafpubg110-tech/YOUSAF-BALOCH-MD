/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Bayan Downloader     ┃
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
  // FIX: command field added
  command: ['bayan', 'islamicbayan', 'lecture'],
  name: 'bayan',
  category: 'Islamic',
  description: 'Download Islamic Bayan from YouTube',
  usage: '.bayan <topic or scholar name>',
  cooldown: 10,

  // FIX: execute -> handler, context object
  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a Bayan topic or scholar name!

*Example:*
.bayan Maulana Tariq Jameel
.bayan Namaz ki Ahmiyat
.bayan Touba aur Maghfirat

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('📖');
      const query = args.join(' ') + ' bayan';

      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No Bayan found! Try different keywords.');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      const caption = `╭━━━『 *ISLAMIC BAYAN* 』━━━╮

📖 *Title:* ${videoInfo.title}
🎙️ *Scholar:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading Bayan...*

${SYSTEM.SHORT_WATERMARK}`;

      // FIX: sanitizeUrl on thumbnail
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

        // FIX: sanitizeUrl on thumbnail for context
        let thumbnailBuffer = Buffer.from('');
        if (videoInfo.thumbnail) {
          const safeThumbnailUrl = sanitizeUrl(videoInfo.thumbnail);
          if (safeThumbnailUrl) {
            thumbnailBuffer = await getBuffer(safeThumbnailUrl);
          }
        }

        // FIX: sanitizeUrl on video URL for sourceUrl
        const safeVideoUrl = sanitizeUrl(videoUrl) || OWNER.GITHUB;

        await sock.sendMessage(from, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: videoInfo.title,
              body: `📖 Islamic Bayan • ${videoInfo.author?.name || 'Unknown'}`,
              thumbnail: thumbnailBuffer,
              mediaType: 2,
              mediaUrl: safeVideoUrl,
              sourceUrl: safeVideoUrl,
            },
          },
        }, { quoted: msg });

        await msg.react('✅');
        await msg.reply(`☪️ *بارک اللہ فیک* ☪️\n\n_May this knowledge benefit you_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download Bayan. Try again later!');
      }

    } catch (error) {
      console.error('❌ Bayan download error:', error.message);
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
