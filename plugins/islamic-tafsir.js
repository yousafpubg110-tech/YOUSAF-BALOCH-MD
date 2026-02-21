/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Quran & Tafsir       ┃
┃  Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import axios from 'axios';
import { SYSTEM } from '../config.js';

// ━━━ تمام سورتوں کا ڈیٹا ━━━
const surahData = {
  1:   { urdu: 'الفاتحہ',    en: 'Al-Fatiha' },
  2:   { urdu: 'البقرہ',     en: 'Al-Baqarah' },
  3:   { urdu: 'آل عمران',   en: 'Aal-Imran' },
  4:   { urdu: 'النساء',     en: 'An-Nisa' },
  5:   { urdu: 'المائدہ',    en: 'Al-Maidah' },
  6:   { urdu: 'الانعام',    en: 'Al-Anam' },
  7:   { urdu: 'الاعراف',    en: 'Al-Araf' },
  8:   { urdu: 'الانفال',    en: 'Al-Anfal' },
  9:   { urdu: 'التوبہ',     en: 'At-Tawbah' },
  10:  { urdu: 'یونس',       en: 'Yunus' },
  11:  { urdu: 'ہود',        en: 'Hud' },
  12:  { urdu: 'یوسف',       en: 'Yusuf' },
  13:  { urdu: 'الرعد',      en: 'Ar-Rad' },
  14:  { urdu: 'ابراہیم',    en: 'Ibrahim' },
  15:  { urdu: 'الحجر',      en: 'Al-Hijr' },
  16:  { urdu: 'النحل',      en: 'An-Nahl' },
  17:  { urdu: 'الاسراء',    en: 'Al-Isra' },
  18:  { urdu: 'الکہف',      en: 'Al-Kahf' },
  19:  { urdu: 'مریم',       en: 'Maryam' },
  20:  { urdu: 'طہ',         en: 'Ta-Ha' },
  21:  { urdu: 'الانبیاء',   en: 'Al-Anbiya' },
  22:  { urdu: 'الحج',       en: 'Al-Hajj' },
  23:  { urdu: 'المومنون',   en: 'Al-Muminun' },
  24:  { urdu: 'النور',      en: 'An-Nur' },
  25:  { urdu: 'الفرقان',    en: 'Al-Furqan' },
  26:  { urdu: 'الشعراء',    en: 'Ash-Shuara' },
  27:  { urdu: 'النمل',      en: 'An-Naml' },
  28:  { urdu: 'القصص',      en: 'Al-Qasas' },
  29:  { urdu: 'العنکبوت',   en: 'Al-Ankabut' },
  30:  { urdu: 'الروم',      en: 'Ar-Rum' },
  31:  { urdu: 'لقمان',      en: 'Luqman' },
  32:  { urdu: 'السجدہ',     en: 'As-Sajdah' },
  33:  { urdu: 'الاحزاب',    en: 'Al-Ahzab' },
  34:  { urdu: 'سبا',        en: 'Saba' },
  35:  { urdu: 'فاطر',       en: 'Fatir' },
  36:  { urdu: 'یٰسین',      en: 'Ya-Sin' },
  37:  { urdu: 'الصافات',    en: 'As-Saffat' },
  38:  { urdu: 'ص',          en: 'Sad' },
  39:  { urdu: 'الزمر',      en: 'Az-Zumar' },
  40:  { urdu: 'غافر',       en: 'Ghafir' },
  41:  { urdu: 'فصلت',       en: 'Fussilat' },
  42:  { urdu: 'الشوریٰ',    en: 'Ash-Shura' },
  43:  { urdu: 'الزخرف',     en: 'Az-Zukhruf' },
  44:  { urdu: 'الدخان',     en: 'Ad-Dukhan' },
  45:  { urdu: 'الجاثیہ',    en: 'Al-Jathiyah' },
  46:  { urdu: 'الاحقاف',    en: 'Al-Ahqaf' },
  47:  { urdu: 'محمد',       en: 'Muhammad' },
  48:  { urdu: 'الفتح',      en: 'Al-Fath' },
  49:  { urdu: 'الحجرات',    en: 'Al-Hujurat' },
  50:  { urdu: 'ق',          en: 'Qaf' },
  51:  { urdu: 'الذاریات',   en: 'Adh-Dhariyat' },
  52:  { urdu: 'الطور',      en: 'At-Tur' },
  53:  { urdu: 'النجم',      en: 'An-Najm' },
  54:  { urdu: 'القمر',      en: 'Al-Qamar' },
  55:  { urdu: 'الرحمن',     en: 'Ar-Rahman' },
  56:  { urdu: 'الواقعہ',    en: 'Al-Waqiah' },
  57:  { urdu: 'الحدید',     en: 'Al-Hadid' },
  58:  { urdu: 'المجادلہ',   en: 'Al-Mujadilah' },
  59:  { urdu: 'الحشر',      en: 'Al-Hashr' },
  60:  { urdu: 'الممتحنہ',   en: 'Al-Mumtahanah' },
  61:  { urdu: 'الصف',       en: 'As-Saf' },
  62:  { urdu: 'الجمعہ',     en: 'Al-Jumuah' },
  63:  { urdu: 'المنافقون',  en: 'Al-Munafiqun' },
  64:  { urdu: 'التغابن',    en: 'At-Taghabun' },
  65:  { urdu: 'الطلاق',     en: 'At-Talaq' },
  66:  { urdu: 'التحریم',    en: 'At-Tahrim' },
  67:  { urdu: 'الملک',      en: 'Al-Mulk' },
  68:  { urdu: 'القلم',      en: 'Al-Qalam' },
  69:  { urdu: 'الحاقہ',     en: 'Al-Haqqah' },
  70:  { urdu: 'المعارج',    en: 'Al-Maarij' },
  71:  { urdu: 'نوح',        en: 'Nuh' },
  72:  { urdu: 'الجن',       en: 'Al-Jinn' },
  73:  { urdu: 'المزمل',     en: 'Al-Muzzammil' },
  74:  { urdu: 'المدثر',     en: 'Al-Muddaththir' },
  75:  { urdu: 'القیامہ',    en: 'Al-Qiyamah' },
  76:  { urdu: 'الانسان',    en: 'Al-Insan' },
  77:  { urdu: 'المرسلات',   en: 'Al-Mursalat' },
  78:  { urdu: 'النبا',      en: 'An-Naba' },
  79:  { urdu: 'النازعات',   en: 'An-Naziat' },
  80:  { urdu: 'عبس',        en: 'Abasa' },
  81:  { urdu: 'التکویر',    en: 'At-Takwir' },
  82:  { urdu: 'الانفطار',   en: 'Al-Infitar' },
  83:  { urdu: 'المطففین',   en: 'Al-Mutaffifin' },
  84:  { urdu: 'الانشقاق',   en: 'Al-Inshiqaq' },
  85:  { urdu: 'البروج',     en: 'Al-Buruj' },
  86:  { urdu: 'الطارق',     en: 'At-Tariq' },
  87:  { urdu: 'الاعلیٰ',    en: 'Al-Ala' },
  88:  { urdu: 'الغاشیہ',    en: 'Al-Ghashiyah' },
  89:  { urdu: 'الفجر',      en: 'Al-Fajr' },
  90:  { urdu: 'البلد',      en: 'Al-Balad' },
  91:  { urdu: 'الشمس',      en: 'Ash-Shams' },
  92:  { urdu: 'اللیل',      en: 'Al-Layl' },
  93:  { urdu: 'الضحیٰ',     en: 'Ad-Duha' },
  94:  { urdu: 'الشرح',      en: 'Ash-Sharh' },
  95:  { urdu: 'التین',      en: 'At-Tin' },
  96:  { urdu: 'العلق',      en: 'Al-Alaq' },
  97:  { urdu: 'القدر',      en: 'Al-Qadr' },
  98:  { urdu: 'البینہ',     en: 'Al-Bayyinah' },
  99:  { urdu: 'الزلزلہ',    en: 'Az-Zalzalah' },
  100: { urdu: 'العادیات',   en: 'Al-Adiyat' },
  101: { urdu: 'القارعہ',    en: 'Al-Qariah' },
  102: { urdu: 'التکاثر',    en: 'At-Takathur' },
  103: { urdu: 'العصر',      en: 'Al-Asr' },
  104: { urdu: 'الہمزہ',     en: 'Al-Humazah' },
  105: { urdu: 'الفیل',      en: 'Al-Fil' },
  106: { urdu: 'قریش',       en: 'Quraysh' },
  107: { urdu: 'الماعون',    en: 'Al-Maun' },
  108: { urdu: 'الکوثر',     en: 'Al-Kawthar' },
  109: { urdu: 'الکافرون',   en: 'Al-Kafirun' },
  110: { urdu: 'النصر',      en: 'An-Nasr' },
  111: { urdu: 'المسد',      en: 'Al-Masad' },
  112: { urdu: 'الاخلاص',    en: 'Al-Ikhlas' },
  113: { urdu: 'الفلق',      en: 'Al-Falaq' },
  114: { urdu: 'الناس',      en: 'An-Nas' },
};

