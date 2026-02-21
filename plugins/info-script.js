/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Script Info          ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['script', 'repo', 'sc', 'github'],
  name: 'script',
  category: 'Info',
  description: 'Show bot script and repository info',
  usage: '.script',
  cooldown: 5,

  handler: async ({ sock, msg, from }) => {
    try {
      const scriptMsg = `╭━━━『 *${OWNER.BOT_NAME}* 』━━━╮

🌟 *Premium WhatsApp Bot*

📊 *Bot Features:*
├ ✅ 280+ Commands
├ 🤖 AI Integration (ChatGPT, Gemini)
├ 📥 Media Downloader (YouTube, TikTok, etc)
├ 🎨 Sticker Maker
├ 👥 Group Management
├ 🔒 Anti-Delete Messages
├ 👁️ Auto View Status
└ 🎮 Fun & Games

💻 *GitHub Repository:*
${OWNER.GITHUB}

╭━━━『 *FOLLOW ME* 』━━━╮

📺 *YouTube:*
${OWNER.YOUTUBE}

🎵 *TikTok:*
${OWNER.TIKTOK}

📢 *WhatsApp Channel:*
${OWNER.CHANNEL}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

👨‍💻 *Developer:* ${OWNER.FULL_NAME}
📞 *Contact:* +${OWNER.NUMBER}

_© ${OWNER.YEAR} ${OWNER.BOT_NAME}_
_All Rights Reserved_`;

      // FIX: conn and buttons removed — buttons API is deprecated in Baileys
      // FIX: global.logo removed — unreliable, text message used instead
      await sock.sendMessage(from, {
        text: scriptMsg,
      }, { quoted: msg });

      await msg.react('💻');

    } catch (error) {
      console.error('Script info error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
