/*
 * YOUSAF-BALOCH-MD - Support & Help Plugin
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

// ─── Helper: Get FAQ list ────────────────────────────────────────────────────
function getFAQ() {
  return [
    { q: 'How to get bot prefix?',     a: `Type *${CONFIG.PREFIX}help* to see all commands` },
    { q: 'Bot not responding?',         a: 'Check if bot is added to group or DM it directly' },
    { q: 'How to report a bug?',        a: 'Contact owner or open GitHub issue' },
    { q: 'How to request a feature?',   a: 'Join WhatsApp Channel and suggest there' },
    { q: 'Is bot free to use?',         a: 'Yes! 100% free and open source' },
  ];
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['support', 'help', 'assist', 'contact'],
  name       : 'support',
  category   : 'Info',
  description: 'Show support links, FAQ and contact info',
  usage      : '.support',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ✅ FIX: react via sock.sendMessage instead of msg.react()
      await sock.sendMessage(from, { react: { text: '🆘', key: msg.key } });

      const senderNum = sender?.split('@')[0] || 'User';
      const year      = OWNER.YEAR || new Date().getFullYear();
      const faqList   = getFAQ();

      // ── Build FAQ section ───────────────────────────────────────
      const faqSection = faqList.map((item, i) =>
        `│ *${i + 1}. ${item.q}*\n│    ↳ ${item.a}`
      ).join('\n│\n');

      // ── Build support message ───────────────────────────────────
      const supportMsg = `
╭━━━『 🆘 *SUPPORT & HELP* 』━━━╮

👋 *Hello +${senderNum}!*
_We are here to help you 24/7_ 💪

╭─『 📢 *Official Channel* 』
│ Join for updates & support:
│ ${OWNER.CHANNEL}
│
│ ✅ Bot setup assistance
│ ✅ Bug reports & issues
│ ✅ Feature requests
│ ✅ Updates & announcements
│ ✅ Tips & tricks
│ ✅ New plugin releases
╰──────────────────────────

╭─『 📞 *Contact Owner* 』
│ 👑 *Name:*    ${OWNER.FULL_NAME}
│ 📱 *Number:*  +${OWNER.NUMBER}
│ 💬 *Command:* \`${CONFIG.PREFIX}owner\`
│ ⏰ *Response: Within 24 hours*
╰──────────────────────────

╭─『 ❓ *FAQ - Quick Answers* 』
│
${faqSection}
│
╰──────────────────────────

╭─『 🔗 *Useful Links* 』
│ 📺 *YouTube:*
│ ${OWNER.YOUTUBE}
│
│ 🎵 *TikTok:*
│ ${OWNER.TIKTOK}
│
│ 💻 *GitHub:*
│ https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
╰──────────────────────────

╭─『 💡 *Quick Commands* 』
│ \`${CONFIG.PREFIX}menu\`    → All commands list
│ \`${CONFIG.PREFIX}owner\`   → Owner contact
│ \`${CONFIG.PREFIX}alive\`   → Bot status check
│ \`${CONFIG.PREFIX}ping\`    → Speed test
│ \`${CONFIG.PREFIX}botinfo\` → Bot information
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      // ── Send support message ────────────────────────────────────
      await sock.sendMessage(from, {
        text: supportMsg,
      }, { quoted: msg });

      // ── Send channel link separately ────────────────────────────
      await sock.sendMessage(from, {
        text: `📢 *Join our WhatsApp Channel for instant support:*\n${OWNER.CHANNEL}`,
      }, { quoted: msg });

      // ✅ FIX: react via sock.sendMessage instead of msg.react()
      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error('[SUPPORT ERROR]:', error.message);
      try {
        // ✅ FIX: react via sock.sendMessage instead of msg.react()
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Support command error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Support command error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
