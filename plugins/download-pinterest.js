/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Pinterest Downloader ┃
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

export default {
  name: 'pinterest',
  aliases: ['pin', 'pindl'],
  category: 'downloader',
  description: 'Download images/videos from Pinterest',
  usage: '.pinterest <pinterest url>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a Pinterest URL!\n\nExample:\n.pinterest https://pin.it/xxxxx\n.pinterest https://www.pinterest.com/pin/xxxxx');
      }

      const url = args[0];

      if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
        return await msg.reply('❌ Please provide a valid Pinterest URL!');
      }

      await msg.react('📌');
      await msg.reply('⏳ *Downloading from Pinterest...*\n\n_Please wait..._');

      // Download Pinterest content using API
      const apiUrl = `https://api.nexoracle.com/downloader/pinterest?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        await msg.react('⬇️');
        
        const result = response.data.result;
        const mediaUrl = result.image || result.video || result.url;
        
        if (!mediaUrl) {
          await msg.react('❌');
          return await msg.reply('❌ Failed to download from Pinterest!');
        }

        const isVideo = mediaUrl.includes('.mp4') || result.type === 'video';
        const mediaBuffer = await axios.get(mediaUrl, { responseType: 'arraybuffer' });

        const caption = `
📌 *PINTEREST DOWNLOAD*

${result.title ? `📝 ${result.title}\n\n` : ''}_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110
`.trim();

        if (isVideo) {
          await msg.sendVideo(
            Buffer.from(mediaBuffer.data),
            caption,
            { mimetype: 'video/mp4' }
          );
        } else {
          await msg.sendImage(
            Buffer.from(mediaBuffer.data),
            caption
          );
        }

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download from Pinterest!');
      }

    } catch (error) {
      console.error('Pinterest download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
