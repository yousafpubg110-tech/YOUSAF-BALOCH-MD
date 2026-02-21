/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Eval Plugin       ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import util   from 'util';
import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Truncate long output ─────────────────────────────────────────────
function truncateOutput(str, maxLen = 3000) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + `\n\n... [truncated ${str.length - maxLen} chars]`;
}

// ─── Helper: Clean sensitive data from output ─────────────────────────────────
function cleanOutput(str) {
  // Remove session tokens / API keys if accidentally printed
  return str
    .replace(/SESSION_ID\s*[:=]\s*\S+/gi,  'SESSION_ID: [HIDDEN]')
    .replace(/API_KEY\s*[:=]\s*\S+/gi,     'API_KEY: [HIDDEN]')
    .replace(/password\s*[:=]\s*\S+/gi,    'PASSWORD: [HIDDEN]')
    .replace(/token\s*[:=]\s*\S+/gi,       'TOKEN: [HIDDEN]');
}

// ─── Helper: Format execution time ───────────────────────────────────────────
function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['eval', 'exec', '>'],
  name       : 'eval',
  category   : 'Owner',
  description: 'Execute JavaScript code (owner only)',
  usage      : '.eval <code>  or  > <code>',
  cooldown   : 3,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⚙️');

      // ── Owner check — strict ────────────────────────────────────
      const senderNum = sender?.split('@')[0] || '';
      const isOwner   = senderNum === String(OWNER.NUMBER);

      if (!isOwner) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *This command is for owner only!*\n\n👑 *Owner:* ${OWNER.FULL_NAME}\n📱 *Contact:* +${OWNER.NUMBER}`,
        }, { quoted: msg });
      }

      // ── Extract code ────────────────────────────────────────────
      const code = text
        ?.replace(/^[.]?eval\s*/i, '')
        ?.replace(/^>\s*/,         '')
        ?.trim();

      if (!code) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *Please provide code to execute!*\n\n📌 *Usage:*\n${CONFIG.PREFIX}eval <code>\n> <code>`,
        }, { quoted: msg });
      }

      // ── Execute code ────────────────────────────────────────────
      const startTime = Date.now();
      let result;
      let isError = false;

      try {
        result = await eval(`(async () => { ${code} })()`);
      } catch (execErr) {
        result  = execErr;
        isError = true;
      }

      const execTime = Date.now() - startTime;

      // ── Format result ───────────────────────────────────────────
      let output;

      if (isError) {
        output = result?.stack || result?.message || String(result);
      } else if (result === undefined) {
        output = 'undefined';
      } else if (typeof result === 'string') {
        output = result;
      } else {
        output = util.inspect(result, {
          depth   : 3,
          colors  : false,
          maxArrayLength: 20,
        });
      }

      // Clean sensitive data + truncate
      output = cleanOutput(truncateOutput(output));

      // ── Build result message ────────────────────────────────────
      const resultMsg = `
╭━━━『 ${isError ? '❌ *EXEC ERROR*' : '✅ *EXEC SUCCESS*'} 』━━━╮

╭─『 📝 *Input Code* 』
│ \`\`\`
${truncateOutput(code, 200)}
\`\`\`
╰──────────────────────────

╭─『 📤 *Output* 』
│ \`\`\`
${output}
\`\`\`
╰──────────────────────────

╭─『 📊 *Stats* 』
│ ⏱️  *Time:*    ${formatTime(execTime)}
│ 📦  *Type:*    ${isError ? 'Error' : typeof result}
│ 📏  *Length:*  ${output.length} chars
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: resultMsg,
      }, { quoted: msg });

      // ── React: result ───────────────────────────────────────────
      if (typeof msg.react === 'function') {
        await msg.react(isError ? '❌' : '✅');
      }

    } catch (error) {
      console.error('[EVAL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Eval handler error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Eval handler error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
