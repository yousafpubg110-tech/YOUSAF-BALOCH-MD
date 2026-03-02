/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Play         ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import ytdl from '@distube/ytdl-core';
import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM } from '../config.js';

export default {
  command : ['play', 'ytplay', 'ytp', 'music'],
  name    : 'play',
  category: 'Downloader',
  description: 'Search and play YouTube music',
  usage   : '.play <song name>',
  cooldown: 10,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Song name دیں!*

*مثال:*
.play Despacito
.play Shape of You
.play Rahat Fateh Ali Khan

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      // ── Search ────────────────────────────────────────────
      const search = await yts(query);
      if (!search.videos.length) {
        await msg.react('❌');
        return await msg.reply('❌ کوئی song نہیں ملی! دوسرے keywords try کریں۔');
      }

      const videoInfo = search.videos[0];
      const videoUrl  = videoInfo.url;
      const title     = videoInfo.title       || 'Unknown';
      const artist    = videoInfo.author?.name || 'Unknown';
      const duration  = videoInfo.timestamp   || '?';
      const views     = formatNumber(videoInfo.views || 0);
      const ago       = videoInfo.ago         || '';
      const thumb     = videoInfo.thumbnail   || videoInfo.image || '';

      const caption = `╭━━━『 🎵 *YOUTUBE PLAY* 』━━━╮

🎵 *Song:* ${title}
👤 *Artist:* ${artist}
⏱️ *Duration:* ${duration}
👁️ *Views:* ${views}
📅 *Uploaded:* ${ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
⏳ *Downloading audio...*
${SYSTEM.SHORT_WATERMARK}`;

      // ── Send thumbnail + info ─────────────────────────────
      if (thumb) {
        try {
          await sock.sendMessage(from, {
            image  : { url: thumb },
            caption,
          }, { quoted: msg });
        } catch (_) {
          await msg.reply(caption);
        }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // ── Download audio via @distube/ytdl-core ─────────────
      const info    = await ytdl.getInfo(videoUrl);
      const formats = ytdl.filterFormats(info.formats, 'audioonly');
      const format  = formats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];

      if (!format) {
        await msg.react('❌');
        return await msg.reply('❌ کوئی audio format نہیں ملا!');
      }

      const chunks = [];
      await new Promise((resolve, reject) => {
        const stream = ytdl(videoUrl, { format });
        stream.on('data',  chunk => chunks.push(chunk));
        stream.on('end',   resolve);
        stream.on('error', reject);
      });

      const audioBuffer = Buffer.concat(chunks);

      if (!audioBuffer || audioBuffer.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Audio download ناکام! دوبارہ try کریں۔');
      }

      // ── Thumbnail buffer ──────────────────────────────────
      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      // ── Send audio ────────────────────────────────────────
      await sock.sendMessage(from, {
        audio  : audioBuffer,
        mimetype: 'audio/mp4',
        ptt    : false,
        contextInfo: {
          externalAdReply: {
            title    : title,
            body     : `${artist} • ${duration}`,
            thumbnail: thumbnailBuffer,
            mediaType: 2,
            mediaUrl : videoUrl,
            sourceUrl: videoUrl,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Play error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Play error:*\n_${error.message}_\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000)    return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
