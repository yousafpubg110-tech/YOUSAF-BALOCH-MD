export async function all(m) {
    if (m.text && (m.text.toLowerCase() === 'owner' || m.text.toLowerCase() === '.owner')) {
        let ownerText = `
╭━━━『 *OWNER INFO* 』━━━╮
│ 👤 *Name:* Yousaf Baloch
│ 📱 *Number:* +92 371 063 6110
│ 🌐 *GitHub:* github.com/musakhanbaloch03-sad
│ 📺 *YouTube:* Yousaf Baloch Tech
│ 💼 *Role:* Developer & Creator
│ 🤖 *Bot:* YOUSAF-BALOCH-MD
╰━━━━━━━━━━━━━━━━━━━╯

🔗 *Links:*
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
🎥 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech

> *Contact owner for bot support!* ✨
`.trim();

        await m.reply(ownerText);
        
        // Owner ka contact card bhejo
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + 'FN:Yousaf Baloch\n'
            + 'ORG:YOUSAF-BALOCH-MD;\n'
            + 'TEL;type=CELL;type=VOICE;waid=923710636110:+92 371 063 6110\n'
            + 'X-WA-BIZ-NAME:Yousaf Baloch Tech\n'
            + 'END:VCARD';
        
        await m.reply({ 
            contacts: { 
                displayName: 'Yousaf Baloch', 
                contacts: [{ vcard }] 
            }
        });
    }
}
