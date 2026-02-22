/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ayat Status Plugin      ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

function ownerFooter() {
  const year = OWNER.YEAR || new Date().getFullYear();
  return `╭─『 👑 *${OWNER.BOT_NAME}* 』
│ 👤 *Owner:*   ${OWNER.FULL_NAME}
│ 📱 *Number:*  +${OWNER.NUMBER}
│ 📢 *Channel:* ${OWNER.CHANNEL}
│ 📺 *YouTube:* ${OWNER.YOUTUBE}
│ 🎵 *TikTok:*  ${OWNER.TIKTOK}
╰──────────────────────────
_© ${year} ${OWNER.BOT_NAME}_`;
}

// ─── Quran Ayat Collection for Status ─────────────────────────────────────────
const AYAT_COLLECTION = [
  { ayat: '﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', surah: 'الانشراح: 6', urdu: 'بے شک تکلیف کے ساتھ آسانی ہے۔', category: 'امید' },
  { ayat: '﴿ وَاللَّهُ مَعَ الصَّابِرِينَ ﴾', surah: 'البقرہ: 249', urdu: 'اللہ صبر کرنے والوں کے ساتھ ہے۔', category: 'صبر' },
  { ayat: '﴿ حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ﴾', surah: 'آل عمران: 173', urdu: 'ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔', category: 'توکل' },
  { ayat: '﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ﴾', surah: 'الطلاق: 3', urdu: 'جو اللہ پر بھروسہ کرے اللہ اسے کافی ہے۔', category: 'توکل' },
  { ayat: '﴿ إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا ﴾', surah: 'النحل: 128', urdu: 'بے شک اللہ تقویٰ والوں کے ساتھ ہے۔', category: 'تقویٰ' },
  { ayat: '﴿ وَلَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ﴾', surah: 'الزمر: 53', urdu: 'اللہ کی رحمت سے مایوس نہ ہو۔', category: 'امید' },
  { ayat: '﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', surah: 'الانشراح: 5', urdu: 'پس بے شک تکلیف کے ساتھ آسانی ہے۔', category: 'امید' },
  { ayat: '﴿ وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ ﴾', surah: 'الجمعہ: 10', urdu: 'اللہ کو کثرت سے یاد کرو تاکہ تم کامیاب ہو۔', category: 'ذکر' },
  { ayat: '﴿ إِنَّ اللَّهَ يُحِبُّ الصَّابِرِينَ ﴾', surah: 'آل عمران: 146', urdu: 'بے شک اللہ صبر کرنے والوں سے محبت کرتا ہے۔', category: 'صبر' },
  { ayat: '﴿ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً ﴾', surah: 'البقرہ: 201', urdu: 'اے رب ہمیں دنیا اور آخرت میں بھلائی دے۔', category: 'دعا' },
  { ayat: '﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾', surah: 'الرعد: 28', urdu: 'یاد رکھو اللہ کے ذکر سے دل مطمئن ہوتے ہیں۔', category: 'ذکر' },
  { ayat: '﴿ وَاللَّهُ خَيْرُ الرَّازِقِينَ ﴾', surah: 'الجمعہ: 11', urdu: 'اللہ بہترین رزق دینے والا ہے۔', category: 'رزق' },
  { ayat: '﴿ وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَى بِاللَّهِ وَكِيلًا ﴾', surah: 'الاحزاب: 3', urdu: 'اللہ پر بھروسہ کرو اور اللہ کافی کارساز ہے۔', category: 'توکل' },
  { ayat: '﴿ يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ ﴾', surah: 'البقرہ: 185', urdu: 'اللہ تمہارے لیے آسانی چاہتا ہے۔', category: 'امید' },
  { ayat: '﴿ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ ﴾', surah: 'التوبہ: 120', urdu: 'بے شک اللہ نیکی کرنے والوں کا اجر ضائع نہیں کرتا۔', category: 'اجر' },
];

// ─── Hadith Collection ────────────────────────────────────────────────────────
const HADITH_COLLECTION = [
  { text: 'مَنْ كَانَ يُؤْمِنُ بِاللهِ وَاليَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُت', urdu: 'جو اللہ اور قیامت پر ایمان رکھتا ہو وہ اچھی بات کہے یا خاموش رہے۔', source: 'بخاری' },
  { text: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', urdu: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ ہوں۔', source: 'بخاری' },
  { text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', urdu: 'تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔', source: 'بخاری' },
  { text: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ', urdu: 'دنیا مومن کے لیے قید خانہ اور کافر کے لیے جنت ہے۔', source: 'مسلم' },
  { text: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', urdu: 'علم حاصل کرنا ہر مسلمان پر فرض ہے۔', source: 'ابن ماجہ' },
];

export default {
  command    : ['ayat', 'quran', 'hadith', 'آیت', 'قرآن', 'حدیث', 'status'],
  name       : 'islamic-ayat-status',
  category   : 'Islamic',
  description: 'Daily Quran Ayat and Hadith for WhatsApp status',
  usage      : '.ayat OR .hadith',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📖');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();
      const isHadith  = /hadith|حدیث/.test(input);

      // ── Get daily rotation ─────────────────────────────────
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

      if (isHadith) {
        const hadith = HADITH_COLLECTION[dayOfYear % HADITH_COLLECTION.length];

        const hadithMsg = `╭━━━『 📖 *آج کی حدیث* 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
👋 *Requested by:* +${senderNum}

╭─『 🌟 *حدیث مبارک* 』
│
│ 📜 *Arabic:*
│ ${hadith.text}
│
│ 🌸 *اردو ترجمہ:*
│ ${hadith.urdu}
│
│ 📚 *حوالہ:* ${hadith.source}
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}ayat\`   → روزانہ آیت
│ \`${CONFIG.PREFIX}hadith\` → روزانہ حدیث
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { text: hadithMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Daily Ayat ─────────────────────────────────────────
      // Filter by category if given
      let pool = AYAT_COLLECTION;
      if (/sabr|صبر/.test(input))    pool = AYAT_COLLECTION.filter(a => a.category === 'صبر');
      if (/hope|امید/.test(input))   pool = AYAT_COLLECTION.filter(a => a.category === 'امید');
      if (/rizq|رزق/.test(input))    pool = AYAT_COLLECTION.filter(a => a.category === 'رزق');
      if (pool.length === 0)          pool = AYAT_COLLECTION;

      const ayat = pool[dayOfYear % pool.length];

      const ayatMsg = `╭━━━『 📖 *آج کی قرآنی آیت* 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
👋 *Requested by:* +${senderNum}
🏷️ *Category:* ${ayat.category}

╭─『 ✨ *آیت کریمہ* 』
│
│ ${ayat.ayat}
│
│ 📍 *سورہ:* ${ayat.surah}
╰──────────────────────────

╭─『 🌸 *اردو ترجمہ* 』
│
│ ${ayat.urdu}
╰──────────────────────────

╭─『 💡 *Categories* 』
│ \`${CONFIG.PREFIX}ayat sabr\`  → صبر
│ \`${CONFIG.PREFIX}ayat hope\`  → امید
│ \`${CONFIG.PREFIX}ayat rizq\`  → رزق
│ \`${CONFIG.PREFIX}hadith\`     → حدیث
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: ayatMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[AYAT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Ayat error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
