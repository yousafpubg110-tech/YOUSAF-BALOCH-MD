/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Bot Info Plugin   ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube:  https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok:   https://tiktok.com/@loser_boy.110
💻 GitHub:   https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel:  https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import os from 'os';
import { OWNER, CONFIG } from '../config.js';

// ✅ Helper: Format uptime nicely
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  let parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

// ✅ Helper: Format bytes to MB/GB
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const gb = bytes / (1024 ** 3);
  const mb = bytes / (1024 ** 2);
  if (gb >= 1) return `${gb.toFixed(decimals)} GB`;
  return `${mb.toFixed(decimals)} MB`;
}

// ✅ Helper: RAM usage bar visual
function ramBar(used, total, length = 10) {
  const percent = used / total;
  const filled  = Math.round(percent * length);
  const empty   = length - filled;
  const bar     = '█'.repeat(filled) + '░'.repeat(empty);
  return `${bar} ${(percent * 100).toFixed(1)}%`;
}

// ✅ Helper: Get CPU model
function getCpuInfo() {
  try {
    const cpus = os.cpus();
    return cpus?.[0]?.model?.trim() || 'Unknown CPU';
  } catch {
    return 'Unknown CPU';
  }
}

// ✅ Helper: Get CPU usage (approximate)
function getCpuUsage() {
  try {
    const cpus    = os.cpus();
    let total     = 0;
    let idle      = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) total += cpu.times[type];
      idle += cpu.times.idle;
    }
    const usage = ((1 - idle / total) * 100).toFixed(1);
    return `${usage}%`;
  } catch {
    return 'N/A';
  }
}

export default {
  command: ['botinfo', 'info', 'system', 'sysinfo'],
  name: 'botinfo',
  category: 'Info',
  description: 'Detailed bot & system information',
  usage: '.botinfo',
  cooldown: 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ✅ React first
      if (typeof msg.react === 'function') await msg.react('🔍');

      // ── System Data ──────────────────────────────────────
      const uptime     = process.uptime();
      const totalMem   = os.totalmem();
      const freeMem    = os.freemem();
      const usedMem    = totalMem - freeMem;
      const heapUsed   = process.memoryUsage().heapUsed;
      const cpuModel   = getCpuInfo();
      const cpuUsage   = getCpuUsage();
      const cpuCores   = os.cpus().length;
      const nodeVer    = process.version;
      const platform   = `${os.platform()} (${os.arch()})`;
      const hostname   = os.hostname();
      const year       = OWNER.YEAR || new Date().getFullYear();
      const senderNum  = sender?.split('@')[0] || 'User';

      // ── Build Message ─────────────────────────────────────
      const infoMsg = `
╭━━━『 🤖 *BOT INFORMATION* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 🤖 *Bot Details* 』
│ ✨ *Name:*      ${OWNER.BOT_NAME}
│ 📌 *Version:*   ${OWNER.VERSION || '2.0.0'}
│ 👑 *Owner:*     ${OWNER.FULL_NAME}
│ 📞 *Contact:*   +${OWNER.NUMBER}
│ 📅 *Since:*     February 2026
│ 🌐 *Platform:*  WhatsApp Multi-Device
│ 🔧 *Prefix:*    \`${CONFIG.PREFIX}\`
│ 🤖 *AI Powered:* Yes ✅
╰──────────────────────────

╭─『 💻 *System Stats* 』
│ ⏱️  *Uptime:*     ${formatUptime(uptime)}
│ 🖥️  *OS:*         ${platform}
│ 🏠  *Host:*       ${hostname}
│ 📦  *Node.js:*    ${nodeVer}
╰──────────────────────────

╭─『 🧠 *Memory Usage* 』
│ 📊 *RAM Bar:*
│ ${ramBar(usedMem, totalMem)}
│ 
│ 💾 *Used RAM:*   ${formatBytes(usedMem)}
│ 🆓 *Free RAM:*   ${formatBytes(freeMem)}
│ 🗂️  *Total RAM:*  ${formatBytes(totalMem)}
│ ⚙️  *Heap Used:*  ${formatBytes(heapUsed)}
╰──────────────────────────

╭─『 ⚡ *CPU Info* 』
│ 🔲 *CPU:*        ${cpuModel}
│ 🧩 *Cores:*      ${cpuCores} Cores
│ 📈 *CPU Load:*   ${cpuUsage}
╰──────────────────────────

╭─『 🔗 *Links* 』
│ 📺 ${OWNER.YOUTUBE}
│ 🎵 ${OWNER.TIKTOK}
│ 📢 ${OWNER.CHANNEL}
│ 💻 github.com/musakhanbaloch03-sad
╰──────────────────────────

_🚀 The Most Powerful WhatsApp Bot!_
_© ${year} ${OWNER.BOT_NAME} by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ✅ Send main info message
      await sock.sendMessage(from, {
        text: infoMsg,
      }, { quoted: msg });

      // ✅ Channel link — alag message
      await sock.sendMessage(from, {
        text: `📢 *ہمارے WhatsApp Channel سے جڑیں:*\n${OWNER.CHANNEL}`,
      }, { quoted: msg });

      // ✅ React done
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BOTINFO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ BotInfo Error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ BotInfo Error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
