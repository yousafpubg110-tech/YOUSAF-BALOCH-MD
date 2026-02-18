/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Group Settings       ┃
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
  name: 'settings',
  aliases: ['groupsettings', 'gsettings'],
  category: 'group',
  description: 'Change group settings',
  usage: '.settings <open/close>',
  cooldown: 3000,
  groupOnly: true,
  adminOnly: true,
  botAdminRequired: true,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply(`
❌ Please specify setting!

*Usage:*
.settings open - Allow all to send
.settings close - Only admins can send
`.trim());
      }

      await msg.react('⏳');

      const action = args[0].toLowerCase();

      if (action === 'open') {
        await msg.conn.groupSettingUpdate(msg.from, 'not_announcement');
        await msg.reply('✅ Group opened! All members can send messages.');
        await msg.react('✅');
      } else if (action === 'close') {
        await msg.conn.groupSettingUpdate(msg.from, 'announcement');
        await msg.reply('✅ Group closed! Only admins can send messages.');
        await msg.react('✅');
      } else {
        await msg.reply('❌ Invalid option! Use: open or close');
      }

    } catch (error) {
      console.error('Settings error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
