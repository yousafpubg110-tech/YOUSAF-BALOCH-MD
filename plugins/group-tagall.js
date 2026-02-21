/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Tag All              ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, SYSTEM } from '../config.js';

export default {
  command: ['tagall', 'everyone', 'all'],
  name: 'tagall',
  category: 'Group',
  description: 'Tag all members in the group',
  usage: '.tagall [message]',
  cooldown: 10,
  groupOnly: true,
  adminOnly: true,

  handler: async ({ sock, msg, from, args, isAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can tag all members!');
      }

      await msg.react('📢');

      // Get group members
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;
      const users = participants.map(p => p.id);

      const message = args.length > 0
        ? args.join(' ')
        : `Tag All by ${OWNER.BOT_NAME}`;

      const tagMessage = `╭━━━『 *TAG ALL* 』━━━╮

📢 *Message:* ${message}
👥 *Members:* ${users.length}

${users.map(v => '➣ @' + v.split('@')[0]).join('\n')}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      // FIX: conn removed — sock directly used
      await sock.sendMessage(from, {
        text: tagMessage,
        mentions: users,
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Tag all error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
