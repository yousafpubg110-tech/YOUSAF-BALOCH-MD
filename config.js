/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONFIG.JS - MAIN BOT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 👨‍💻 Developer: Muhammad Yousaf Baloch
 * 📱 WhatsApp: +923710636110
 * 📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
 * 🎵 TikTok: https://tiktok.com/@loser_boy.110
 * 📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
 * 🔗 Main Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 * 🔗 Pairing: https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const { OWNER_INFO } = require('./constants');

// ═══════════════════════════════════════════════════════════════════════════════
// 🔒 LOCKED CONFIGURATION (UNCHANGEABLE BY USERS)
// ═══════════════════════════════════════════════════════════════════════════════

const LOCKED_CONFIG = Object.freeze({
    // Owner Details (LOCKED)
    OWNER_NAME: OWNER_INFO.NAME,
    OWNER_NUMBER: OWNER_INFO.NUMBER,
    
    // Social Media Links (LOCKED)
    YOUTUBE_LINK: OWNER_INFO.YOUTUBE,
    TIKTOK_LINK: OWNER_INFO.TIKTOK,
    WHATSAPP_CHANNEL: OWNER_INFO.WHATSAPP_CHANNEL,
    
    // GitHub Links (LOCKED)
    GITHUB_PROFILE: OWNER_INFO.GITHUB,
    MAIN_REPO: OWNER_INFO.MAIN_REPO,
    PAIRING_REPO: OWNER_INFO.PAIRING_REPO,
    
    // Bot Info (LOCKED)
    BOT_NAME: OWNER_INFO.BOT_NAME,
    VERSION: OWNER_INFO.VERSION,
    AUTHOR: OWNER_INFO.AUTHOR
});

// ═══════════════════════════════════════════════════════════════════════════════
// ✏️ USER EDITABLE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const USER_CONFIG = {
    // Session (Required)
    SESSION_ID: process.env.SESSION_ID || '',
    
    // Bot Settings (User can edit these)
    PREFIX: process.env.PREFIX || '.',
    MODE: (process.env.MODE || 'public').toLowerCase(), // 'public' or 'private'
    
    // App Info
    APP_NAME: process.env.APP_NAME || 'yousaf-baloch-md',
    
    // Auto Features
    AUTO_READ: process.env.AUTO_READ === 'true',
    AUTO_BIO: process.env.AUTO_BIO === 'true',
    AUTO_TYPING: process.env.AUTO_TYPING === 'false',
    AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW === 'true',
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'false',
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL || './database.db',
    
    // Language & Timezone
    LANGUAGE: process.env.LANGUAGE || 'EN',
    TIME_ZONE: process.env.TIME_ZONE || 'Asia/Karachi',
    
    // Port
    PORT: process.env.PORT || 3000
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function isPublicMode() {
    return USER_CONFIG.MODE === 'public';
}

function isPrivateMode() {
    return USER_CONFIG.MODE === 'private';
}

function getMode() {
    return USER_CONFIG.MODE;
}

function hasValidSession() {
    return USER_CONFIG.SESSION_ID && USER_CONFIG.SESSION_ID.length > 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = {
    // Export locked config
    ...LOCKED_CONFIG,
    
    // Export user config
    ...USER_CONFIG,
    
    // Export helper functions
    isPublicMode,
    isPrivateMode,
    getMode,
    hasValidSession,
    
    // Export owner info
    OWNER_INFO
};

// Validation
if (!hasValidSession()) {
    console.warn('⚠️  WARNING: No SESSION_ID provided!');
}

console.log(`🤖 Bot Mode: ${getMode().toUpperCase()}`);
console.log(`🔑 Prefix: ${USER_CONFIG.PREFIX}`);
console.log(`👨‍💻 Owner: ${LOCKED_CONFIG.OWNER_NAME}`);
console.log(`📺 YouTube: ${LOCKED_CONFIG.YOUTUBE_LINK}`);
console.log(`🎵 TikTok: ${LOCKED_CONFIG.TIKTOK_LINK}`);
console.log(`📢 Channel: ${LOCKED_CONFIG.WHATSAPP_CHANNEL}`);
