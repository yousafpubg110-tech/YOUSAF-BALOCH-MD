// Auto reply for new users
const replied = new Set();

export async function all(m, { conn }) {
    // Ignore if:
    // - Message is from bot itself
    // - Message is from group
    // - Message starts with command prefix
    // - User already got auto reply in this session
    if (m.fromMe || m.isGroup || m.text?.startsWith('.') || m.text?.startsWith('/') || replied.has(m.sender)) {
        return;
    }
    
    // Check if this is a new conversation (not replied before)
    if (m.text && m.text.length > 0) {
        replied.add(m.sender);
        
        const autoReplyText = `
╭━━━━━━━━━━━━━━━━━━━╮
│ *🤖 AUTO REPLY*
╰━━━━━━━━━━━━━━━━━━━╯

assalamu alaikum! 👋

Thank you for contacting *Yousaf Baloch MD*. This is an automated assistant.

Yousaf is currently unavailable or offline at the moment. Your message is important to us, and he will respond to you personally as soon as he returns.

If you require immediate assistance or want to explore our professional tools and features, please type *.menu* to access the command list.

━━━━━━━━━━━━━━━━━━━

🔗 *Quick Links:*
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
🎥 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
💻 GitHub: github.com/musakhanbaloch03-sad

━━━━━━━━━━━━━━━━━━━

*Best Regards,*
⚡ Powered by *YOUSAF-BALOCH-MD*
👨‍💻 Support Team
`.trim();

        // Send auto reply message
        await conn.sendMessage(m.chat, { 
            text: autoReplyText 
        });
        
        // Send voice note (optional - agar voice file hai to)
        // Uncomment this if you have a voice file
        /*
        try {
            await conn.sendMessage(m.chat, {
                audio: { url: './media/autoreply.mp3' }, // voice file path
                mimetype: 'audio/mpeg',
                ptt: true // voice message format
            });
        } catch (err) {
            console.log('Voice file not found');
        }
        */
    }
}
