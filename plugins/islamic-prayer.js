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

'use strict';

const axios = require('axios');

module.exports = {
  name: 'prayer',
  aliases: ['prayertime', 'salah', 'namaz', 'نماز', 'اوقات'],
  category: 'islamic',
  description: 'کسی بھی شہر کے نماز کے اوقات معلوم کریں',
  usage: '.prayer <شہر کا نام> — مثال: .prayer Karachi',
  cooldown: 3000,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      if (!args[0]) {
        await sock.sendMessage(jid, {
          text: `
❌ *شہر کا نام لکھیں!*

*مثال:*
.prayer Karachi
.prayer Lahore
.prayer Islamabad
.prayer Quetta
.prayer Peshawar
.prayer Multan
.prayer Okara
.prayer Sahiwal
.prayer Dubai
.prayer London`.trim()
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(jid, {
        react: { text: '🕌', key: msg.key }
      });

      const city = args.join(' ');

      await sock.sendMessage(jid, {
        text: '⏳ *نماز کے اوقات لوڈ ہو رہے ہیں...*'
      }, { quoted: msg });

      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Pakistan&method=1`,
        { timeout: 10000 }
      );

      if (
        response.data &&
        response.data.code === 200 &&
        response.data.data
      ) {
        const data    = response.data.data;
        const timings = data.timings;
        const date    = data.date.readable;
        const hijri   = data.date.hijri;

        // ━━━ اگلی نماز معلوم کریں ━━━
        const now         = new Date();
        const currentMins = now.getHours() * 60 + now.getMinutes();

        const prayers = [
          { name: 'فجر',   key: 'Fajr',    emoji: '🌅' },
          { name: 'ظہر',   key: 'Dhuhr',   emoji: '☀️' },
          { name: 'عصر',   key: 'Asr',     emoji: '🌤️' },
          { name: 'مغرب',  key: 'Maghrib', emoji: '🌇' },
          { name: 'عشاء',  key: 'Isha',    emoji: '🌙' }
        ];

        let nextPrayer = null;
        for (const p of prayers) {
          const [ph, pm] = timings[p.key].split(':').map(Number);
          const pMins    = ph * 60 + pm;
          if (pMins > currentMins) {
            nextPrayer = p;
            break;
          }
        }
        if (!nextPrayer) nextPrayer = prayers[0]; // اگلے دن فجر

        const message = `
╭━━━『 *نماز کے اوقات* 』━━━╮

📍 *شہر:* ${city}
📅 *تاریخ:* ${date}
☪️ *ہجری:* ${hijri.day} ${hijri.month.en} ${hijri.year}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌅 *فجر:*    ${timings.Fajr}
🌞 *طلوع:*   ${timings.Sunrise}
☀️ *ظہر:*    ${timings.Dhuhr}
🌤️ *عصر:*    ${timings.Asr}
🌇 *مغرب:*   ${timings.Maghrib}
🌙 *عشاء:*   ${timings.Isha}
🌙 *آدھی رات:* ${timings.Midnight}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ *اگلی نماز:* ${nextPrayer.emoji} ${nextPrayer.name}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *اَلصَّلَاةُ خَيْرٌ مِّنَ النَّوْمِ* ☪️
*(نماز نیند سے بہتر ہے)*

🤲 *اللہ ہماری نمازیں قبول فرمائے*

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

        await sock.sendMessage(jid, { text: message }, { quoted: msg });
        await sock.sendMessage(jid, {
          react: { text: '✅', key: msg.key }
        });

      } else {
        await sock.sendMessage(jid, {
          text: `❌ *شہر نہیں ملا:* "${city}"\n\nدوبارہ صحیح نام لکھیں۔\n*مثال:* .prayer Karachi`
        }, { quoted: msg });
        await sock.sendMessage(jid, {
          react: { text: '❌', key: msg.key }
        });
      }

    } catch (error) {
      console.error('[PRAYER ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, {
        react: { text: '❌', key: msg.key }
      });
      await sock.sendMessage(jid,
        { text: `❌ *غلطی:* نماز کے اوقات لوڈ نہیں ہو سکے\n*Error:* ${error.message}` },
        { quoted: msg }
      );
    }
  }
};
