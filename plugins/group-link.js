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

import { SYSTEM } from '../config.js';

export default {
  command: ['link', 'grouplink', 'gclink'],
  name: 'link',
  category: 'Group',
  description: 'Get group invite link',
  usage: '.link',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,
  botAdminRequired: true,

  handler: async ({ sock, msg, from, isAdmin, isBotAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can get the group link!');
      }

      if (!isBotAdmin) {
        return await msg.reply('❌ Bot must be admin to get group link!');
      }

      await msg.react('🔗');

      // FIX: msg.conn removed — sock directly used
      const code = await sock.groupInviteCode(from);
      const link = `https://chat.whatsapp.com/${code}`;

      const groupMetadata = await sock.groupMetadata(from);

      await msg.reply(`╭━━━『 *GROUP LINK* 』━━━╮

📱 *Group:* ${groupMetadata.subject}
👥 *Members:* ${groupMetadata.participants.length}

🔗 *Invite Link:*
${link}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('✅');

    } catch (error) {
      console.error('Group link error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
