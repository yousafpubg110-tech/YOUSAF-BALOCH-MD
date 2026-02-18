/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD DALL-E Image Gen     ┃
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
  name: 'dalle',
  aliases: ['imagegen', 'createimage'],
  category: 'ai',
  description: 'Generate AI images with DALL-E',
  usage: '.dalle <image description>',
  cooldown: 10000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ براہ کرم image description لکھیں!

*مثال:*
.dalle a beautiful sunset over mountains
.dalle a cute cat wearing sunglasses
.dalle futuristic city with flying cars

*Tips:*
✨ Be specific and detailed
🎨 Describe colors, style, mood
📐 Mention perspective or angle
`.trim());
      }

      await msg.react('🎨');
      const prompt = args.join(' ');

      await msg.reply(`
⏳ *Creating AI image...*

🎨 Prompt: ${prompt}

_یہ 10-20 سیکنڈ لے سکتا ہے..._
`.trim());

      const apiUrl = `https://api.nexoracle.com/ai/dalle?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const imageUrl = response.data.result;
        const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        
        await msg.sendImage(
          Buffer.from(imageBuffer.data),
          `
🎨 *AI GENERATED IMAGE*

📝 Prompt: ${prompt}

_Created by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
`.trim()
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to generate image. Try again!');
      }

    } catch (error) {
      console.error('DALL-E error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
