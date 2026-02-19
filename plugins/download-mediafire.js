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
import cheerio from 'cheerio';

export default {
  name: 'mediafire',
  aliases: ['mf', 'mfdl'],
  category: 'downloader',
  description: 'Download files from MediaFire',
  usage: '.mediafire <mediafire url>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a MediaFire URL!\n\nExample:\n.mediafire https://www.mediafire.com/file/xxxxx');
      }

      const url = args[0];

      // Properly validate MediaFire URL
      if (!isValidMediaFireUrl(url)) {
        return await msg.reply('❌ Please provide a valid MediaFire URL!');
      }

      await msg.react('📁');
      await msg.reply('⏳ *Fetching MediaFire file...*\n\n_Please wait..._');

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const filename = $('.dl-btn-label').attr('title') || $('div.filename').text().trim();
      const filesize = $('.details li:first-child span').text().trim();
      const filetype = $('.details li:nth-child(2) span').text().trim();
      const downloadUrl = $('#downloadButton').attr('href');

      // Validate download URL before using
      if (!downloadUrl || !isValidHttpUrl(downloadUrl)) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to get download link! Make sure the file is publicly accessible.');
      }

      const fileInfo = `
╭━━━『 *MEDIAFIRE FILE* 』━━━╮

📁 *Filename:* ${filename}
📊 *Size:* ${filesize}
📄 *Type:* ${filetype}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Downloading file...*

_Powered by YOUSAF-BALOCH-MD_
_Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j_
`.trim();

      await msg.reply(fileInfo);
      await msg.react('⬇️');

      const sizeMatch = filesize.match(/([\d.]+)\s*(MB|GB)/i);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        
        if ((unit === 'GB') || (unit === 'MB' && size > 100)) {
          await msg.react('⚠️');
          return await msg.reply(`
⚠️ *File is too large!*

📊 Size: ${filesize}
⚠️ WhatsApp limit: 100MB

*Download manually:*
${downloadUrl}

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());
        }
      }

      const fileBuffer = await axios.get(downloadUrl, { 
        responseType: 'arraybuffer',
        maxContentLength: 100 * 1024 * 1024
      });

      let mimetype = 'application/octet-stream';
      if (filetype.includes('APK')) mimetype = 'application/vnd.android.package-archive';
      else if (filetype.includes('PDF')) mimetype = 'application/pdf';
      else if (filetype.includes('ZIP')) mimetype = 'application/zip';
      else if (filetype.includes('MP4')) mimetype = 'video/mp4';
      else if (filetype.includes('MP3')) mimetype = 'audio/mpeg';

      await msg.sendDocument(
        Buffer.from(fileBuffer.data),
        filename,
        mimetype,
        `
📁 *${filename}*
📊 Size: ${filesize}
📄 Type: ${filetype}

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim()
      );

      await msg.react('✅');

    } catch (error) {
      console.error('MediaFire download error:', error);
      await msg.react('❌');
      
      if (error.message.includes('maxContentLength')) {
        await msg.reply('❌ File is too large to send via WhatsApp (max 100MB)');
      } else {
        await msg.reply('❌ Error: ' + error.message);
      }
    }
  }
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

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
