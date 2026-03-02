/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Video DL     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import yts  from 'yt-search';
import axios from 'axios';
import { OWNER, SYSTEM } from '../config.js';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
const execAsync = promisify(exec);

export default {
  command : ['video', 'ytv', 'ytvideo', 'ytmp4'],
  name    : 'video',
  category: 'Downloader',
  description: 'Download YouTube videos',
  usage   : '.video <youtube url or search query>',
  cooldown: 15,

  handler: async ({ sock, msg, from, args }) => {
    try {
      if (!args || args.length === 0) {
        return await msg.reply(`❌ *Please provide a YouTube URL or search query!*

*Examples:*
.video https://youtu.be/xxxxx
.video Despacito
.ytmp4 Avengers trailer

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('🔍');
      const query = args.join(' ');

      let videoUrl;
      let videoInfo;

      // Check if input is URL or search query
      if (!isValidYouTubeUrl(query)) {
        // Search for video
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('❌');
          return await msg.reply('❌ No video found! Try different keywords.');
        }
        videoInfo = search.videos[0];
        videoUrl  = videoInfo.url;
      } else {
        // Direct URL
        videoUrl = query;
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('❌');
          return await msg.reply('❌ Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo = search;
      }

      const title    = videoInfo.title         || 'Unknown';
      const channel  = videoInfo.author?.name  || 'Unknown';
      const duration = videoInfo.timestamp     || '?';
      const views    = formatNumber(videoInfo.views || 0);
      const ago      = videoInfo.ago           || '';
      const thumb    = videoInfo.thumbnail     || videoInfo.image || '';

      // Send info message with thumbnail
      const caption = `╭━━━『 🎥 *YOUTUBE VIDEO* 』━━━╮

📌 *Title:* ${title}
👤 *Channel:* ${channel}
⏱️ *Duration:* ${duration}
👁️ *Views:* ${views}
📅 *Uploaded:* ${ago}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯
⏳ *Downloading video...*
${SYSTEM.SHORT_WATERMARK}`;

      if (thumb) {
        try {
          await sock.sendMessage(from, { image: { url: thumb }, caption }, { quoted: msg });
        } catch (_) { await msg.reply(caption); }
      } else {
        await msg.reply(caption);
      }

      await msg.react('⬇️');

      // Try multiple download methods
      let videoBuffer = null;
      let downloadUrl = null;
      let errors = [];

      // METHOD 1: cobalt.tools API
      try {
        const cobaltRes = await axios.post('https://api.cobalt.tools/', {
          url          : videoUrl,
          downloadMode : 'auto',
          videoQuality : '720',
          filenameStyle: 'basic',
        }, {
          headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
            'User-Agent'  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 30000,
        });

        downloadUrl = cobaltRes.data?.url;
        if (downloadUrl) {
          const videoRes = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout     : 120000,
            headers     : { 'User-Agent': 'Mozilla/5.0' },
          });
          videoBuffer = Buffer.from(videoRes.data);
        }
      } catch (e) {
        errors.push(`Cobalt API: ${e.message}`);
      }

      // METHOD 2: yt-dlp (if installed)
      if (!videoBuffer) {
        try {
          const tempFile = path.join('/tmp', `video_${Date.now()}.mp4`);
          await execAsync(`yt-dlp -f "best[height<=720]" -o "${tempFile}" "${videoUrl}"`);
          
          if (fs.existsSync(tempFile)) {
            videoBuffer = fs.readFileSync(tempFile);
            fs.unlinkSync(tempFile);
          }
        } catch (e) {
          errors.push(`yt-dlp: ${e.message}`);
        }
      }

      // METHOD 3: piped.video API
      if (!videoBuffer) {
        try {
          const videoId = extractVideoId(videoUrl);
          const pipedRes = await axios.get(`https://piped.video/api/v1/streams/${videoId}`);
          
          if (pipedRes.data && pipedRes.data.videoStreams) {
            const stream = pipedRes.data.videoStreams.find(s => s.quality === '720p') || 
                          pipedRes.data.videoStreams[0];
            
            if (stream && stream.url) {
              const videoRes = await axios.get(stream.url, {
                responseType: 'arraybuffer',
                timeout     : 120000,
              });
              videoBuffer = Buffer.from(videoRes.data);
            }
          }
        } catch (e) {
          errors.push(`Piped API: ${e.message}`);
        }
      }

      // METHOD 4: y2mate (fallback)
      if (!videoBuffer) {
        try {
          const y2mateRes = await axios.get(`https://y2mate.guru/api/convert`, {
            params: {
              url: videoUrl,
              format: 'mp4',
              quality: '720'
            }
          });
          
          if (y2mateRes.data && y2mateRes.data.downloadUrl) {
            const videoRes = await axios.get(y2mateRes.data.downloadUrl, {
              responseType: 'arraybuffer',
              timeout: 120000,
            });
            videoBuffer = Buffer.from(videoRes.data);
          }
        } catch (e) {
          errors.push(`Y2Mate: ${e.message}`);
        }
      }

      // Check if any method worked
      if (!videoBuffer || videoBuffer.length === 0) {
        await msg.react('❌');
        const errorMsg = errors.length > 0 
          ? errors.join('\n• ') 
          : 'Unknown error';
          
        return await msg.reply(`❌ *Video download failed!*\n\n• ${errorMsg}\n\nTry again later or use different video.\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

      // Get thumbnail buffer
      let thumbnailBuffer = Buffer.from('');
      if (thumb) {
        try {
          const res = await axios.get(thumb, { responseType: 'arraybuffer', timeout: 10000 });
          thumbnailBuffer = Buffer.from(res.data);
        } catch (_) {}
      }

      // Send video
      await sock.sendMessage(from, {
        video   : videoBuffer,
        mimetype: 'video/mp4',
        caption : `🎥 *${title}*\n\n📺 ${channel}\n⏱️ ${duration}\n👁️ ${views} views\n\n${SYSTEM.SHORT_WATERMARK}`,
        contextInfo: {
          externalAdReply: {
            title    : title.substring(0, 30),
            body     : `🎥 YouTube Video • ${OWNER.BOT_NAME}`,
            thumbnail: thumbnailBuffer,
            sourceUrl: videoUrl,
            mediaType: 1,
          },
        },
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Video download error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply(`❌ *Video download error:*\n_${error.message}_\n\nPlease try again later.\n\n${SYSTEM.SHORT_WATERMARK}`);
      } catch (_) {}
    }
  },
};

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'].includes(parsed.hostname);
  } catch { return false; }
}

function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    return parsed.searchParams.get('v') || null;
  } catch { return null; }
}

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000)    return (num / 1000).toFixed(1) + 'K';
  return num.toString();
          }
