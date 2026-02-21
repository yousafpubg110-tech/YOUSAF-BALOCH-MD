/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Restart Plugin     ┃
┃       Created by MR YOUSAF BALOCH       ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Delay ────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Helper: Get timestamp ────────────────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['restart', 'reboot', 'reset'],
  name       : 'restart',
  category   : 'Owner',
  description: 'Restart the bot process',
  usage      : '.restart',
  cooldown   : 30,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⚙️');

      // ── Owner check ─────────────────────────────────────────────
      const senderNum = sender?.split('@')[0] || '';
      const isOwner   = senderNum === String(OWNER.NUMBER);

      if (!isOwner) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *This command is for owner only!*\n\n👑 *Owner:* ${OWNER.FULL_NAME}\n📱 *Contact:* +${OWNER.NUMBER}`,
        }, { quoted: msg });
      }

      // ── Get system info before restart ──────────────────────────
      const uptime    = process.uptime();
      const uptimeStr = (() => {
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        return `${h}h ${m}m ${s}s`;
      })();

      const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

      // ── Send restart notification ───────────────────────────────
      const restartMsg = `
╭━━━『 🔄 *BOT RESTARTING* 』━━━╮

⏳ *Please wait 10-15 seconds...*

╭─『 📊 *Session Stats* 』
│ ⏱️  *Uptime:*    ${uptimeStr}
│ 🧠  *Memory:*   ${memUsed} MB
│ 📅  *Time:*     ${getTimestamp()}
│ 👑  *By:*       ${OWNER.FULL_NAME}
╰──────────────────────────

╭─『 💡 *After Restart* 』
│ ✅ All plugins reloaded
│ ✅ Memory cleared
│ ✅ Fresh connection
│ ✅ Bot back online
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
_Restarting now..._
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: restartMsg,
      }, { quoted: msg });

      // ── React: restarting ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('🔄');

      // ── Wait for message to send — then restart ─────────────────
      await delay(3000);

      // ── Exit with code 1 — process manager will restart ─────────
      // Works with: pm2, nodemon, forever, railway, heroku
      process.exit(1);

    } catch (error) {
      console.error('[RESTART ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Restart error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Restart error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
