export async function all(m, { isOwner, conn }) {
    // Match: unblock @user or .unblock @user
    if (m.text && (m.text.toLowerCase().startsWith('unblock') || m.text.toLowerCase().startsWith('.unblock'))) {
        
        if (!isOwner) {
            return m.reply('❌ *Only owner can unblock users!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        let user = m.mentionedJid?.[0] || m.quoted?.sender;
        
        if (!user) {
            return m.reply('⚠️ *Please mention or reply to a user to unblock!*\n\nExample: *unblock @user*');
        }
        
        try {
            await conn.updateBlockStatus(user, 'unblock');
            await m.reply(`✅ *User unblocked successfully!*\n\n✅ User: @${user.split('@')[0]}\n🤖 YOUSAF-BALOCH-MD`, { mentions: [user] });
        } catch (error) {
            await m.reply(`❌ *Failed to unblock user!*\n\n⚠️ Error: ${error.message}`);
        }
    }
}
