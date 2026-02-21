/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Quran Reader         ┃
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

// ━━━ مشہور سورتوں کے اردو نام ━━━
const surahNames = {
  1:   'الفاتحہ',
  2:   'البقرہ',
  3:   'آل عمران',
  4:   'النساء',
  5:   'المائدہ',
  6:   'الانعام',
  7:   'الاعراف',
  8:   'الانفال',
  9:   'التوبہ',
  10:  'یونس',
  11:  'ہود',
  12:  'یوسف',
  13:  'الرعد',
  14:  'ابراہیم',
  15:  'الحجر',
  18:  'الکہف',
  19:  'مریم',
  20:  'طہ',
  23:  'المومنون',
  24:  'النور',
  25:  'الفرقان',
  29:  'العنکبوت',
  30:  'الروم',
  31:  'لقمان',
  32:  'السجدہ',
  36:  'یٰسین',
  39:  'الزمر',
  40:  'غافر',
  41:  'فصلت',
  42:  'الشوریٰ',
  44:  'الدخان',
  45:  'الجاثیہ',
  46:  'الاحقاف',
  47:  'محمد',
  48:  'الفتح',
  49:  'الحجرات',
  50:  'ق',
  51:  'الذاریات',
  52:  'الطور',
  53:  'النجم',
  54:  'القمر',
  55:  'الرحمن',
  56:  'الواقعہ',
  57:  'الحدید',
  58:  'المجادلہ',
  59:  'الحشر',
  60:  'الممتحنہ',
  61:  'الصف',
  62:  'الجمعہ',
  63:  'المنافقون',
  64:  'التغابن',
  65:  'الطلاق',
  66:  'التحریم',
  67:  'الملک',
  68:  'القلم',
  69:  'الحاقہ',
  70:  'المعارج',
  71:  'نوح',
  72:  'الجن',
  73:  'المزمل',
  74:  'المدثر',
  75:  'القیامہ',
  76:  'الانسان',
  78:  'النبا',
  79:  'النازعات',
  80:  'عبس',
  81:  'التکویر',
  82:  'الانفطار',
  83:  'المطففین',
  84:  'الانشقاق',
  85:  'البروج',
  86:  'الطارق',
  87:  'الاعلیٰ',
  88:  'الغاشیہ',
  89:  'الفجر',
  90:  'البلد',
  91:  'الشمس',
  92:  'اللیل',
  93:  'الضحیٰ',
  94:  'الشرح',
  95:  'التین',
  96:  'العلق',
  97:  'القدر',
  98:  'البینہ',
  99:  'الزلزلہ',
  100: 'العادیات',
  101: 'القارعہ',
  102: 'التکاثر',
  103: 'العصر',
  104: 'الہمزہ',
  105: 'الفیل',
  106: 'قریش',
  107: 'الماعون',
  108: 'الکوثر',
  109: 'الکافرون',
  110: 'النصر',
  111: 'المسد',
  112: 'الاخلاص',
  113: 'الفلق',
  114: 'الناس'
};

// ━━━ مشہور آیات کی فہرست ━━━
const famousAyahs = [
  { s: 1,   a: 1   }, // فاتحہ
  { s: 2,   a: 255 }, // آیت الکرسی
  { s: 2,   a: 286 }, // لا یکلف اللہ
  { s: 3,   a: 18  }, // شہد اللہ
  { s: 3,   a: 185 }, // کل نفس ذائقۃ الموت
  { s: 36,  a: 1   }, // یٰسین
  { s: 55,  a: 1   }, // الرحمن
  { s: 67,  a: 1   }, // الملک
  { s: 112, a: 1   }, // الاخلاص
  { s: 113, a: 1   }, // الفلق
  { s: 114, a: 1   }, // الناس
  { s: 93,  a: 1   }, // الضحیٰ
  { s: 94,  a: 1   }, // الشرح
  { s: 103, a: 1   }, // العصر
  { s: 108, a: 1   }  // الکوثر
];

