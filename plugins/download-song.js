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

export default {
  name: 'song',
  aliases: ['music', 'track'],
  category: 'downloader',
  description: 'Download songs from YouTube',
  usage: '.song <song name>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a song name!\n\nExample:\n.song Perfect by Ed Sheeran\n.song Blinding Lights');
      }

      await msg.react('🎵');
      const query = args.join(' ');

      // Search YouTube
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No songs found!');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      // Send downloading message
      const downloadMsg = await msg.reply(`
╭━━━『 *DOWNLOADING SONG* 』━━━╮

🎵 *Song:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}

⏳ *Please wait...*

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim());

      await msg.react('⬇️');

      // Download audio
      const apiUrl = `https://api.nexoracle.com/downloader/ytmp3?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result && response.data.result.download) {
        const audioBuffer = await axios.get(response.data.result.download, { responseType: 'arraybuffer' });
        
        // Send as document with audio metadata
        await msg.sendDocument(
          Buffer.from(audioBuffer.data),
          `${videoInfo.title}.mp3`,
          'audio/mpeg',
          `
🎵 *${videoInfo.title}*
👤 *${videoInfo.author?.name || 'Unknown'}*
⏱️ *${videoInfo.timestamp}*

_Downloaded by YOUSAF-BALOCH-MD_
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim()
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download song. Try again later!');
      }

    } catch (error) {
      console.error('Song download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