// ━━━ نام سے نمبر تلاش ━━━
const nameToNumber = {
  'fatiha':1, 'alfatiha':1, 'al-fatiha':1, 'fatihah':1,
  'فاتحہ':1, 'الفاتحہ':1,
  'baqarah':2, 'albaqarah':2, 'al-baqarah':2, 'baqra':2, 'bakra':2,
  'البقرہ':2, 'بقرہ':2,
  'aal imran':3, 'aale imran':3, 'al imran':3, 'imran':3,
  'آل عمران':3, 'عمران':3,
  'nisa':4, 'an-nisa':4, 'annisa':4,
  'النساء':4, 'نساء':4,
  'maidah':5, 'al-maidah':5, 'maida':5,
  'المائدہ':5, 'مائدہ':5,
  'anam':6, 'al-anam':6, 'anaam':6,
  'الانعام':6, 'انعام':6,
  'araf':7, 'al-araf':7,
  'الاعراف':7, 'اعراف':7,
  'anfal':8, 'al-anfal':8,
  'الانفال':8, 'انفال':8,
  'tawbah':9, 'tauba':9, 'toba':9,
  'التوبہ':9, 'توبہ':9,
  'yunus':10, 'younus':10,
  'یونس':10,
  'hud':11, 'hood':11,
  'ہود':11,
  'yusuf':12, 'yousuf':12, 'yousaf':12,
  'یوسف':12,
  'rad':13, 'raad':13,
  'الرعد':13, 'رعد':13,
  'ibrahim':14, 'ibraheem':14,
  'ابراہیم':14,
  'hijr':15, 'al-hijr':15,
  'الحجر':15, 'حجر':15,
  'nahl':16, 'an-nahl':16,
  'النحل':16, 'نحل':16,
  'isra':17, 'al-isra':17,
  'الاسراء':17, 'اسراء':17,
  'kahf':18, 'al-kahf':18, 'kehf':18, 'kahaf':18,
  'الکہف':18, 'کہف':18,
  'maryam':19, 'mariam':19,
  'مریم':19,
  'taha':20, 'ta-ha':20,
  'طہ':20,
  'anbiya':21, 'ambiya':21,
  'الانبیاء':21, 'انبیاء':21,
  'hajj':22, 'haj':22,
  'الحج':22, 'حج':22,
  'muminun':23, 'mominoon':23,
  'المومنون':23, 'مومنون':23,
  'nur':24, 'noor':24,
  'النور':24, 'نور':24,
  'furqan':25, 'al-furqan':25,
  'الفرقان':25, 'فرقان':25,
  'yasin':36, 'yaseen':36, 'ya seen':36,
  'یٰسین':36, 'یسین':36, 'یاسین':36,
  'saffat':37,
  'الصافات':37, 'صافات':37,
  'zumar':39,
  'الزمر':39, 'زمر':39,
  'ghafir':40, 'momin':40,
  'غافر':40,
  'muhammad':47, 'mohammed':47,
  'محمد':47,
  'fath':48, 'fatah':48,
  'الفتح':48, 'فتح':48,
  'hujurat':49, 'hujraat':49,
  'الحجرات':49, 'حجرات':49,
  'rahman':55, 'rehman':55,
  'الرحمن':55, 'رحمن':55,
  'waqiah':56, 'wakia':56, 'waqia':56,
  'الواقعہ':56, 'واقعہ':56,
  'jumuah':62, 'juma':62, 'jumma':62,
  'الجمعہ':62, 'جمعہ':62,
  'mulk':67, 'al-mulk':67,
  'الملک':67, 'ملک':67,
  'qalam':68,
  'القلم':68, 'قلم':68,
  'nuh':71, 'nooh':71,
  'نوح':71,
  'jinn':72, 'jin':72,
  'الجن':72, 'جن':72,
  'muzzammil':73, 'muzammil':73,
  'المزمل':73, 'مزمل':73,
  'muddaththir':74, 'mudassir':74,
  'المدثر':74, 'مدثر':74,
  'naba':78, 'nabaa':78,
  'النبا':78, 'نبا':78,
  'ala':87, 'aala':87,
  'الاعلیٰ':87, 'اعلیٰ':87,
  'fajr':89, 'fajar':89,
  'الفجر':89, 'فجر':89,
  'shams':91,
  'الشمس':91, 'شمس':91,
  'layl':92, 'lail':92, 'leel':92,
  'اللیل':92, 'لیل':92,
  'duha':93, 'zuha':93, 'dhuha':93,
  'الضحیٰ':93, 'ضحیٰ':93,
  'sharh':94, 'inshirah':94,
  'الشرح':94, 'شرح':94,
  'tin':95, 'teen':95,
  'التین':95, 'تین':95,
  'alaq':96, 'iqra':96,
  'العلق':96, 'علق':96,
  'qadr':97, 'qadar':97,
  'القدر':97, 'قدر':97,
  'zalzalah':99, 'zilzal':99,
  'الزلزلہ':99, 'زلزلہ':99,
  'adiyat':100,
  'العادیات':100, 'عادیات':100,
  'qariah':101,
  'القارعہ':101, 'قارعہ':101,
  'takathur':102,
  'التکاثر':102, 'تکاثر':102,
  'asr':103,
  'العصر':103, 'عصر':103,
  'fil':105, 'feel':105,
  'الفیل':105, 'فیل':105,
  'quraysh':106, 'quraish':106,
  'قریش':106,
  'maun':107, 'maoon':107,
  'الماعون':107, 'ماعون':107,
  'kawthar':108, 'kausar':108, 'kosar':108,
  'الکوثر':108, 'کوثر':108,
  'kafirun':109, 'kafiroon':109,
  'الکافرون':109, 'کافرون':109,
  'nasr':110, 'naser':110,
  'النصر':110, 'نصر':110,
  'masad':111, 'lahab':111,
  'المسد':111, 'مسد':111,
  'ikhlas':112, 'akhlas':112, 'qulhuallah':112,
  'الاخلاص':112, 'اخلاص':112,
  'falaq':113, 'falak':113,
  'الفلق':113, 'فلق':113,
  'nas':114, 'naas':114,
  'الناس':114, 'ناس':114,
};

