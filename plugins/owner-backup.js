/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Owner Backup Plugin   ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }  from '../config.js';
import { exec }           from 'child_process';
import { promisify }      from 'util';
import { readdir, stat }  from 'fs/promises';
import { join }           from 'path';

const execAsync = promisify(exec);

function ownerFooter() {
  const year = OWNER.YEAR || new Date().getFullYear();
  return `╭─『 👑 *${OWNER.BOT_NAME}* 』
│ 👤 *Owner:*   ${OWNER.FULL_NAME}
│ 📱 *Number:*  +${OWNER.NUMBER}
│ 📢 *Channel:* ${OWNER.CHANNEL}
│ 📺 *YouTube:* ${OWNER.YOUTUBE}
│ 🎵 *TikTok:*  ${OWNER.TIKTOK}
╰──────────────────────────
_© ${year} ${OWNER.BOT_NAME}_`;
}

function getPKTTime() {
  return new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
}

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function getDirSize(dirPath) {
  let total = 0;
  try {
    const files = await readdir(dirPath);
    for (const file of files) {
      try {
        const fileStat = await stat(join(dirPath, file));
        if (fileStat.isFile()) total += fileStat.size;
      } catch (_) {}
    }
  } catch (_) {}
  return total;
}

async function createBackup() {
  const timestamp  = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupName = `backup_${timestamp}.tar.gz`;
  const backupPath = `/tmp/${backupName}`;

  // Backup important files: plugins, config, .env (without sensitive data)
  const cmd = `tar -czf "${backupPath}" --exclude="node_modules" --exclude=".git" --exclude="*.tar.gz" plugins/ config.js .env 2>/dev/null || tar -czf "${backupPath}" --exclude="node_modules" --exclude=".git" plugins/ config.js`;

  await execAsync(cmd);

  const fileStat = await stat(backupPath);
  return { path: backupPath, name: backupName, size: fileStat.size };
}

export default {
  command    : ['backup', 'savedata', 'export'],
  name       : 'owner-backup',
  category   : 'Owner',
  description: 'Create and send bot backup to owner',
  usage      : '.backup [create/info]',
  ownerOnly  : true,
  cooldown   : 30,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💾');

      // ── Owner check ───────────────────────────────────────
      if (sender?.split('@')[0] !== OWNER.NUMBER) {
        return await sock.sendMessage(from, {
          text: `🚫 *Owner only command!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const input = (text || '').trim().toLowerCase();

      // ── System info (no backup) ───────────────────────────
      if (input === 'info' || input === 'check') {
        let diskInfo = 'N/A';
        let nodeInfo = 'N/A';
        let pmInfo   = 'N/A';

        try {
          const { stdout: df } = await execAsync("df -h / | awk 'NR==2 {print $3\"/\"$2\" used (\"$5\" full)\"}'");
          diskInfo = df.trim();
        } catch (_) {}

        try {
          const { stdout: nv } = await execAsync('node --version');
          nodeInfo = nv.trim();
        } catch (_) {}

        try {
          const { stdout: pm } = await execAsync('pm2 ls --no-color 2>/dev/null | head -5');
          pmInfo = pm.trim().split('\n')[0] || 'pm2 not running';
        } catch (_) { pmInfo = 'pm2 not found'; }

        const pluginsSize  = await getDirSize('./plugins');
        const mem          = process.memoryUsage();

        return await sock.sendMessage(from, {
          text: `╭━━━『 💾 *SYSTEM INFO* 』━━━╮

👑 *Owner:* ${OWNER.FULL_NAME}
📅 *Time:*  ${getPKTTime()}

╭─『 💻 *System* 』
│ 🖥️ *Platform:*  ${process.platform}
│ 🔧 *Node.js:*  ${nodeInfo}
│ 💾 *RAM Used:* ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB
│ 💿 *Disk:*     ${diskInfo}
│ ⚙️ *PM2:*      ${pmInfo}
╰──────────────────────────

╭─『 📁 *Bot Files* 』
│ 🔌 *Plugins Dir:* ${formatBytes(pluginsSize)}
│ ⏱️ *Uptime:*      ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}backup create\` → Create backup
│ \`${CONFIG.PREFIX}backup info\`   → System info
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Create backup ─────────────────────────────────────
      await sock.sendMessage(from, {
        text: `💾 *Creating backup...*\n⏳ Compressing files...\nPlease wait...`,
      }, { quoted: msg });

      let backup;
      try {
        backup = await createBackup();
      } catch (e) {
        // Fallback: create simple config backup as text
        let configContent = '';
        try {
          const { readFile } = await import('fs/promises');
          configContent = await readFile('./config.js', 'utf-8');
        } catch (_) { configContent = 'Could not read config'; }

        await sock.sendMessage(from, {
          text: `╭━━━『 💾 *CONFIG BACKUP* 』━━━╮

👑 *Owner:* ${OWNER.FULL_NAME}
📅 *Time:*  ${getPKTTime()}

⚠️ *tar not available — sending config as text*

\`\`\`
${configContent.substring(0, 3000)}
\`\`\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });

        if (typeof msg.react === 'function') await msg.react('⚠️');
        return;
      }

      // ── Send backup file ──────────────────────────────────
      const { readFile } = await import('fs/promises');
      const backupBuffer = await readFile(backup.path);

      await sock.sendMessage(from, {
        document : backupBuffer,
        mimetype : 'application/gzip',
        fileName : backup.name,
        caption  : `╭━━━『 ✅ *BACKUP COMPLETE!* 』━━━╮

👑 *Owner:* ${OWNER.FULL_NAME}
📅 *Time:*  ${getPKTTime()}

╭─『 📦 *Backup Details* 』
│ 📁 *File:*  ${backup.name}
│ 📦 *Size:*  ${formatBytes(backup.size)}
│ 📂 *Includes:*
│    ✅ plugins/ folder
│    ✅ config.js
│    ✅ .env (if accessible)
╰──────────────────────────

⚠️ Keep this file safe!
Contains bot configuration data.

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      // Cleanup temp file
      try {
        const { unlink } = await import('fs/promises');
        await unlink(backup.path);
      } catch (_) {}

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[BACKUP ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Backup failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
