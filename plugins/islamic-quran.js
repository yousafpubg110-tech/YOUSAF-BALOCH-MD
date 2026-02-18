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

import axios from 'axios';

export default {
  name: 'quran',
  aliases: ['ayah', 'surah'],
  category: 'islamic',
  description: 'Read Quran verses with translation',
  usage: '.quran <surah:ayah> or .quran random',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please specify surah and ayah!

*Examples:*
.quran 1:1 (Al-Fatiha, Ayah 1)
.quran 2:255 (Ayatul Kursi)
.quran random (Random ayah)

*Popular Surahs:*
1 - Al-Fatiha
2 - Al-Baqarah
36 - Ya-Sin
67 - Al-Mulk
112 - Al-Ikhlas
`.trim());
      }

      await msg.react('📖');

      let surah, ayah;
      
      if (args[0].toLowerCase() === 'random') {
        surah = Math.floor(Math.random() * 114) + 1;
        // Get random ayah (simplified)
        ayah = Math.floor(Math.random() * 10) + 1;
      } else {
        const parts = args[0].split(':');
        surah = parseInt(parts[0]);
        ayah = parseInt(parts[1]);
      }

      if (!surah || !ayah) {
        return await msg.reply('❌ Invalid format! Use: .quran 1:1');
      }

      const apiUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih,ur.jalandhry`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.data) {
        const data = response.data.data;
        const arabic = data[0].text;
        const english = data[1].text;
        const urdu = data[2].text;
        const surahName = data[0].surah.englishName;

        await msg.reply(`
╭━━━『 *HOLY QURAN* 』━━━╮

📖 *${surahName}* - Ayah ${ayah}

*Arabic:*
${arabic}

*English:*
${english}

*Urdu:*
${urdu}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

☪️ *سُبْحَانَ اللَّهِ وَبِحَمْدِهِ* ☪️

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Ayah not found!');
      }

    } catch (error) {
      console.error('Quran error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
