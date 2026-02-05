import axios from 'axios';

export async function all(m, { conn }) {
    // Match: fb <url> or facebook <url> or .fb <url>
    const fbMatch = m.text?.match(/^[.]?(fb|facebook)\s+(https?:\/\/(?:www\.|web\.|m\.)?facebook\.com\/[\w\.\/\?\=\-]+)/i);
    
    if (fbMatch) {
        const url = fbMatch[2];
        
        await m.reply('⬇️ *Downloading Facebook video...*\n\n⏳ Please wait...');
        
        try {
            // Facebook downloader API
            const response = await axios.get(`https://api.facebookdownloader.com/api?url=${encodeURIComponent(url)}`);
            const data = response.data;
            
            if (!data || (!data.hd && !data.sd)) {
                return m.reply('❌ *Failed to download!*\n\n⚠️ Invalid Facebook URL or video unavailable.');
            }
            
            const videoUrl = data.hd || data.sd;
            const title = data.title || 'Facebook Video';
            
            const caption = `
╭━━━『 *FACEBOOK* 』━━━╮
│ 📺 *Title:* ${title}
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
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Make sure URL is correct and video is public.`);
        }
    }
}
