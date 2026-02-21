/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Bing AI              ┃
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
  command: ['bing', 'bingai', 'sydney'],
  name: 'bing',
  category: 'AI',
  description: 'Chat with Bing AI (Microsoft Copilot)',
  usage: '.bing <your question>',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please ask a question!

*Example:*
.bing What is happening in the world today?
.bing Summarize latest tech news
.bing Creative writing tips

*Bing AI Features:*
🌐 Internet search integration
📰 Real-time information
💡 Creative responses
📊 Factual data

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const question = args.join(' ');

      await msg.reply('🔍 *Bing AI is searching...*');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/bing?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result) {
        const answer = response.data.result;

        await msg.reply(`╭━━━『 *BING AI* 』━━━╮

💭 *Question:* ${question}

🔍 *Answer:*
${answer}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response from Bing. Try again!');
      }

    } catch (error) {
      console.error('Bing AI error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
