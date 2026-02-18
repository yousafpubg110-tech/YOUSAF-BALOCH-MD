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

export default {
  name: 'asma',
  aliases: ['99names', 'asmaul'],
  category: 'islamic',
  description: 'Get 99 Names of Allah',
  usage: '.asma',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('☪️');

      const names = `
╭━━━『 *99 NAMES OF ALLAH* 』━━━╮

1. الرَّحْمَنُ - Ar-Rahman - The Most Merciful
2. الرَّحِيمُ - Ar-Raheem - The Bestower of Mercy
3. الْمَلِكُ - Al-Malik - The King
4. الْقُدُّوسُ - Al-Quddus - The Most Holy
5. السَّلاَمُ - As-Salam - The Source of Peace
6. الْمُؤْمِنُ - Al-Mu'min - The Guardian of Faith
7. الْمُهَيْمِنُ - Al-Muhaymin - The Protector
8. الْعَزِيزُ - Al-Aziz - The All Mighty
9. الْجَبَّارُ - Al-Jabbar - The Compeller
10. الْمُتَكَبِّرُ - Al-Mutakabbir - The Supreme

*[First 10 names shown]*

*Benefits of reciting:*
✅ Brings closeness to Allah
✅ Increases faith and taqwa
✅ Protection and blessings
✅ Spiritual growth

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Full list available at:*
https://99namesofallah.name

☪️ *سُبْحَانَ اللَّهِ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim();

      await msg.reply(names);
      await msg.react('✅');

    } catch (error) {
      console.error('Asma error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
