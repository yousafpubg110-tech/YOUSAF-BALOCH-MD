import ytdl from 'ytdl-core';

export async function all(m, { conn }) {
    // Match: ytmp4 <url> or .ytmp4 <url>
    const mp4Match = m.text?.match(/^[.]?ytmp4\s+(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/i);
    
    if (mp4Match) {
        const url = mp4Match[1];
        
        await m.reply('⬇️ *Downloading video...*\n\n⏳ Please wait... (This may take a while)');
        
        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            
            const videoStream = ytdl(url, {
                quality: 'highest',
                filter: format => format.container === 'mp4'
            });
            
            const chunks = [];
            videoStream.on('data', (chunk) => chunks.push(chunk));
            videoStream.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                
                // Check file size (WhatsApp limit ~100MB)
                if (buffer.length > 100 * 1024 * 1024) {
                    return m.reply('❌ *File too large!*\n\n⚠️ Video exceeds 100MB limit.\n💡 Try downloading audio instead with *.ytmp3*');
                }
                
                await conn.sendMessage(m.chat, {
                    video: buffer,
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`,
                    caption: `🎬 *${title}*\n\n🤖 YOUSAF-BALOCH-MD\n👨‍💻 By Yousaf Baloch`
                }, { quoted: m });
                
                await m.reply('✅ *Download complete!*');
            });
            
            videoStream.on('error', (error) => {
                throw error;
            });
            
        } catch (error) {
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Try: *.yt <search query>*`);
        }
    }
}
