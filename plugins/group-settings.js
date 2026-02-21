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

import { SYSTEM } from '../config.js';

export default {
  command: ['settings', 'groupsettings', 'gsettings', 'open', 'close'],
  name: 'settings',
  category: 'Group',
  description: 'Change group settings',
  usage: '.settings open/close',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,
  botAdminRequired: true,

  handler: async ({ sock, msg, from, args, isAdmin, isBotAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can change group settings!');
      }

      if (!isBotAdmin) {
        return await msg.reply('❌ Bot must be admin to change group settings!');
      }

      if (!args || args.length === 0) {
        return await msg.reply(`❌ Please specify a setting!

*Usage:*
.settings open — Allow all members to send messages
.settings close — Only admins can send messages

${SYSTEM.SHORT_WATERMARK}`);
      }

      await msg.react('⏳');

      const action = args[0].toLowerCase();

      if (action === 'open') {
        // FIX: msg.conn removed — sock directly used
        await sock.groupSettingUpdate(from, 'not_announcement');
        await msg.reply(`✅ Group is now *OPEN!*\n\nAll members can send messages.\n\n${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');

      } else if (action === 'close') {
        await sock.groupSettingUpdate(from, 'announcement');
        await msg.reply(`✅ Group is now *CLOSED!*\n\nOnly admins can send messages.\n\n${SYSTEM.SHORT_WATERMARK}`);
        await msg.react('✅');

      } else {
        await msg.react('❌');
        await msg.reply(`❌ Invalid option! Use *open* or *close*\n\n${SYSTEM.SHORT_WATERMARK}`);
      }

    } catch (error) {
      console.error('Group settings error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
