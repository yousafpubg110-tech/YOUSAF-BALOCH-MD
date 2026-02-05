import ytdl from 'ytdl-core';

export async function all(m, { conn }) {
    // Match: ytmp3 <url> or .ytmp3 <url>
    const mp3Match = m.text?.match(/^[.]?ytmp3\s+(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/i);
    
    if (mp3Match) {
        const url = mp3Match[1];
        
        await m.reply('⬇️ *Downloading audio...*\n\n⏳ Please wait...');
        
        try {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            
            const audioStream = ytdl(url, {
                quality: 'highestaudio',
                filter: 'audioonly'
            });
            
            const chunks = [];
            audioStream.on('data', (chunk) => chunks.push(chunk));
            audioStream.on('end', async () => {
                const buffer = Buffer.concat(chunks);
                
                await conn.sendMessage(m.chat, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    contextInfo: {
                        externalAdReply: {
                            title: title,
                            body: 'YOUSAF-BALOCH-MD',
                            thumbnailUrl: info.videoDetails.thumbnails[0].url,
                            sourceUrl: url,
                            mediaType: 2,
                            mediaUrl: url
                        }
                    }
                }, { quoted: m });
                
                await m.reply('✅ *Download complete!*\n\n🤖 YOUSAF-BALOCH-MD');
            });
            
            audioStream.on('error', (error) => {
                throw error;
            });
            
        } catch (error) {
            await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}\n\n💡 Try: *.yt <search query>*`);
        }
    }
}
