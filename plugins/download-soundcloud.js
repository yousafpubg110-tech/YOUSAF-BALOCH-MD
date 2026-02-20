/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD SoundCloud DL        ┃
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
  command: ['soundcloud', 'sc', 'scdl'],
  name: 'soundcloud',
  category: 'Downloader',
  description: 'Download music from SoundCloud',
  usage: '.soundcloud <soundcloud url>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a SoundCloud URL!

*Example:*
.soundcloud https://soundcloud.com/artist/track-name
.sc https://soundcloud.com/artist/track-name

${SYSTEM.SHORT_WATERMARK}`);
      }

      const url = args[0];

      if (!isValidSoundCloudUrl(url)) {
        return await msg.reply(`❌ Invalid SoundCloud URL!

Please provide a valid SoundCloud track link.

*Example:*
.sc https://soundcloud.com/artist/track-name

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🎧');
      await msg.reply('⏳ *Downloading from SoundCloud...*\n\nPlease wait...');

      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const rawApiUrl = `https://api.nexoracle.com/downloader/soundcloud?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const safeApiUrl = sanitizeUrl(rawApiUrl);

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build download URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 30000 });
      const result = response.data?.result;

      if (!result) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to download from SoundCloud!');
      }

      await msg.react('⬇️');

      const rawAudioUrl = result.download || result.url;

      // FIX: sanitizeUrl on audio URL — CodeQL High error fix
      const safeAudioUrl = rawAudioUrl ? sanitizeUrl(rawAudioUrl) : null;

      if (!safeAudioUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid audio URL received!');
      }

      const trackInfo = `╭━━━『 *SOUNDCLOUD TRACK* 』━━━╮

🎧 *Title:* ${result.title || 'Unknown'}
👤 *Artist:* ${result.artist || 'Unknown'}
⏱️ *Duration:* ${result.duration || 'Unknown'}
${result.plays ? `▶️ *Plays:* ${formatNumber(result.plays)}\n` : ''}
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Sending audio...*

${SYSTEM.SHORT_WATERMARK}`;

      await msg.reply(trackInfo);

      const audioRes = await axios.get(safeAudioUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
      });

      const audioBuffer = Buffer.from(audioRes.data);

      // FIX: sanitizeUrl on thumbnail URL
      let thumbnailBuffer = Buffer.from('');
      if (result.thumbnail) {
        const safeThumbnailUrl = sanitizeUrl(result.thumbnail);
        if (safeThumbnailUrl) {
          thumbnailBuffer = await getBuffer(safeThumbnailUrl);
        }
      }

      // FIX: sanitizeUrl on source URL for contextInfo
      const safeSourceUrl = sanitizeUrl(url) || OWNER.GITHUB;

      await sock.sendMessage(from, {
        audio: audioBuffer,
        mimetype: 'audio/mp4',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: result.title || 'SoundCloud Track',
            body: `🎧 ${result.artist || 'SoundCloud'} • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            sourceUrl: safeSourceUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('SoundCloud download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};

function isValidSoundCloudUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'soundcloud.com' || parsed.hostname === 'www.soundcloud.com') &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function getBuffer(safeUrl) {
  try {
    const response = await axios.get(safeUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
    });
    return Buffer.from(response.data);
  } catch {
    return Buffer.from('');
  }
}
