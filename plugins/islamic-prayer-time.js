/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Auto Prayer Alerts   ┃
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
import { groupDb } from '../../lib/database.js';

let prayerIntervals = new Map();

export default {
  name: 'prayeralert',
  aliases: ['namazalert', 'autoprayertime'],
  category: 'islamic',
  description: 'Auto prayer time notifications',
  usage: '.prayeralert <on/off> <city>',
  cooldown: 3000,
  groupOnly: true,
  adminOnly: true,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please specify on/off and city!

*Usage:*
.prayeralert on Karachi
.prayeralert off

*Example:*
.prayeralert on Lahore
`.trim());
      }

      const action = args[0].toLowerCase();

      if (action === 'off') {
        if (prayerIntervals.has(msg.from)) {
          clearInterval(prayerIntervals.get(msg.from));
          prayerIntervals.delete(msg.from);
          
          groupDb.updateGroup(msg.from, { prayerAlert: false });
          
          await msg.reply('✅ Prayer time alerts disabled!');
          await msg.react('✅');
        } else {
          await msg.reply('❌ Prayer alerts were not enabled!');
        }
        return;
      }

      if (action === 'on') {
        if (!args[1]) {
          return await msg.reply('❌ Please specify city! Example: .prayeralert on Karachi');
        }

        const city = args.slice(1).join(' ');
        
        await msg.react('🕌');
        await msg.reply('⏳ *Setting up prayer alerts...*');

        // Get prayer times
        const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.data) {
          groupDb.updateGroup(msg.from, { 
            prayerAlert: true,
            prayerCity: city
          });

          // Check prayer times every 5 minutes
          const interval = setInterval(async () => {
            await checkAndSendPrayerAlert(msg.from, city, msg.conn);
          }, 5 * 60 * 1000); // 5 minutes

          prayerIntervals.set(msg.from, interval);

          await msg.reply(`
✅ *Prayer time alerts enabled!*

📍 City: ${city}
⏰ You'll receive notifications before each prayer time

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

          await msg.react('✅');
        } else {
          await msg.react('❌');
          await msg.reply('❌ City not found! Try different spelling.');
        }
      }

    } catch (error) {
      console.error('Prayer alert error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};

async function checkAndSendPrayerAlert(groupId, city, conn) {
  try {
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.data) {
      const timings = response.data.data.timings;
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      
      for (const prayer of prayers) {
        const prayerTime = timings[prayer];
        
        // Check if current time matches prayer time
        if (currentTime === prayerTime) {
          await conn.sendMessage(groupId, {
            text: `
🕌 *${prayer.toUpperCase()} TIME*

⏰ Prayer time has arrived!
📍 ${city}

☪️ *حَيَّ عَلَى الصَّلاَةِ* ☪️
_Come to prayer_

_YOUSAF-BALOCH-MD_
`.trim()
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error('Auto prayer alert error:', error);
  }
        }
