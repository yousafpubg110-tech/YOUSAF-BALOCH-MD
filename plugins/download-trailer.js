/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Trailer Downloader   ┃
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
  name: 'trailer',
  aliases: ['movietrailer', 'teaser'],
  category: 'downloader',
  description: 'Download movie/drama trailers from YouTube',
  usage: '.trailer <movie/drama name>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a movie or drama name!\n\nExample:\n.trailer Avengers Endgame\n.trailer The Legend of Maula Jatt');
      }

      await msg.react('🎥');
      const query = args.join(' ') + ' trailer';

      // Search YouTube for trailer
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No trailer found!');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      // Send trailer info
      const caption = `
╭━━━『 *MOVIE TRAILER* 』━━━╮

🎥 *Title:* ${videoInfo.title}
📺 *Channel:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading trailer...*

_Powered by YOUSAF-BALOCH-MD_
_Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j_
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
🎥 *${videoInfo.title}*

⏱️ ${videoInfo.timestamp}
👁️ ${formatNumber(videoInfo.views)} views

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
💻 https://github.com/musakhanbaloch03-sad
`.trim(),
          { 
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: videoInfo.title,
                body: '🎥 Movie Trailer • YOUSAF-BALOCH-MD',
                thumbnail: await getBuffer(videoInfo.thumbnail),
                sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD'
              }
            }
          }
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download trailer. Try again later!');
      }

    } catch (error) {
      console.error('Trailer download error:', error);
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
