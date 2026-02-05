let handler = async (m, { conn, usedPrefix }) => {
  let ownerNumber = '923710636110'; // آپ کا نمبر
  
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:Muhammad Yousaf Baloch
ORG:YOUSAF-BALOCH-MD Developer
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`;

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: 'Muhammad Yousaf Baloch',
      contacts: [{ vcard }]
    }
  }, { quoted: m });

  let ownerMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃   *OWNER INFO* 👑
╰━━━━━━━━━━━━━━━━━╯

👤 *Name:* Muhammad Yousaf Baloch
📞 *Number:* +923710636110
💻 *Bot:* YOUSAF-BALOCH-MD
🌐 *Status:* Active Developer

📱 *Contact saved above!*

╭━━━『 *FOLLOW ME* 』━━━╮
┃ 📺 *YouTube:* ${global.socialLinks.youtube}
┃ 📢 *WhatsApp Channel:* ${global.socialLinks.whatsappChannel}
┃ 🎵 *TikTok:* ${global.socialLinks.tiktok}
┃ 💻 *GitHub:* ${global.socialLinks.github}
╰━━━━━━━━━━━━━━━━━╯

_For bot issues or support, contact owner_
_© 2026 YOUSAF-BALOCH-MD_
`;

  await conn.sendMessage(m.chat, { text: ownerMsg }, { quoted: m });
};

handler.help = ['owner', 'creator', 'developer'];
handler.tags = ['main'];
handler.command = /^(owner|creator|developer)$/i;

export default handler;
