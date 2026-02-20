/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Facebook Downloader  ┃
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
  command: ['fb', 'facebook', 'fbdl'],
  name: 'facebook',
  category: 'Downloader',
  description: 'Download Facebook videos',
  usage: '.fb <facebook video url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a Facebook video URL!

*Example:*
.fb https://www.facebook.com/video/xxxxx
.fb https://fb.watch/xxxxx

*Note:* Video must be public.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidFacebookUrl(url)) {
        return await msg.reply(`❌ Invalid Facebook URL!

Please provide a valid Facebook video link.

*Example:*
.fb https://www.facebook.com/watch?v=xxxxx
.fb https://fb.watch/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⬇️');
      await msg.reply('⏳ *Downloading Facebook video...*\n\nPlease wait...');

      const rawApiUrl = `https://api.nexoracle.com/downloader/facebook?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const data = response.data?.result || response.data;

      if (!data || (!data.hd && !data.sd && !data.url)) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download!\n\nMake sure the video is public and URL is correct.');
      }

      const rawVideoUrl = data.hd || data.sd || data.url;
      const safeVideoUrl = sanitizeUrl(rawVideoUrl);

      if (!safeVideoUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid video URL received!');
      }

      const title = data.title || 'Facebook Video';

      const caption = `╭━━━『 *FACEBOOK VIDEO* 』━━━╮

📺 *Title:* ${title}
🔗 *Quality:* ${data.hd ? 'HD' : 'SD'}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      await sock.sendMessage(from, {
        video: { url: safeVideoUrl },
        caption,
        mimetype: 'video/mp4',
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Facebook download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ Download failed!\n\n${error.message}\n\nMake sure URL is correct and video is public.`);
      } catch (_) {}
    }
  },
};

function isValidFacebookUrl(url) {
  try {
    const parsed = new URL(url);
    const validHosts = [
      'www.facebook.com',
      'facebook.com',
      'web.facebook.com',
      'm.facebook.com',
      'fb.watch',
    ];
    return (
      validHosts.includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}
