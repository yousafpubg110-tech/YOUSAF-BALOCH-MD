let handler = async (m, { conn, text, usedPrefix }) => {
  let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  
  if (!who) return m.reply(`❌ *Tag someone to ban!*\n\n*Example:* ${usedPrefix}ban @user`);
  
  let user = global.db.data.users[who];
  if (!user) return m.reply('❌ *User not found in database!*');
  
  user.banned = true;
  user.bannedReason = text.split(' ').slice(1).join(' ') || 'No reason provided';
  
  await m.reply(`✅ *Successfully banned @${who.split('@')[0]}!*\n\n📝 *Reason:* ${user.bannedReason}\n\n_© YOUSAF-BALOCH-MD_`, null, { mentions: [who] });
};

handler.help = ['ban'];
handler.tags = ['owner'];
handler.command = /^ban$/i;
handler.owner = true;

export default handler;
