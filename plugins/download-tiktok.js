/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD TikTok Downloader    ┃
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
  command: ['tiktok', 'tt', 'tiktokdl', 'ttdl'],
  name: 'tiktok',
  category: 'Downloader',
  description: 'Download TikTok videos without watermark',
  usage: '.tiktok <tiktok url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a TikTok URL!

*Example:*
.tiktok https://www.tiktok.com/@user/video/xxxxx
.tt https://vm.tiktok.com/xxxxx

*Note:* Video will be downloaded without watermark.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidTikTokUrl(url)) {
        return await msg.reply(`❌ Invalid TikTok URL!

Please provide a valid TikTok video link.

*Example:*
.tiktok https://www.tiktok.com/@user/video/xxxxx
.tt https://vm.tiktok.com/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⬇️');
      await msg.reply('⏳ *Downloading TikTok video...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const data = response.data;

      if (!data?.video?.noWatermark) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download!\n\nMake sure the URL is correct and video is public.');
      }

      // FIX: sanitizeUrl on video URL — CodeQL High error fix
      const safeVideoUrl = sanitizeUrl(data.video.noWatermark);

      if (!safeVideoUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid video URL received!');
      }

      const caption = `╭━━━『 *TIKTOK* 』━━━╮

👤 *Author:* ${data.author?.name || 'Unknown'}
📝 *Title:* ${data.title || 'No title'}
⏱️ *Duration:* ${data.video?.duration || 'N/A'}s
🔇 *Watermark:* Removed

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      await sock.sendMessage(from, {
        video: { url: safeVideoUrl },
        caption,
        mimetype: 'video/mp4',
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('TikTok download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ Download failed!\n\n${error.message}\n\nMake sure the URL is correct.`);
      } catch (_) {}
    }
  },
};

function isValidTikTokUrl(url) {
  try {
    const parsed = new URL(url);
    const validHosts = [
      'www.tiktok.com',
      'tiktok.com',
      'vm.tiktok.com',
      'm.tiktok.com',
    ];
    return (
      validHosts.includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}
