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
import { sanitizeUrl } from '../lib/utils.js';
import { SYSTEM } from '../config.js';

export default {
  command: ['imagine', 'aiimage', 'texttoimage', 'img'],
  name: 'imagine',
  category: 'AI',
  description: 'Generate creative AI images',
  usage: '.imagine <description>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please describe what you want to create!

*Example:*
.imagine dragon flying over castle
.imagine cyberpunk city at night
.imagine realistic portrait of a lion

*Styles you can try:*
🎨 Realistic, Cartoon, Anime
🌌 Fantasy, Sci-Fi, Abstract
🖼️ Oil Painting, Watercolor

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎭');
      const prompt = args.join(' ');

      await msg.reply(`⏳ *Imagining your creation...*\n\n🎭 Description: ${prompt}\n\nPlease wait...`);

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/imagine?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
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
          caption: `🎭 *AI IMAGINE*\n\n📝 ${prompt}\n\n${SYSTEM.SHORT_WATERMARK}`,
        }, { quoted: msg });

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to create image. Try a different description!');
      }

    } catch (error) {
      console.error('Imagine AI error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
