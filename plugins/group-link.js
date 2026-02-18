/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Group Link           ┃
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
  name: 'link',
  aliases: ['grouplink', 'gclink'],
  category: 'group',
  description: 'Get group link',
  usage: '.link',
  cooldown: 3000,
  groupOnly: true,
  botAdminRequired: true,

  async execute(msg, args) {
    try {
      await msg.react('🔗');

      const code = await msg.conn.groupInviteCode(msg.from);
      const link = `https://chat.whatsapp.com/${code}`;

      await msg.reply(`
🔗 *Group Invite Link:*

${link}

_YOUSAF-BALOCH-MD_
`.trim());

      await msg.react('✅');

    } catch (error) {
      console.error('Link error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
