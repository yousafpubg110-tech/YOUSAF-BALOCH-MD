/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Auto Status View     ┃
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
  command: ['autostatus', 'autoview'],
  name: 'autostatus',
  category: 'Owner',
  description: 'Enable/disable auto status view',
  usage: '.autostatus on/off',
  cooldown: 5,
  ownerOnly: true,

  handler: async ({ msg, args }) => {
    try {
      const setting = args[0]?.toLowerCase();

      if (!setting || !['on', 'off'].includes(setting)) {
        return await msg.reply(`Auto Status View Settings:

*Usage:*
.autostatus on
.autostatus off

${SYSTEM.SHORT_WATERMARK}`);
      }

      if (!global.db) global.db = { data: { settings: {} } };
      if (!global.db.data.settings) global.db.data.settings = {};
      global.db.data.settings.autoStatusView = setting === 'on';

      await msg.reply(`Auto Status View has been turned *${setting.toUpperCase()}* ${setting === 'on' ? '✅' : '❌'}\n\n${SYSTEM.SHORT_WATERMARK}`);
      await msg.react(setting === 'on' ? '✅' : '❌');

    } catch (error) {
      console.error('Auto status command error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },

  // Event listener — auto view status when enabled
  onMessage: async ({ sock, msg }) => {
    try {
      if (!msg.key?.remoteJid?.endsWith('status@broadcast')) return;
      if (!global.db?.data?.settings?.autoStatusView) return;

      await sock.readMessages([msg.key]);

      const sender = msg.key.participant || msg.key.remoteJid;
      console.log(`Auto viewed status from: ${sender.split('@')[0]}`);

    } catch (error) {
      console.error('Auto status view error:', error.message);
    }
  },
};
