/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Hadith Reader        ┃
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
  name: 'hadith',
  aliases: ['hadees', 'sunnah'],
  category: 'islamic',
  description: 'Read random Hadith',
  usage: '.hadith',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('📚');

      const apiUrl = 'https://random-hadith-generator.vercel.app/bukhari/';
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data) {
        const hadith = response.data.data;

        await msg.reply(`
╭━━━『 *HADITH SHARIF* 』━━━╮

📚 *Sahih Bukhari*

*Hadith Number:* ${hadith.hadithNumber}
*Chapter:* ${hadith.chapterNumber}

*English:*
${hadith.hadithEnglish}

*Arabic:*
${hadith.hadithArabic}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get Hadith!');
      }

    } catch (error) {
      console.error('Hadith error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
