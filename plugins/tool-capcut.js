/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD CapCut Templates     ┃
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
  name: 'capcut',
  aliases: ['capcuttemplate', 'cctemplate'],
  category: 'tools',
  description: 'Download CapCut templates',
  usage: '.capcut <capcut template url>',
  cooldown: 5000,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please provide a CapCut template URL!

*Example:*
.capcut https://www.capcut.com/template/xxxxx

*How to get template link:*
1. Open CapCut app
2. Find a template you like
3. Tap "Share" → "Copy Link"
4. Send the link here with .capcut command
`.trim());
      }

      const url = args[0];

      // Properly validate CapCut URL
      if (!isValidCapCutUrl(url)) {
        return await msg.reply('❌ Please provide a valid CapCut template URL!');
      }

      await msg.react('🎬');
      await msg.reply('⏳ *Downloading CapCut template...*\n\n_Please wait..._');

      const apiUrl = `https://api.nexoracle.com/downloader/capcut?apikey=free_key@maher_apis&url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.result) {
        await msg.react('⬇️');
        
        const result = response.data.result;
        const videoUrl = result.video || result.download;
        
        // Validate video URL before using
        if (!videoUrl || !isValidHttpUrl(videoUrl)) {
          await msg.react('❌');
          return await msg.reply('❌ Failed to download CapCut template!');
        }

        const caption = `
🎬 *CAPCUT TEMPLATE*

${result.title ? `📝 *Title:* ${result.title}\n` : ''}${result.author ? `👤 *Creator:* ${result.author}\n` : ''}${result.uses ? `🔥 *Uses:* ${formatNumber(result.uses)}\n` : ''}
*How to use:*
1. Open CapCut app
2. Tap "Use Template"
3. Add your photos/videos
4. Export and share!

_Downloaded by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
`.trim();

        const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });

        // Validate thumbnail URL before using
        let thumbnail = Buffer.from('');
        if (result.thumbnail && isValidHttpUrl(result.thumbnail)) {
          thumbnail = await getBuffer(result.thumbnail);
        }
        
        await msg.sendVideo(
          Buffer.from(videoBuffer.data),
          caption,
          { 
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: result.title || 'CapCut Template',
                body: 'YOUSAF-BALOCH-MD • Template Downloader',
                thumbnail: thumbnail,
                sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD'
              }
            }
          }
        );

        await msg.react('✅');
      } else {
        await msg.react('❌');
        await msg.reply('❌ Failed to download CapCut template!');
      }

    } catch (error) {
      console.error('CapCut download error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};

function isValidCapCutUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'www.capcut.com' || parsed.hostname === 'capcut.com') &&
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
