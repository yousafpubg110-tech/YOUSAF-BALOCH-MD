export async function all(m, { isOwner, conn }) {
    // Match: join <link> or .join <link>
    const joinMatch = m.text?.match(/^[.]?join\s+(https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+)/i);
    
    if (joinMatch) {
        if (!isOwner) {
            return m.reply('❌ *Only owner can add bot to groups!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        const inviteCode = joinMatch[1].split('/').pop();
        
        await m.reply('🔄 *Joining group...*\n\n⏳ Please wait...');
        
        try {
            const response = await conn.groupAcceptInvite(inviteCode);
            
            await m.reply(`✅ *Successfully joined the group!*\n\n🆔 Group ID: ${response}\n\n🤖 YOUSAF-BALOCH-MD`);
            
        } catch (error) {
            if (error.message.includes('already')) {
                await m.reply('⚠️ *Bot is already in this group!*');
            } else {
                await m.reply(`❌ *Failed to join group!*\n\n⚠️ Error: ${error.message}`);
            }
        }
    }
}
