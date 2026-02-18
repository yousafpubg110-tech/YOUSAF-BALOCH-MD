/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Premium Mod APK DL   ┃
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
  name: 'modapk',
  aliases: ['premiumapk', 'apkmod'],
  category: 'downloader',
  description: 'Download premium/modded APKs',
  usage: '.modapk <app name>',
  cooldown: 10000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ براہ کرم app کا نام لکھیں!

*مثال:*
.modapk CapCut Pro
.modapk InShot Premium
.modapk Spotify Premium
.modapk Netflix Mod
.modapk PicsArt Gold

*مشہور Premium Apps:*
🎬 CapCut Pro (No Watermark)
🎥 InShot Premium (All Features)
🎵 Spotify Premium (Ad Free)
📺 Netflix Mod (Free Subscription)
📸 PicsArt Gold (All Unlocked)
🎮 Game Mods (Unlimited Money)
`.trim());
      }

      await msg.react('💎');
      const query = args.join(' ');

      await msg.reply(`
⏳ *Premium APK تلاش کر رہا ہوں...*

🔍 Searching: ${query}
📦 Sources: APKMody, LiteAPK

_براہ کرم انتظار کریں..._
`.trim());

      // Search on APKMody
      const searchUrl = `https://apkmody.io/?s=${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const apps = [];

      $('.post').slice(0, 5).each((i, elem) => {
        const title = $(elem).find('.entry-title a').text().trim();
        const url = $(elem).find('.entry-title a').attr('href');
        const version = $(elem).find('.version').text().trim() || 'Latest';
        const img = $(elem).find('img').attr('src');
        const features = $(elem).find('.excerpt').text().trim();
        
        if (title && url) {
          apps.push({ title, url, version, img, features });
        }
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ کوئی Premium APK نہیں ملی! مختلف نام try کریں۔');
      }

      // Show results
      let resultMsg = `
╭━━━『 *PREMIUM APK SEARCH* 』━━━╮

💎 *${apps.length} Premium Apps ملیں: ${query}*

`;

      apps.forEach((app, i) => {
        resultMsg += `
${i + 1}. *${app.title}*
   📦 Version: ${app.version}
   ✨ Features: ${app.features.substring(0, 50)}...
`;
      });

      resultMsg += `
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *پہلی app download کر رہا ہوں...*

_Powered by YOUSAF-BALOCH-MD_
`.trim();

      await msg.reply(resultMsg);
      await msg.react('⬇️');

      // Get download page
      const appPage = await axios.get(apps[0].url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $app = cheerio.load(appPage.data);
      
      // Find download button
      let downloadUrl = $app('a.btn-download').attr('href');
      if (!downloadUrl) {
        downloadUrl = $app('a[href*="download"]').first().attr('href');
      }
      if (!downloadUrl) {
        downloadUrl = $app('.download-btn').attr('href');
      }

      if (!downloadUrl || downloadUrl === '#') {
        // Try to find direct APK link
        const links = [];
        $app('a').each((i, elem) => {
          const href = $(elem).attr('href');
          if (href && href.includes('.apk')) {
            links.push(href);
          }
        });
        
        if (links.length > 0) {
          downloadUrl = links[0];
        }
      }

      if (!downloadUrl || downloadUrl === '#') {
        await msg.react('❌');
        return await msg.reply('❌ Download link نہیں مل سکا! دوبارہ try کریں۔');
      }

      // If download URL is relative, make it absolute
      if (!downloadUrl.startsWith('http')) {
        downloadUrl = 'https://apkmody.io' + downloadUrl;
      }

      // Get APK info
      const modInfo = $app('.mod-info').text().trim();
      const size = $app('.file-size').text().trim() || 'Unknown';

      await msg.reply(`
✅ *Premium APK تیار ہے!*

💎 *App:* ${apps[0].title}
📦 *Version:* ${apps[0].version}
📊 *Size:* ${size}
✨ *Mod Features:* ${modInfo || 'Premium Unlocked'}

⏳ *Downloading Modded APK...*

_یہ کچھ وقت لے سکتا ہے..._
`.trim());

      // Download APK
      const apkBuffer = await axios.get(downloadUrl, { 
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024, // 100MB limit
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': apps[0].url
        }
      });

      // Send APK
      await msg.sendDocument(
        Buffer.from(apkBuffer.data),
        `${apps[0].title}.apk`,
        'application/vnd.android.package-archive',
        `
💎 *${apps[0].title}*

📦 Version: ${apps[0].version}
📊 Size: ${size}
✨ Mod Features: ${modInfo || 'Premium Features Unlocked'}

*Premium Features:*
✅ All Features Unlocked
✅ No Ads
✅ Pro/Premium Free
✅ No Watermark (if video editor)

*Installation:*
1️⃣ Uninstall original app (if installed)
2️⃣ Enable "Unknown Sources" in Settings
3️⃣ Install this modded APK
4️⃣ Enjoy Premium Features!

⚠️ *Note:* Use at your own risk

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110
`.trim()
      );

      await msg.react('✅');

    } catch (error) {
      console.error('Mod APK download error:', error);
      await msg.react('❌');
      
      if (error.message.includes('maxContentLength')) {
        await msg.reply('❌ APK بہت بڑی ہے (100MB سے زیادہ)');
      } else {
        await msg.reply(`
❌ *Error occurred!*

براہ کرم:
• مختلف app name try کریں
• یا دوبارہ command استعمال کریں

_YOUSAF-BALOCH-MD_
`.trim());
      }
    }
  }
};
