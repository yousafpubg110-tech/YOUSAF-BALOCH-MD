export async function all(m, { isOwner, conn }) {
    if (m.text && (m.text.toLowerCase() === 'setpp' || m.text.toLowerCase() === '.setpp')) {
        
        if (!isOwner) {
            return m.reply('❌ *Only owner can change bot profile picture!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        let quoted = m.quoted ? m.quoted : m;
        let mime = quoted.msg?.mimetype || '';
        
        if (!/image/.test(mime)) {
            return m.reply('⚠️ *Please reply to an image!*\n\nExample: Reply to image and type *setpp*');
        }
        
        await m.reply('🔄 *Updating profile picture...*');
        
        try {
            let media = await quoted.download();
            await conn.updateProfilePicture(conn.user.jid, media);
            await m.reply('✅ *Profile picture updated successfully!*\n\n🤖 YOUSAF-BALOCH-MD');
        } catch (error) {
            await m.reply(`❌ *Failed to update profile picture!*\n\n⚠️ Error: ${error.message}`);
        }
    }
}
