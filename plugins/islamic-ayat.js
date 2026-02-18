/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Ayatul Kursi         ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

export default {
  name: 'ayat',
  aliases: ['ayatulkursi', 'kursi'],
  category: 'islamic',
  description: 'Read Ayatul Kursi',
  usage: '.ayat',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('📿');

      const ayatulKursi = {
        arabic: `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ`,
        english: `Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.`,
        urdu: `اللہ وہ ہے جس کے سوا کوئی معبود نہیں، زندہ ہے، سب کا تھامنے والا ہے، اُسے نہ اونگھ آتی ہے نہ نیند، آسمانوں اور زمین میں جو کچھ ہے سب اسی کا ہے، کون ہے جو اس کی اجازت کے بغیر اس کے سامنے سفارش کر سکے؟ جو کچھ بندوں کے سامنے ہے اور جو کچھ اُن کے پیچھے ہے سب اُسے معلوم ہے اور وہ اس کے علم میں سے کسی چیز پر دسترس نہیں پا سکتے، مگر جس قدر وہ چاہے، اس کی کرسی آسمانوں اور زمین پر چھائی ہوئی ہے اور اُن کی نگہبانی اُس کے لیے کوئی تھکا دینے والا کام نہیں، وہ بس بلند و برتر ہے`
      };

      await msg.reply(`
╭━━━『 *AYATUL KURSI* 』━━━╮

📖 *Surah Al-Baqarah (2:255)*

*Arabic:*
${ayatulKursi.arabic}

*English Translation:*
${ayatulKursi.english}

*Urdu Translation:*
${ayatulKursi.urdu}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Benefits of Ayatul Kursi:*
✅ Protection from evil
✅ Blessings in home
✅ Guardian angels
✅ Safety throughout the day

☪️ *سُبْحَانَ اللَّهِ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
`.trim());

      await msg.react('✅');

    } catch (error) {
      console.error('Ayat error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
