let handler = async (m, { conn, usedPrefix }) => {
  let scriptMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃ *YOUSAF-BALOCH-MD* 💻
╰━━━━━━━━━━━━━━━━━╯

🌟 *Premium WhatsApp Bot*

📊 *Bot Features:*
├ ✅ 280+ Commands
├ 🤖 AI Integration (ChatGPT, Gemini)
├ 📥 Media Downloader (YouTube, TikTok, etc)
├ 🎨 Sticker Maker
├ 👥 Group Management
├ 🔒 Anti-Delete Messages
├ 👁️ Auto View Status
└ 🎮 Fun & Games

💻 *GitHub Repository:*
https://github.com/yourusername/YOUSAF-BALOCH-MD

╭━━━『 *FOLLOW ME* 』━━━╮
┃ 📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
┃ 🎵 TikTok: https://tiktok.com/@loser_boy.110
┃ 📢 WhatsApp: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
╰━━━━━━━━━━━━━━━━━╯

👨‍💻 *Developer:* Muhammad Yousaf Baloch
📞 *Contact:* +923710636110

_© 2026 YOUSAF-BALOCH-MD_
_All Rights Reserved_
`;

  await conn.sendMessage(m.chat, {
    image: { url: global.logo },
    caption: scriptMsg,
    footer: '© Muhammad Yousaf Baloch',
    buttons: [
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 Owner' }, type: 1 },
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '📜 Menu' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
};

handler.help = ['script', 'repo', 'sc'];
handler.tags = ['info'];
handler.command = /^(script|repo|sc|github)$/i;

export default handler;
