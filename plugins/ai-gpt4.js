/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD GPT-4 Integration    ┃
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
  name: 'gpt4',
  aliases: ['gpt-4', 'openai'],
  category: 'ai',
  description: 'Chat with GPT-4 AI (Most Advanced)',
  usage: '.gpt4 <your question>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please ask a question!

*Example:*
.gpt4 Solve this math problem: 2x + 5 = 15
.gpt4 Write a professional email
.gpt4 Explain blockchain technology

*GPT-4 Advanced Features:*
🎓 Complex problem solving
💼 Professional writing
🔬 Scientific analysis
💻 Code generation
📊 Data interpretation
🎨 Creative tasks
`.trim());
      }

      await msg.react('🧠');
      const question = args.join(' ');

      await msg.reply('🧠 *GPT-4 is processing your request...*');

      // Call GPT-4 API
      const apiUrl = `https://api.nexoracle.com/ai/gpt4?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const answer = response.data.result;
        
        await msg.reply(`
╭━━━『 *GPT-4 AI* 』━━━╮

💭 *Your Question:*
${question}

🧠 *GPT-4 Response:*
${answer}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response from GPT-4. Try again!');
      }

    } catch (error) {
      console.error('GPT-4 error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
