/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║            YOUSAF-BALOCH-MD — CORE CONFIGURATION                ║
 * ║            Created by: Muhammad Yousaf Baloch                   ║
 * ║            Version: 2.0.0                                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * FILE STRUCTURE:
 *  [SECTION 1] — OWNER IDENTITY (HARDCODED — READ ONLY)
 *  [SECTION 2] — USER CONFIGURABLE SETTINGS (editable via .env)
 *  [SECTION 3] — SYSTEM CONSTANTS (DO NOT TOUCH)
 *
 * ⚠️  WARNING: Section 1 is protected. Editing owner branding
 *     violates the MIT License attribution clause of this project.
 */

import { config } from 'dotenv';
config();

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 1]  🔒 HARDCODED OWNER IDENTITY — PROTECTED — READ ONLY
//  These values are the intellectual identity of the project creator.
//  They cannot and should not be overridden by environment variables.
// ═══════════════════════════════════════════════════════════════════
export const OWNER = Object.freeze({
  NAME:      'Yousuf Baloch',
  FULL_NAME: 'Muhammad Yousaf Baloch',
  NUMBER:    '923710636110',
  JID:       '923710636110@s.whatsapp.net',
  TIKTOK:    'https://www.tiktok.com/@yousaf_baloch_tech',
  YOUTUBE:   'https://www.youtube.com/@Yousaf_Baloch_Tech',
  CHANNEL:   'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
  GITHUB:    'https://github.com/musakhanbaloch03-sad',
  BOT_NAME:  'YOUSAF-BALOCH-MD',
  VERSION:   '2.0.0',
  YEAR:      '2026',
});
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 2]  ✅ USER CONFIGURABLE SETTINGS
//  Users may freely change these via Environment Variables or .env
// ═══════════════════════════════════════════════════════════════════
export const CONFIG = {
  // Session ID from YOUSAF-PAIRING-V1
  SESSION_ID: process.env.SESSION_ID || '',

  // Bot prefix for commands
  PREFIX: process.env.PREFIX || '.',

  // Bot operation mode: 'public' = everyone | 'private' = owner only
  MODE: (process.env.MODE || 'public').toLowerCase(),

  // Custom bot name (user can rename the bot's display name)
  APP_NAME: process.env.APP_NAME || OWNER.BOT_NAME,

  // Auto-reply when user is not owner
  AUTO_READ: process.env.AUTO_READ === 'true',

  // Auto-read status updates
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === 'true',

  // Timezone for schedules and logs
  TIMEZONE: process.env.TIMEZONE || 'Asia/Karachi',

  // Language for bot responses
  LANGUAGE: process.env.LANGUAGE || 'en',

  // Heroku app name (for keep-alive pings)
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',

  // MongoDB URI (optional, for premium plugins)
  MONGO_URI: process.env.MONGO_URI || '',
};
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  [SECTION 3]  ⚙️  SYSTEM CONSTANTS — DO NOT MODIFY
// ═══════════════════════════════════════════════════════════════════
export const SYSTEM = Object.freeze({
  BAILEYS_VERSION: '6.7.9',
  NODE_MIN:        '18.0.0',
  SESSION_DIR:     './sessions',
  TEMP_DIR:        './temp',
  PLUGINS_DIR:     './plugins',

  // Ultra-Pro Premium brand watermark used in bot messages
  WATERMARK: `\n\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n⚡ *${OWNER.BOT_NAME}* by *${OWNER.FULL_NAME}*\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄`,

  // Short watermark for quick replies
  SHORT_WATERMARK: `\n_⚡ ${OWNER.BOT_NAME}_`,

  // Bot footer for menus
  FOOTER: `👑 Owner: ${OWNER.FULL_NAME}\n🎵 ${OWNER.TIKTOK}\n🎬 ${OWNER.YOUTUBE}`,
});
// ═══════════════════════════════════════════════════════════════════

// ── Validation on startup ────────────────────────────────────────────
export function validateConfig() {
  const errors = [];

  if (!CONFIG.SESSION_ID) {
    errors.push('SESSION_ID is not set. Get it from: https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1');
  }

  if (!['public', 'private'].includes(CONFIG.MODE)) {
    errors.push(`Invalid MODE "${CONFIG.MODE}". Use "public" or "private".`);
  }

  return errors;
}

export default { OWNER, CONFIG, SYSTEM, validateConfig };
