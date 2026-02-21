/*
 * YOUSAF-BALOCH-MD - Runtime / Uptime Plugin
 * Created by MR YOUSAF BALOCH
 *
 * WhatsApp : +923710636110
 * YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 * TikTok   : https://tiktok.com/@loser_boy.110
 * GitHub   : https://github.com/musakhanbaloch03-sad
 * Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 * Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
 */

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Format uptime into parts ───────────────────────────────────────
function parseUptime(totalSeconds) {
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { days, hours, minutes, seconds };
}

// ─── Helper: Visual uptime progress bar ─────────────────────────────────────
function uptimeBar(totalSeconds) {
  const maxDay  = 7 * 86400; // 7 days = full bar
  const percent = Math.min(totalSeconds / maxDay, 1);
  const filled  = Math.round(percent * 10);
  const empty   = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${(percent * 100).toFixed(1)}%`;
}

// ─── Helper: Human readable total uptime ────────────────────────────────────
function humanUptime(totalSeconds) {
  const { days, hours, minutes, seconds } = parseUptime(totalSeconds);
  const parts = [];
  if (days    > 0) parts.push(`${days}d`);
  if (hours   > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

// ─── Helper: Stability rating based on uptime ───────────────────────────────
function getStabilityRating(totalSeconds) {
  if (totalSeconds >= 86400 * 3) return '🟢 *Excellent Stability!* (3+ days)';
  if (totalSeconds >= 86400)     return '🟢 *Very Stable!* (1+ day)';
  if (totalSeconds >= 3600)      return '🟡 *Stable!* (1+ hour)';
  if (totalSeconds >= 600)       return '🟠 *Running Fine!* (10+ mins)';
  return '🔴 *Just Started!*';
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['runtime', 'uptime', 'rtime', 'running'],
  name       : 'runtime',
  category   : 'Info',
  description: 'Show how long the bot has been running',
  usage      : '.runtime',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: loading ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⏱️');

      const totalSeconds = process.uptime();
      const { days, hours, minutes, seconds } = parseUptime(totalSeconds);
      const bar       = uptimeBar(totalSeconds);
      const human     = humanUptime(totalSeconds);
      const rating    = getStabilityRating(totalSeconds);
      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Start timestamp (approx) ────────────────────────────────
      const startTime = new Date(Date.now() - totalSeconds * 1000);
      const startStr  = startTime.toUTCString().replace(' GMT', ' (UTC)');

      // ── Build message ───────────────────────────────────────────
      const runtimeMsg = `
╭━━━『 ⏱️ *BOT RUNTIME* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📊 *Uptime Breakdown* 』
│ 📅 *Days:*     ${days}
│ ⏰ *Hours:*    ${hours}
│ ⏲️  *Minutes:*  ${minutes}
│ ⏱️  *Seconds:*  ${seconds}
╰──────────────────────────

╭─『 ⚡ *Uptime Stats* 』
│ 🕐 *Total:*    ${human}
│ 🔢 *Seconds:*  ${Math.floor(totalSeconds).toLocaleString()}s
│ 📅 *Started:*  ${startStr}
╰──────────────────────────

╭─『 📈 *Stability* 』
│ ${bar}
│ 
│ ${rating}
╰──────────────────────────

╭─『 🤖 *Bot Info* 』
│ 🤖 *Bot:*    ${OWNER.BOT_NAME}
│ 👑 *Owner:*  ${OWNER.FULL_NAME}
│ 🔧 *Prefix:* \`${CONFIG.PREFIX}\`
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send message ────────────────────────────────────────────
      await sock.sendMessage(from, {
        text: runtimeMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[RUNTIME ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Runtime error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Runtime error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
