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

'use strict';

const axios = require('axios');

module.exports = {
  name: 'hijri',
  aliases: ['islamicdate', 'hijridate', 'اسلامی تاریخ', 'ہجری'],
  category: 'islamic',
  description: 'آج کی ہجری اور عیسوی تاریخ — اسلامی مہینوں کی مکمل معلومات',
  usage: '.hijri — آج کی تاریخ | .hijri info — اسلامی مہینوں کی فضیلت',
  cooldown: 3000,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      await sock.sendMessage(jid, {
        react: { text: '📅', key: msg.key }
      });

      // ━━━ اسلامی مہینوں کی فضیلت ━━━
      const islamicMonths = {
        1:  { name: 'محرم الحرام',       en: 'Muharram',       fazilat: 'حرمت والا مہینہ، عاشوراء کا روزہ دو سال کے گناہ معاف کرتا ہے' },
        2:  { name: 'صفر المظفر',        en: 'Safar',          fazilat: 'اس مہینے میں صبر و استقامت کی تعلیم ملتی ہے' },
        3:  { name: 'ربیع الاول',        en: "Rabi' al-Awwal", fazilat: 'نبی کریم ﷺ کی ولادت باسعادت کا مہینہ' },
        4:  { name: 'ربیع الثانی',       en: "Rabi' al-Thani", fazilat: 'نیک اعمال اور عبادت کا مہینہ' },
        5:  { name: 'جمادی الاول',       en: 'Jumada al-Awwal',fazilat: 'توبہ اور استغفار کا مہینہ' },
        6:  { name: 'جمادی الثانی',      en: 'Jumada al-Thani',fazilat: 'نیک کاموں میں بڑھ چڑھ کر حصہ لیں' },
        7:  { name: 'رجب المرجب',        en: 'Rajab',          fazilat: 'حرمت والا مہینہ، شب معراج اسی مہینے میں ہے' },
        8:  { name: 'شعبان المعظم',      en: "Sha'ban",        fazilat: 'نبی ﷺ کا پسندیدہ مہینہ، شب برات میں مغفرت' },
        9:  { name: 'رمضان المبارک',     en: 'Ramadan',        fazilat: 'سب سے افضل مہینہ، لیلۃ القدر ہزار مہینوں سے بہتر' },
        10: { name: 'شوال المکرم',       en: 'Shawwal',        fazilat: 'عید الفطر، چھ روزوں کا ثواب سال بھر کے روزوں کے برابر' },
        11: { name: 'ذو القعدہ',         en: "Dhul-Qi'dah",   fazilat: 'حرمت والا مہینہ، حج کی تیاری کا وقت' },
        12: { name: 'ذو الحجہ',          en: 'Dhul-Hijjah',   fazilat: 'حج کا مہینہ، پہلے دس دن سب سے افضل ایام' }
      };

      // ━━━ اسلامی دنوں کے نام اردو میں ━━━
      const urduDays = {
        'Sunday':    'اتوار',
        'Monday':    'پیر',
        'Tuesday':   'منگل',
        'Wednesday': 'بدھ',
        'Thursday':  'جمعرات',
        'Friday':    'جمعہ',
        'Saturday':  'ہفتہ'
      };

      const subCommand = (args[0] || '').toLowerCase();

      // ━━━ اسلامی مہینوں کی مکمل فضیلت ━━━
      if (subCommand === 'info' || subCommand === 'فضیلت') {
        let infoMsg = `╭━━━『 *اسلامی مہینے اور فضیلت* 』━━━╮\n\n`;

        for (let i = 1; i <= 12; i++) {
          const m = islamicMonths[i];
          infoMsg += `*${i}. ${m.name}*\n`;
          infoMsg += `    (${m.en})\n`;
          infoMsg += `    💡 ${m.fazilat}\n\n`;
        }

        infoMsg += `╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
        infoMsg += `☪️ *اللّٰہُ اَکْبَر* ☪️\n\n`;
        infoMsg += `_YOUSAF-BALOCH-MD_\n`;
        infoMsg += `📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j`;

        await sock.sendMessage(jid, { text: infoMsg.trim() }, { quoted: msg });
        await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
        return;
      }

      // ━━━ آج کی تاریخ API سے لیں ━━━
      const today = new Date();
      const day   = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year  = today.getFullYear();

      const apiUrl = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;
      const response = await axios.get(apiUrl, { timeout: 10000 });

      if (
        response.data &&
        response.data.code === 200 &&
        response.data.data
      ) {
        const hijri     = response.data.data.hijri;
        const gregorian = response.data.data.gregorian;

        const hijriMonthNum = parseInt(hijri.month.number);
        const monthInfo     = islamicMonths[hijriMonthNum] || {};
        const urduDay       = urduDays[gregorian.weekday.en] || gregorian.weekday.en;

        const message = `
╭━━━『 *اسلامی تاریخ* 』━━━╮

📅 *ہجری تاریخ:*
${hijri.day} ${monthInfo.name || hijri.month.ar} ${hijri.year} ہجری
(${hijri.day} ${hijri.month.en} ${hijri.year} AH)

📆 *عیسوی تاریخ:*
${gregorian.day} ${gregorian.month.en} ${gregorian.year}

📌 *آج کا دن:* ${urduDay} (${gregorian.weekday.en})
🕌 *اسلامی مہینہ:* ${monthInfo.name || hijri.month.en}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*💡 اس مہینے کی فضیلت:*
${monthInfo.fazilat || 'اللہ کی عبادت اور ذکر کریں'}

╭━━━『 *اسلامی مہینے* 』━━━╮
1️⃣  محرم الحرام
2️⃣  صفر المظفر
3️⃣  ربیع الاول ﷺ
4️⃣  ربیع الثانی
5️⃣  جمادی الاول
6️⃣  جمادی الثانی
7️⃣  رجب المرجب
8️⃣  شعبان المعظم
9️⃣  رمضان المبارک
🔟  شوال المکرم
1️⃣1️⃣ ذو القعدہ
1️⃣2️⃣ ذو الحجہ
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

تمام مہینوں کی فضیلت: *.hijri info*

☪️ *اَللّٰہُ اَکْبَر* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

        await sock.sendMessage(jid, { text: message }, { quoted: msg });
        await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });

      } else {
        await sock.sendMessage(jid, {
          text: '❌ *غلطی:* تاریخ حاصل نہیں ہو سکی، دوبارہ کوشش کریں۔'
        }, { quoted: msg });
        await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
      }

    } catch (error) {
      console.error('[HIJRI ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
      await sock.sendMessage(jid,
        { text: `❌ *غلطی:* ہجری تاریخ لوڈ نہیں ہو سکی\n*Error:* ${error.message}` },
        { quoted: msg }
      );
    }
  }
};
