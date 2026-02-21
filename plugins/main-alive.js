/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Alive Status         ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

export default {
  command: ['alive', 'active', 'status', 'bot'],
  name: 'alive',
  category: 'Info',
  description: 'Check if bot is alive',
  usage: '.alive',
  cooldown: 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ✅ FIX 1: React sirf ek baar — shuru mein
      if (typeof msg.react === 'function') {
        await msg.react('✅');
      }

      // Uptime calculate
      const uptime  = process.uptime();
      const hours   = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // ✅ FIX 2: Sender number safe extraction
      const senderNumber = sender?.split('@')[0] || 'User';

      // ✅ FIX 3: OWNER.YEAR safe fallback
      const year = OWNER.YEAR || new Date().getFullYear();

      const aliveMsg = `╭━━━『 *${OWNER.BOT_NAME}* 』━━━╮

👋 *Hello +${senderNumber}!*

✅ *Bot is Active & Running!*

📊 *Bot Statistics:*
├ ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
├ 👑 *Owner:* ${OWNER.FULL_NAME}
├ 📞 *Contact:* +${OWNER.NUMBER}
├ ✨ *Version:* ${OWNER.VERSION}
└ 🔧 *Prefix:* \`${CONFIG.PREFIX}\`

🚀 *Type ${CONFIG.PREFIX}menu for commands*

╭━━━『 *FOLLOW ME* 』━━━╮

📺 *YouTube:*
${OWNER.YOUTUBE}

🎵 *TikTok:*
${OWNER.TIKTOK}

📢 *WhatsApp Channel:*
${OWNER.CHANNEL}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_`;

      // ✅ Main alive message
      await sock.sendMessage(from, {
        text: aliveMsg,
      }, { quoted: msg });

      // ✅ Channel link — alag message mein
      await sock.sendMessage(from, {
        text: `📢 *ہمارے WhatsApp Channel سے جڑیں:*\n${OWNER.CHANNEL}`,
      }, { quoted: msg });

    } catch (error) {
      console.error('[ALIVE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Alive command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Alive command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
