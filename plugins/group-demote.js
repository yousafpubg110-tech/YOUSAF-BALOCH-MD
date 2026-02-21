/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Group Demote         ┃
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
  command: ['demote', 'unadmin'],
  name: 'demote',
  category: 'Group',
  description: 'Demote admin to member',
  usage: '.demote @user',
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
        return await msg.reply('❌ Bot must be admin to demote members!');
      }

      // Get target user — mention or quoted message
      let targetJid = null;

      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;
      } else if (args[0]) {
        const clean = args[0].replace(/[^0-9]/g, '');
        if (clean.length >= 10) targetJid = clean + '@s.whatsapp.net';
      }

      if (!targetJid) {
        return await msg.reply(`❌ Please tag someone to demote!

*Example:*
.demote @user
.demote 923001234567

${SYSTEM.SHORT_WATERMARK}`);
      }

      const targetNumber = targetJid.split('@')[0];

      await sock.groupParticipantsUpdate(from, [targetJid], 'demote');

      await sock.sendMessage(from, {
        text: `✅ Successfully demoted @${targetNumber}!\n\n${SYSTEM.SHORT_WATERMARK}`,
        mentions: [targetJid],
      }, { quoted: msg });

      await msg.react('✅');

    } catch (error) {
      console.error('Group demote error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },
};
