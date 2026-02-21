/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Daily Announcement   ┃
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// روزانہ کی احادیث (365 دن گھومتی ہیں)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const dailyAhadith = [
  {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    urdu: 'اعمال کا دارومدار نیتوں پر ہے۔',
    ref: 'صحیح بخاری: 1'
  },
  {
    arabic: 'الطَّهُورُ شَطْرُ الْإِيمَانِ',
    urdu: 'پاکیزگی آدھا ایمان ہے۔',
    ref: 'صحیح مسلم: 223'
  },
  {
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    urdu: 'تم میں سے کوئی اس وقت تک مومن نہیں جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔',
    ref: 'صحیح بخاری: 13'
  },
  {
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    urdu: 'لوگوں میں سب سے بہتر وہ ہے جو لوگوں کو سب سے زیادہ فائدہ پہنچائے۔',
    ref: 'طبرانی'
  },
  {
    arabic: 'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
    urdu: 'صدقہ گناہ کو اس طرح بجھا دیتا ہے جیسے پانی آگ کو بجھاتا ہے۔',
    ref: 'ترمذی: 2616'
  },
  {
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    urdu: 'جو ایمان اور ثواب کی نیت سے رمضان کے روزے رکھے اس کے پچھلے تمام گناہ معاف ہو جاتے ہیں۔',
    ref: 'صحیح بخاری: 38'
  },
  {
    arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ',
    urdu: 'رحم کرنے والوں پر رحمان رحم کرتا ہے۔',
    ref: 'ترمذی: 1924'
  },
  {
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    urdu: 'جو اللہ اور آخرت پر ایمان رکھتا ہو وہ اچھی بات کہے یا خاموش رہے۔',
    ref: 'صحیح بخاری: 6018'
  },
  {
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    urdu: 'اپنے بھائی کے چہرے پر مسکرانا تمہاری طرف سے صدقہ ہے۔',
    ref: 'ترمذی: 1956'
  },
  {
    arabic: 'رِضَا اللَّهِ فِي رِضَا الْوَالِدَيْنِ',
    urdu: 'اللہ کی رضا والدین کی رضا میں ہے۔',
    ref: 'ترمذی: 1899'
  },
  {
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    urdu: 'علم حاصل کرنا ہر مسلمان پر فرض ہے۔',
    ref: 'ابن ماجہ: 224'
  },
  {
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    urdu: 'دعا ہی اصل عبادت ہے۔',
    ref: 'ترمذی: 3247'
  },
  {
    arabic: 'كُلُّ بَنِي آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
    urdu: 'ہر آدم کی اولاد خطاکار ہے اور بہترین خطاکار وہ ہیں جو توبہ کرتے ہیں۔',
    ref: 'ترمذی: 2499'
  },
  {
    arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔',
    ref: 'صحیح بخاری: 10'
  },
  {
    arabic: 'إِنَّ مِنْ أَحَبِّكُمْ إِلَيَّ أَحَاسِنَكُمْ أَخْلَاقًا',
    urdu: 'تم میں مجھے سب سے زیادہ محبوب وہ ہے جس کے اخلاق سب سے اچھے ہوں۔',
    ref: 'ترمذی: 2018'
  },
  {
    arabic: 'أَفْشُوا السَّلَامَ بَيْنَكُمْ',
    urdu: 'آپس میں سلام کو عام کرو۔',
    ref: 'صحیح مسلم: 54'
  },
  {
    arabic: 'الْحَيَاءُ مِنَ الْإِيمَانِ',
    urdu: 'حیا ایمان کا حصہ ہے۔',
    ref: 'صحیح بخاری: 24'
  },
  {
    arabic: 'مَنْ لَا يَشْكُرِ النَّاسَ لَا يَشْكُرِ اللَّهَ',
    urdu: 'جو لوگوں کا شکریہ ادا نہیں کرتا وہ اللہ کا بھی شکر نہیں کرتا۔',
    ref: 'ترمذی: 1954'
  },
  {
    arabic: 'مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ',
    urdu: 'کسی کو صبر سے بہتر اور وسیع تر عطیہ نہیں دیا گیا۔',
    ref: 'صحیح بخاری: 1469'
  },
  {
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ',
    urdu: 'جہاں بھی ہو اللہ سے ڈرتے رہو۔',
    ref: 'ترمذی: 1987'
  },
  {
    arabic: 'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ فَلْيَصِلْ رَحِمَهُ',
    urdu: 'جو رزق میں فراخی اور عمر میں اضافہ چاہتا ہو وہ صلہ رحمی کرے۔',
    ref: 'صحیح بخاری: 5985'
  },
  {
    arabic: 'اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ',
    urdu: 'قرآن پڑھو کیونکہ یہ قیامت کے دن اپنے پڑھنے والوں کی سفارش کرے گا۔',
    ref: 'صحیح مسلم: 804'
  },
  {
    arabic: 'مَنْ صَلَّى عَلَيَّ صَلَاةً وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا',
    urdu: 'جو مجھ پر ایک مرتبہ درود بھیجتا ہے اللہ اس پر دس رحمتیں نازل فرماتا ہے۔',
    ref: 'صحیح مسلم: 408'
  },
  {
    arabic: 'إِيَّاكُمْ وَالْحَسَدَ فَإِنَّ الْحَسَدَ يَأْكُلُ الْحَسَنَاتِ',
    urdu: 'حسد سے بچو کیونکہ حسد نیکیوں کو کھا جاتا ہے جیسے آگ لکڑی کو۔',
    ref: 'ابو داؤد: 4903'
  },
  {
    arabic: 'لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ',
    urdu: 'جس کے دل میں ذرہ برابر تکبر ہو وہ جنت میں داخل نہیں ہوگا۔',
    ref: 'صحیح مسلم: 91'
  },
  {
    arabic: 'نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ',
    urdu: 'دو نعمتوں میں اکثر لوگ خسارے میں رہتے ہیں: صحت اور فراغت۔',
    ref: 'صحیح بخاری: 6412'
  },
  {
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    urdu: 'طاقتور مومن کمزور مومن سے بہتر اور اللہ کو زیادہ محبوب ہے۔',
    ref: 'صحیح مسلم: 2664'
  },
  {
    arabic: 'أَكْثِرُوا مِنْ ذِكْرِ هَاذِمِ اللَّذَّاتِ يَعْنِي الْمَوْتَ',
    urdu: 'لذتوں کو کاٹ دینے والی چیز یعنی موت کو کثرت سے یاد کرو۔',
    ref: 'ترمذی: 2307'
  },
  {
    arabic: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ',
    urdu: 'مومن کا معاملہ عجیب ہے، اس کا ہر حال اچھا ہے۔ خوشی میں شکر اور مصیبت میں صبر۔',
    ref: 'صحیح مسلم: 2999'
  },
  {
    arabic: 'الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ',
    urdu: 'جنت ماؤں کے قدموں تلے ہے۔',
    ref: 'نسائی، ابن ماجہ'
  }
];

