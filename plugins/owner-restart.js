export async function all(m, { isOwner }) {
    if (m.text && (m.text.toLowerCase() === 'restart' || m.text.toLowerCase() === '.restart')) {
        
        // Check if user is owner
        if (!isOwner) {
            return m.reply('❌ *Only owner can restart the bot!*\n\n👤 Owner: Yousaf Baloch\n📱 +92 371 063 6110');
        }
        
        await m.reply('🔄 *Restarting YOUSAF-BALOCH-MD...*\n\n⏳ Please wait 10 seconds...\n\n💡 Bot will be back online shortly!');
        
        // Restart process
        setTimeout(() => {
            process.exit(1);
        }, 2000);
    }
}
