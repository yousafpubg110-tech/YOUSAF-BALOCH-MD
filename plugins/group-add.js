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

import { SYSTEM } from '../config.js';

export default {
  command: ['add', 'invite'],
  name: 'add',
  category: 'Group',
  description: 'Add user to group',
  usage: '.add 923xxxxxxxxx',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,
  botAdminRequired: true,

  handler: async ({ sock, msg, from, args, isAdmin, isBotAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can use this command!');
      }

      if (!isBotAdmin) {
        return await msg.reply('❌ Bot must be admin to add members!');
      }

      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please provide a phone number!

*Example:*
.add 923xxxxxxxxx
.add 923001234567

*Note:* Include country code without +

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⏳');

      // Clean number — remove all non-digits
      const cleanNumber = args[0].replace(/[^0-9]/g, '');

      if (cleanNumber.length < 10) {
        await msg.react('❌');
        return await msg.reply('❌ Invalid phone number! Please include country code.\n\nExample: 923001234567');
      }

      const jid = cleanNumber + '@s.whatsapp.net';

      const response = await sock.groupParticipantsUpdate(from, [jid], 'add');

      if (!response || response.length === 0) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to add user!');
      }

      const status = response[0]?.status;

      if (status === '200') {
        await msg.reply(`✅ Successfully added *+${cleanNumber}* to the group!\n\n${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');
      } else if (status === '403') {
        await msg.react('❌');
        await msg.reply('❌ Unable to add! User privacy settings prevent adding to groups.');
      } else if (status === '408') {
        await msg.react('❌');
        await msg.reply('❌ User recently left the group. Please wait before re-adding.');
      } else if (status === '409') {
        await msg.react('❌');
        await msg.reply('❌ User is already in the group!');
      } else {
        await msg.react('❌');
        await msg.reply(`❌ Failed to add user! Status: ${status}`);
      }

    } catch (error) {
      console.error('Group add error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
