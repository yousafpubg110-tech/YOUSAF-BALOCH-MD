/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Islamic Duas         ┃
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
  name: 'dua',
  aliases: ['duaa', 'prayer'],
  category: 'islamic',
  description: 'Get Islamic duas',
  usage: '.dua <morning/evening/sleep/travel>',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('🤲');

      const duas = {
        morning: {
          arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
          english: 'We have reached the morning and at this very time all sovereignty belongs to Allah',
          urdu: 'ہم نے صبح کی اور تمام بادشاہی اللہ کی ہے'
        },
        evening: {
          arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
          english: 'We have reached the evening and at this very time all sovereignty belongs to Allah',
          urdu: 'ہم نے شام کی اور تمام بادشاہی اللہ کی ہے'
        },
        sleep: {
          arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          english: 'In Your name O Allah, I live and I die',
          urdu: 'اے اللہ تیرے نام سے میں مرتا ہوں اور جیتا ہوں'
        },
        travel: {
          arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
          english: 'Glory is to Him Who has provided this for us',
          urdu: 'پاک ہے وہ ذات جس نے ہمارے لیے یہ مسخر کیا'
        }
      };

      const type = args[0]?.toLowerCase() || 'morning';
      const dua = duas[type] || duas.morning;

      await msg.reply(`
╭━━━『 *ISLAMIC DUA* 』━━━╮

*Type:* ${type.charAt(0).toUpperCase() + type.slice(1)} Dua

*Arabic:*
${dua.arabic}

*English:*
${dua.english}

*Urdu:*
${dua.urdu}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Available Duas:*
🌅 .dua morning
🌆 .dua evening
😴 .dua sleep
✈️ .dua travel

☪️ *آمِيْن يَا رَبَّ الْعَالَمِيْنَ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

      await msg.react('✅');

    } catch (error) {
      console.error('Dua error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
