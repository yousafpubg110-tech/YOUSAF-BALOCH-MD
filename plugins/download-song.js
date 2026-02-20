/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Song DL      ┃
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
  command: ['song', 'track', 'mp3dl'],
  name: 'song',
  category: 'Downloader',
  description: 'Download songs from YouTube as MP3',
  usage: '.song <song name>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a song name!

*Example:*
.song Perfect by Ed Sheeran
.song Blinding Lights
.song Rahat Fateh Ali Khan

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎵');
      const query = args.join(' ');

      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No songs found! Try different keywords.');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      await msg.reply(`╭━━━『 *DOWNLOADING SONG* 』━━━╮

🎵 *Song:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}

⏳ *Please wait...*

╰━━━━━━━━━━━━━━━━━━━━━━━━╯`);

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

        // Send as audio (playable in WhatsApp)
        await sock.sendMessage(from, {
          audio: audioBuffer,
          mimetype: 'audio/mp4',
          ptt: false,
          contextInfo: {
            externalAdReply: {
              title: videoInfo.title,
              body: `${videoInfo.author?.name || 'Unknown'} • ${videoInfo.timestamp}`,
              sourceUrl: sanitizeUrl(videoUrl) || OWNER.GITHUB,
            },
          },
        }, { quoted: msg });

        // Also send as document so user can save MP3
        await sock.sendMessage(from, {
          document: audioBuffer,
          fileName: `${videoInfo.title}.mp3`,
          mimetype: 'audio/mpeg',
          caption: `🎵 *${videoInfo.title}*\n👤 *${videoInfo.author?.name || 'Unknown'}*\n⏱️ *${videoInfo.timestamp}*\n\n${SYSTEM.SHORT_WATERMARK}`,
        }, { quoted: msg });

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download song. Try again later!');
      }

    } catch (error) {
      console.error('Song download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
