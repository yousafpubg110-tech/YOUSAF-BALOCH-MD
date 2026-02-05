let handler = async (m, { conn, participants, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('❌ *This command is only for groups!*');
  
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  
  if (!user) return m.reply(`❌ *Tag someone to kick!*\n\n*Example:* ${usedPrefix + command} @user`);
  
  let botAdmin = await conn.groupMetadata(m.chat).then(data => {
    return data.participants.find(v => v.id === conn.user.jid)?.admin;
  });
  
  if (!botAdmin) return m.reply('❌ *I need to be admin to kick members!*');
  
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
  
  await m.reply(`✅ *Successfully kicked @${user.split('@')[0]}!*\n\n_© YOUSAF-BALOCH-MD | Muhammad Yousaf Baloch_`, null, { mentions: [user] });
};

handler.help = ['kick'];
handler.tags = ['group'];
handler.command = /^(kick|remove)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
