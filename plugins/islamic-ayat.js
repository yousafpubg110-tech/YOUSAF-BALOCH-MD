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

'use strict';

module.exports = {
  name: 'ayat',
  aliases: ['ayatulkursi', 'kursi', 'آیت', 'آیت الکرسی'],
  category: 'islamic',
  description: 'آیت الکرسی پڑھیں - تین زبانوں میں',
  usage: '.ayat [urdu/english/arabic/all]',
  cooldown: 3000,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      await sock.sendMessage(jid, {
        react: { text: '📿', key: msg.key }
      });

      // زبان کا انتخاب
      const lang = (args[0] || 'all').toLowerCase();

      const ayatulKursi = {
        arabic: `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ`,

        urdu: `اللہ وہ ہے جس کے سوا کوئی معبود نہیں، زندہ ہے، سب کا تھامنے والا ہے، اُسے نہ اونگھ آتی ہے نہ نیند، آسمانوں اور زمین میں جو کچھ ہے سب اسی کا ہے، کون ہے جو اس کی اجازت کے بغیر اس کے سامنے سفارش کر سکے؟ جو کچھ بندوں کے سامنے ہے اور جو کچھ اُن کے پیچھے ہے سب اُسے معلوم ہے اور وہ اس کے علم میں سے کسی چیز پر دسترس نہیں پا سکتے، مگر جس قدر وہ چاہے، اس کی کرسی آسمانوں اور زمین پر چھائی ہوئی ہے اور اُن کی نگہبانی اُس کے لیے کوئی تھکا دینے والا کام نہیں، وہ بس بلند و برتر ہے۔`,

        english: `Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.`
      };

      // ━━━ صرف اردو ━━━
      const urduOnly = `
╭━━━『 *آیت الکرسی* 』━━━╮

📖 *سورۃ البقرہ - آیت نمبر 255*

*🔷 عربی متن:*
${ayatulKursi.arabic}

*🌙 اردو ترجمہ:*
${ayatulKursi.urdu}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*آیت الکرسی کے فوائد:*
✅ برے خوابوں سے حفاظت
✅ گھر میں برکت
✅ فرشتوں کی نگہبانی
✅ دن رات محفوظ رہنا
✅ جنت کا دروازہ کھلنا

☪️ *سُبْحَانَ اللّٰہ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

      // ━━━ صرف انگریزی ━━━
      const englishOnly = `
╭━━━『 *AYATUL KURSI* 』━━━╮

📖 *Surah Al-Baqarah (2:255)*

*🔷 Arabic Text:*
${ayatulKursi.arabic}

*🌙 English Translation:*
${ayatulKursi.english}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Benefits of Ayatul Kursi:*
✅ Protection from evil
✅ Blessings in home
✅ Guardian angels throughout the day
✅ Gates of Jannah open

☪️ *SubhanAllah* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

      // ━━━ صرف عربی ━━━
      const arabicOnly = `
╭━━━『 *آیت الکرسی - عربی* 』━━━╮

📖 *سورۃ البقرہ - آیت 255*

${ayatulKursi.arabic}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *اَللّٰہُ اَکْبَر* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j`.trim();

      // ━━━ تینوں زبانیں ━━━
      const allLanguages = `
╭━━━『 *آیت الکرسی* 』━━━╮

📖 *سورۃ البقرہ - آیت نمبر 255*

*🔷 عربی متن:*
${ayatulKursi.arabic}

*🌙 اردو ترجمہ:*
${ayatulKursi.urdu}

*🌐 English Translation:*
${ayatulKursi.english}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*آیت الکرسی کے فوائد:*
✅ برے خوابوں اور شیطان سے حفاظت
✅ گھر میں رحمت اور برکت
✅ فرشتوں کی نگہبانی
✅ دن رات محفوظ رہنا
✅ جنت کا دروازہ کھلنا

*استعمال کا طریقہ:*
• .ayat urdu — صرف اردو
• .ayat english — صرف انگریزی
• .ayat arabic — صرف عربی
• .ayat — تینوں زبانیں

☪️ *سُبْحَانَ اللّٰہ وَبِحَمْدِہٖ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad`.trim();

      // زبان کے مطابق جواب
      let finalMessage;
      switch (lang) {
        case 'urdu':
        case 'اردو':
          finalMessage = urduOnly;
          break;
        case 'english':
        case 'eng':
          finalMessage = englishOnly;
          break;
        case 'arabic':
        case 'عربی':
          finalMessage = arabicOnly;
          break;
        default:
          finalMessage = allLanguages;
      }

      await sock.sendMessage(jid, { text: finalMessage }, { quoted: msg });

      await sock.sendMessage(jid, {
        react: { text: '✅', key: msg.key }
      });

    } catch (error) {
      console.error('[AYAT ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, {
        react: { text: '❌', key: msg.key }
      });
      await sock.sendMessage(jid,
        { text: `❌ *غلطی:* آیت الکرسی لوڈ نہیں ہو سکی\n\n*Error:* ${error.message}` },
        { quoted: msg }
      );
    }
  }
};
