/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD 99 Names of Allah    ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { SYSTEM } from '../config.js';

const ALLAH_NAMES = [
  {
    num: 1,
    arabic: 'الرَّحْمَنُ',
    transliteration: 'Ar-Rahman',
    urdu: 'بہت مہربان',
    fazilat: '100 بار پڑھنے سے دل میں رحمت اور نرمی پیدا ہوتی ہے، سونے سے پہلے پڑھنے سے نیند اچھی آتی ہے۔',
  },
  {
    num: 2,
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Raheem',
    urdu: 'بار بار رحم کرنے والا',
    fazilat: '100 بار پڑھنے سے اللہ کی رحمت نازل ہوتی ہے، گناہوں کی معافی ملتی ہے۔',
  },
  {
    num: 3,
    arabic: 'الْمَلِكُ',
    transliteration: 'Al-Malik',
    urdu: 'بادشاہ',
    fazilat: 'صبح کثرت سے پڑھنے سے دنیا میں عزت اور مقام ملتا ہے۔',
  },
  {
    num: 4,
    arabic: 'الْقُدُّوسُ',
    transliteration: 'Al-Quddus',
    urdu: 'پاک اور منزہ',
    fazilat: '100 بار پڑھنے سے دل کی پاکیزگی حاصل ہوتی ہے اور فکری پریشانیاں دور ہوتی ہیں۔',
  },
  {
    num: 5,
    arabic: 'السَّلاَمُ',
    transliteration: 'As-Salam',
    urdu: 'سلامتی دینے والا',
    fazilat: '160 بار بیمار پر پڑھنے سے شفاء ملتی ہے، پڑھ کر دم کرنے سے بیماری دور ہوتی ہے۔',
  },
  {
    num: 6,
    arabic: 'الْمُؤْمِنُ',
    transliteration: 'Al-Mumin',
    urdu: 'امن دینے والا',
    fazilat: '630 بار پڑھنے سے ظالموں کے ظلم سے حفاظت ہوتی ہے۔',
  },
  {
    num: 7,
    arabic: 'الْمُهَيْمِنُ',
    transliteration: 'Al-Muhaymin',
    urdu: 'نگہبان',
    fazilat: 'غسل کے بعد 100 بار پڑھنے سے دل روشن ہوتا ہے، حافظہ تیز ہوتا ہے۔',
  },
  {
    num: 8,
    arabic: 'الْعَزِيزُ',
    transliteration: 'Al-Aziz',
    urdu: 'غالب اور عزت والا',
    fazilat: '40 بار پڑھنے سے بے نیازی نصیب ہوتی ہے، کسی کا محتاج نہیں رہتا۔',
  },
  {
    num: 9,
    arabic: 'الْجَبَّارُ',
    transliteration: 'Al-Jabbar',
    urdu: 'سب پر غالب',
    fazilat: 'صبح شام پڑھنے سے ظالموں سے حفاظت ہوتی ہے، دشمن بے بس ہوجاتا ہے۔',
  },
  {
    num: 10,
    arabic: 'الْمُتَكَبِّرُ',
    transliteration: 'Al-Mutakabbir',
    urdu: 'بڑائی والا',
    fazilat: '10 بار پڑھ کر دم کرنے سے تکبر دور ہوتا ہے اور انکساری آتی ہے۔',
  },
  {
    num: 11,
    arabic: 'الْخَالِقُ',
    transliteration: 'Al-Khaliq',
    urdu: 'پیدا کرنے والا',
    fazilat: 'رات کو پڑھنے سے فرشتہ موکل ہوتا ہے جو صبح تک حفاظت کرتا ہے۔',
  },
  {
    num: 12,
    arabic: 'الْبَارِئُ',
    transliteration: 'Al-Bari',
    urdu: 'بنانے والا',
    fazilat: '100 بار پڑھنے سے مقصد پورا ہوتا ہے اور دل کی مراد ملتی ہے۔',
  },
  {
    num: 13,
    arabic: 'الْمُصَوِّرُ',
    transliteration: 'Al-Musawwir',
    urdu: 'صورت بنانے والا',
    fazilat: 'حاملہ عورت کثرت سے پڑھے تو اولاد صالح اور خوبصورت ہوتی ہے۔',
  },
  {
    num: 14,
    arabic: 'الْغَفَّارُ',
    transliteration: 'Al-Ghaffar',
    urdu: 'بہت بخشنے والا',
    fazilat: 'جمعہ کی نماز کے بعد 100 بار پڑھنے سے تمام گناہ معاف ہوتے ہیں۔',
  },
  {
    num: 15,
    arabic: 'الْقَهَّارُ',
    transliteration: 'Al-Qahhar',
    urdu: 'سب پر غالب',
    fazilat: 'کثرت سے پڑھنے سے دنیا کی محبت دل سے نکل جاتی ہے اور زہد پیدا ہوتا ہے۔',
  },
  {
    num: 16,
    arabic: 'الْوَهَّابُ',
    transliteration: 'Al-Wahhab',
    urdu: 'بہت عطا کرنے والا',
    fazilat: '40 بار پڑھنے سے تنگدستی دور ہوتی ہے اور رزق میں وسعت آتی ہے۔',
  },
  {
    num: 17,
    arabic: 'الرَّزَّاقُ',
    transliteration: 'Ar-Razzaq',
    urdu: 'رزق دینے والا',
    fazilat: 'کثرت سے پڑھنے سے رزق میں برکت اور وسعت ہوتی ہے، فقر دور ہوتا ہے۔',
  },
  {
    num: 18,
    arabic: 'الْفَتَّاحُ',
    transliteration: 'Al-Fattah',
    urdu: 'کھولنے والا، فتح دینے والا',
    fazilat: 'صبح کی نماز کے بعد 71 بار پڑھنے سے بند دروازے کھلتے ہیں، مشکلات آسان ہوتی ہیں۔',
  },
  {
    num: 19,
    arabic: 'اَلْعَلِيمُ',
    transliteration: 'Al-Alim',
    urdu: 'سب کچھ جاننے والا',
    fazilat: '100 بار پڑھنے سے علم میں اضافہ ہوتا ہے اور ذہن تیز ہوتا ہے۔',
  },
  {
    num: 20,
    arabic: 'الْقَابِضُ',
    transliteration: 'Al-Qabid',
    urdu: 'روکنے والا',
    fazilat: 'روٹی پر 21 بار پڑھ کر کھانے سے بھوک اور فاقہ سے حفاظت ہوتی ہے۔',
  },
  {
    num: 21,
    arabic: 'الْبَاسِطُ',
    transliteration: 'Al-Basit',
    urdu: 'کشادہ کرنے والا',
    fazilat: 'صبح 10 بار ہاتھ اٹھا کر پڑھنے سے رزق میں وسعت آتی ہے۔',
  },
  {
    num: 22,
    arabic: 'الْخَافِضُ',
    transliteration: 'Al-Khafid',
    urdu: 'نیچا کرنے والا',
    fazilat: '500 بار پڑھنے سے دشمنوں پر غلبہ ملتا ہے۔',
  },
  {
    num: 23,
    arabic: 'الرَّافِعُ',
    transliteration: 'Ar-Rafi',
    urdu: 'اونچا کرنے والا',
    fazilat: 'کثرت سے پڑھنے سے مرتبہ اور شان بڑھتی ہے۔',
  },
  {
    num: 24,
    arabic: 'الْمُعِزُّ',
    transliteration: 'Al-Muizz',
    urdu: 'عزت دینے والا',
    fazilat: '140 بار پڑھنے سے دشمنوں پر عزت ملتی ہے اور لوگ عزت کرتے ہیں۔',
  },
  {
    num: 25,
    arabic: 'المُذِلُّ',
    transliteration: 'Al-Mudhill',
    urdu: 'ذلیل کرنے والا',
    fazilat: '75 بار پڑھنے سے ظالم دشمن ذلیل ہوتا ہے اور اس کا شر دور ہوتا ہے۔',
  },
  {
    num: 26,
    arabic: 'السَّمِيعُ',
    transliteration: 'As-Sami',
    urdu: 'سب کچھ سننے والا',
    fazilat: 'جمعرات کو 500 بار پڑھنے سے دعائیں قبول ہوتی ہیں۔',
  },
  {
    num: 27,
    arabic: 'الْبَصِيرُ',
    transliteration: 'Al-Basir',
    urdu: 'سب کچھ دیکھنے والا',
    fazilat: 'جمعہ کی نماز کے بعد 100 بار پڑھنے سے آنکھوں کی روشنی بڑھتی ہے۔',
  },
  {
    num: 28,
    arabic: 'الْحَكَمُ',
    transliteration: 'Al-Hakam',
    urdu: 'فیصلہ کرنے والا',
    fazilat: 'رات کو 68 بار پڑھنے سے پوشیدہ علوم کھلتے ہیں اور قلبی سکون ملتا ہے۔',
  },
  {
    num: 29,
    arabic: 'الْعَدْلُ',
    transliteration: 'Al-Adl',
    urdu: 'انصاف کرنے والا',
    fazilat: 'کھانے پر پڑھنے سے دل میں عدل اور انصاف پیدا ہوتا ہے۔',
  },
  {
    num: 30,
    arabic: 'اللَّطِيفُ',
    transliteration: 'Al-Latif',
    urdu: 'مہربان اور باریک بین',
    fazilat: '133 بار پڑھنے سے مشکل کام آسان ہوتے ہیں اور رزق کے نئے ذرائع کھلتے ہیں۔',
  },
  {
    num: 31,
    arabic: 'الْخَبِيرُ',
    transliteration: 'Al-Khabir',
    urdu: 'باخبر',
    fazilat: 'کثرت سے پڑھنے سے برے اخلاق سے نجات ملتی ہے اور اچھی عادتیں پیدا ہوتی ہیں۔',
  },
  {
    num: 32,
    arabic: 'الْحَلِيمُ',
    transliteration: 'Al-Halim',
    urdu: 'بردبار',
    fazilat: 'پانی پر پڑھ کر کھیتوں پر چھڑکنے سے فصل آفات سے محفوظ رہتی ہے۔',
  },
  {
    num: 33,
    arabic: 'الْعَظِيمُ',
    transliteration: 'Al-Azim',
    urdu: 'بڑی شان والا',
    fazilat: 'کثرت سے پڑھنے سے دنیا و آخرت میں عظمت ملتی ہے۔',
  },
  {
    num: 34,
    arabic: 'الْغَفُورُ',
    transliteration: 'Al-Ghafur',
    urdu: 'بخشنے والا',
    fazilat: 'سر درد میں پڑھنے سے آرام ملتا ہے، کثرت سے پڑھنے سے گناہ معاف ہوتے ہیں۔',
  },
  {
    num: 35,
    arabic: 'الشَّكُورُ',
    transliteration: 'Ash-Shakur',
    urdu: 'قدردان',
    fazilat: '41 بار پڑھنے سے آنکھ اور دل کی بیماری دور ہوتی ہے۔',
  },
  {
    num: 36,
    arabic: 'الْعَلِيُّ',
    transliteration: 'Al-Ali',
    urdu: 'بلند و بالا',
    fazilat: 'چمڑے پر لکھ کر پاس رکھنے سے سفر میں حفاظت ہوتی ہے۔',
  },
  {
    num: 37,
    arabic: 'الْكَبِيرُ',
    transliteration: 'Al-Kabir',
    urdu: 'بڑا',
    fazilat: '100 بار پڑھنے سے لوگوں میں عزت بڑھتی ہے اور وقار حاصل ہوتا ہے۔',
  },
  {
    num: 38,
    arabic: 'الْحَفِيظُ',
    transliteration: 'Al-Hafiz',
    urdu: 'حفاظت کرنے والا',
    fazilat: 'صبح 16 بار پڑھنے سے پورا دن ہر آفت سے محفوظ رہتا ہے۔',
  },
  {
    num: 39,
    arabic: 'المُقِيتُ',
    transliteration: 'Al-Muqit',
    urdu: 'رزق دینے والا',
    fazilat: 'پانی پر پڑھ کر پلانے سے بچے کا دل مضبوط اور قوی ہوتا ہے۔',
  },
  {
    num: 40,
    arabic: 'الْحَسِيبُ',
    transliteration: 'Al-Hasib',
    urdu: 'حساب لینے والا',
    fazilat: 'صبح شام 70 بار پڑھنے سے انسانوں اور جنوں کے شر سے حفاظت ہوتی ہے۔',
  },
  {
    num: 41,
    arabic: 'الْجَلِيلُ',
    transliteration: 'Al-Jalil',
    urdu: 'بزرگی والا',
    fazilat: 'کثرت سے پڑھنے سے دنیا میں جلال اور ہیبت پیدا ہوتی ہے۔',
  },
  {
    num: 42,
    arabic: 'الْكَرِيمُ',
    transliteration: 'Al-Karim',
    urdu: 'کریم اور سخی',
    fazilat: 'سونے سے پہلے کثرت سے پڑھنے سے دنیا و آخرت میں عزت ملتی ہے۔',
  },
  {
    num: 43,
    arabic: 'الرَّقِيبُ',
    transliteration: 'Ar-Raqib',
    urdu: 'نگہبان',
    fazilat: '7 بار پڑھ کر اپنے آپ پر، گھر اور مال پر دم کرنے سے حفاظت ہوتی ہے۔',
  },
  {
    num: 44,
    arabic: 'الْمُجِيبُ',
    transliteration: 'Al-Mujib',
    urdu: 'دعا قبول کرنے والا',
    fazilat: '55 بار پڑھنے سے دعائیں قبول ہوتی ہیں اور حاجتیں پوری ہوتی ہیں۔',
  },
  {
    num: 45,
    arabic: 'الْوَاسِعُ',
    transliteration: 'Al-Wasi',
    urdu: 'وسعت والا',
    fazilat: 'تنگدستی میں کثرت سے پڑھنے سے رزق میں کشادگی آتی ہے۔',
  },
  {
    num: 46,
    arabic: 'الْحَكِيمُ',
    transliteration: 'Al-Hakim',
    urdu: 'حکمت والا',
    fazilat: 'کثرت سے پڑھنے سے علم و حکمت میں اضافہ ہوتا ہے اور صحیح فیصلے کرنے کی صلاحیت آتی ہے۔',
  },
  {
    num: 47,
    arabic: 'الْوَدُودُ',
    transliteration: 'Al-Wadud',
    urdu: 'محبت کرنے والا',
    fazilat: '1000 بار پڑھنے سے دشمن دوست بن جاتے ہیں اور دلوں میں محبت پیدا ہوتی ہے۔',
  },
  {
    num: 48,
    arabic: 'الْمَجِيدُ',
    transliteration: 'Al-Majid',
    urdu: 'بزرگی اور کرم والا',
    fazilat: 'کثرت سے پڑھنے سے دل میں انوار الہی کی روشنی آتی ہے۔',
  },
  {
    num: 49,
    arabic: 'الْبَاعِثُ',
    transliteration: 'Al-Baith',
    urdu: 'اٹھانے والا',
    fazilat: 'سونے سے پہلے ہاتھ سینے پر رکھ کر 100 بار پڑھنے سے دل زندہ ہوتا ہے۔',
  },
  {
    num: 50,
    arabic: 'الشَّهِيدُ',
    transliteration: 'Ash-Shahid',
    urdu: 'گواہ',
    fazilat: 'ہفتے میں ایک بار 21 بار پڑھنے سے اہل و عیال فرمانبردار ہوتے ہیں۔',
  },
  {
    num: 51,
    arabic: 'الْحَقُّ',
    transliteration: 'Al-Haqq',
    urdu: 'سچا',
    fazilat: 'کثرت سے پڑھنے سے گمشدہ چیز واپس ملتی ہے اور حق بات زبان سے نکلتی ہے۔',
  },
  {
    num: 52,
    arabic: 'الْوَكِيلُ',
    transliteration: 'Al-Wakil',
    urdu: 'کارساز',
    fazilat: 'پریشانی میں کثرت سے پڑھنے سے اللہ ہر معاملے میں کافی ہوجاتا ہے۔',
  },
  {
    num: 53,
    arabic: 'الْقَوِيُّ',
    transliteration: 'Al-Qawiyy',
    urdu: 'طاقتور',
    fazilat: 'ظالم سے ڈرنے پر پڑھنے سے ظالم کا ظلم دور ہوتا ہے۔',
  },
  {
    num: 54,
    arabic: 'الْمَتِينُ',
    transliteration: 'Al-Matin',
    urdu: 'مضبوط',
    fazilat: 'بیماری میں کثرت سے پڑھنے سے مشکل آسان ہوتی ہے اور جسمانی طاقت واپس آتی ہے۔',
  },
  {
    num: 55,
    arabic: 'الْوَلِيُّ',
    transliteration: 'Al-Waliyy',
    urdu: 'دوست اور مددگار',
    fazilat: 'کثرت سے پڑھنے سے اللہ کی دوستی نصیب ہوتی ہے اور دشمن بے اثر ہوجاتا ہے۔',
  },
  {
    num: 56,
    arabic: 'الْحَمِيدُ',
    transliteration: 'Al-Hamid',
    urdu: 'تعریف کے لائق',
    fazilat: 'کثرت سے پڑھنے سے اللہ کی محبت حاصل ہوتی ہے اور لوگ تعریف کرتے ہیں۔',
  },
  {
    num: 57,
    arabic: 'الْمُحْصِيُ',
    transliteration: 'Al-Muhsi',
    urdu: 'شمار کرنے والا',
    fazilat: '20 بار پڑھنے سے قیامت کا حساب آسان ہوگا اور اعمال کا شمار ہوگا۔',
  },
  {
    num: 58,
    arabic: 'الْمُبْدِئُ',
    transliteration: 'Al-Mubdi',
    urdu: 'ابتدا کرنے والا',
    fazilat: 'حاملہ عورت پڑھے تو بچہ صحیح سالم پیدا ہوتا ہے۔',
  },
  {
    num: 59,
    arabic: 'الْمُعِيدُ',
    transliteration: 'Al-Muid',
    urdu: 'دوبارہ پیدا کرنے والا',
    fazilat: 'گھر سے نکلتے وقت 70 بار پڑھنے سے سفر سے سلامت واپسی ہوتی ہے۔',
  },
  {
    num: 60,
    arabic: 'الْمُحْيِي',
    transliteration: 'Al-Muhyi',
    urdu: 'زندگی دینے والا',
    fazilat: 'کثرت سے پڑھنے سے مردہ دل زندہ ہوتا ہے اور ایمان تازہ ہوتا ہے۔',
  },
  {
    num: 61,
    arabic: 'اَلْمُمِيتُ',
    transliteration: 'Al-Mumit',
    urdu: 'موت دینے والا',
    fazilat: 'نفس پر قابو پانے کے لیے کثرت سے پڑھیں، دنیا کی لالچ کم ہوتی ہے۔',
  },
  {
    num: 62,
    arabic: 'الْحَيُّ',
    transliteration: 'Al-Hayy',
    urdu: 'ہمیشہ زندہ',
    fazilat: 'بیماری میں پڑھنے سے شفا ملتی ہے، کمزوری دور ہوتی ہے۔',
  },
  {
    num: 63,
    arabic: 'الْقَيُّومُ',
    transliteration: 'Al-Qayyum',
    urdu: 'قائم رکھنے والا',
    fazilat: 'نیند سے بچنے کے لیے پڑھیں، غفلت دور ہوتی ہے اور دل میں بیداری آتی ہے۔',
  },
  {
    num: 64,
    arabic: 'الْوَاجِدُ',
    transliteration: 'Al-Wajid',
    urdu: 'جو چاہے پانے والا',
    fazilat: 'کثرت سے پڑھنے سے دل غنی ہوتا ہے اور قناعت نصیب ہوتی ہے۔',
  },
  {
    num: 65,
    arabic: 'الْمَاجِدُ',
    transliteration: 'Al-Majid',
    urdu: 'بزرگ اور کریم',
    fazilat: 'کثرت سے پڑھنے سے قلبی نور اور روحانی ترقی ملتی ہے۔',
  },
  {
    num: 66,
    arabic: 'الْوَاحِدُ',
    transliteration: 'Al-Wahid',
    urdu: 'اکیلا',
    fazilat: 'اکیلے میں 1000 بار پڑھنے سے خوف دور ہوتا ہے اور دل میں سکون آتا ہے۔',
  },
  {
    num: 67,
    arabic: 'اَلاَحَدُ',
    transliteration: 'Al-Ahad',
    urdu: 'یکتا',
    fazilat: '1000 بار پڑھنے سے غیب کے راز کھلتے ہیں اور باطنی علم ملتا ہے۔',
  },
  {
    num: 68,
    arabic: 'الصَّمَدُ',
    transliteration: 'As-Samad',
    urdu: 'بے نیاز',
    fazilat: 'پیٹ کی بھوک میں پڑھنے سے سیری ملتی ہے، کثرت سے پڑھنے سے حاجتیں پوری ہوتی ہیں۔',
  },
  {
    num: 69,
    arabic: 'الْقَادِرُ',
    transliteration: 'Al-Qadir',
    urdu: 'قدرت والا',
    fazilat: 'جمعرات کو 100 بار پڑھنے سے مشکل کام آسان ہو جاتے ہیں۔',
  },
  {
    num: 70,
    arabic: 'الْمُقْتَدِرُ',
    transliteration: 'Al-Muqtadir',
    urdu: 'غالب قدرت والا',
    fazilat: 'کثرت سے پڑھنے سے اللہ ہر کام میں مدد کرتا ہے اور کوئی رکاوٹ نہیں آتی۔',
  },
  {
    num: 71,
    arabic: 'الْمُقَدِّمُ',
    transliteration: 'Al-Muqaddim',
    urdu: 'آگے کرنے والا',
    fazilat: 'جنگ یا مشکل میں کثرت سے پڑھنے سے کامیابی ملتی ہے۔',
  },
  {
    num: 72,
    arabic: 'الْمُؤَخِّرُ',
    transliteration: 'Al-Muakhkhir',
    urdu: 'پیچھے کرنے والا',
    fazilat: '100 بار پڑھنے سے دل میں توبہ کی توفیق ملتی ہے اور گناہ چھوٹ جاتے ہیں۔',
  },
  {
    num: 73,
    arabic: 'الأوَّلُ',
    transliteration: 'Al-Awwal',
    urdu: 'سب سے پہلے',
    fazilat: 'اولاد کی خواہش میں 40 جمعوں کو 1000 بار پڑھنے سے اولاد نصیب ہوتی ہے۔',
  },
  {
    num: 74,
    arabic: 'الآخِرُ',
    transliteration: 'Al-Akhir',
    urdu: 'سب سے آخر میں',
    fazilat: 'آخری عمر میں کثرت سے پڑھنے سے خاتمہ بالخیر ہوتا ہے۔',
  },
  {
    num: 75,
    arabic: 'الظَّاهِرُ',
    transliteration: 'Az-Zahir',
    urdu: 'ظاہر',
    fazilat: '15 بار پڑھنے سے دل روشن ہوتا ہے اور دنیاوی معاملات آسان ہوتے ہیں۔',
  },
  {
    num: 76,
    arabic: 'الْبَاطِنُ',
    transliteration: 'Al-Batin',
    urdu: 'پوشیدہ',
    fazilat: '3 بار پڑھنے سے راز کھلتے ہیں اور باطنی نور حاصل ہوتا ہے۔',
  },
  {
    num: 77,
    arabic: 'الْوَالِي',
    transliteration: 'Al-Wali',
    urdu: 'حاکم',
    fazilat: 'کثرت سے پڑھنے سے اللہ کی ولایت اور قربت نصیب ہوتی ہے۔',
  },
  {
    num: 78,
    arabic: 'الْمُتَعَالِي',
    transliteration: 'Al-Mutaali',
    urdu: 'بہت بلند',
    fazilat: 'کثرت سے پڑھنے سے روحانی بلندی ملتی ہے اور نفس کا تزکیہ ہوتا ہے۔',
  },
  {
    num: 79,
    arabic: 'الْبَرُّ',
    transliteration: 'Al-Barr',
    urdu: 'نیکی کرنے والا',
    fazilat: 'نومولود بچے پر 7 بار پڑھ کر دم کرنے سے بچہ آفات سے محفوظ رہتا ہے۔',
  },
  {
    num: 80,
    arabic: 'التَّوَّابُ',
    transliteration: 'At-Tawwab',
    urdu: 'بار بار توبہ قبول کرنے والا',
    fazilat: 'کثرت سے پڑھنے سے توبہ قبول ہوتی ہے اور گناہوں سے پشیمانی پیدا ہوتی ہے۔',
  },
  {
    num: 81,
    arabic: 'الْمُنْتَقِمُ',
    transliteration: 'Al-Muntaqim',
    urdu: 'بدلہ لینے والا',
    fazilat: 'ظالم دشمن کے خلاف پڑھنے سے اللہ انصاف دیتا ہے اور ظالم کو سزا ملتی ہے۔',
  },
  {
    num: 82,
    arabic: 'الْعَفُوُّ',
    transliteration: 'Al-Afuww',
    urdu: 'معاف کرنے والا',
    fazilat: 'کثرت سے پڑھنے سے گناہ معاف ہوتے ہیں اور آخرت میں نجات ملتی ہے۔',
  },
  {
    num: 83,
    arabic: 'الرَّؤُوفُ',
    transliteration: 'Ar-Rauf',
    urdu: 'نہایت مہربان',
    fazilat: 'کثرت سے پڑھنے سے اللہ کی رحمت خاص طور پر نازل ہوتی ہے۔',
  },
  {
    num: 84,
    arabic: 'مَالِكُ الْمُلْكِ',
    transliteration: 'Malik-ul-Mulk',
    urdu: 'سلطنت کا مالک',
    fazilat: 'کثرت سے پڑھنے سے حکمرانوں سے کام نکلتا ہے اور عزت ملتی ہے۔',
  },
  {
    num: 85,
    arabic: 'ذُوالْجَلاَلِ وَالإكْرَامِ',
    transliteration: 'Dhul-Jalali-wal-Ikram',
    urdu: 'جلال اور اکرام والا',
    fazilat: 'کثرت سے پڑھنے سے دنیا میں جلال اور آخرت میں انعام ملتا ہے۔',
  },
  {
    num: 86,
    arabic: 'الْمُقْسِطُ',
    transliteration: 'Al-Muqsit',
    urdu: 'انصاف کرنے والا',
    fazilat: '209 بار پڑھنے سے نفس کی برائیوں سے نجات ملتی ہے۔',
  },
  {
    num: 87,
    arabic: 'الْجَامِعُ',
    transliteration: 'Al-Jami',
    urdu: 'جمع کرنے والا',
    fazilat: 'بچھڑے ہوئے لوگوں کے لیے پڑھنے سے وہ واپس مل جاتے ہیں۔',
  },
  {
    num: 88,
    arabic: 'الْغَنِيُّ',
    transliteration: 'Al-Ghani',
    urdu: 'بے نیاز',
    fazilat: 'کثرت سے پڑھنے سے دل غنی ہوتا ہے اور لوگوں کا محتاج نہیں رہتا۔',
  },
  {
    num: 89,
    arabic: 'الْمُغْنِي',
    transliteration: 'Al-Mughni',
    urdu: 'غنی کرنے والا',
    fazilat: 'جمعہ کو 1000 بار پڑھنے سے غربت دور ہوتی ہے اور مالداری آتی ہے۔',
  },
  {
    num: 90,
    arabic: 'اَلْمَانِعُ',
    transliteration: 'Al-Mani',
    urdu: 'روکنے والا',
    fazilat: 'اپنے آپ اور گھر پر پڑھ کر دم کرنے سے ہر برائی سے حفاظت ہوتی ہے۔',
  },
  {
    num: 91,
    arabic: 'الضَّارُّ',
    transliteration: 'Ad-Darr',
    urdu: 'نقصان پہنچانے والا',
    fazilat: 'دشمن کے شر سے بچنے کے لیے پڑھیں، اللہ دشمن کو بے اثر کردیتا ہے۔',
  },
  {
    num: 92,
    arabic: 'النَّافِعُ',
    transliteration: 'An-Nafi',
    urdu: 'فائدہ دینے والا',
    fazilat: 'جمعرات کو 41 بار پڑھنے سے مقصد حاصل ہوتا ہے اور کام میں برکت آتی ہے۔',
  },
  {
    num: 93,
    arabic: 'النُّورُ',
    transliteration: 'An-Nur',
    urdu: 'نور',
    fazilat: 'اندھیرے میں پڑھنے سے دل روشن ہوتا ہے، علم کا نور ملتا ہے۔',
  },
  {
    num: 94,
    arabic: 'الْهَادِي',
    transliteration: 'Al-Hadi',
    urdu: 'ہدایت دینے والا',
    fazilat: '1100 بار پڑھنے سے قلبی نور اور صراط مستقیم ملتی ہے۔',
  },
  {
    num: 95,
    arabic: 'الْبَدِيعُ',
    transliteration: 'Al-Badi',
    urdu: 'بے مثال',
    fazilat: 'مشکل میں پڑھنے سے اللہ نئے طریقے سے مدد کرتا ہے۔',
  },
  {
    num: 96,
    arabic: 'اَلْبَاقِي',
    transliteration: 'Al-Baqi',
    urdu: 'ہمیشہ رہنے والا',
    fazilat: 'کثرت سے پڑھنے سے دنیا کی فانی محبت دل سے نکلتی ہے اور آخرت کی فکر آتی ہے۔',
  },
  {
    num: 97,
    arabic: 'الْوَارِثُ',
    transliteration: 'Al-Warith',
    urdu: 'وارث',
    fazilat: 'کثرت سے پڑھنے سے اولاد نیک ہوتی ہے اور میراث میں برکت آتی ہے۔',
  },
  {
    num: 98,
    arabic: 'الرَّشِيدُ',
    transliteration: 'Ar-Rashid',
    urdu: 'راہ دکھانے والا',
    fazilat: 'کثرت سے پڑھنے سے ہر کام میں صحیح فیصلہ ملتا ہے اور گمراہی دور ہوتی ہے۔',
  },
  {
    num: 99,
    arabic: 'الصَّبُورُ',
    transliteration: 'As-Sabur',
    urdu: 'بہت صبر کرنے والا',
    fazilat: 'مصیبت میں 100 بار پڑھنے سے صبر ملتا ہے اور مشکل آسان ہوجاتی ہے۔',
  },
];

