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
import { sanitizeUrl } from '../lib/utils.js';
import { SYSTEM } from '../config.js';

export default {
  command: ['dalle', 'imagegen', 'createimage', 'aiimage'],
  name: 'dalle',
  category: 'AI',
  description: 'Generate AI images with DALL-E',
  usage: '.dalle <image description>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an image description!

*Example:*
.dalle a beautiful sunset over mountains
.dalle a cute cat wearing sunglasses
.dalle futuristic city with flying cars

*Tips:*
✨ Be specific and detailed
🎨 Describe colors, style, mood
📐 Mention perspective or angle

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎨');
      const prompt = args.join(' ');

      await msg.reply(`⏳ *Creating AI image...*\n\n🎨 Prompt: ${prompt}\n\nThis may take 10-20 seconds...`);

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/dalle?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 60000 });

      if (response.data?.result) {
        // FIX: sanitizeUrl on image URL — CodeQL High error fix
        const safeImageUrl = sanitizeUrl(response.data.result);

        if (!safeImageUrl) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid image URL received!');
        }

        const imageRes = await axios.get(safeImageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
        });

        const imageBuffer = Buffer.from(imageRes.data);

        // FIX: sendImage replaced with sock.sendMessage
        await sock.sendMessage(from, {
          image: imageBuffer,
          caption: `🎨 *AI GENERATED IMAGE*\n\n📝 Prompt: ${prompt}\n\n${SYSTEM.SHORT_WATERMARK}`,
        }, { quoted: msg });

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to generate image. Try a different prompt!');
      }

    } catch (error) {
      console.error('DALL-E error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
