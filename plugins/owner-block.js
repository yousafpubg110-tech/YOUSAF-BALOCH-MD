export async function all(m, { isOwner, conn }) {
    // Match: block @user or .block @user
    if (m.text && (m.text.toLowerCase().startsWith('block') || m.text.toLowerCase().startsWith('.block'))) {
        
        if (!isOwner) {
            return m.reply('❌ *Only owner can block users!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        let user = m.mentionedJid?.[0] || m.quoted?.sender;
        
        if (!user) {
            return m.reply('⚠️ *Please mention or reply to a user to block!*\n\nExample: *block @user*');
        }
        
        try {
            await conn.updateBlockStatus(user, 'block');
            await m.reply(`✅ *User blocked successfully!*\n\n🚫 User: @${user.split('@')[0]}\n🤖 YOUSAF-BALOCH-MD`, { mentions: [user] });
        } catch (error) {
            await m.reply(`❌ *Failed to block user!*\n\n⚠️ Error: ${error.message}`);
        }
    }
}
