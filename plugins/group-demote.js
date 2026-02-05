let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply('❌ *This command is only for groups!*');
  
  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  
  if (!user) return m.reply(`❌ *Tag someone to demote!*\n\n*Example:* ${usedPrefix + command} @user`);
  
  let botAdmin = await conn.groupMetadata(m.chat).then(data => {
    return data.participants.find(v => v.id === conn.user.jid)?.admin;
  });
  
  if (!botAdmin) return m.reply('❌ *I need to be admin to demote members!*');
  
  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
  
  await m.reply(`✅ *Successfully demoted @${user.split('@')[0]}!*\n\n_© YOUSAF-BALOCH-MD | Muhammad Yousaf Baloch_`, null, { mentions: [user] });
};

handler.help = ['demote'];
handler.tags = ['group'];
handler.command = /^(demote|unadmin)$/i;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
