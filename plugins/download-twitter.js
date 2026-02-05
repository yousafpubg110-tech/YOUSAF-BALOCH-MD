import axios from 'axios';

export async function all(m, { conn }) {
    // Match: twitter <url> or x <url> or .twitter <url>
    const twitterMatch = m.text?.match(/^[.]?(twitter|x|tweet)\s+(https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/[\w]+\/status\/[\d]+)/i);
    
    if (twitterMatch) {
        const url = twitterMatch[2];
        
        await m.reply('⬇️ *Downloading Twitter/X video...*\n\n⏳ Please wait...');
        
        try {
            // Twitter downloader API
            const response = await axios.get(`https://api.twittervideodownloader.com/download?url=${encodeURIComponent(url)}`);
            const data = response.data;
            
            if (!data || !data.video || data.video.length === 0) {
                return m.reply('❌ *Failed to download!*\n\n⚠️ Invalid Twitter URL or video unavailable.');
            }
            
            const videoUrl = data.video[0].url;
            const caption = `
╭━━━『 *TWITTER/X* 』━━━╮
│ 🔗 *URL:* ${url}
╰━━━━━━━━━━━━━━━━━━━╯

🤖 *YOUSAF-BALOCH-MD*
👨‍💻 *By Yousaf Baloch*
`.trim();
            
            await conn.sendMessage(m.chat, {
                video: { url: videoUrl },
                caption: caption,
                mimetype: 'video/mp4'
            }, { quoted: m });
            
            await m.reply('✅ *Download complete!*');
            
        } catch (error) {
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Make sure the tweet contains a video.`);
        }
    }
}
