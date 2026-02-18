/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Play Store Downloader┃
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
import cheerio from 'cheerio';

export default {
  name: 'playstore',
  aliases: ['ps', 'playstoreapp'],
  category: 'downloader',
  description: 'Download apps directly from Play Store',
  usage: '.playstore <app name>',
  cooldown: 10000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ براہ کرم app کا نام لکھیں!

*مثال:*
.playstore WhatsApp
.playstore Instagram
.playstore Facebook
.playstore TikTok
.playstore Telegram

*مشہور Apps:*
📱 WhatsApp, Instagram, Facebook
🎮 PUBG, Free Fire, Call of Duty
🎵 Spotify, YouTube Music
📺 Netflix, YouTube
📸 Snapchat, TikTok
`.trim());
      }

      await msg.react('📱');
      const query = args.join(' ');

      await msg.reply(`
⏳ *Play Store میں تلاش کر رہا ہوں...*

🔍 Searching: ${query}

_براہ کرم انتظار کریں..._
`.trim());

      // Search on APKPure (Play Store mirror)
      const searchUrl = `https://apkpure.com/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const apps = [];

      $('.search-dl').slice(0, 5).each((i, elem) => {
        const title = $(elem).find('.p1').text().trim();
        const developer = $(elem).find('.p2').text().trim();
        const url = 'https://apkpure.com' + $(elem).find('a').attr('href');
        const icon = $(elem).find('img').attr('src');
        const rating = $(elem).find('.star').text().trim();
        
        if (title && url) {
          apps.push({ title, developer, url, icon, rating });
        }
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ کوئی app نہیں ملی! دوسرا نام try کریں۔');
      }

      // Show search results
      let resultMsg = `
╭━━━『 *PLAY STORE SEARCH* 』━━━╮

📱 *${apps.length} Apps ملیں: ${query}*

`;

      apps.forEach((app, i) => {
        resultMsg += `
${i + 1}. *${app.title}*
   👤 Developer: ${app.developer}
   ⭐ Rating: ${app.rating || 'N/A'}
`;
      });

      resultMsg += `
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *پہلی app download کر رہا ہوں...*

_Powered by YOUSAF-BALOCH-MD_
`.trim();

      await msg.reply(resultMsg);
      await msg.react('⬇️');

      // Get download link from first app
      const appPage = await axios.get(apps[0].url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $app = cheerio.load(appPage.data);
      const downloadPageUrl = 'https://apkpure.com' + $app('.download-btn').attr('href');

      if (!downloadPageUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Download link نہیں مل سکا!');
      }

      // Get final APK download link
      const downloadPage = await axios.get(downloadPageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $dl = cheerio.load(downloadPage.data);
      const apkUrl = $dl('#download_link').attr('href');

      if (!apkUrl) {
        await msg.react('❌');
        return await msg.reply('❌ APK download نہیں ہو سکا! دوبارہ try کریں۔');
      }

      // Get APK info
      const version = $app('.details-sdk span:first').text().trim();
      const size = $app('.details-sdk span:last').text().trim();

      await msg.reply(`
✅ *APK تیار ہے!*

📱 *App:* ${apps[0].title}
👤 *Developer:* ${apps[0].developer}
📦 *Version:* ${version || 'Latest'}
📊 *Size:* ${size || 'Unknown'}
⭐ *Rating:* ${apps[0].rating || 'N/A'}

⏳ *Downloading APK...*

_یہ کچھ وقت لے سکتا ہے..._
`.trim());

      // Download APK file
      const apkBuffer = await axios.get(apkUrl, { 
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024, // 100MB limit
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Send APK as document
      await msg.sendDocument(
        Buffer.from(apkBuffer.data),
        `${apps[0].title}.apk`,
        'application/vnd.android.package-archive',
        `
📱 *${apps[0].title}*

👤 Developer: ${apps[0].developer}
📦 Version: ${version || 'Latest'}
📊 Size: ${size || 'Unknown'}
⭐ Rating: ${apps[0].rating || 'N/A'}

*Installation:*
1️⃣ Download APK
2️⃣ Settings میں "Unknown Sources" enable کریں
3️⃣ APK install کریں
4️⃣ Enjoy!

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110
`.trim()
      );

      await msg.react('✅');

    } catch (error) {
      console.error('Play Store download error:', error);
      await msg.react('❌');
      
      if (error.message.includes('maxContentLength')) {
        await msg.reply('❌ APK بہت بڑی ہے (100MB سے زیادہ)');
      } else {
        await msg.reply(`
❌ *Error occurred!*

براہ کرم دوبارہ try کریں یا مختلف app name استعمال کریں۔

_YOUSAF-BALOCH-MD_
`.trim());
      }
    }
  }
};
