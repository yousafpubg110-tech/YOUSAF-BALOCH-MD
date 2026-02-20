/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Instagram Downloader ┃
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
  command: ['ig', 'instagram', 'insta', 'igdl'],
  name: 'instagram',
  category: 'Downloader',
  description: 'Download Instagram photos, reels and videos',
  usage: '.ig <instagram url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide an Instagram URL!

*Example:*
.ig https://www.instagram.com/p/xxxxx
.ig https://www.instagram.com/reel/xxxxx

*Note:* Account must be public.

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidInstagramUrl(url)) {
        return await msg.reply(`❌ Invalid Instagram URL!

Please provide a valid Instagram post, reel or video link.

*Example:*
.ig https://www.instagram.com/p/xxxxx
.ig https://www.instagram.com/reel/xxxxx

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⬇️');
      await msg.reply('⏳ *Downloading Instagram media...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/downloader/instagram?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const data = response.data?.result || response.data;

      if (!data || (!data.url && !data.video && !data.image)) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download!\n\nMake sure the account is public and URL is correct.');
      }

      // FIX: sanitizeUrl on media URL — CodeQL High error fix
      const rawMediaUrl = data.video || data.url || data.image;
      const safeMediaUrl = sanitizeUrl(rawMediaUrl);

      if (!safeMediaUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid media URL received!');
      }

      const caption = `╭━━━『 *INSTAGRAM* 』━━━╮

📸 *Downloaded successfully!*
🔗 *Source:* Instagram

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      const isVideo = data.video || url.includes('/reel/') || url.includes('/tv/');

      if (isVideo) {
        await sock.sendMessage(from, {
          video: { url: safeMediaUrl },
          caption,
          mimetype: 'video/mp4',
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          image: { url: safeMediaUrl },
          caption,
        }, { quoted: msg });
      }

      await msg.react('✅');

    } catch (error) {
      console.error('Instagram download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ Download failed!\n\n${error.message}\n\nMake sure URL is correct and account is public.`);
      } catch (_) {}
    }
  },
};

function isValidInstagramUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'www.instagram.com' || parsed.hostname === 'instagram.com') &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      /\/(p|reel|tv|stories)\//.test(parsed.pathname)
    );
  } catch {
    return false;
  }
}
