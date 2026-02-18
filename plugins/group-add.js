/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Group Add            ┃
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
  name: 'add',
  aliases: ['invite'],
  category: 'group',
  description: 'Add user to group',
  usage: '.add 923xxxxxxxxx',
  cooldown: 3000,
  groupOnly: true,
  adminOnly: true,
  botAdminRequired: true,

  async execute(msg, args) {
    try {
      if (!args[0]) {
        return await msg.reply('❌ Please provide a phone number!\n\nExample:\n.add 923xxxxxxxxx');
      }

      await msg.react('⏳');

      let number = args[0].replace(/[^0-9]/g, '');
      if (!number.includes('@s.whatsapp.net')) {
        number = number + '@s.whatsapp.net';
      }

      const response = await msg.conn.groupParticipantsUpdate(msg.from, [number], 'add');

      if (response[0].status === '200') {
        await msg.reply('✅ Successfully added user to group!');
        await msg.react('✅');
      } else if (response[0].status === '403') {
        await msg.reply('❌ Unable to add! User privacy settings prevent adding.');
      } else if (response[0].status === '408') {
        await msg.reply('❌ User recently left the group. Wait before re-adding.');
      } else {
        await msg.reply('❌ Failed to add user!');
      }

    } catch (error) {
      console.error('Add error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
