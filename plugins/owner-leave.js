export async function all(m, { isOwner, conn }) {
    if (m.text && (m.text.toLowerCase() === 'leave' || m.text.toLowerCase() === '.leave')) {
        
        if (!isOwner) {
            return m.reply('❌ *Only owner can remove bot from groups!*\n\n👤 Owner: Yousaf Baloch');
        }
        
        if (!m.isGroup) {
            return m.reply('⚠️ *This command only works in groups!*');
        }
        
        await m.reply('👋 *Goodbye!*\n\n🤖 YOUSAF-BALOCH-MD is leaving...\n👨‍💻 By Yousaf Baloch');
        
        setTimeout(async () => {
            await conn.groupLeave(m.chat);
        }, 2000);
    }
}
