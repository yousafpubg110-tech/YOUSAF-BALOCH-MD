/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Twitter/X Downloader ┃
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
  command: ['twitter', 'x', 'tweet', 'xdl', 'twdl'],
  name: 'twitter',
  category: 'Downloader',
  description: 'Download Twitter/X videos',
  usage: '.twitter <twitter/x video url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a Twitter/X video URL!

*Example:*
.twitter https://twitter.com/user/status/xxxxx
.x https://x.com/user/status/xxxxx

*Note:* Tweet must contain a video.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidTwitterUrl(url)) {
        return await msg.reply(`❌ Invalid Twitter/X URL!

Please provide a valid Twitter or X video link.

*Example:*
.twitter https://twitter.com/user/status/xxxxx
.x https://x.com/user/status/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⬇️');
      await msg.reply('⏳ *Downloading Twitter/X video...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.twittervideodownloader.com/download?url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const data = response.data;

      if (!data?.video || data.video.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download!\n\nMake sure the tweet contains a video and URL is correct.');
      }

      // Get highest quality video
      const videos = data.video;
      const bestVideo = videos.reduce((prev, curr) => {
        const prevRes = parseInt(prev.res || '0');
        const currRes = parseInt(curr.res || '0');
        return currRes > prevRes ? curr : prev;
      }, videos[0]);

      // FIX: sanitizeUrl on video URL — CodeQL High error fix
      const safeVideoUrl = sanitizeUrl(bestVideo.url);

      if (!safeVideoUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid video URL received!');
      }

      const caption = `╭━━━『 *TWITTER/X* 』━━━╮

🐦 *Downloaded successfully!*
📊 *Quality:* ${bestVideo.res || 'Best available'}
🔗 *Source:* Twitter/X

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      await sock.sendMessage(from, {
        video: { url: safeVideoUrl },
        caption,
        mimetype: 'video/mp4',
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Twitter download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ Download failed!\n\n${error.message}\n\nMake sure the tweet contains a video.`);
      } catch (_) {}
    }
  },
};

function isValidTwitterUrl(url) {
  try {
    const parsed = new URL(url);
    const validHosts = [
      'twitter.com',
      'www.twitter.com',
      'mobile.twitter.com',
      'x.com',
      'www.x.com',
      'mobile.x.com',
    ];
    return (
      validHosts.includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      /\/status\/\d+/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}
