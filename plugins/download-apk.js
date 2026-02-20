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
import * as cheerio from 'cheerio';
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

export default {
  // FIX: command field added — pluginLoader ke liye zaruri
  command: ['apk', 'apkdl', 'modapk', 'premiumapk'],
  name: 'apk',
  category: 'Downloader',
  description: 'Download premium/modded APKs',
  usage: '.apk <app name>',
  cooldown: 10,

  // FIX: execute -> handler, context object use kiya
  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an app name!

*Example:*
.apk capcut pro
.apk inshot premium
.apk spotify premium

*Popular Apps:*
🎬 CapCut Pro
🎥 InShot Premium
🎵 Spotify Premium
📺 Netflix Mod
📸 PicsArt Premium

*Note:* Apps are downloaded from trusted sources.`);
      }

      await msg.react('📱');
      const query = args.join(' ');

      await msg.reply(`⏳ *Searching for: ${query}*\n\n🔍 Please wait...`);

      // FIX: sanitizeUrl used — CodeQL High error fix
      const rawUrl = `https://apkmody.io/?s=${encodeURIComponent(query)}`;
      const safeUrl = sanitizeUrl(rawUrl);

      if (!safeUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid search query. Please try again.');
      }

      const response = await axios.get(safeUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $ = cheerio.load(response.data);
      const apps = [];

      $('.post').slice(0, 3).each((i, elem) => {
        const title = $(elem).find('.entry-title a').text().trim();
        const url = $(elem).find('.entry-title a').attr('href');
        const version = $(elem).find('.version').text().trim();

        if (title && url) {
          apps.push({ title, url, version });
        }
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ No APK found! Try a different app name.');
      }

      let resultMsg = `╭━━━『 *APK SEARCH RESULTS* 』━━━╮\n\n📱 *Found ${apps.length} results for: ${query}*\n`;

      apps.forEach((app, i) => {
        resultMsg += `\n${i + 1}. *${app.title}*\n   📦 Version: ${app.version || 'Latest'}\n   🔗 ${app.url}\n`;
      });

      resultMsg += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n*Checking download link...*`;

      await msg.reply(resultMsg);
      await msg.react('⬇️');

      // FIX: sanitizeUrl on app page URL too
      const appPageUrl = sanitizeUrl(apps[0].url);
      if (!appPageUrl) {
        return await msg.reply(`✅ *APK Found!*\n\n📱 *App:* ${apps[0].title}\n🔗 *Visit:* ${apps[0].url}\n\nPlease visit the link to download manually.\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      const appPage = await axios.get(appPageUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $app = cheerio.load(appPage.data);
      const downloadBtn = $app('a.btn-download, a.download-btn, a[href*="download"]').first();
      const rawDownloadUrl = downloadBtn.attr('href');

      // FIX: sanitizeUrl on download URL — CodeQL fix
      const safeDownloadUrl = rawDownloadUrl ? sanitizeUrl(rawDownloadUrl) : null;

      if (safeDownloadUrl) {
        await msg.reply(`✅ *APK Found!*

📱 *App:* ${apps[0].title}
📦 *Version:* ${apps[0].version || 'Latest'}
🔗 *Download Link:*
${safeDownloadUrl}

*Installation Guide:*
1️⃣ Download the APK
2️⃣ Enable "Unknown Sources" in settings
3️⃣ Install the APK
4️⃣ Open and enjoy!

⚠️ *Note:* Scan APK with antivirus before installing.

${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');
      } else {
        await msg.reply(`✅ *APK Page Found!*

📱 *App:* ${apps[0].title}
🔗 *Visit:* ${apps[0].url}

Please visit the link above to download manually.

${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');
      }

    } catch (error) {
      console.error('❌ APK download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Error searching for APK*

Please try:
• Different app name
• Visit: https://apkmody.io
• Or try: https://liteapks.com

${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};
