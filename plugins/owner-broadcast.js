export async function all(m, { isOwner, conn }) {
    // Match: broadcast <message> or .broadcast <message>
    const bcMatch = m.text?.match(/^[.]?broadcast\s+(.+)/is);
    
    if (bcMatch) {
        if (!isOwner) {
            return m.reply('❌ *Only owner can broadcast messages!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        const message = bcMatch[1];
        
        await m.reply('📢 *Starting broadcast...*\n\n⏳ Please wait...');
        
        try {
            // Get all chats
            const chats = Object.entries(await conn.chats)
                .filter(([_, chat]) => chat.id && !chat.id.includes('newsletter'))
                .map(([id]) => id);
            
            let success = 0;
            let failed = 0;
            
            for (let chatId of chats) {
                try {
                    await conn.sendMessage(chatId, { 
                        text: `📢 *BROADCAST MESSAGE*\n\n${message}\n\n━━━━━━━━━━━━━━━\n🤖 *YOUSAF-BALOCH-MD*\n👨‍💻 *By Yousaf Baloch*` 
                    });
                    success++;
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
                } catch {
                    failed++;
                }
            }
            
            await m.reply(`✅ *Broadcast Complete!*\n\n📊 *Stats:*\n✅ Success: ${success}\n❌ Failed: ${failed}\n📝 Total: ${chats.length}`);
            
        } catch (error) {
            await m.reply(`❌ *Broadcast Failed!*\n\n⚠️ Error: ${error.message}`);
        }
    }
}