// ━━━ نام سے نمبر تلاش کریں ━━━
function getSurahNumber(input) {
  if (!input) return null;
  const clean = input.toLowerCase().trim();
  return nameToNumber[clean] || null;
}

// ━━━ آیت کا اردو ترجمہ API سے لیں ━━━
async function getAyah(surah, ayah) {
  try {
    // Arabic text
    const arabicRes = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`
    );
    // Urdu translation
    const urduRes = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ur.jalandhry`
    );
    // English translation
    const englishRes = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`
    );

    return {
      arabic: arabicRes.data.data.text,
      urdu: urduRes.data.data.text,
      english: englishRes.data.data.text,
    };
  } catch (_) {
    return null;
  }
}

export default {
  command: ['tafsir', 'quran', 'ayah', 'ayat', 'verse', 'آیت', 'قرآن'],
  name: 'tafsir',
  category: 'Islamic',
  description: 'قرآن کی آیت کا عربی، اردو ترجمہ اور تفسیر دیکھیں',
  usage: '.tafsir <سورہ نمبر> <آیت نمبر> — مثال: .tafsir 1 1 یا .tafsir 18 1',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      await msg.react('📖');

      // ━━━ کوئی argument نہیں دیا ━━━
      if (!args[0]) {
        return await msg.reply(`📖 *قرآن پاک — آیت تلاش کریں*

*استعمال کا طریقہ:*
\`.tafsir <سورہ نمبر> <آیت نمبر>\`

*مثالیں:*
🔹 \`.tafsir 1 1\` — سورہ الفاتحہ آیت 1
🔹 \`.tafsir 18 1\` — سورہ الکہف آیت 1
🔹 \`.tafsir 36 1\` — سورہ یٰسین آیت 1
🔹 \`.tafsir 112 1\` — سورہ الاخلاص آیت 1

*سورہ کا نام بھی لکھ سکتے ہیں:*
🔹 \`.tafsir kahf 1\`
🔹 \`.tafsir yaseen 1\`
🔹 \`.tafsir الکہف 1\`

*سورتوں کی تعداد:* 114
*آیات کی تعداد:* 6236

${SYSTEM.SHORT_WATERMARK}`);
      }

      // ━━━ سورہ نمبر یا نام سے تلاش ━━━
      let surahNum = parseInt(args[0]);
      if (isNaN(surahNum)) {
        surahNum = getSurahNumber(args[0]);
        if (!surahNum) {
          return await msg.reply(`❌ سورہ نہیں ملی۔\n\nسورہ کا نام یا نمبر (1-114) لکھیں۔\n\n${SYSTEM.SHORT_WATERMARK}`);
        }
      }

      if (surahNum < 1 || surahNum > 114) {
        return await msg.reply(`❌ سورہ نمبر 1 سے 114 کے درمیان ہونا چاہیے۔\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      const ayahNum = parseInt(args[1]) || 1;
      if (ayahNum < 1) {
        return await msg.reply(`❌ آیت نمبر کم از کم 1 ہونا چاہیے۔\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⏳');

      const surahInfo = surahData[surahNum];
      const ayahData = await getAyah(surahNum, ayahNum);

      if (!ayahData) {
        return await msg.reply(`❌ آیت نہیں ملی۔ سورہ ${surahNum} میں آیت ${ayahNum} موجود نہیں ہے۔\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      const reply = `╭━━━『 📖 *قرآن پاک* 』━━━╮

🕌 *سورہ:* ${surahInfo.urdu} (${surahInfo.en})
📍 *سورہ نمبر:* ${surahNum} | *آیت نمبر:* ${ayahNum}

━━━━━━━━━━━━━━━━━━━━━━━━

🔤 *عربی متن:*
${ayahData.arabic}

━━━━━━━━━━━━━━━━━━━━━━━━

🇵🇰 *اردو ترجمہ:*
${ayahData.urdu}

━━━━━━━━━━━━━━━━━━━━━━━━

🌐 *English Translation:*
${ayahData.english}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *اللہ کا کلام پاک*

${SYSTEM.SHORT_WATERMARK}`;

      await msg.reply(reply);
      await msg.react('✅');

    } catch (error) {
      console.error('Tafsir error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ خطا آئی: ${error.message}\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
