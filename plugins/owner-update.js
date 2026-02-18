import { execSync } from 'child_process';

export async function all(m, { isOwner }) {
    if (m.text && (m.text.toLowerCase() === 'update' || m.text.toLowerCase() === '.update')) {
        
        if (!isOwner) {
            return m.reply('\u274C *Only owner can update the bot!*\n\n\u{1F464} Owner: Yousaf Baloch\n\u{1F4F1} +92 371 063 6110');
        }
        
        await m.reply('\u{1F504} *Checking for updates...*\n\n\u23F3 Please wait...');
        
        try {
            // Git pull latest changes
            const stdout = execSync('git pull').toString();
            
            if (stdout.includes('Already up to date')) {
                await m.reply('\u2705 *Bot is already up to date!*\n\n\u{1F916} YOUSAF-BALOCH-MD v2.0.0\n\u{1F468}\u200D\u{1F4BB} By Yousaf Baloch');
            } else {
                await m.reply(`\u2705 *Update Successful!*\n\n\`\`\`${stdout}\`\`\`\n\n\u{1F4A1} Use *.restart* to apply changes.\n\n\u{1F916} YOUSAF-BALOCH-MD`);
            }
            
        } catch (error) {
            await m.reply(`\u274C *Update Failed!*\n\n\u26A0\uFE0F *Error:*\n\`\`\`${error.message}\`\`\`\n\n\u{1F916} YOUSAF-BALOCH-MD`);
        }
    }
}
