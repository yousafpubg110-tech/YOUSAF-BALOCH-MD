/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Google Drive DL      ┃
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
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['gdrive', 'googledrive', 'drive'],
  name: 'gdrive',
  category: 'Downloader',
  description: 'Download files from Google Drive',
  usage: '.gdrive <google drive url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a Google Drive URL!

*Example:*
.gdrive https://drive.google.com/file/d/xxxxx/view

*Note:* File must be publicly accessible.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidGoogleDriveUrl(url)) {
        return await msg.reply(`❌ Invalid Google Drive URL!

Please provide a valid Google Drive link.

*Example:*
.gdrive https://drive.google.com/file/d/xxxxx/view

${SYSTEM.SHORT_WATERMARK}`);
      }

      const fileId = extractGoogleDriveId(url);
      if (!fileId) {
        await msg.react('❌');
        return await msg.reply('❌ Could not extract file ID from URL!');
      }

      await msg.react('☁️');
      await msg.reply('⏳ *Fetching Google Drive file...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL
      const rawApiUrl = `https://api.nexoracle.com/downloader/gdrive?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const result = response.data?.result;

      if (!result) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to fetch file! Make sure the file is publicly accessible.');
      }

      const fileInfo = `╭━━━『 *GOOGLE DRIVE FILE* 』━━━╮

📁 *Filename:* ${result.name || 'Unknown'}
📊 *Size:* ${result.size || 'Unknown'}
📄 *Type:* ${result.mimetype || 'Unknown'}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Processing download...*

${SYSTEM.SHORT_WATERMARK}`;

      await msg.reply(fileInfo);
      await msg.react('⬇️');

      // Check if file is too large (GB size)
      if (result.size && result.size.toLowerCase().includes('gb')) {
        await msg.react('⚠️');
        const fallbackUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
        return await msg.reply(`⚠️ *File is too large for WhatsApp!*

📊 Size: ${result.size}
⚠️ WhatsApp limit: 100MB

*Download manually:*
${fallbackUrl}

${SYSTEM.SHORT_WATERMARK}`);
      }

      // FIX: sanitizeUrl on download URL
      const rawDownloadUrl = result.download || `https://drive.google.com/uc?id=${fileId}&export=download`;
      const safeDownloadUrl = sanitizeUrl(rawDownloadUrl);

      if (!safeDownloadUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid download URL received!');
      }

      await msg.reply(`✅ *Google Drive File Ready!*

📁 *File:* ${result.name || 'Unknown'}
📊 *Size:* ${result.size || 'Unknown'}

🔗 *Download Link:*
${safeDownloadUrl}

*Note:* If file is large, download from link above.

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('✅');

    } catch (error) {
      console.error('Google Drive download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};

function isValidGoogleDriveUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === 'drive.google.com' &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}

function extractGoogleDriveId(url) {
  try {
    const parsed = new URL(url);
    const pathMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    if (pathMatch) return pathMatch[1];
    const idParam = parsed.searchParams.get('id');
    if (idParam && /^[a-zA-Z0-9_-]{25,}$/.test(idParam)) return idParam;
    return null;
  } catch {
    return null;
  }
}
