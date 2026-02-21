/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║            YOUSAF-BALOCH-MD — CORE CONFIGURATION                ║
 * ║            Created by: Muhammad Yousaf Baloch                   ║
 * ║            Version: 2.0.0  |  500+ Commands                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * FILE STRUCTURE:
 *  [SECTION 1] — OWNER IDENTITY   (LOCKED — DO NOT TOUCH)
 *  [SECTION 2] — BOT SETTINGS     (freely editable via .env)
 *  [SECTION 3] — SYSTEM CONSTANTS (internal — do not modify)
 *
 * ⚠️  WARNING: Section 1 is protected.
 *     Owner name and social links cannot be changed.
 *     All other settings are freely editable via .env file.
 */

import { config } from 'dotenv';
config();

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 1]  🔒 OWNER IDENTITY — LOCKED — READ ONLY
//  These values are the intellectual identity of the project creator.
//  They cannot be overridden by environment variables.
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

  // 🔒 Social Links — LOCKED
  YOUTUBE:  'https://www.youtube.com/@Yousaf_Baloch_Tech',
  TIKTOK:   'https://www.tiktok.com/@yousaf_baloch_tech',
  CHANNEL:  'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
  GITHUB:   'https://github.com/musakhanbaloch03-sad',
  REPO:     'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
  WHATSAPP: 'https://wa.me/923710636110',
});

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 2]  ✅ BOT SETTINGS — FREELY EDITABLE
//  Change these via .env file or environment variables.
// ═══════════════════════════════════════════════════════════════════

export const CONFIG = {

  // ── Session ───────────────────────────────────────────────────
  // Get your Session ID from YOUSAF-PAIRING-V1
  SESSION_ID: process.env.SESSION_ID || '',

  // ── Commands ──────────────────────────────────────────────────
  // Bot command prefix (default: .)
  PREFIX: process.env.PREFIX || '.',

  // ── Mode ──────────────────────────────────────────────────────
  // 'public'  = everyone can use the bot
  // 'private' = only owner can use the bot
  MODE: (process.env.MODE || 'public').toLowerCase(),

  // ── Bot Name ──────────────────────────────────────────────────
  // Display name used in messages
  APP_NAME: process.env.APP_NAME || OWNER.BOT_NAME,

  // ── Timezone & Language ───────────────────────────────────────
  TIMEZONE: process.env.TIMEZONE || 'Asia/Karachi',
  LANGUAGE: process.env.LANGUAGE || 'en',

  // ── Auto Features ─────────────────────────────────────────────
  // Auto read messages (blue tick)
  AUTO_READ: process.env.AUTO_READ === 'true',

  // Auto view status updates
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === 'true',

  // Auto like status updates
  AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS === 'true',

  // Auto react to messages
  AUTO_REACT: process.env.AUTO_REACT === 'true',

  // ── Anti Features ─────────────────────────────────────────────
  // Block invite links in groups
  ANTI_LINK: process.env.ANTI_LINK === 'true',

  // Block bad words in groups
  ANTI_BAD: process.env.ANTI_BAD === 'true',

  // Block spam in groups
  ANTI_SPAM: process.env.ANTI_SPAM === 'true',

  // Auto reject incoming calls
  ANTI_CALL: process.env.ANTI_CALL === 'true',

  // Block view-once media (auto saves)
  ANTI_VIEW_ONCE: process.env.ANTI_VIEW_ONCE === 'true',

  // ── Group Features ────────────────────────────────────────────
  // Welcome new members
  WELCOME: process.env.WELCOME === 'true',

  // Goodbye message on leave
  GOODBYE: process.env.GOODBYE === 'true',

  // Max warnings before kick
  MAX_WARN: parseInt(process.env.MAX_WARN) || 3,

  // ── Deployment ────────────────────────────────────────────────
  // Heroku app name (keep-alive)
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',

  // Keep-alive URL
  KEEP_ALIVE_URL: process.env.KEEP_ALIVE_URL || '',
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
  MAX_FILE_SIZE   : 100 * 1024 * 1024, // 100MB
  COOLDOWN_MS     : 3000,
  COMMAND_TIMEOUT : 30000,

  // Brand watermark — bottom of all bot messages
  WATERMARK: `\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n⚡ *${OWNER.BOT_NAME}* by *${OWNER.FULL_NAME}*\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,

  // Short watermark for quick replies
  SHORT_WATERMARK: `\n_⚡ ${OWNER.BOT_NAME}_`,

  // Footer for menu messages
  FOOTER: `👑 Owner: ${OWNER.FULL_NAME}\n🎵 ${OWNER.TIKTOK}\n🎬 ${OWNER.YOUTUBE}`,
});

// ═══════════════════════════════════════════════════════════════════
//  STARTUP VALIDATOR
//  SESSION_ID is optional — bot waits for pairing if not set.
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

export default { OWNER, CONFIG, SYSTEM, validateConfig };
