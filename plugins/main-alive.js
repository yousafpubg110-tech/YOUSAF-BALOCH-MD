import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  let name = await conn.getName(m.sender);
  let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.imgur.com/whjlJSf.jpg');
  
  let uptime = process.uptime();
  let hours = Math.floor(uptime / 3600);
  let minutes = Math.floor((uptime % 3600) / 60);
  let seconds = Math.floor(uptime % 60);
  
  let aliveMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃ *YOUSAF-BALOCH-MD* ✅
╰━━━━━━━━━━━━━━━━━╯

👋 *Hello ${name}!*

✅ *Bot is Active & Running*

📊 *Bot Statistics:*
├ ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
├ 👑 *Owner:* Muhammad Yousaf Baloch
├ 📞 *Contact:* +923710636110
├ ✨ *Version:* 1.0.0
└ 🌐 *Prefix:* ${usedPrefix}

🚀 *Type ${usedPrefix}menu for commands*

╭━━━『 *FOLLOW ME* 』━━━╮
┃ 📺 *YouTube:* ${global.socialLinks.youtube}
┃ 📢 *WhatsApp Channel:* ${global.socialLinks.whatsappChannel}
╰━━━━━━━━━━━━━━━━━╯

_© 2026 YOUSAF-BALOCH-MD_
_Developed by Muhammad Yousaf Baloch_
`;

  await conn.sendMessage(m.chat, {
    image: { url: global.thumb },
    caption: aliveMsg,
    footer: '© Muhammad Yousaf Baloch',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 Menu' }, type: 1 },
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 Owner' }, type: 1 },
      { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '⚡ Ping' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
};

handler.help = ['alive', 'active', 'status'];
handler.tags = ['main'];
handler.command = /^(alive|active|status|bot)$/i;

export default handler;
