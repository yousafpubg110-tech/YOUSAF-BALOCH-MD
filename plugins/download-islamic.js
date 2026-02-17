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

export default {
  name: 'islamic',
  aliases: ['islamicvideo', 'islamiccontent'],
  category: 'islamic',
  description: 'Download Islamic videos from YouTube',
  usage: '.islamic <topic>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide an Islamic topic!\n\nExample:\n.islamic Jummah Mubarak\n.islamic Ramadan\n.islamic Hajj');
      }

      await msg.react('☪️');
      const query = args.join(' ') + ' islamic';

      // Search YouTube for Islamic content
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ No Islamic content found!');
      }

      const videoInfo = search.videos[0];
      const videoUrl = videoInfo.url;

      // Send Islamic content info
      const caption = `
╭━━━『 *ISLAMIC CONTENT* 』━━━╮

☪️ *Title:* ${videoInfo.title}
📺 *Channel:* ${videoInfo.author?.name || 'Unknown'}
⏱️ *Duration:* ${videoInfo.timestamp}
👁️ *Views:* ${formatNumber(videoInfo.views)}
📅 *Uploaded:* ${videoInfo.ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading video...*

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
☪️ *${videoInfo.title}*

📺 Channel: ${videoInfo.author?.name || 'Unknown'}
⏱️ Duration: ${videoInfo.timestamp}

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
`.trim(),
          { 
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: videoInfo.title,
                body: '☪️ Islamic Content • YOUSAF-BALOCH-MD',
                thumbnail: await getBuffer(videoInfo.thumbnail),
                sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD'
              }
            }
          }
        );

        await msg.react('✅');
        await msg.reply('☪️ *السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ* ☪️\n\n_May Allah bless you_');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download video. Try again later!');
      }

    } catch (error) {
      console.error('Islamic content download error:', error);
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
