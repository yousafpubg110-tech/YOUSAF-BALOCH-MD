/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD BlackBox AI          ┃
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
  command: ['blackbox', 'code', 'codegen'],
  name: 'blackbox',
  category: 'AI',
  description: 'AI specialized for coding and programming',
  usage: '.blackbox <coding question>',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please ask a coding question!

*Example:*
.blackbox Write a Python function to reverse a string
.blackbox How to create a REST API in Node.js?
.blackbox Fix this JavaScript error: undefined is not a function

*BlackBox AI Specializes in:*
💻 Code generation
🐛 Bug fixing
📚 Code explanation
🔧 Best practices
⚡ Optimization tips
🌐 All programming languages

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('💻');
      const question = args.join(' ');

      await msg.reply('💻 *BlackBox AI is generating code...*');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/ai/blackbox?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });

      if (response.data?.result) {
        const answer = response.data.result;

        await msg.reply(`╭━━━『 *BLACKBOX AI* 』━━━╮

💭 *Question:* ${question}

💻 *Code Solution:*
\`\`\`
${answer}
\`\`\`

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response. Try again!');
      }

    } catch (error) {
      console.error('BlackBox AI error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
