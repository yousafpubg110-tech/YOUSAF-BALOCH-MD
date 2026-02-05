import axios from 'axios';

export async function all(m, { conn }) {
    // Match: tiktok <url> or .tiktok <url> or tt <url>
    const ttMatch = m.text?.match(/^[.]?(tiktok|tt)\s+(https?:\/\/(?:www\.|vm\.)?tiktok\.com\/[\w\-\/]+)/i);
    
    if (ttMatch) {
        const url = ttMatch[2];
        
        await m.reply('⬇️ *Downloading TikTok video...*\n\n⏳ Please wait...');
        
        try {
            // TikTok downloader API
            const response = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
            const data = response.data;
            
            if (!data.video || !data.video.noWatermark) {
                return m.reply('❌ *Failed to download!*\n\n⚠️ Invalid TikTok URL or video unavailable.');
            }
            
            const videoUrl = data.video.noWatermark;
            const caption = `
╭━━━『 *TIKTOK* 』━━━╮
│ 👤 *Author:* ${data.author?.name || 'Unknown'}
│ 📝 *Title:* ${data.title || 'No title'}
│ ⏱️ *Duration:* ${data.video?.duration || 'N/A'}s
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
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Make sure the URL is correct.`);
        }
    }
}
