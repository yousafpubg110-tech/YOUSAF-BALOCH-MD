/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      PAIRING CODE COMMAND              ┃
┃      Created by: Muhammad Yousaf Baloch ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

let handler = async (m, { conn, usedPrefix, command }) => {
    
    // Check if pairing is enabled
    if (!global.pairingEnabled) {
        return conn.reply(m.chat, '❌ Pairing code feature is currently disabled.', m);
    }
    
    let pairingText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  🆓 *FREE PAIRING CODE*
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

🔗 *Get Your Code Here:*
${global.pairingUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━

📝 *How to Use:*

*Step 1:* Click the link above 👆
   
*Step 2:* Enter your WhatsApp number
   • Include country code
   • Example: 923710636110
   
*Step 3:* Click "Get Pairing Code"
   • You'll receive 8-digit code
   • Example: ABCD-EFGH
   
*Step 4:* Open WhatsApp on your phone
   • Go to Settings ⚙️
   • Tap "Linked Devices" 📱
   • Tap "Link a Device" ➕
   • Choose "Link with phone number"
   
*Step 5:* Enter the pairing code
   • Input the 8-digit code
   • Wait for connection ✅

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *Why Use Pairing Code?*

✅ No QR code scan needed
✅ Works from any device
✅ Instant code generation
✅ Completely secure
✅ No data stored on server
✅ Easy to use

⏱️ *Note:* Code expires in 60 seconds
🔄 *Tip:* You can request new code anytime

━━━━━━━━━━━━━━━━━━━━━━━━━

💬 *Need Help?*
Contact Owner: wa.me/${global.numberowner}

━━━━━━━━━━━━━━━━━━━━━━━━━
_Powered by ${global.botName} v${global.botVersion}_
_Created with ❤️ by ${global.author}_
    `;
    
    // Send message with external link preview
    await conn.sendMessage(m.chat, {
        text: pairingText,
        contextInfo: {
            externalAdReply: {
                title: '🔗 GET FREE PAIRING CODE',
                body: 'Click to open pairing website →',
                thumbnailUrl: 'https://telegra.ph/file/2b4a4a84f8cc6e01be97a.jpg',
                sourceUrl: global.pairingUrl,
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        }
    }, { quoted: m });
    
    // Optional: Log usage
    console.log(`[PAIRING] ${m.sender.split('@')[0]} requested pairing code`);
}

// Command configuration
handler.help = ['pairing', 'pair', 'code', 'getcode'];
handler.tags = ['main'];
handler.command = /^(pairing|pair|code|getcode|pairingcode)$/i;
handler.limit = false;
handler.group = false;
handler.private = false;

export default handler;
