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

export default {
  name: 'blackbox',
  aliases: ['code', 'codegen'],
  category: 'ai',
  description: 'AI specialized for coding and programming',
  usage: '.blackbox <coding question>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please ask a coding question!

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
`.trim());
      }

      await msg.react('💻');
      const question = args.join(' ');

      await msg.reply('💻 *BlackBox AI is generating code...*');

      // Call BlackBox API
      const apiUrl = `https://api.nexoracle.com/ai/blackbox?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const answer = response.data.result;
        
        await msg.reply(`
╭━━━『 *BLACKBOX AI* 』━━━╮

💭 *Question:* ${question}

💻 *Code Solution:*
\`\`\`
${answer}
\`\`\`

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_Powered by YOUSAF-BALOCH-MD_
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response. Try again!');
      }

    } catch (error) {
      console.error('BlackBox error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
