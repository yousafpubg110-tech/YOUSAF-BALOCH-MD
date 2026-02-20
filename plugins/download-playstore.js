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
import * as cheerio from 'cheerio';
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['playstore', 'ps', 'playstoreapp', 'apk'],
  name: 'playstore',
  category: 'Downloader',
  description: 'Download apps from Play Store via APKPure',
  usage: '.playstore <app name>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an app name!

*Example:*
.playstore WhatsApp
.playstore Instagram
.playstore TikTok
.playstore Telegram
.playstore PUBG

*Popular Apps:*
📱 WhatsApp, Instagram, Facebook
🎮 PUBG, Free Fire, Call of Duty
🎵 Spotify, YouTube Music
📺 Netflix, YouTube

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('📱');
      const query = args.join(' ');

      await msg.reply(`⏳ *Searching Play Store...*\n\n🔍 Searching: ${query}\n\nPlease wait...`);

      // FIX: sanitizeUrl on search URL — CodeQL High error fix
      const rawSearchUrl = `https://apkpure.com/search?q=${encodeURIComponent(query)}`;
      const safeSearchUrl = sanitizeUrl(rawSearchUrl);

      if (!safeSearchUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build search URL.');
      }

      const response = await axios.get(safeSearchUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $ = cheerio.load(response.data);
      const apps = [];

      $('.search-dl').slice(0, 5).each((i, elem) => {
        const title = $(elem).find('.p1').text().trim();
        const developer = $(elem).find('.p2').text().trim();
        const href = $(elem).find('a').attr('href');
        const rating = $(elem).find('.star').text().trim();
        if (title && href) {
          apps.push({
            title,
            developer,
            url: 'https://apkpure.com' + href,
            rating,
          });
        }
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ No apps found! Try a different name.');
      }

      let resultMsg = `╭━━━『 *PLAY STORE SEARCH* 』━━━╮\n\n📱 *Found ${apps.length} apps for: ${query}*\n`;
      apps.forEach((app, i) => {
        resultMsg += `\n${i + 1}. *${app.title}*\n   👤 ${app.developer}\n   ⭐ ${app.rating || 'N/A'}\n`;
      });
      resultMsg += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n⏳ *Downloading first result...*`;

      await msg.reply(resultMsg);
      await msg.react('⬇️');

      // FIX: sanitizeUrl on app page URL
      const safeAppUrl = sanitizeUrl(apps[0].url);
      if (!safeAppUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid app page URL.');
      }

      const appPage = await axios.get(safeAppUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $app = cheerio.load(appPage.data);
      const downloadHref = $app('.download-btn').attr('href');

      if (!downloadHref) {
        await msg.react('❌');
        return await msg.reply('❌ Download link not found!');
      }

      // FIX: sanitizeUrl on download page URL
      const rawDownloadPageUrl = downloadHref.startsWith('http')
        ? downloadHref
        : 'https://apkpure.com' + downloadHref;
      const safeDownloadPageUrl = sanitizeUrl(rawDownloadPageUrl);

      if (!safeDownloadPageUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid download page URL.');
      }

      const downloadPage = await axios.get(safeDownloadPageUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $dl = cheerio.load(downloadPage.data);
      const rawApkUrl = $dl('#download_link').attr('href');

      // FIX: sanitizeUrl on APK download URL — CodeQL High error fix
      const safeApkUrl = rawApkUrl ? sanitizeUrl(rawApkUrl) : null;

      if (!safeApkUrl) {
        await msg.react('❌');
        return await msg.reply('❌ APK download link not found! Try again.');
      }

      const version = $app('.details-sdk span:first').text().trim() || 'Latest';
      const size = $app('.details-sdk span:last').text().trim() || 'Unknown';

      await msg.reply(`✅ *APK Ready!*

📱 *App:* ${apps[0].title}
👤 *Developer:* ${apps[0].developer}
📦 *Version:* ${version}
📊 *Size:* ${size}
⭐ *Rating:* ${apps[0].rating || 'N/A'}

⏳ *Downloading APK...*

${SYSTEM.SHORT_WATERMARK}`);

      const apkRes = await axios.get(safeApkUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: 100 * 1024 * 1024,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const apkBuffer = Buffer.from(apkRes.data);

      await sock.sendMessage(from, {
        document: apkBuffer,
        fileName: `${apps[0].title}.apk`,
        mimetype: 'application/vnd.android.package-archive',
        caption: `📱 *${apps[0].title}*

👤 Developer: ${apps[0].developer}
📦 Version: ${version}
📊 Size: ${size}
⭐ Rating: ${apps[0].rating || 'N/A'}

*Installation:*
1️⃣ Download APK
2️⃣ Enable Unknown Sources in Settings
3️⃣ Install APK
4️⃣ Enjoy!

${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Play Store download error:', error.message);
      try {
        await msg.react('❌');
        if (error.message.includes('maxContentLength')) {
          await msg.reply('❌ APK is too large (over 100MB)');
        } else {
          await msg.reply('❌ Error: ' + error.message);
        }
      } catch (_) {}
    }
  },
};
