/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Auto Bio Plugin       ┃
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

// ─── Bio rotation list ────────────────────────────────────────────────────────
const AUTO_BIOS = [
  `🤖 ${OWNER.BOT_NAME} | 24/7 Active | Owner: ${OWNER.FULL_NAME}`,
  `⚡ ${OWNER.BOT_NAME} | AI Powered Bot | +${OWNER.NUMBER}`,
  `🌙 ${OWNER.BOT_NAME} | رمضان مبارک | ${OWNER.CHANNEL}`,
  `🏏 ${OWNER.BOT_NAME} | Cricket & Sports | ${OWNER.YOUTUBE}`,
  `👑 ${OWNER.BOT_NAME} | Pakistan 🇵🇰 | ${OWNER.FULL_NAME}`,
  `🔥 ${OWNER.BOT_NAME} | Always Online | ${OWNER.TIKTOK}`,
  `✨ ${OWNER.BOT_NAME} | Features 200+ | Owner: ${OWNER.FULL_NAME}`,
  `🕌 ${OWNER.BOT_NAME} | Islamic Bot | +${OWNER.NUMBER}`,
];

let   bioIndex    = 0;
let   bioInterval = null;

export default {
  command    : ['autobio', 'bio', 'setbio', 'بایو'],
  name       : 'group-auto-bio',
  category   : 'Group',
  description: 'Auto rotate bot WhatsApp bio/status',
  usage      : '.autobio [on/off/set <text>]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text, isBotOwner }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('✏️');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();
      const lower     = input.toLowerCase();

      if (!isBotOwner && sender?.split('@')[0] !== OWNER.NUMBER) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Bot Owner bio change کر سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Manual set ────────────────────────────────────────
      if (lower.startsWith('set ') || (!lower.startsWith('on') && !lower.startsWith('off') && input.length > 3)) {
        const bioText = input.replace(/^set\s*/i, '').trim();
        if (!bioText) {
          return await sock.sendMessage(from, {
            text: `❌ *Bio text دیں!*\n📌 Usage: \`${CONFIG.PREFIX}bio set Your bio here\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        await sock.updateProfileStatus(bioText.substring(0, 140));
        await sock.sendMessage(from, {
          text: `✅ *Bio update ہو گیا!*\n\n📝 *New Bio:*\n${bioText}\n\n${ownerFooter()}`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Auto rotation ON ───────────────────────────────────
      if (lower === 'on' || lower === 'start') {
        if (bioInterval) clearInterval(bioInterval);

        // Change bio every 2 hours
        bioInterval = setInterval(async () => {
          try {
            const bio = AUTO_BIOS[bioIndex % AUTO_BIOS.length];
            await sock.updateProfileStatus(bio);
            bioIndex++;
          } catch (e) {
            console.error('[AUTO BIO INTERVAL ERROR]:', e.message);
          }
        }, 2 * 60 * 60 * 1000); // 2 hours

        // Set immediately
        const bio = AUTO_BIOS[bioIndex % AUTO_BIOS.length];
        await sock.updateProfileStatus(bio);
        bioIndex++;

        await sock.sendMessage(from, {
          text: `✅ *Auto Bio چالو ہو گیا!*\n\n⏰ ہر 2 گھنٹے میں bio خود بدلے گا\n📝 *Current:* ${bio}\n\n${ownerFooter()}`,
        }, { quoted: msg });

      // ── Auto rotation OFF ──────────────────────────────────
      } else if (lower === 'off' || lower === 'stop') {
        if (bioInterval) {
          clearInterval(bioInterval);
          bioInterval = null;
        }
        await sock.sendMessage(from, {
          text: `🔕 *Auto Bio بند ہو گیا!*\n\n${ownerFooter()}`,
        }, { quoted: msg });

      } else {
        // ── Show menu ─────────────────────────────────────────
        await sock.sendMessage(from, {
          text: `╭━━━『 ✏️ *AUTO BIO* 』━━━╮

📊 *Status:* ${bioInterval ? '✅ Active' : '❌ Off'}

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}autobio on\`         → چالو
│ \`${CONFIG.PREFIX}autobio off\`        → بند
│ \`${CONFIG.PREFIX}bio set <text>\`     → Manual set
╰──────────────────────────

╭─『 📝 *Bio Rotation List* 』
${AUTO_BIOS.map((b, i) => `│ ${i + 1}. ${b.substring(0, 50)}`).join('\n')}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[AUTO-BIO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Auto bio error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
