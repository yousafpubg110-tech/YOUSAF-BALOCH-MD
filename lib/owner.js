/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Owner System      ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

// FIX: module.exports removed — ES Module system use ho raha hai (type: module in package.json)
// FIX: OWNER config.js se import hoga — duplicate data nahi rahega
import { OWNER as OWNER_CONFIG } from '../config.js';

// FIX: Consistent OWNER object — config.js se match karta hai
export const OWNER = Object.freeze({
  name:      OWNER_CONFIG.NAME,
  fullName:  OWNER_CONFIG.FULL_NAME,
  phone:     [OWNER_CONFIG.NUMBER],
  jid:       OWNER_CONFIG.JID,
  country:   'Pakistan 🇵🇰',

  whatsapp:  `https://wa.me/${OWNER_CONFIG.NUMBER}`,
  channel:   OWNER_CONFIG.CHANNEL,
  youtube:   OWNER_CONFIG.YOUTUBE,
  tiktok:    OWNER_CONFIG.TIKTOK,
  github:    OWNER_CONFIG.GITHUB,

  botName:   OWNER_CONFIG.BOT_NAME,
  version:   OWNER_CONFIG.VERSION,
  edition:   'Ultra Pro Premium',

  copyright: `© ${OWNER_CONFIG.YEAR} ${OWNER_CONFIG.FULL_NAME}`,
});

/**
 * Check if sender is owner
 */
export function isOwner(sender) {
  if (!sender) return false;
  const number = sender.replace(/[^0-9]/g, '');
  return OWNER.phone.includes(number);
}

/**
 * Get owner JID
 */
export function getOwnerJid() {
  return OWNER_CONFIG.JID;
}

/**
 * Get owner info as formatted text
 */
export function getOwnerInfo() {
  return `👑 *${OWNER.fullName}*
📱 wa.me/${OWNER_CONFIG.NUMBER}
🎵 ${OWNER.tiktok}
🎬 ${OWNER.youtube}
📢 ${OWNER.channel}
💻 ${OWNER.github}
⚡ ${OWNER.botName} v${OWNER.version} | ${OWNER.edition}
${OWNER.copyright}`;
}

export default OWNER;
