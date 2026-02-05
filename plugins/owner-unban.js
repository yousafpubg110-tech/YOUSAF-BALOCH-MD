let handler = async (m, { conn, text, usedPrefix }) => {
  let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  
  if (!who) return m.reply(`❌ *Tag someone to unban!*\n\n*Example:* ${usedPrefix}unban @user`);
  
  let user = global.db.data.users[who];
  if (!user) return m.reply('❌ *User not found in database!*');
  
  if (!user.banned) return m.reply('❌ *This user is not banned!*');
  
  user.banned = false;
  user.bannedReason = '';
  
  await m.reply(`✅ *Successfully unbanned @${who.split('@')[0]}!*\n\n_© YOUSAF-BALOCH-MD_`, null, { mentions: [who] });
};

handler.help = ['unban'];
handler.tags = ['owner'];
handler.command = /^unban$/i;
handler.owner = true;

export default handler;
