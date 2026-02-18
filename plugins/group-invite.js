/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Group Invite         ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

export default {
  name: 'invite',
  aliases: ['grouplink'],
  category: 'group',
  description: 'Get group invite link',
  usage: '.invite',
  cooldown: 3000,
  groupOnly: true,
  botAdminRequired: true,

  async execute(msg, args) {
    try {
      await msg.react('🔗');

      const code = await msg.conn.groupInviteCode(msg.from);
      const link = `https://chat.whatsapp.com/${code}`;

      const groupMetadata = await msg.conn.groupMetadata(msg.from);

      await msg.reply(`
╭━━━『 *GROUP INVITE LINK* 』━━━╮

📱 *Group:* ${groupMetadata.subject}
👥 *Members:* ${groupMetadata.participants.length}

🔗 *Invite Link:*
${link}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
`.trim());

      await msg.react('✅');

    } catch (error) {
      console.error('Invite error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
