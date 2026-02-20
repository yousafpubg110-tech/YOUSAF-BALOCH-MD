/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD MediaFire Downloader ┃
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
  command: ['mediafire', 'mf', 'mfdl'],
  name: 'mediafire',
  category: 'Downloader',
  description: 'Download files from MediaFire',
  usage: '.mediafire <mediafire url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a MediaFire URL!

*Example:*
.mediafire https://www.mediafire.com/file/xxxxx

*Note:* File must be publicly accessible.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidMediaFireUrl(url)) {
        return await msg.reply(`❌ Invalid MediaFire URL!

Please provide a valid MediaFire link.

*Example:*
.mediafire https://www.mediafire.com/file/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('📁');
      await msg.reply('⏳ *Fetching MediaFire file...*\n\nPlease wait...');

      // FIX: sanitizeUrl on page URL before fetching
      const safePageUrl = sanitizeUrl(url);
      if (!safePageUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid URL provided.');
      }

      const response = await axios.get(safePageUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const $ = cheerio.load(response.data);

      const filename = $('.dl-btn-label').attr('title') || $('div.filename').text().trim() || 'Unknown File';
      const filesize = $('.details li:first-child span').text().trim() || 'Unknown';
      const filetype = $('.details li:nth-child(2) span').text().trim() || 'Unknown';
      const rawDownloadUrl = $('#downloadButton').attr('href');

      // FIX: sanitizeUrl on download URL — CodeQL High error fix
      const safeDownloadUrl = rawDownloadUrl ? sanitizeUrl(rawDownloadUrl) : null;

      if (!safeDownloadUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to get download link! Make sure the file is publicly accessible.');
      }

      const fileInfo = `╭━━━『 *MEDIAFIRE FILE* 』━━━╮

📁 *Filename:* ${filename}
📊 *Size:* ${filesize}
📄 *Type:* ${filetype}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading file...*

${SYSTEM.SHORT_WATERMARK}`;

      await msg.reply(fileInfo);
      await msg.react('⬇️');

      // Check file size limit
      const sizeMatch = filesize.match(/([\d.]+)\s*(MB|GB)/i);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();

        if (unit === 'GB' || (unit === 'MB' && size > 100)) {
          await msg.react('⚠️');
          return await msg.reply(`⚠️ *File is too large!*

📊 Size: ${filesize}
⚠️ WhatsApp limit: 100MB

*Download manually:*
${safeDownloadUrl}

${SYSTEM.SHORT_WATERMARK}`);
        }
      }

      const fileRes = await axios.get(safeDownloadUrl, {
        responseType: 'arraybuffer',
        timeout: 120000,
        maxContentLength: 100 * 1024 * 1024,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });

      const fileBuffer = Buffer.from(fileRes.data);

      let mimetype = 'application/octet-stream';
      const ft = filetype.toUpperCase();
      if (ft.includes('APK')) mimetype = 'application/vnd.android.package-archive';
      else if (ft.includes('PDF')) mimetype = 'application/pdf';
      else if (ft.includes('ZIP')) mimetype = 'application/zip';
      else if (ft.includes('MP4')) mimetype = 'video/mp4';
      else if (ft.includes('MP3')) mimetype = 'audio/mpeg';

      await sock.sendMessage(from, {
        document: fileBuffer,
        fileName: filename,
        mimetype,
        caption: `📁 *${filename}*\n📊 Size: ${filesize}\n📄 Type: ${filetype}\n\n${SYSTEM.SHORT_WATERMARK}`,
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('MediaFire download error:', error.message);
      try {
        await msg.react('❌');
        if (error.message.includes('maxContentLength')) {
          await msg.reply('❌ File is too large to send via WhatsApp (max 100MB)');
        } else {
          await msg.reply('❌ Error: ' + error.message);
        }
      } catch (_) {}
    }
  },
};

function isValidMediaFireUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'www.mediafire.com' || parsed.hostname === 'mediafire.com') &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}
