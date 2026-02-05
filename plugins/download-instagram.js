import axios from 'axios';

export async function all(m, { conn }) {
    // Match: ig <url> or instagram <url> or .ig <url>
    const igMatch = m.text?.match(/^[.]?(ig|instagram|insta)\s+(https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[\w-]+)/i);
    
    if (igMatch) {
        const url = igMatch[2];
        
        await m.reply('⬇️ *Downloading Instagram media...*\n\n⏳ Please wait...');
        
        try {
            // Simple Instagram API
            const response = await axios.get(`https://api.saveig.app/api/download?url=${encodeURIComponent(url)}`);
            const data = response.data;
            
            if (!data || !data.url) {
                return m.reply('❌ *Failed to download!*\n\n⚠️ Invalid Instagram URL or media unavailable.');
            }
            
            const mediaUrl = data.url;
            const mediaType = data.type || 'image';
            
            const caption = `
╭━━━『 *INSTAGRAM* 』━━━╮
│ 🔗 *URL:* ${url}
╰━━━━━━━━━━━━━━━━━━━╯

🤖 *YOUSAF-BALOCH-MD*
👨‍💻 *By Yousaf Baloch*
`.trim();
            
            if (mediaType === 'video' || url.includes('/reel/')) {
                await conn.sendMessage(m.chat, {
                    video: { url: mediaUrl },
                    caption: caption,
                    mimetype: 'video/mp4'
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    image: { url: mediaUrl },
                    caption: caption
                }, { quoted: m });
            }
            
            await m.reply('✅ *Download complete!*');
            
        } catch (error) {
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Make sure URL is correct and account is public.`);
        }
    }
}
