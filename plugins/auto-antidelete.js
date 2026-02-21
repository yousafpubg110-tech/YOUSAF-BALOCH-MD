/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Anti Delete          ┃
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
  command: ['antidelete', 'antidel'],
  name: 'antidelete',
  category: 'Group',
  description: 'Enable/disable anti-delete in group',
  usage: '.antidelete on/off',
  cooldown: 5,
  groupOnly: true,

  handler: async ({ sock, msg, from, args, isAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can use this command!');
      }

      const setting = args[0]?.toLowerCase();

      if (!setting || !['on', 'off'].includes(setting)) {
        return await msg.reply(`Anti-Delete Settings:

*Usage:*
.antidelete on
.antidelete off

${SYSTEM.SHORT_WATERMARK}`);
      }

      // Store setting in group metadata
      if (!global.db) global.db = { data: { chats: {} } };
      if (!global.db.data.chats[from]) global.db.data.chats[from] = {};
      global.db.data.chats[from].antidelete = setting === 'on';

      await msg.reply(`Anti-Delete has been turned *${setting.toUpperCase()}* ${setting === 'on' ? '✅' : '❌'}\n\n${SYSTEM.SHORT_WATERMARK}`);
      await msg.react(setting === 'on' ? '✅' : '❌');

    } catch (error) {
      console.error('Anti-delete command error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },

  // Event listener for deleted messages
  onMessage: async ({ sock, msg, from, store }) => {
    try {
      if (msg.messageStubType !== 68 && msg.messageStubType !== 69) return;

      if (!global.db?.data?.chats?.[from]?.antidelete) return;

      const deletedKey = msg.message?.protocolMessage?.key;
      if (!deletedKey) return;

      // Load deleted message from store
      const deletedMsg = store?.messages?.[deletedKey.remoteJid]?.get(deletedKey.id);
      if (!deletedMsg) return;

      const sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
      const senderNumber = sender.split('@')[0];

      const antiDeleteMsg = `╭━━━『 *ANTI DELETE* 』━━━╮

🚫 *Deleted Message Caught!*
👤 *User:* @${senderNumber}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`;

      await sock.sendMessage(from, {
        text: antiDeleteMsg,
        mentions: [sender],
      }, { quoted: deletedMsg });

      // Forward deleted message
      await sock.copyNForward(from, deletedMsg, false);

    } catch (error) {
      console.error('Anti-delete event error:', error.message);
    }
  },
};
