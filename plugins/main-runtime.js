export async function all(m) {
    if (m.text && (m.text.toLowerCase() === 'runtime' || m.text.toLowerCase() === '.runtime' || m.text.toLowerCase() === 'uptime')) {
        let uptime = process.uptime();
        let days = Math.floor(uptime / 86400);
        let hours = Math.floor((uptime % 86400) / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        let seconds = Math.floor(uptime % 60);
        
        let runtimeText = `
╭━━━『 *BOT RUNTIME* 』━━━╮
│ ⏰ *Bot is Running Since:*
│ 
│ 📅 *${days}* Days
│ ⏰ *${hours}* Hours
│ ⏲️ *${minutes}* Minutes
│ ⏱️ *${seconds}* Seconds
│ 
│ ⚡ *Total Uptime:* ${uptime.toFixed(0)} seconds
│ 
│ 🤖 *Bot:* YOUSAF-BALOCH-MD
│ 👨‍💻 *Owner:* Yousaf Baloch
╰━━━━━━━━━━━━━━━━━━━╯

> *Bot is running smoothly!* ✅
`.trim();

        await m.reply(runtimeText);
    }
}
