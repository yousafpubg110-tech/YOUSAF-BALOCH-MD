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

export default {
  name: 'gdrive',
  aliases: ['googledrive', 'drive'],
  category: 'downloader',
  description: 'Download files from Google Drive',
  usage: '.gdrive <google drive url>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a Google Drive URL!\n\nExample:\n.gdrive https://drive.google.com/file/d/xxxxx');
      }

      const url = args[0];

      // Properly validate Google Drive URL
      if (!isValidGoogleDriveUrl(url)) {
        return await msg.reply('❌ Please provide a valid Google Drive URL!');
      }

      await msg.react('☁️');
      await msg.reply('⏳ *Fetching Google Drive file...*\n\n_Please wait..._');

      // Extract file ID properly
      const fileId = extractGoogleDriveId(url);
      if (!fileId) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid Google Drive URL!');
      }

      const apiUrl = `https://api.nexoracle.com/downloader/gdrive?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        const result = response.data.result;
        
        const fileInfo = `
╭━━━『 *GOOGLE DRIVE FILE* 』━━━╮

📁 *Filename:* ${result.name || 'Unknown'}
📊 *Size:* ${result.size || 'Unknown'}
📄 *Type:* ${result.mimetype || 'Unknown'}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading file...*

_Powered by YOUSAF-BALOCH-MD_
_Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j_
`.trim();

        await msg.reply(fileInfo);
        await msg.react('⬇️');

        if (result.size && result.size.includes('GB')) {
          await msg.react('⚠️');
          return await msg.reply(`
⚠️ *File is too large!*

📊 Size: ${result.size}
⚠️ WhatsApp limit: 100MB

*Download manually:*
https://drive.google.com/uc?id=${fileId}&export=download

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());
        }

        // Validate download URL before using
        let downloadUrl = result.download;
        if (!downloadUrl || !isValidHttpUrl(downloadUrl)) {
          downloadUrl = `https://drive.google.com/uc?id=${fileId}&export=download`;
        }
        
        await msg.reply(`
✅ *Google Drive File Ready!*

📁 ${result.name || 'File'}
📊 ${result.size || 'Unknown size'}

🔗 *Download Link:*
${downloadUrl}

*Note:* If file is large, download manually from link above.

_Downloaded by YOUSAF-BALOCH-MD_
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim());

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to fetch file! Make sure the file is publicly accessible.');
      }

    } catch (error) {
      console.error('Google Drive download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};

function isValidGoogleDriveUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'drive.google.com') &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function extractGoogleDriveId(url) {
  try {
    const parsed = new URL(url);
    // Format: /file/d/FILE_ID/view
    const pathMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    if (pathMatch) return pathMatch[1];
    // Format: ?id=FILE_ID
    const idParam = parsed.searchParams.get('id');
    if (idParam && /^[a-zA-Z0-9_-]{25,}$/.test(idParam)) return idParam;
    return null;
  } catch {
    return null;
  }
}
