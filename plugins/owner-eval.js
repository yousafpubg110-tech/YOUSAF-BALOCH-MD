import util from 'util';

export async function all(m, { isOwner }) {
    // Match "> code" or ".eval code" or "eval code"
    const evalMatch = m.text?.match(/^[>.]\s*eval\s+(.+)/is) || m.text?.match(/^>\s+(.+)/is);
    
    if (evalMatch) {
        if (!isOwner) {
            return m.reply('❌ *Only owner can execute code!*\n\n👤 Owner: Yousaf Baloch\n📱 +92 371 063 6110');
        }
        
        const code = evalMatch[1];
        
        try {
            let result = await eval(`(async () => { ${code} })()`);
            
            if (typeof result !== 'string') {
                result = util.inspect(result);
            }
            
            await m.reply(`✅ *Code Executed Successfully*\n\n📤 *Result:*\n\`\`\`${result}\`\`\`\n\n🤖 YOUSAF-BALOCH-MD`);
        } catch (error) {
            await m.reply(`❌ *Execution Error*\n\n⚠️ *Error:*\n\`\`\`${error.message}\`\`\`\n\n🤖 YOUSAF-BALOCH-MD`);
        }
    }
}
