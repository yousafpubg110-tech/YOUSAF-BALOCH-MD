/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Imagine AI           ┃
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
  name: 'imagine',
  aliases: ['aiimage', 'texttoimage'],
  category: 'ai',
  description: 'Generate creative AI images',
  usage: '.imagine <description>',
  cooldown: 10000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please describe what you want to create!

*Example:*
.imagine dragon flying over castle
.imagine cyberpunk city at night
.imagine realistic portrait of a lion

*Styles you can try:*
🎨 Realistic, Cartoon, Anime
🌌 Fantasy, Sci-Fi, Abstract
🖼️ Oil Painting, Watercolor
`.trim());
      }

      await msg.react('🎭');
      const prompt = args.join(' ');

      await msg.reply(`
⏳ *Imagining your creation...*

🎭 Description: ${prompt}

_Please wait..._
`.trim());

      const apiUrl = `https://api.nexoracle.com/ai/imagine?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const imageUrl = response.data.result;
        const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        await msg.sendImage(
          Buffer.from(imageBuffer.data),
          `
🎭 *AI IMAGINE*

📝 ${prompt}

_Created by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim()
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to create image. Try again!');
      }

    } catch (error) {
      console.error('Imagine error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
