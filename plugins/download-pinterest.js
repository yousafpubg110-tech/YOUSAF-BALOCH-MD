/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Pinterest Downloader ┃
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
  command: ['pinterest', 'pin', 'pindl'],
  name: 'pinterest',
  category: 'Downloader',
  description: 'Download images/videos from Pinterest',
  usage: '.pinterest <pinterest url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a Pinterest URL!

*Example:*
.pinterest https://pin.it/xxxxx
.pinterest https://www.pinterest.com/pin/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidPinterestUrl(url)) {
        return await msg.reply(`❌ Invalid Pinterest URL!

Please provide a valid Pinterest link.

*Example:*
.pin https://pin.it/xxxxx
.pin https://www.pinterest.com/pin/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('📌');
      await msg.reply('⏳ *Downloading from Pinterest...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/downloader/pinterest?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const result = response.data?.result;

      if (!result) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download from Pinterest!');
      }

      await msg.react('⬇️');

      const rawMediaUrl = result.image || result.video || result.url;

      // FIX: sanitizeUrl on media URL — CodeQL High error fix
      const safeMediaUrl = rawMediaUrl ? sanitizeUrl(rawMediaUrl) : null;

      if (!safeMediaUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid media URL received!');
      }

      const mediaRes = await axios.get(safeMediaUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      const mediaBuffer = Buffer.from(mediaRes.data);
      const isVideo = safeMediaUrl.includes('.mp4') || result.type === 'video';

      const caption = `📌 *PINTEREST DOWNLOAD*

${result.title ? `📝 ${result.title}\n\n` : ''}${SYSTEM.SHORT_WATERMARK}`;

      if (isVideo) {
        await sock.sendMessage(from, {
          video: mediaBuffer,
          mimetype: 'video/mp4',
          caption,
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          image: mediaBuffer,
          caption,
        }, { quoted: msg });
      }

      await msg.react('✅');

    } catch (error) {
      console.error('Pinterest download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};

function isValidPinterestUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'www.pinterest.com' ||
        parsed.hostname === 'pinterest.com' ||
        parsed.hostname === 'pin.it' ||
        parsed.hostname === 'www.pinterest.co.uk' ||
        parsed.hostname === 'in.pinterest.com') &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}
