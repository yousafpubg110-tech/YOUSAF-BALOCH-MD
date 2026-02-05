export async function all(m) {
    if (m.text && (m.text.toLowerCase() === 'support' || m.text.toLowerCase() === '.support' || m.text.toLowerCase() === 'help')) {
        let supportText = `
╭━━━『 *SUPPORT & HELP* 』━━━╮
│ 💬 *WhatsApp Channel:*
│ https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
│ 
│ 🆘 *Need Help?*
│ Join our official channel for:
│ ✅ Bot setup assistance
│ ✅ Bug reports & issues
│ ✅ Feature requests
│ ✅ Updates & announcements
│ ✅ Tips & tricks
│ 
│ 📱 *Contact Owner:*
│ Type: *owner* or *.owner*
│ Number: +92 371 063 6110
│ 
│ 🎥 *YouTube Channel:*
│ https://www.youtube.com/@Yousaf_Baloch_Tech
│ Subscribe for tutorials & updates!
│ 
│ 🌐 *GitHub Repository:*
│ github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
╰━━━━━━━━━━━━━━━━━━━╯

> *We're here to help 24/7!* 💪
`.trim();

        await m.reply(supportText);
    }
}
