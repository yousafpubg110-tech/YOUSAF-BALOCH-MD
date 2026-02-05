import { execSync } from 'child_process';

export async function all(m, { isOwner }) {
    if (m.text && (m.text.toLowerCase() === 'update' || m.text.toLowerCase() === '.update')) {
        
        if (!isOwner) {
            return m.reply('❌ *Only owner can update the bot!*\n\n👤 Owner: Yousaf Baloch\n📱 +92 371 063 6110');
        }
        
        await m.reply('🔄 *Checking for updates...*\n\n⏳ Please wait...');
        
        try {
            // Git pull latest changes
            const stdout = execSync('git pull').toString();
            
            if (stdout.includes('Already up to date')) {
                await m.reply('✅ *Bot is already up to date!*\n\n🤖 YOUSAF-BALOCH-MD v2.0.0\n👨‍💻 By Yousaf Baloch');
            } else {
                await m.reply(`✅ *Update Successful!*\n\n\`\`\`${stdout}\`\`\`\n\n💡 Use *.restart* to apply changes.\n\n🤖 YOUSAF-BALOCH-MD`);
            }
            
        } catch (error) {
            await m.reply(`❌ *Update Failed!*\n\n⚠️ *Error:*\n\`\`\`${error.message}\`\`\`\n\n🤖 YOUSAF-BALOCH-MD`);
        }
