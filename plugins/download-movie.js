/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Movie Downloader     ┃
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
  name: 'movie',
  aliases: ['film', 'cinema'],
  category: 'downloader',
  description: 'Download movie clips/scenes from YouTube',
  usage: '.movie <movie name>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a movie name!\n\nExample:\n.movie Avengers Endgame\n.movie Spider-Man best scenes');
      }

      await msg.react('🎬');
      const query = args.join(' ') + ' movie';

      // Search YouTube for movie
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No movie content found!');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      // Send movie info
      const caption = `
╭━━━『 *MOVIE CONTENT* 』━━━╮

🎬 *Title:* ${videoInfo.title}
📺 *Channel:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading movie content...*

_Powered by YOUSAF-BALOCH-MD_
_Join: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j_
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

      // Download video
      const apiUrl = `https://api.nexoracle.com/downloader/youtube?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result && response.data.result.url) {
        const videoBuffer = await axios.get(response.data.result.url, { responseType: 'arraybuffer' });
        
        await msg.sendVideo(
          Buffer.from(videoBuffer.data),
          `
🎬 *${videoInfo.title}*

⏱️ Duration: ${videoInfo.timestamp}
👁️ Views: ${formatNumber(videoInfo.views)}

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📱 https://tiktok.com/@loser_boy.110
`.trim(),
          { 
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: videoInfo.title,
                body: '🎬 Movie Content • YOUSAF-BALOCH-MD',
                thumbnail: await getBuffer(videoInfo.thumbnail),
                sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD'
              }
            }
          }
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download movie content. Try again later!');
      }

    } catch (error) {
      console.error('Movie download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function getBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch {
    return Buffer.from('');
  }
}
