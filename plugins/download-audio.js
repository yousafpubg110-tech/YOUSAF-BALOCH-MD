/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD YouTube Audio DL     ┃
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
import yts from 'yt-search';

export default {
  name: 'audio',
  aliases: ['yta', 'ytaudio', 'mp3'],
  category: 'downloader',
  description: 'Download YouTube audio/music',
  usage: '.audio <youtube url or search query>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('\u274C Please provide a YouTube URL or search query!\n\nExample:\n.audio https://youtu.be/xxxxx\n.audio Despacito');
      }

      await msg.react('\u{1F50D}');
      const query = args.join(' ');

      // Check if URL or search query
      let videoUrl = query;
      let videoInfo;

      if (!isValidYouTubeUrl(query)) {
        // Search YouTube
        const search = await yts(query);
        if (!search.videos.length) {
          await msg.react('\u274C');
          return await msg.reply('\u274C No audio found!');
        }
        videoInfo = search.videos[0];
        videoUrl = videoInfo.url;
      } else {
        // Get video info from URL
        const videoId = extractVideoId(query);
        if (!videoId) {
          await msg.react('\u274C');
          return await msg.reply('\u274C Invalid YouTube URL!');
        }
        const search = await yts({ videoId });
        videoInfo = search;
      }

      // Send audio info
      const caption = `
\u256D\u2501\u2501\u2501\u300E *YOUTUBE AUDIO* \u300F\u2501\u2501\u2501\u256E

\u{1F3B5} *Title:* ${videoInfo.title}
\u{1F464} *Artist:* ${videoInfo.author?.name || 'Unknown'}
\u23F1\uFE0F *Duration:* ${videoInfo.timestamp}
\u{1F441}\uFE0F *Views:* ${formatNumber(videoInfo.views)}
\u{1F4C5} *Uploaded:* ${videoInfo.ago}

\u2570\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u256F

\u23F3 *Downloading audio...*

_Powered by YOUSAF-BALOCH-MD_
_GitHub: musakhanbaloch03-sad_
`.trim();

      if (videoInfo.thumbnail) {
        await msg.sendImage(
          { url: videoInfo.thumbnail },
          caption
        );
      } else {
        await msg.reply(caption);
      }

      await msg.react('\u2B07\uFE0F');

      // Download audio using API - URL is already validated above
      const apiUrl = `https://api.nexoracle.com/downloader/ytmp3?apikey=free_key@maher_apis&url=${encodeURIComponent(videoUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result && response.data.result.download) {
        const downloadUrl = response.data.result.download;

        // Validate download URL before using
        if (!isValidHttpUrl(downloadUrl)) {
          await msg.react('\u274C');
          return await msg.reply('\u274C Invalid download URL received!');
        }

        const audioBuffer = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        
        await msg.sendAudio(
          Buffer.from(audioBuffer.data),
          {
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
              externalAdReply: {
                title: videoInfo.title,
                body: 'YOUSAF-BALOCH-MD',
                thumbnail: await getBuffer(videoInfo.thumbnail),
                sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD'
              }
            }
          }
        );

        await msg.react('\u2705');
      } else {
        await msg.react('\u274C');
        await msg.reply('\u274C Failed to download audio. Try again later!');
      }

    } catch (error) {
      console.error('Audio download error:', error);
      await msg.react('\u274C');
      await msg.reply('\u274C Error downloading audio: ' + error.message);
    }
  }
};

function isValidYouTubeUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com' || parsed.hostname === 'youtu.be') &&
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

function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    return parsed.searchParams.get('v') || null;
  } catch {
    return null;
  }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

async function getBuffer(url) {
  try {
    if (!isValidHttpUrl(url)) return Buffer.from('');
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch {
    return Buffer.from('');
  }
                }
