/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD ChatGPT AI           ┃
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
  command: ['chatgpt', 'ai', 'gpt', 'openai'],
  name: 'chatgpt',
  category: 'AI',
  description: 'Chat with GPT-4 AI',
  usage: '.chatgpt <your question>',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a question!

*Example:*
.chatgpt What is artificial intelligence?
.ai Explain quantum computing
.gpt Write a poem about the moon

${SYSTEM.SHORT_WATERMARK}`);
      }

      const question = args.join(' ');

      await msg.reply('🤖 *AI is thinking...*');

      // FIX: node-fetch removed — axios used
      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/gpt4?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const data = response.data?.result || response.data?.data;

      if (!data) {
        await msg.react('❌');
        return await msg.reply('❌ AI failed to respond! Try again.');
      }

      await msg.reply(`╭━━━『 *CHATGPT AI* 』━━━╮

📝 *Your Question:*
${question}

💬 *AI Response:*
${data}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('✅');

    } catch (error) {
      console.error('ChatGPT AI error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error connecting to AI: ' + error.message);
      } catch (_) {}
    }
  },
};
