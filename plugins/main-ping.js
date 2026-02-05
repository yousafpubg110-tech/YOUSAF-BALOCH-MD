let handler = async (m, { conn }) => {
  let start = Date.now();
  let msg = await conn.sendMessage(m.chat, { text: '⏳ *Testing Speed...*' }, { quoted: m });
  let end = Date.now();
  let speed = end - start;
  
  let pingMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃   *SPEED TEST* ⚡
╰━━━━━━━━━━━━━━━━━╯

📊 *Response Time:* ${speed}ms

${speed < 100 ? '🟢 *Excellent Speed!*' : speed < 300 ? '🟡 *Good Speed!*' : '🔴 *Slow Connection!*'}

╭━━━『 *FOLLOW ME* 』━━━╮
┃ 📺 *YouTube:* ${global.socialLinks.youtube}
┃ 📢 *WhatsApp:* ${global.socialLinks.whatsappChannel}
╰━━━━━━━━━━━━━━━━━╯

_YOUSAF-BALOCH-MD_
_© Muhammad Yousaf Baloch_
`;

  await conn.sendMessage(m.chat, { 
    text: pingMsg,
    edit: msg.key 
  });
};

handler.help = ['ping', 'speed'];
handler.tags = ['main'];
handler.command = /^(ping|speed)$/i;

export default handler;
