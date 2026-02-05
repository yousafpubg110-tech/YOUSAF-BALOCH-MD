import os from 'os';

export async function all(m) {
    if (m.text && (m.text.toLowerCase() === 'info' || m.text.toLowerCase() === '.info' || m.text.toLowerCase() === 'botinfo')) {
        let uptime = process.uptime();
        let hours = Math.floor(uptime / 3600);
        let minutes = Math.floor((uptime % 3600) / 60);
        let seconds = Math.floor(uptime % 60);
        
        let totalMem = os.totalmem();
        let freeMem = os.freemem();
        
        let infoText = `
╭━━━『 *BOT INFORMATION* 』━━━╮
│ 🤖 *Bot Name:* YOUSAF-BALOCH-MD
│ ⚡ *Version:* 2.0.0
│ 👨‍💻 *Developer:* Yousaf Baloch
│ 📅 *Created:* February 2026
│ 🌐 *Platform:* WhatsApp Multi-Device
│ 
│ 📊 *System Info:*
│ 💾 *RAM Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
│ 💻 *Total RAM:* ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB
│ 🆓 *Free RAM:* ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB
│ ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
│ 🖥️ *OS:* ${os.platform()}
│ 📦 *Node.js:* ${process.version}
│ 
│ 🔗 *Links:*
│ 📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
│ 🎥 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
│ 💻 GitHub: github.com/musakhanbaloch03-sad
╰━━━━━━━━━━━━━━━━━━━╯

> *The Most Powerful WhatsApp Bot by Yousaf Baloch!* 🚀
`.trim();

        await m.reply(infoText);
    }
}
