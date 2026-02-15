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

export default {
  name: 'video',
  aliases: ['ytv', 'ytvideo'],
  category: 'downloader',
  description: 'Download YouTube videos',
  usage: '.video <youtube url or search query>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a YouTube URL or search query!\n\nExample:\n.video https://youtu.be/xxxxx\n.video Despacito');
      }

      await msg.react('🔍');
      const query = args.join(' ');

      // Check if URL or search query
      let videoUrl = query;
      let videoInfo;

      if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
        // Search YouTube
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ No videos found!');
        }
        videoInfo = search.videos[0];
        videoUrl = videoInfo.url;
      } else {
        // Get video info from URL
        const search = await yts({ videoId: extractVideoId(query) });
        videoInfo = search;
      }

      // Send video info
      const caption = `
╭━━━『 *YOUTUBE VIDEO* 』━━━╮

📌 *Title:* ${videoInfo.title}
👤 *Channel:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading video...*

_Powered by YOUSAF-BALOCH-MD_
_GitHub: musakhanbaloch03-sad_
`.trim();

      if (videoInfo.thumbnail) {
        await msg.sendImage(
          { url: videoInfo.thumbnail },
          caption
        );
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // Download video using API
      const apiUrl = `https://api.nexoracle.com/downloader/youtube?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result && response.data.result.url) {
        const videoBuffer = await axios.get(response.data.result.url, { responseType: 'arraybuffer' });
        
        await msg.sendVideo(
          Buffer.from(videoBuffer.data),
          `🎥 *${videoInfo.title}*\n\n_Downloaded by YOUSAF-BALOCH-MD_\n📢 ${global.config.channel}`,
          { mimetype: 'video/mp4' }
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download video. Try again later!');
      }

    } catch (error) {
      console.error('Video download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error downloading video: ' + error.message);
    }
  }
};

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