// ━━━ اسلامی مہینے ━━━
const islamicMonths = {
  1:  'محرم الحرام',
  2:  'صفر المظفر',
  3:  'ربیع الاول',
  4:  'ربیع الثانی',
  5:  'جمادی الاول',
  6:  'جمادی الثانی',
  7:  'رجب المرجب',
  8:  'شعبان المعظم',
  9:  'رمضان المبارک',
  10: 'شوال المکرم',
  11: 'ذو القعدہ',
  12: 'ذو الحجہ'
};

// ━━━ گروپ IDs محفوظ کریں جہاں announcement بھیجنی ہے ━━━
const announcementGroups = new Set();

// ━━━ آج کی حدیث نمبر ━━━
function getDailyHadithIndex() {
  const start    = new Date('2024-01-01');
  const today    = new Date();
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diffDays % dailyAhadith.length;
}

// ━━━ ہجری تاریخ API سے لیں ━━━
async function getHijriDate() {
  try {
    const today = new Date();
    const dd    = String(today.getDate()).padStart(2, '0');
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy  = today.getFullYear();

    const response = await axios.get(
      `https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`,
      { timeout: 8000 }
    );

    if (response.data && response.data.code === 200) {
      const h = response.data.data.hijri;
      return {
        day:   h.day,
        month: islamicMonths[parseInt(h.month.number)] || h.month.ar,
        monthEn: h.month.en,
        year:  h.year,
        weekday: h.weekday.ar
      };
    }
  } catch (e) {
    console.error('[HIJRI API ERROR]', e.message);
  }
  return null;
}

// ━━━ روزانہ کا پیغام بنائیں ━━━
async function buildDailyMessage() {
  const now     = new Date();
  const hadith  = dailyAhadith[getDailyHadithIndex()];
  const hijri   = await getHijriDate();

  const days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months  = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName   = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum   = now.getDate();
  const yearNum   = now.getFullYear();

  const hijriLine = hijri
    ? `📅 *اسلامی دن:* ${hijri.weekday}\n🗓️ *ہجری تاریخ:* ${hijri.day} ${hijri.month} ${hijri.year} ہجری`
    : `📅 *ہجری تاریخ:* دستیاب نہیں`;

  return `
╔══════════════════════════╗
       *السَّلامُ عَلَیْکُمْ*
    *وَرَحْمَةُ اللّٰہِ وَبَرَکَاتُہ*
╚══════════════════════════╝

━━━━━『 📅 *آج کی تاریخ* 』━━━━━

🔢 *تاریخ:*  ${dateNum}
📆 *دن:*     ${dayName}
🗓️ *مہینہ:*  ${monthName}
📌 *سال:*    ${yearNum}

━━━━━『 ☪️ *اسلامی تاریخ* 』━━━━━

${hijriLine}

━━━『 📚 *آج کی حدیث مبارک* 』━━━

*🔷 عربی متن:*
${hadith.arabic}

*🌙 اردو ترجمہ:*
${hadith.urdu}

*📚 حوالہ:* ${hadith.ref}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

☪️ *صَلَّى اللّٰہُ عَلَیْہِ وَسَلَّمَ* ☪️

📢 *YOUSAF-BALOCH-MD*
🔔 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 GitHub: https://github.com/musakhanbaloch03-sad`.trim();
}

