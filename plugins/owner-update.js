/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Update Plugin     ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { execSync } from 'child_process';
import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Truncate long git output ────────────────────────────────────────
function truncateOutput(str, maxLen = 1500) {
  if (!str) return '';
  const clean = str.trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen) + `\n... [truncated]`;
}

// ─── Helper: Get timestamp ────────────────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Helper: Get current git branch ──────────────────────────────────────────
function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      timeout: 10000,
    }).toString().trim();
  } catch {
    return 'unknown';
  }
}

// ─── Helper: Get latest commit info ──────────────────────────────────────────
function getLatestCommit() {
  try {
    return execSync('git log -1 --pretty=format:"%h — %s"', {
      timeout: 10000,
    }).toString().trim();
  } catch {
    return 'unknown';
  }
}

// ─── Helper: Get changed files count ─────────────────────────────────────────
function getChangedFiles(stdout) {
  try {
    const match = stdout.match(/(\d+) file/);
    return match ? match[1] : '0';
  } catch {
    return '0';
  }
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['update', 'upgrade', 'pull'],
  name       : 'update',
  category   : 'Owner',
  description: 'Pull latest updates from GitHub',
  usage      : '.update',
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

      // ── Send checking message ───────────────────────────────────
      const branch = getGitBranch();

      await sock.sendMessage(from, {
        text: `🔄 *Checking for updates...*\n\n🌿 *Branch:* ${branch}\n⏳ *Please wait...*`,
      }, { quoted: msg });

      // ── Run git pull ────────────────────────────────────────────
      let stdout;
      try {
        stdout = execSync('git pull', {
          timeout: 30000,  // 30 second timeout
        }).toString();
      } catch (gitErr) {
        throw new Error('Git pull failed: ' + gitErr.message);
      }

      const isUpToDate = stdout.includes('Already up to date');
      const commit     = getLatestCommit();
      const timestamp  = getTimestamp();

      // ── Already up to date ──────────────────────────────────────
      if (isUpToDate) {
        const upToDateMsg = `
╭━━━『 ✅ *ALREADY UP TO DATE* 』━━━╮

✅ *Bot is running latest version!*

╭─『 📋 *Git Info* 』
│ 🌿 *Branch:*  ${branch}
│ 📝 *Commit:*  ${commit}
│ 📅 *Checked:* ${timestamp}
╰──────────────────────────

╭─『 🤖 *Bot Info* 』
│ 🤖 *Bot:*     ${OWNER.BOT_NAME}
│ ✨ *Version:* ${OWNER.VERSION}
│ 👑 *Owner:*   ${OWNER.FULL_NAME}
╰──────────────────────────

_No restart needed — already latest!_
_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        await sock.sendMessage(from, {
          text: upToDateMsg,
        }, { quoted: msg });

        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Update successful ───────────────────────────────────────
      const changedFiles = getChangedFiles(stdout);
      const cleanOutput  = truncateOutput(stdout);

      const updateMsg = `
╭━━━『 🎉 *UPDATE SUCCESSFUL* 』━━━╮

✅ *Bot updated successfully!*

╭─『 📋 *Git Info* 』
│ 🌿 *Branch:*   ${branch}
│ 📝 *Commit:*   ${commit}
│ 📁 *Files:*    ${changedFiles} changed
│ 📅 *Updated:*  ${timestamp}
╰──────────────────────────

╭─『 📤 *Git Output* 』
\`\`\`
${cleanOutput}
\`\`\`
╰──────────────────────────

╭─『 💡 *Next Steps* 』
│ 1️⃣  Type \`${CONFIG.PREFIX}restart\` to apply
│ 2️⃣  Wait 10-15 seconds
│ 3️⃣  Bot back online ✅
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: updateMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UPDATE ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');

        const errMsg = `
╭━━━『 ❌ *UPDATE FAILED* 』━━━╮

❌ *Could not pull updates!*

╭─『 ⚠️ *Error Details* 』
\`\`\`
${error.message?.slice(0, 500) || 'Unknown error'}
\`\`\`
╰──────────────────────────

╭─『 💡 *Possible Fixes* 』
│ 1️⃣  Check internet connection
│ 2️⃣  Check GitHub repo access
│ 3️⃣  Run: git status
│ 4️⃣  Run: git stash then update
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        await sock.sendMessage(from, {
          text: errMsg,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
