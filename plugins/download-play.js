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

export default {
  name: 'play',
  aliases: ['ytplay', 'ytp'],
  category: 'downloader',
  description: 'Search and play YouTube music',
  usage: '.play <song name>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a song name!\n\nExample:\n.play Despacito\n.playShape of You');
      }

      await msg.react('🔍');
      const query = args.join(' ');

      // Search YouTube
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No songs found!');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      // Send song info with options
      const caption = `
╭━━━『 *YOUTUBE PLAY* 』━━━╮

🎵 *Song:* ${videoInfo.title}
👤 *Artist:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}
🔗 *URL:* ${videoUrl}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading audio...*

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

      // Download audio
      const apiUrl = `https://api.nexoracle.com/downloader/ytmp3?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result && response.data.result.download) {
        const audioBuffer = await axios.get(response.data.result.download, { responseType: 'arraybuffer' });
        
        await msg.sendAudio(
          Buffer.from(audioBuffer.data),
          {
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
              externalAdReply: {
                title: videoInfo.title,
                body: `${videoInfo.author?.name || 'Unknown'} • ${videoInfo.timestamp}`,
                thumbnail: await getBuffer(videoInfo.thumbnail),
                mediaType: 2,
                mediaUrl: videoUrl,
                sourceUrl: videoUrl
              }
            }
          }
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download audio. Try again later!');
      }

    } catch (error) {
      console.error('Play error:', error);
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
