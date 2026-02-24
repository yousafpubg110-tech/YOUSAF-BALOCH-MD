/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║            YOUSAF-BALOCH-MD — CORE CONFIGURATION                ║
 * ║            Created by: Muhammad Yousaf Baloch                   ║
 * ║            Version: 2.0.0  |  500+ Commands                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { config } from 'dotenv';
config();

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 1]  🔒 OWNER IDENTITY — LOCKED — READ ONLY
// ═══════════════════════════════════════════════════════════════════

export const OWNER = Object.freeze({
  NAME:      'Yousuf Baloch',
  FULL_NAME: 'Muhammad Yousaf Baloch',
  NUMBER:    '923710636110',
  JID:       '923710636110@s.whatsapp.net',
  BOT_NAME:  'YOUSAF-BALOCH-MD',
  VERSION:   '2.0.0',
  YEAR:      '2026',
  COUNTRY:   'Pakistan',

  // ✅ FIX: TikTok link corrected
  YOUTUBE:  'https://www.youtube.com/@Yousaf_Baloch_Tech',
  TIKTOK:   'https://tiktok.com/@loser_boy.110',
  CHANNEL:  'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
  GITHUB:   'https://github.com/musakhanbaloch03-sad',
  REPO:     'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
  WHATSAPP: 'https://wa.me/923710636110',
});

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 2]  ✅ BOT SETTINGS — FREELY EDITABLE
// ═══════════════════════════════════════════════════════════════════

export const CONFIG = {

  SESSION_ID: process.env.SESSION_ID || '',
  PREFIX:     process.env.PREFIX     || '.',
  MODE:       (process.env.MODE      || 'public').toLowerCase(),
  APP_NAME:   process.env.APP_NAME   || OWNER.BOT_NAME,
  TIMEZONE:   process.env.TIMEZONE   || 'Asia/Karachi',
  LANGUAGE:   process.env.LANGUAGE   || 'en',

  // Auto Features
  AUTO_READ:        process.env.AUTO_READ        === 'true',
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === 'true',
  AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS === 'true',
  AUTO_REACT:       process.env.AUTO_REACT       === 'true',

  // Anti Features
  ANTI_LINK:      process.env.ANTI_LINK      === 'true',
  ANTI_BAD:       process.env.ANTI_BAD       === 'true',
  ANTI_SPAM:      process.env.ANTI_SPAM      === 'true',
  ANTI_CALL:      process.env.ANTI_CALL      === 'true',
  ANTI_VIEW_ONCE: process.env.ANTI_VIEW_ONCE === 'true',

  // Group Features
  WELCOME:  process.env.WELCOME  === 'true',
  GOODBYE:  process.env.GOODBYE  === 'true',
  MAX_WARN: parseInt(process.env.MAX_WARN) || 3,

  // Deployment
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
  KEEP_ALIVE_URL:  process.env.KEEP_ALIVE_URL  || '',
};

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 3]  ⚙️  SYSTEM CONSTANTS — DO NOT MODIFY
// ═══════════════════════════════════════════════════════════════════

export const SYSTEM = Object.freeze({
  BAILEYS_VERSION : process.env.BAILEYS_VERSION || '6.7.9',
  NODE_MIN        : '18.0.0',
  SESSION_DIR     : './session',
  TEMP_DIR        : './temp',
  PLUGINS_DIR     : './plugins',
  DB_DIR          : './database',
  LOGS_DIR        : './logs',
  MAX_FILE_SIZE   : 100 * 1024 * 1024,
  COOLDOWN_MS     : 3000,
  COMMAND_TIMEOUT : 30000,

  WATERMARK:       `\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n⚡ *${OWNER.BOT_NAME}* by *${OWNER.FULL_NAME}*\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,
  SHORT_WATERMARK: `\n_⚡ ${OWNER.BOT_NAME}_`,
  FOOTER:          `👑 Owner: ${OWNER.FULL_NAME}\n🎵 ${OWNER.TIKTOK}\n🎬 ${OWNER.YOUTUBE}`,
});

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 4]  ✅ NEW — ownerFooter() FUNCTION
//  Used by all 160 plugins at the bottom of messages
// ═══════════════════════════════════════════════════════════════════

export function ownerFooter() {
  return `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃ 👑 *${OWNER.FULL_NAME}*
┃ 📱 +${OWNER.NUMBER}
┃ 🎵 ${OWNER.TIKTOK}
┃ 📺 ${OWNER.YOUTUBE}
┃ 📢 ${OWNER.CHANNEL}
┃ 💻 ${OWNER.GITHUB}
╰━━━━━━━━━━━━━━━━━━━━━━╯
_⚡ ${OWNER.BOT_NAME} v${OWNER.VERSION}_`;
}

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 5]  ✅ NEW — isOwner() HELPER
//  Use in any plugin: if (!isOwner(sender)) return
// ═══════════════════════════════════════════════════════════════════

export function isOwner(sender) {
  return sender?.split('@')[0] === OWNER.NUMBER;
}

// ═══════════════════════════════════════════════════════════════════
//  STARTUP VALIDATOR
// ═══════════════════════════════════════════════════════════════════

export function validateConfig() {
  const errors   = [];
  const warnings = [];

  if (!['public', 'private'].includes(CONFIG.MODE)) {
    errors.push(`Invalid MODE "${CONFIG.MODE}". Use: public | private`);
  }

  if (!CONFIG.PREFIX || CONFIG.PREFIX.length > 3) {
    errors.push('PREFIX must be 1-3 characters.');
  }

  if (!CONFIG.SESSION_ID) {
    warnings.push('SESSION_ID not set. Use YOUSAF-PAIRING-V1 to generate one.');
  }

  warnings.forEach(w => console.warn(`[CONFIG WARN] ⚠️  ${w}`));
  return errors;
}

export default { OWNER, CONFIG, SYSTEM, ownerFooter, isOwner, validateConfig };
