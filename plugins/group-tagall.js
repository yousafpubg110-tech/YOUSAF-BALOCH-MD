let handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('❌ *This command is only for groups!*');
  if (!isAdmin && !isOwner) return m.reply('❌ *Only admins can use this command!*');
  
  let users = participants.map(u => u.id);
  let message = text ? text : 'Tag All by YOUSAF-BALOCH-MD';
  
  let tagMessage = `
╭━━━━━━━━━━━━━━━━━╮
┃   *TAG ALL* 📢
╰━━━━━━━━━━━━━━━━━╯

📝 *Message:* ${message}

👥 *Tagged Members:*
${users.map(v => '┃ ➣ @' + v.replace(/@.+/, '')).join('\n')}

_© YOUSAF-BALOCH-MD | Muhammad Yousaf Baloch_
`;

  await conn.sendMessage(m.chat, { 
    text: tagMessage, 
    mentions: users 
  }, { quoted: m });
};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = /^(tagall|everyone|all)$/i;
handler.admin = true;
handler.group = true;

export default handler;
