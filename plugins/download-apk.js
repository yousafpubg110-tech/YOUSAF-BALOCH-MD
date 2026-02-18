/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Premium APK DL       ┃
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
  name: 'apk',
  aliases: ['apkdl', 'modapk', 'premiumapk'],
  category: 'downloader',
  description: 'Download premium/modded APKs',
  usage: '.apk <app name>',
  cooldown: 10000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please provide an app name!

*Example:*
.apk capcut pro
.apk inshot premium
.apk spotify premium
.apk netflix mod

*Popular Apps:*
🎬 CapCut Pro
🎥 InShot Premium
🎵 Spotify Premium
📺 Netflix Mod
📸 PicsArt Premium
🎮 Game Mods

*Note:* Apps are downloaded from trusted modded APK sources.
`.trim());
      }

      await msg.react('📱');
      const query = args.join(' ');

      await msg.reply(`
⏳ *Searching for: ${query}*

🔍 Searching on:
• APKMody
• LiteAPK
• APKPure Modded

_Please wait, this may take a moment..._
`.trim());

      // Search for APK
      const searchUrl = `https://apkmody.io/?s=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      const apps = [];
      $('.post').slice(0, 3).each((i, elem) => {
        const title = $(elem).find('.entry-title a').text().trim();
        const url = $(elem).find('.entry-title a').attr('href');
        const version = $(elem).find('.version').text().trim();
        const img = $(elem).find('img').attr('src');
        
        if (title && url) {
          apps.push({ title, url, version, img });
        }
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ No APK found! Try a different app name.');
      }

      // Show results
      let resultMsg = `
╭━━━『 *APK SEARCH RESULTS* 』━━━╮

📱 *Found ${apps.length} results for: ${query}*

`;

      apps.forEach((app, i) => {
        resultMsg += `
${i + 1}. *${app.title}*
   📦 Version: ${app.version || 'Latest'}
   🔗 ${app.url}
`;
      });

      resultMsg += `
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

*Downloading first result...*

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim();

      await msg.reply(resultMsg);
      await msg.react('⬇️');

      // Try to get download link from first result
      const appPage = await axios.get(apps[0].url);
      const $app = cheerio.load(appPage.data);
      
      const downloadBtn = $app('a.btn-download, a.download-btn, a[href*="download"]').first();
      const downloadUrl = downloadBtn.attr('href');

      if (downloadUrl) {
        await msg.reply(`
✅ *APK Found!*

📱 *App:* ${apps[0].title}
📦 *Version:* ${apps[0].version || 'Latest'}
🔗 *Download Link:*
${downloadUrl}

*Installation Guide:*
1️⃣ Download the APK
2️⃣ Enable "Unknown Sources" in settings
3️⃣ Install the APK
4️⃣ Open and enjoy!

⚠️ *Note:* Download at your own risk. Make sure to scan APK with antivirus.

_Downloaded by YOUSAF-BALOCH-MD_
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim());
        
        await msg.react('✅');
      } else {
        await msg.reply(`
✅ *APK Page Found!*

📱 *App:* ${apps[0].title}
🔗 *Visit:* ${apps[0].url}

Please visit the link above to download the APK manually.

_YOUSAF-BALOCH-MD_
`.trim());
        
        await msg.react('✅');
      }

    } catch (error) {
      console.error('APK download error:', error);
      await msg.react('❌');
      await msg.reply(`
❌ *Error searching for APK*

Please try:
• Different app name
• Visit manually: https://apkmody.io
• Or try: https://liteapks.com

_YOUSAF-BALOCH-MD_
`.trim());
    }
  }
};
