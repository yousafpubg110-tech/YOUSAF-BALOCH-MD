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

export default {
  name: 'mixtral',
  aliases: ['mix', 'mistral'],
  category: 'ai',
  description: 'Chat with Mixtral AI',
  usage: '.mixtral <your question>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please ask a question!

*Example:*
.mixtral Explain machine learning
.mixtral Write a short story
.mixtral Help me with homework

*Mixtral AI is great for:*
📚 Detailed explanations
✍️ Creative writing
🧮 Math and logic
💬 Conversations
`.trim());
      }

      await msg.react('⚡');
      const question = args.join(' ');

      await msg.reply('⚡ *Mixtral AI is processing...*');

      const apiUrl = `https://api.nexoracle.com/ai/mixtral?apikey=free_key@maher_apis&prompt=${encodeURIComponent(question)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const answer = response.data.result;
        
        await msg.reply(`
╭━━━『 *MIXTRAL AI* 』━━━╮

💭 *Question:* ${question}

⚡ *Answer:*
${answer}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get response. Try again!');
      }

    } catch (error) {
      console.error('Mixtral error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
