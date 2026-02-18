/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Hijri Date           ┃
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
  name: 'hijri',
  aliases: ['islamicdate', 'hijridate'],
  category: 'islamic',
  description: 'Get current Hijri date',
  usage: '.hijri',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('📅');

      const apiUrl = 'https://api.aladhan.com/v1/gToH';
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data) {
        const hijri = response.data.data.hijri;
        const gregorian = response.data.data.gregorian;

        await msg.reply(`
╭━━━『 *ISLAMIC DATE* 』━━━╮

📅 *Hijri Date:*
${hijri.day} ${hijri.month.en} ${hijri.year} AH
${hijri.day} ${hijri.month.ar} ${hijri.year} هـ

📆 *Gregorian Date:*
${gregorian.day} ${gregorian.month.en} ${gregorian.year}

*Islamic Month:* ${hijri.month.en}
*Weekday:* ${hijri.weekday.en}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Islamic Months:*
1. Muharram
2. Safar
3. Rabi al-Awwal
4. Rabi al-Thani
5. Jumada al-Awwal
6. Jumada al-Thani
7. Rajab
8. Sha'ban
9. Ramadan
10. Shawwal
11. Dhul-Qi'dah
12. Dhul-Hijjah

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to get date!');
      }

    } catch (error) {
      console.error('Hijri error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
