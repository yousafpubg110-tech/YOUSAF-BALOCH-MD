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

export default {
  name: 'soundcloud',
  aliases: ['sc', 'scdl'],
  category: 'downloader',
  description: 'Download music from SoundCloud',
  usage: '.soundcloud <soundcloud url>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a SoundCloud URL!\n\nExample:\n.soundcloud https://soundcloud.com/artist/track');
      }

      const url = args[0];

      // Properly validate SoundCloud URL
      if (!isValidSoundCloudUrl(url)) {
        return await msg.reply('❌ Please provide a valid SoundCloud URL!');
      }

      await msg.react('🎧');
      await msg.reply('⏳ *Downloading from SoundCloud...*\n\n_Please wait..._');

      const apiUrl = `https://api.nexoracle.com/downloader/soundcloud?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        await msg.react('⬇️');
        
        const result = response.data.result;
        const audioUrl = result.download || result.url;
        
        // Validate audio URL before using
        if (!audioUrl || !isValidHttpUrl(audioUrl)) {
          await msg.react('❌');
          return await msg.reply('❌ Failed to download from SoundCloud!');
        }

        const trackInfo = `
╭━━━『 *SOUNDCLOUD TRACK* 』━━━╮

🎧 *Title:* ${result.title || 'Unknown'}
👤 *Artist:* ${result.artist || 'Unknown'}
⏱️ *Duration:* ${result.duration || 'Unknown'}
${result.plays ? `▶️ *Plays:* ${formatNumber(result.plays)}\n` : ''}
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

⏳ *Sending audio...*

_Powered by YOUSAF-BALOCH-MD_
`.trim();

        await msg.reply(trackInfo);

        const audioBuffer = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        
        // Validate thumbnail URL before using
        let thumbnail = Buffer.from('');
        if (result.thumbnail && isValidHttpUrl(result.thumbnail)) {
          thumbnail = await getBuffer(result.thumbnail);
        }

        await msg.sendAudio(
          Buffer.from(audioBuffer.data),
          {
            mimetype: 'audio/mp4',
            ptt: false,
            contextInfo: {
              externalAdReply: {
                title: result.title || 'SoundCloud Track',
                body: `🎧 ${result.artist || 'SoundCloud'} • YOUSAF-BALOCH-MD`,
                thumbnail: thumbnail,
                mediaType: 2,
                sourceUrl: url
              }
            }
          }
        );

        await msg.react('✅');
        await msg.reply(`
✅ *Downloaded!*

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110
`.trim());
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download from SoundCloud!');
      }

    } catch (error) {
      console.error('SoundCloud download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
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

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
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
