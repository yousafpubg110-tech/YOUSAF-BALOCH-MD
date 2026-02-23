/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — DP Maker Plugin       ┃
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

// ─── 30 DP Bio/Status Styles ──────────────────────────────────────────────────
const DP_STYLES = [
  // Style 1 — Basic
  (name, tag) => `👑 ${name}\n💎 ${tag}`,
  // Style 2 — Gamer
  (name, tag) => `🎮 ${name} | Gamer\n⚡ ${tag}`,
  // Style 3 — Attitude
  (name, tag) => `😈 ${name}\n🔥 "${tag}"`,
  // Style 4 — Royal
  (name, tag) => `♛ ${name} ♛\n👑 Royal • ${tag}`,
  // Style 5 — Pakistan
  (name, tag) => `🇵🇰 ${name}\n💚 ${tag} | Pakistani`,
  // Style 6 — Islamic
  (name, tag) => `☪️ ${name}\n🕌 ${tag} | Alhamdulillah`,
  // Style 7 — Developer
  (name, tag) => `💻 ${name}\n⌨️ Developer | ${tag}`,
  // Style 8 — Cricket fan
  (name, tag) => `🏏 ${name}\n⚡ Cricket Fan | ${tag}`,
  // Style 9 — Single
  (name, tag) => `💔 ${name}\n🥀 Single | ${tag}`,
  // Style 10 — Bhai
  (name, tag) => `😎 ${name} Bhai\n🔥 ${tag} | Attitude King`,
  // Style 11 — Student
  (name, tag) => `📚 ${name}\n🎓 Student | ${tag}`,
  // Style 12 — Boss
  (name, tag) => `👔 ${name}\n💼 Boss Mode | ${tag}`,
  // Style 13 — Night owl
  (name, tag) => `🌙 ${name}\n🌟 Night Owl | ${tag}`,
  // Style 14 — Foodie
  (name, tag) => `🍽️ ${name}\n🍛 Foodie | ${tag}`,
  // Style 15 — Traveler
  (name, tag) => `✈️ ${name}\n🌍 Traveler | ${tag}`,
  // Style 16 — Musician
  (name, tag) => `🎵 ${name}\n🎧 Music Lover | ${tag}`,
  // Style 17 — Photographer
  (name, tag) => `📸 ${name}\n👁️ Photographer | ${tag}`,
  // Style 18 — Poet
  (name, tag) => `✍️ ${name}\n🖊️ "${tag}"`,
  // Style 19 — Military
  (name, tag) => `🪖 ${name}\n⚔️ ${tag} | Pak Army Fan`,
  // Style 20 — Gym
  (name, tag) => `💪 ${name}\n🏋️ Gym Lover | ${tag}`,
  // Style 21 — Doctor
  (name, tag) => `🩺 Dr. ${name}\n💊 ${tag} | Healthcare`,
  // Style 22 — YouTuber
  (name, tag) => `📹 ${name}\n▶️ YouTuber | ${tag}`,
  // Style 23 — Hacker
  (name, tag) => `💀 ${name}\n⌨️ ${tag} | Ethical Hacker`,
  // Style 24 — VIP
  (name, tag) => `💎 VIP ${name}\n✨ ${tag}`,
  // Style 25 — Legend
  (name, tag) => `🏆 ${name}\n👑 Legend | ${tag}`,
  // Style 26 — Ghost
  (name, tag) => `👻 ${name}\n🌑 ${tag} | In The Dark`,
  // Style 27 — Rebel
  (name, tag) => `🔥 ${name}\n😤 ${tag} | Born Rebel`,
  // Style 28 — Artist
  (name, tag) => `🎨 ${name}\n🖌️ Artist | ${tag}`,
  // Style 29 — God
  (name, tag) => `⚡ ${name}\n🌩️ ${tag} | The God Of..`,
  // Style 30 — Ultimate
  (name, tag) => `꧁❤ ${name} ❤꧂\n💫 ${tag} | One & Only`,
];

export default {
  command    : ['dp', 'dpmaker', 'dpstyle', 'bio'],
  name       : 'tool-dpmaker',
  category   : 'Tools',
  description: 'Create stylish WhatsApp DP bio — 30 styles',
  usage      : '.dp <name> | <tag> [style number]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🖼️');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 🖼️ *DP MAKER* 』━━━╮

📌 *Usage:*
\`${CONFIG.PREFIX}dp <name> | <tagline>\`
\`${CONFIG.PREFIX}dp <name> | <tagline> 5\` → Style #5

💡 *Examples:*
▸ \`${CONFIG.PREFIX}dp Yousaf | King of Pakistan\`
▸ \`${CONFIG.PREFIX}dp Ali Raza | Stay Silent 10\`

🎨 *Available DP Styles:* 30

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Parse name | tag [style] ──────────────────────────
      const splitPipe = input.split('|').map(p => p.trim());
      const name      = splitPipe[0] || 'Unknown';
      const rest      = splitPipe[1] || 'My Style';

      const restParts   = rest.split(' ');
      const lastToken   = restParts[restParts.length - 1];
      const styleNum    = parseInt(lastToken);
      const hasStyleNum = !isNaN(styleNum) && styleNum >= 1 && styleNum <= 30;
      const tag         = hasStyleNum ? restParts.slice(0, -1).join(' ') : rest;

      // ── Single style ──────────────────────────────────────
      if (hasStyleNum) {
        const dp = DP_STYLES[styleNum - 1](name, tag);
        await sock.sendMessage(from, {
          text: `╭━━━『 🖼️ *DP STYLE #${styleNum}* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 ✨ *Your DP Bio* 』
│
${dp}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── All 30 styles in 3 batches ────────────────────────
      for (let batch = 0; batch < 3; batch++) {
        const start   = batch * 10;
        const section = DP_STYLES.slice(start, start + 10)
          .map((fn, i) => `│ *#${start + i + 1}:*\n│ ${fn(name, tag).replace(/\n/g, '\n│ ')}`)
          .join('\n│\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 🖼️ *DP STYLES ${start + 1}-${start + 10}* 』━━━╮

${section}

${batch === 2 ? ownerFooter() + '\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯' : '╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯'}`,
        }, { quoted: batch === 0 ? msg : undefined });

        if (batch < 2) await new Promise(r => setTimeout(r, 500));
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[DP ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *DP Maker error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
