/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Quran Tafsir         ┃
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
  name: 'tafsir',
  aliases: ['tafseer', 'explanation'],
  category: 'islamic',
  description: 'Get Quran verse explanation',
  usage: '.tafsir <surah:ayah>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please specify surah and ayah!

*Example:*
.tafsir 1:1
.tafsir 2:255
`.trim());
      }

      await msg.react('📖');

      const parts = args[0].split(':');
      const surah = parseInt(parts[0]);
      const ayah = parseInt(parts[1]);

      const apiUrl = `https://api.quran.com/api/v4/quran/tafsirs/93?verse_key=${surah}:${ayah}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.tafsirs) {
        const tafsir = response.data.tafsirs[0];

        await msg.reply(`
╭━━━『 *TAFSIR* 』━━━╮

📖 *Surah ${surah}, Ayah ${ayah}*

*Explanation:*
${tafsir.text.substring(0, 800)}...

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Tafsir not found!');
      }

    } catch (error) {
      console.error('Tafsir error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