export default {
  command: ['asma', '99names', 'asmaul', 'allahnames'],
  name: 'asma',
  category: 'Islamic',
  description: 'Get 99 Names of Allah with Urdu meanings and fazilat',
  usage: '.asma [number]',
  cooldown: 5,

  handler: async ({ msg, args }) => {
    try {
      await msg.react('☪️');

      // If number provided — show specific name with fazilat
      if (args[0] && !isNaN(args[0])) {
        const num = parseInt(args[0]);
        if (num < 1 || num > 99) {
          return await msg.reply('❌ 1 سے 99 کے درمیان نمبر لکھیں۔');
        }
        const n = ALLAH_NAMES[num - 1];
        await msg.reply(`☪️ *اللہ کا نام نمبر ${n.num}*

*${n.arabic}*
*${n.transliteration}*
🌟 *اردو ترجمہ:* ${n.urdu}

📿 *فضیلت:*
${n.fazilat}

${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');
        return;
      }

      // Show all 99 names in three parts
      const part1 = ALLAH_NAMES.slice(0, 33).map(n =>
        `${n.num}. ${n.arabic} - ${n.transliteration}\n    🌟 ${n.urdu}\n    📿 ${n.fazilat}`
      ).join('\n\n');

      const part2 = ALLAH_NAMES.slice(33, 66).map(n =>
        `${n.num}. ${n.arabic} - ${n.transliteration}\n    🌟 ${n.urdu}\n    📿 ${n.fazilat}`
      ).join('\n\n');

      const part3 = ALLAH_NAMES.slice(66).map(n =>
        `${n.num}. ${n.arabic} - ${n.transliteration}\n    🌟 ${n.urdu}\n    📿 ${n.fazilat}`
      ).join('\n\n');

      await msg.reply(`╭━━━『 *اللہ کے 99 نام* 』━━━╮

☪️ *حصہ اول — نام 1 تا 33*

${part1}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
${SYSTEM.SHORT_WATERMARK}`);

      await msg.reply(`╭━━━『 *اللہ کے 99 نام* 』━━━╮

☪️ *حصہ دوم — نام 34 تا 66*

${part2}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
${SYSTEM.SHORT_WATERMARK}`);

      await msg.reply(`╭━━━『 *اللہ کے 99 نام* 』━━━╮

☪️ *حصہ سوم — نام 67 تا 99*

${part3}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ اللہ سے قربت حاصل ہوتی ہے
✅ ایمان اور تقویٰ میں اضافہ ہوتا ہے
✅ حفاظت اور برکت ملتی ہے
✅ روحانی ترقی ہوتی ہے

☪️ *سُبْحَانَ اللَّهِ* ☪️

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('✅');

    } catch (error) {
      console.error('Asma error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