module.exports = {
  name: 'quran',
  aliases: ['ayah', 'surah', 'قرآن', 'آیت', 'سورہ'],
  category: 'islamic',
  description: 'قرآن مجید کی آیات — عربی، اردو اور انگریزی ترجمے کے ساتھ',
  usage: '.quran <سورہ:آیت> — مثال: .quran 1:1 | .quran random | .quran list',
  cooldown: 3000,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      // ━━━ کوئی argument نہیں ━━━
      if (!args[0]) {
        await sock.sendMessage(jid, {
          text: `
📖 *قرآن مجید — استعمال کا طریقہ*

*مثالیں:*
.quran 1:1 — سورۃ الفاتحہ، آیت 1
.quran 2:255 — آیت الکرسی
.quran 36:1 — سورۃ یٰسین
.quran 67:1 — سورۃ الملک
.quran 112:1 — سورۃ الاخلاص
.quran random — کوئی بھی آیت
.quran famous — مشہور آیت
.quran list — مشہور سورتیں

*فارمیٹ:* .quran سورہ نمبر:آیت نمبر`.trim()
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(jid, {
        react: { text: '📖', key: msg.key }
      });

      let surahNum, ayahNum;
      const input = args[0].toLowerCase();

      // ━━━ Random آیت ━━━
      if (input === 'random' || input === 'رینڈم') {
        surahNum = Math.floor(Math.random() * 114) + 1;
        ayahNum  = Math.floor(Math.random() * 7) + 1;
      }
      // ━━━ مشہور آیت ━━━
      else if (input === 'famous' || input === 'مشہور') {
        const pick = famousAyahs[Math.floor(Math.random() * famousAyahs.length)];
        surahNum = pick.s;
        ayahNum  = pick.a;
      }
      // ━━━ فہرست ━━━
      else if (input === 'list' || input === 'فہرست') {
        const listMsg = `
╭━━━『 *مشہور سورتیں* 』━━━╮

📖 *مختصر سورتیں:*
.quran 112:1 — سورۃ الاخلاص
.quran 113:1 — سورۃ الفلق
.quran 114:1 — سورۃ الناس
.quran 108:1 — سورۃ الکوثر
.quran 103:1 — سورۃ العصر
.quran 93:1  — سورۃ الضحیٰ
.quran 94:1  — سورۃ الشرح

📖 *اہم آیات:*
.quran 2:255  — آیت الکرسی
.quran 2:286  — لا یکلف اللہ
.quran 1:1    — سورۃ الفاتحہ

📖 *مشہور سورتیں:*
.quran 36:1  — سورۃ یٰسین
.quran 67:1  — سورۃ الملک
.quran 55:1  — سورۃ الرحمن
.quran 18:1  — سورۃ الکہف

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j`.trim();

        await sock.sendMessage(jid, { text: listMsg }, { quoted: msg });
        await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
        return;
      }
      // ━━━ سورہ:آیت فارمیٹ ━━━
      else {
        const parts = args[0].split(':');
        if (parts.length !== 2) {
          await sock.sendMessage(jid, {
            text: '❌ *غلط فارمیٹ!*\n\nصحیح طریقہ:\n*.quran 2:255*\n*(سورہ نمبر:آیت نمبر)*'
          }, { quoted: msg });
          return;
        }
        surahNum = parseInt(parts[0]);
        ayahNum  = parseInt(parts[1]);
      }

      // ━━━ نمبر درست ہیں؟ ━━━
      if (
        isNaN(surahNum) || isNaN(ayahNum) ||
        surahNum < 1 || surahNum > 114 ||
        ayahNum  < 1
      ) {
        await sock.sendMessage(jid, {
          text: '❌ *غلط نمبر!*\n\nسورہ نمبر: 1 سے 114 کے درمیان\nآیت نمبر: 1 سے شروع\n\n*مثال:* .quran 2:255'
        }, { quoted: msg });
        return;
      }

      await sock.sendMessage(jid, {
        text: '⏳ *قرآنی آیت لوڈ ہو رہی ہے...*'
      }, { quoted: msg });

      // ━━━ API Call ━━━
      const response = await axios.get(
        `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/quran-uthmani,en.sahih,ur.jalandhry`,
        { timeout: 12000 }
      );

      if (
        response.data &&
        response.data.code === 200 &&
        response.data.data &&
        response.data.data.length >= 3
      ) {
        const data       = response.data.data;
        const arabicText = data[0].text;
        const englishText= data[1].text;
        const urduText   = data[2].text;
        const surahEn    = data[0].surah.englishName;
        const surahAr    = data[0].surah.name;
        const ayahNo     = data[0].numberInSurah;
        const juzNo      = data[0].juz;
        const surahUrdu  = surahNames[surahNum] || surahEn;

        const message = `
╭━━━『 *قرآن مجید* 』━━━╮

📖 *سورۃ ${surahUrdu}*
    *(${surahEn} — ${surahAr})*
🔢 *آیت نمبر:* ${ayahNo}
📚 *پارہ نمبر:* ${juzNo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

*🔷 عربی متن:*
${arabicText}

*🌙 اردو ترجمہ:*
${urduText}

*🌐 English Translation:*
${englishText}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*مزید آیات کے لیے:*
• .quran ${surahNum}:${ayahNo + 1} — اگلی آیت
• .quran random — بے ترتیب آیت
• .quran list — مشہور سورتیں

☪️ *سُبْحَانَ اللّٰہِ وَبِحَمْدِہٖ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

        await sock.sendMessage(jid, { text: message }, { quoted: msg });
        await sock.sendMessage(jid, {
          react: { text: '✅', key: msg.key }
        });

      } else {
        await sock.sendMessage(jid, {
          text: `❌ *آیت نہیں ملی!*\n\nسورہ ${surahNum} میں آیت ${ayahNum} موجود نہیں۔\nچھوٹا نمبر لکھیں۔`
        }, { quoted: msg });
        await sock.sendMessage(jid, {
          react: { text: '❌', key: msg.key }
        });
      }

    } catch (error) {
      console.error('[QURAN ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, {
        react: { text: '❌', key: msg.key }
      });
      await sock.sendMessage(jid,
        { text: `❌ *غلطی:* قرآنی آیت لوڈ نہیں ہو سکی\n*Error:* ${error.message}` },
        { quoted: msg }
      );
    }
  }
};
