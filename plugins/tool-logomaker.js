/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Logo Maker Plugin     ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
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

// ─── 30 Logo Name Styles ──────────────────────────────────────────────────────
const LOGO_STYLES = [
  // Style 1 — Stars
  (name) => `✦✦✦ ${name.toUpperCase()} ✦✦✦`,
  // Style 2 — Box
  (name) => `【 ${name.toUpperCase()} 】`,
  // Style 3 — Diamond
  (name) => `◈ ${name} ◈`,
  // Style 4 — Crown
  (name) => `👑 ${name.toUpperCase()} 👑`,
  // Style 5 — Double line
  (name) => `━━━ ${name} ━━━`,
  // Style 6 — Fire
  (name) => `🔥${name.toUpperCase()}🔥`,
  // Style 7 — Arrow
  (name) => `➤ ${name} ◀`,
  // Style 8 — Flower
  (name) => `🌸 ${name} 🌸`,
  // Style 9 — Lightning
  (name) => `⚡${name.toUpperCase()}⚡`,
  // Style 10 — Ghost frame
  (name) => `꧁${name}꧂`,
  // Style 11 — Wavy
  (name) => `〜${name.toUpperCase()}〜`,
  // Style 12 — Brackets
  (name) => `《 ${name} 》`,
  // Style 13 — Wings
  (name) => `»ιℓℓ᷊umιnat℮ŕ ${name} ℓegend«`,
  // Style 14 — Royal
  (name) => `♛ ${name.toUpperCase()} ♛`,
  // Style 15 — Double star
  (name) => `★彡 ${name} 彡★`,
  // Style 16 — Neon
  (name) => `『${name.toUpperCase()}』`,
  // Style 17 — Skull
  (name) => `☠ ${name} ☠`,
  // Style 18 — Infinity
  (name) => `∞ ${name} ∞`,
  // Style 19 — Angel
  (name) => `༺ ${name} ༻`,
  // Style 20 — Dragon
  (name) => `꧁༒${name}༒꧂`,
  // Style 21 — Elegant
  (name) => `✿ ${name} ✿`,
  // Style 22 — Bold Box
  (name) => `┣━━━ ${name.toUpperCase()} ━━━┫`,
  // Style 23 — Underline
  (name) => `_${name.toUpperCase()}_\n${'‾'.repeat(name.length + 2)}`,
  // Style 24 — Classic
  (name) => `| ${name.toUpperCase()} |`,
  // Style 25 — Tribal
  (name) => `⌁ ${name} ⌁`,
  // Style 26 — Music
  (name) => `🎵 ${name} 🎵`,
  // Style 27 — Vortex
  (name) => `◉ ${name.toUpperCase()} ◉`,
  // Style 28 — Vintage
  (name) => `—— ${name} ——`,
  // Style 29 — Neon Box
  (name) => `╔══╗\n║${name.padStart(Math.ceil((10 + name.length) / 2)).padEnd(10)}║\n╚══╝`,
  // Style 30 — Ultimate
  (name) => `꧁❤${name.toUpperCase()}❤꧂`,
];

export default {
  command    : ['logo', 'logomaker', 'namestyle'],
  name       : 'tool-logomaker',
  category   : 'Tools',
  description: 'Create stylish text logos — 30 styles',
  usage      : '.logo <name> [style number]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎨');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 🎨 *LOGO MAKER* 』━━━╮

📌 *Usage:*
\`${CONFIG.PREFIX}logo <name>\`          → All 30 styles
\`${CONFIG.PREFIX}logo <name> 5\`        → Style #5 only

💡 *Examples:*
▸ \`${CONFIG.PREFIX}logo Yousaf\`
▸ \`${CONFIG.PREFIX}logo Pakistan 10\`
▸ \`${CONFIG.PREFIX}logo Gaming King 25\`

🎨 *Available Styles:* 30

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Parse name and optional style number ──────────────
      const parts       = input.split(' ');
      const lastPart    = parts[parts.length - 1];
      const styleNum    = parseInt(lastPart);
      const hasStyleNum = !isNaN(styleNum) && styleNum >= 1 && styleNum <= 30;
      const name        = hasStyleNum ? parts.slice(0, -1).join(' ') : input;

      if (!name.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a name!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Single style ──────────────────────────────────────
      if (hasStyleNum) {
        const styleFn = LOGO_STYLES[styleNum - 1];
        const logo    = styleFn(name);

        await sock.sendMessage(from, {
          text: `╭━━━『 🎨 *LOGO STYLE #${styleNum}* 』━━━╮

👋 *Requested by:* +${senderNum}
📝 *Name:* ${name}

╭─『 ✨ *Logo* 』
│
${logo}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── All 30 styles in 3 messages (10 each) ────────────
      for (let batch = 0; batch < 3; batch++) {
        const start   = batch * 10;
        const end     = start + 10;
        const section = LOGO_STYLES.slice(start, end)
          .map((fn, i) => `│ *Style #${start + i + 1}:*\n│ ${fn(name)}`)
          .join('\n│\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 🎨 *LOGOS ${start + 1}-${end}* 』━━━╮

👋 +${senderNum} | 📝 "${name}"

${section}

${batch === 2 ? `╭─『 💡 *Single Style* 』\n│ \`${CONFIG.PREFIX}logo ${name} 5\`\n╰──────────────────────────\n\n${ownerFooter()}` : ''}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: batch === 0 ? msg : undefined });

        if (batch < 2) await new Promise(r => setTimeout(r, 500));
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[LOGO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Logo error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
