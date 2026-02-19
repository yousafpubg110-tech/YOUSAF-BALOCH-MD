/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Roman Urdu AI Chat   ┃
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

// Roman Urdu detection patterns
const romanUrduPatterns = [
  /\b(aap|main|hum|tum|ye|wo|kya|kab|kahan|kyun|kaise)\b/i,
  /\b(hai|tha|hoga|hoga|gaya|kar|ho|na|nahi)\b/i,
  /\b(acha|theek|sahi|galat|bohat|bhut|ziyada)\b/i,
  /\b(yar|yaar|bhai|bro|dost|jan)\b/i
];

function isRomanUrdu(text) {
  let matches = 0;
  for (const pattern of romanUrduPatterns) {
    if (pattern.test(text)) matches++;
  }
  return matches >= 2;
}

export default {
  name: 'romanurdu',
  category: 'ai',
  description: 'Auto-detect and respond in Roman Urdu',
  usage: 'Just chat naturally in Roman Urdu',
  
  async execute(msg, args) {
    try {
      const userMessage = msg.body;

      if (!isRomanUrdu(userMessage)) {
        return;
      }

      await msg.react('🤔');

      const prompt = `You are a friendly Pakistani chatbot. Respond ONLY in Roman Urdu (Urdu written in English letters). Be natural, casual, and friendly. User said: "${userMessage}"`;

      const apiUrl = `https://api.nexoracle.com/ai/chatgpt?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        // یہ دو لائنیں ہٹا دی گئی ہیں جو خود کو replace کر رہی تھیں (یہی error تھی)
        const reply = response.data.result;
        
        await msg.reply(reply);
        await msg.react('✅');
      } else {
        const fallbacks = [
          'Ji bilkul! Kya main aur kuch madad kar sakta hun?',
          'Theek hai yar, batao aur kya chahiye?',
          'Hmm... acha sawal hai! Main soch raha hun...',
          'Yar bohat acha point hai aap ka!',
          'Bilkul sahi kaha aap ne!'
        ];
        
        const randomReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        await msg.reply(randomReply);
        await msg.react('😊');
      }

    } catch (error) {
      console.error('Roman Urdu AI error:', error);
      await msg.reply('Yar sorry, mujhe samajh nahi aaya. Dubara try karo na!');
    }
  }
};

export { isRomanUrdu };
