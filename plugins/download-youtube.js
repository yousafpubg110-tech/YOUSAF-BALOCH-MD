import yts from 'yt-search';
import ytdl from 'ytdl-core';

export async function all(m, { conn }) {
    // Match: yt <search> or .yt <search> or youtube <search>
    const ytMatch = m.text?.match(/^[.]?(yt|youtube)\s+(.+)/i);
    
    if (ytMatch) {
        const query = ytMatch[2];
        
        await m.reply('🔍 *Searching YouTube...*\n\n⏳ Please wait...');
        
        try {
            // Search YouTube
            const search = await yts(query);
            const video = search.videos[0];
            
            if (!video) {
                return m.reply('❌ *No results found!*');
            }
            
            const infoText = `
╭━━━『 *YOUTUBE* 』━━━╮
│ 📺 *Title:* ${video.title}
│ ⏱️ *Duration:* ${video.timestamp}
│ 👁️ *Views:* ${video.views.toLocaleString()}
│ 📅 *Uploaded:* ${video.ago}
│ 📢 *Channel:* ${video.author.name}
│ 🔗 *Link:* ${video.url}
╰━━━━━━━━━━━━━━━━━━━╯

🎵 Reply with:
*1* for Audio (MP3)
*2* for Video (MP4)

⏳ Download will start automatically in 60 seconds...
`.trim();

            await conn.sendMessage(m.chat, {
                image: { url: video.thumbnail },
                caption: infoText
            }, { quoted: m });
            
            // Auto download after 60 seconds
            setTimeout(async () => {
                try {
                    await m.reply('⬇️ *Downloading audio...*\n\n⏳ Please wait...');
                    
                    const audioStream = ytdl(video.url, { 
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
                            fileName: `${video.title}.mp3`
                        }, { quoted: m });
                        
                        await m.reply('✅ *Download complete!*\n\n🤖 YOUSAF-BALOCH-MD');
                    });
                    
                } catch (error) {
                    await m.reply(`❌ *Download failed!*\n\n⚠️ Error: ${error.message}`);
                }
            }, 60000);
            
        } catch (error) {
            await m.reply(`❌ *Search failed!*\n\n⚠️ Error: ${error.message}`);
        }
    }
}
