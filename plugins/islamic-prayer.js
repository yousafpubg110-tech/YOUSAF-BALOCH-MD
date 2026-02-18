/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Prayer Times         ┃
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
  name: 'prayer',
  aliases: ['prayertime', 'salah', 'namaz'],
  category: 'islamic',
  description: 'Get prayer times for your city',
  usage: '.prayer <city name>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please specify your city!

*Example:*
.prayer Karachi
.prayer Lahore
.prayer Islamabad
.prayer Dubai
`.trim());
      }

      await msg.react('🕌');
      const city = args.join(' ');

      await msg.reply('⏳ *Getting prayer times...*');

      const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data) {
        const data = response.data.data;
        const timings = data.timings;
        const date = data.date.readable;
        const hijri = data.date.hijri.date;

        await msg.reply(`
╭━━━『 *PRAYER TIMES* 』━━━╮

📍 *City:* ${city}
📅 *Date:* ${date}
☪️ *Hijri:* ${hijri}

🕌 *Prayer Times:*

*Fajr:* ${timings.Fajr}
*Sunrise:* ${timings.Sunrise}
*Dhuhr:* ${timings.Dhuhr}
*Asr:* ${timings.Asr}
*Maghrib:* ${timings.Maghrib}
*Isha:* ${timings.Isha}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *الصَّلاَةُ خَيْرٌ مِّنَ النَّوْمِ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ City not found! Try different spelling.');
      }

    } catch (error) {
      console.error('Prayer times error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
