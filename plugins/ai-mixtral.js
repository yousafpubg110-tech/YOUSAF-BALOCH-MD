/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Mixtral AI           ┃
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
  command: ['mixtral', 'mix', 'mistral'],
  name: 'mixtral',
  category: 'AI',
  description: 'Chat with Mixtral AI',
  usage: '.mixtral <your question>',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please ask a question!

*Example:*
.mixtral Explain machine learning
.mixtral Write a short story
.mixtral Help me with homework

*Mixtral AI is great for:*
📚 Detailed explanations
✍️ Creative writing
🧮 Math and logic
💬 Conversations

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⚡');
      const question = args.join(' ');

      await msg.reply('⚡ *Mixtral AI is processing...*');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/mixtral?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result) {
        const answer = response.data.result;

        await msg.reply(`╭━━━『 *MIXTRAL AI* 』━━━╮

💭 *Question:* ${question}

⚡ *Answer:*
${answer}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response. Try again!');
      }

    } catch (error) {
      console.error('Mixtral AI error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
