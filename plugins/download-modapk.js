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
import * as cheerio from 'cheerio';
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['modapk', 'premiumapk', 'apkmod'],
  name: 'modapk',
  category: 'Downloader',
  description: 'Download premium/modded APKs',
  usage: '.modapk <app name>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an app name!

*Example:*
.modapk CapCut Pro
.modapk InShot Premium
.modapk Spotify Premium
.modapk Netflix Mod
.modapk PicsArt Gold

*Popular Premium Apps:*
🎬 CapCut Pro
🎥 InShot Premium
🎵 Spotify Premium
📺 Netflix Mod
📸 PicsArt Gold
🎮 Game Mods

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('💎');
      const query = args.join(' ');

      await msg.reply(`⏳ *Searching Premium APK...*\n\n🔍 Searching: ${query}\n📦 Source: APKMody\n\nPlease wait...`);

      // FIX: sanitizeUrl on search URL — CodeQL High error fix
      const rawSearchUrl = `https://apkmody.io/?s=${encodeURIComponent(query)}`;
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

      $('.post').slice(0, 5).each((i, elem) => {
        const title = $(elem).find('.entry-title a').text().trim();
        const url = $(elem).find('.entry-title a').attr('href');
        const version = $(elem).find('.version').text().trim() || 'Latest';
        const features = $(elem).find('.excerpt').text().trim();
        if (title && url) apps.push({ title, url, version, features });
      });

      if (apps.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ No Premium APK found! Try a different app name.');
      }

      let resultMsg = `╭━━━『 *PREMIUM APK SEARCH* 』━━━╮\n\n💎 *Found ${apps.length} apps for: ${query}*\n`;

      apps.forEach((app, i) => {
        resultMsg += `\n${i + 1}. *${app.title}*\n   📦 Version: ${app.version}\n`;
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

      let rawDownloadUrl = $app('a.btn-download').attr('href')
        || $app('a[href*="download"]').first().attr('href')
        || $app('.download-btn').attr('href');

      if (!rawDownloadUrl || rawDownloadUrl === '#') {
        $app('a').each((i, elem) => {
          const href = $app(elem).attr('href');
          if (href && href.includes('.apk')) {
            rawDownloadUrl = href;
            return false;
          }
        });
      }

      if (!rawDownloadUrl || rawDownloadUrl === '#') {
        await msg.react('❌');
        return await msg.reply('❌ Download link not found! Try again.');
      }

      // Fix relative URLs
      if (!rawDownloadUrl.startsWith('http')) {
        rawDownloadUrl = 'https://apkmody.io' + rawDownloadUrl;
      }

      // FIX: sanitizeUrl on download URL — CodeQL High error fix
      const safeDownloadUrl = sanitizeUrl(rawDownloadUrl);
      if (!safeDownloadUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid download URL!');
      }

      const modInfo = $app('.mod-info').text().trim() || 'Premium Unlocked';
      const size = $app('.file-size').text().trim() || 'Unknown';

      await msg.reply(`✅ *Premium APK Ready!*

💎 *App:* ${apps[0].title}
📦 *Version:* ${apps[0].version}
📊 *Size:* ${size}
✨ *Mod:* ${modInfo}

⏳ *Downloading...*

${SYSTEM.SHORT_WATERMARK}`);

      const apkRes = await axios.get(safeDownloadUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: 100 * 1024 * 1024,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': safeAppUrl,
        },
      });

      const apkBuffer = Buffer.from(apkRes.data);

      await sock.sendMessage(from, {
        document: apkBuffer,
        fileName: `${apps[0].title}.apk`,
        mimetype: 'application/vnd.android.package-archive',
        caption: `💎 *${apps[0].title}*

📦 Version: ${apps[0].version}
📊 Size: ${size}
✨ Mod: ${modInfo}

*Installation:*
1️⃣ Uninstall original app
2️⃣ Enable Unknown Sources in Settings
3️⃣ Install this APK
4️⃣ Enjoy Premium!

⚠️ Use at your own risk.

${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Mod APK download error:', error.message);
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