// ━━━ Scheduler: ہر منٹ چیک کریں ━━━
let lastAnnouncedDate = '';
let schedulerStarted  = false;

function startDailyScheduler(sock) {
  if (schedulerStarted) return;
  schedulerStarted = true;

  console.log('[DAILY ANNOUNCEMENT] Scheduler started ✅');

  setInterval(async () => {
    const now     = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    // صرف تاریخ بدلنے پر بھیجیں
    if (todayStr !== lastAnnouncedDate && announcementGroups.size > 0) {
      lastAnnouncedDate = todayStr;

      console.log('[DAILY ANNOUNCEMENT] Sending daily message to', announcementGroups.size, 'groups');

      const message = await buildDailyMessage();

      for (const groupJid of announcementGroups) {
        try {
          await sock.sendMessage(groupJid, { text: message });
          console.log('[DAILY ANNOUNCEMENT] Sent to:', groupJid);
          // ہر گروپ کے درمیان 2 سیکنڈ کا وقفہ
          await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
          console.error('[DAILY ANNOUNCEMENT] Failed for', groupJid, err.message);
          announcementGroups.delete(groupJid);
        }
      }
    }
  }, 60 * 1000); // ہر منٹ چیک
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Plugin Export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports = {
  name: 'daily',
  aliases: ['announcement', 'روزانہ', 'dailyon', 'dailyoff'],
  category: 'islamic',
  description: 'گروپ میں روزانہ خودکار اسلامی اعلان — تاریخ، ہجری اور حدیث',
  usage: '.daily on — شروع کریں | .daily off — بند کریں | .daily test — ابھی بھیجیں',
  cooldown: 5000,
  groupOnly: true,

  async execute(sock, msg, args) {
    try {
      const jid        = msg.key.remoteJid;
      const subCommand = (args[0] || 'on').toLowerCase();
      const isGroup    = jid.endsWith('@g.us');

      if (!isGroup) {
        await sock.sendMessage(jid, {
          text: '❌ یہ command صرف گروپ میں استعمال ہو سکتا ہے۔'
        }, { quoted: msg });
        return;
      }

      // ━━━ Scheduler شروع کریں (صرف ایک بار) ━━━
      startDailyScheduler(sock);

      // ━━━ ON ━━━
      if (subCommand === 'on' || subCommand === 'شروع') {
        announcementGroups.add(jid);

        await sock.sendMessage(jid, {
          text: `✅ *روزانہ اعلان فعال ہو گیا!*\n\n📢 اب ہر رات 12 بجے کے بعد اس گروپ میں خودکار اسلامی اعلان آئے گا جس میں شامل ہوگا:\n\n📅 آج کی تاریخ\n☪️ ہجری تاریخ\n📚 روزانہ نئی حدیث\n\n*بند کرنے کے لیے:* .daily off`
        }, { quoted: msg });

        await sock.sendMessage(jid, {
          react: { text: '✅', key: msg.key }
        });
      }

      // ━━━ OFF ━━━
      else if (subCommand === 'off' || subCommand === 'بند') {
        announcementGroups.delete(jid);

        await sock.sendMessage(jid, {
          text: `🔕 *روزانہ اعلان بند ہو گیا۔*\n\nدوبارہ شروع کرنے کے لیے:\n*.daily on*`
        }, { quoted: msg });

        await sock.sendMessage(jid, {
          react: { text: '🔕', key: msg.key }
        });
      }

      // ━━━ TEST (ابھی بھیجیں) ━━━
      else if (subCommand === 'test' || subCommand === 'ٹیسٹ') {
        await sock.sendMessage(jid, {
          react: { text: '⏳', key: msg.key }
        });

        const message = await buildDailyMessage();
        await sock.sendMessage(jid, { text: message }, { quoted: msg });

        await sock.sendMessage(jid, {
          react: { text: '✅', key: msg.key }
        });
      }

      // ━━━ STATUS ━━━
      else if (subCommand === 'status' || subCommand === 'اسٹیٹس') {
        const isActive = announcementGroups.has(jid);
        await sock.sendMessage(jid, {
          text: `📊 *روزانہ اعلان کی حالت:*\n\n${isActive ? '✅ فعال ہے' : '🔕 بند ہے'}\n\n*کل فعال گروپس:* ${announcementGroups.size}`
        }, { quoted: msg });
      }

      // ━━━ غلط command ━━━
      else {
        await sock.sendMessage(jid, {
          text: `❓ *استعمال کا طریقہ:*\n\n• .daily on — روزانہ اعلان شروع کریں\n• .daily off — روزانہ اعلان بند کریں\n• .daily test — ابھی ٹیسٹ پیغام بھیجیں\n• .daily status — حالت دیکھیں`
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('[DAILY ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
      await sock.sendMessage(jid,
        { text: `❌ *غلطی:* ${error.message}` },
        { quoted: msg }
      );
    }
  }
};
