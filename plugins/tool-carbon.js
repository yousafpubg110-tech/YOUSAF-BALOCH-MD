/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Carbon Code Plugin    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';

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

async function generateCarbon(code, theme = 'monokai', lang = 'auto') {
  const url = new URL('https://carbonara.solopov.dev/api/cook');
  if (url.hostname !== 'carbonara.solopov.dev') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url.toString(), {
      method : 'POST',
      signal : controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({
        code,
        theme,
        language: lang,
        fontFamily: 'Fira Code',
        fontSize  : '14px',
        lineNumbers: true,
        windowControls: true,
      }),
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Carbon API error: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally { clearTimeout(timer); }
}

const THEMES = ['monokai','dracula','solarized-dark','github','night-owl','oceanic-next','nord','one-dark'];

export default {
  command    : ['carbon', 'code2img', 'codeimage', 'codeshot'],
  name       : 'tool-carbon',
  category   : 'Tools',
  description: 'Generate beautiful code screenshots (carbon-style)',
  usage      : '.carbon [theme] <code>',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💻');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 💻 *CARBON CODE* 』━━━╮

📌 *Usage:*
\`${CONFIG.PREFIX}carbon <your code>\`
\`${CONFIG.PREFIX}carbon dracula <code>\`

🎨 *Themes:*
│ monokai dracula solarized-dark
│ github night-owl nord one-dark
│ oceanic-next

💡 *Example:*
\`${CONFIG.PREFIX}carbon
const greet = name => \`Hello \${name}!\`;
console.log(greet('Pakistan'));\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Parse theme ───────────────────────────────────────
      const words  = input.split('\n')[0].split(' ');
      const theme  = THEMES.includes(words[0].toLowerCase()) ? words[0].toLowerCase() : 'monokai';
      const code   = THEMES.includes(words[0].toLowerCase())
        ? input.slice(words[0].length).trim()
        : input;

      if (!code.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide code!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `💻 *Generating code screenshot...*\n🎨 Theme: ${theme}\n⏳ Please wait...`,
      }, { quoted: msg });

      const imgBuffer = await generateCarbon(code, theme);

      await sock.sendMessage(from, {
        image  : imgBuffer,
        caption: `✅ *Code Image Generated!*\n\n👋 +${senderNum}\n🎨 Theme: ${theme}\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[CARBON ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Carbon failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
