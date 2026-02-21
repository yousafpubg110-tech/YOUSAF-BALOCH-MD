/*
 * YOUSAF-BALOCH-MD - Ping / Speed Test Plugin
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

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns a speed rating label + emoji based on ms value.
 * @param {number} ms
 * @returns {string}
 */
function getSpeedRating(ms) {
  if (ms < 100) return '🟢 *Excellent Speed!* (< 100ms)';
  if (ms < 300) return '🟡 *Good Speed!* (< 300ms)';
  if (ms < 600) return '🟠 *Average Speed!* (< 600ms)';
  return '🔴 *Slow Connection!* (> 600ms)';
}

/**
 * Returns a visual speed bar.
 * @param {number} ms
 * @returns {string}
 */
function getSpeedBar(ms) {
  const max    = 1000;
  const filled = Math.max(1, Math.round(((max - Math.min(ms, max)) / max) * 10));
  const empty  = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Returns memory usage info.
 * @returns {{ heapUsed: string, heapTotal: string, rss: string }}
 */
function getMemoryInfo() {
  const mem = process.memoryUsage();
  const toMB = (b) => (b / 1024 / 1024).toFixed(2) + ' MB';
  return {
    heapUsed  : toMB(mem.heapUsed),
    heapTotal : toMB(mem.heapTotal),
    rss       : toMB(mem.rss),
  };
}

/**
 * Returns formatted uptime string.
 * @returns {string}
 */
function getUptime() {
  const total = Math.floor(process.uptime());
  const h     = Math.floor(total / 3600);
  const m     = Math.floor((total % 3600) / 60);
  const s     = total % 60;
  return `${h}h ${m}m ${s}s`;
}

// ─── Plugin Export ───────────────────────────────────────────────────────────

export default {
  command    : ['ping', 'speed', 'pong', 'test'],
  name       : 'ping',
  category   : 'Info',
  description: 'Check bot response speed and system stats',
  usage      : '.ping',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: testing ──────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⏳');

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Round 1: Send placeholder & measure latency ─────────────
      const pingStart = Date.now();

      const placeholder = await sock.sendMessage(from, {
        text: '⏳ *Testing speed...*',
      }, { quoted: msg });

      const pingEnd   = Date.now();
      const latencyMs = pingEnd - pingStart;

      // ── System stats ────────────────────────────────────────────
      const mem     = getMemoryInfo();
      const uptime  = getUptime();
      const rating  = getSpeedRating(latencyMs);
      const bar     = getSpeedBar(latencyMs);
      const nodeVer = process.version;

      // ── Build result message ────────────────────────────────────
      const resultMsg = `
╭━━━『 ⚡ *SPEED TEST* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📡 *Ping Result* 』
│ ⚡ *Latency:*    ${latencyMs}ms
│ 📊 *Speed Bar:*
│ ${bar}
│ 
│ ${rating}
╰──────────────────────────

╭─『 💻 *System Stats* 』
│ ⏱️  *Uptime:*      ${uptime}
│ 📦  *Node.js:*     ${nodeVer}
│ 🧠  *Heap Used:*   ${mem.heapUsed}
│ 📂  *Heap Total:*  ${mem.heapTotal}
│ 💾  *RSS Memory:*  ${mem.rss}
╰──────────────────────────

╭─『 🔗 *Follow Me* 』
│ 📺 ${OWNER.YOUTUBE}
│ 🎵 ${OWNER.TIKTOK}
│ 📢 ${OWNER.CHANNEL}
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Edit placeholder with real result ───────────────────────
      if (placeholder?.key) {
        await sock.sendMessage(from, {
          text : resultMsg,
          edit : placeholder.key,
        });
      } else {
        // Fallback: send fresh message if edit not supported
        await sock.sendMessage(from, {
          text: resultMsg,
        }, { quoted: msg });
      }

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PING ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Ping Error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Ping Error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
