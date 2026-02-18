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

export default {
  name: 'bing',
  aliases: ['bingai', 'sydney'],
  category: 'ai',
  description: 'Chat with Bing AI (Microsoft Copilot)',
  usage: '.bing <your question>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please ask a question!

*Example:*
.bing What's happening in the world today?
.bing Summarize latest tech news
.bing Creative writing tips

*Bing AI Features:*
🌐 Internet search integration
📰 Real-time information
💡 Creative responses
📊 Factual data
`.trim());
      }

      await msg.react('🔍');
      const question = args.join(' ');

      await msg.reply('🔍 *Bing AI is searching...*');

      const apiUrl = `https://api.nexoracle.com/ai/bing?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const answer = response.data.result;
        
        await msg.reply(`
╭━━━『 *BING AI* 』━━━╮

💭 *Question:* ${question}

🔍 *Bing's Answer:*
${answer}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response from Bing. Try again!');
      }

    } catch (error) {
      console.error('Bing error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
