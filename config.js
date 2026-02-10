// ╔══════════════════════════════════════════════════════════════╗
// ║           YOUSAF-BALOCH-MD  •  BOT CONFIG                   ║
// ║                 Created by Yousuf Baloch                    ║
// ║    🔒 LOCKED — Owner info cannot be changed by any user     ║
// ╚══════════════════════════════════════════════════════════════╝

// ℹ️  Cloud platforms (Heroku, Koyeb, Render, Railway) inject env vars directly.
//    For local dev, create a .env file. dotenv is loaded by index.js if present.

// ═══════════════════════════════════════════════════════════════
// 🔒  HARDCODED — CANNOT BE OVERRIDDEN BY ENV VARS OR CONFIG
//     Even if a user sets OWNER_NAME in Heroku config vars,
//     it will NOT take effect. These values are locked in code.
// ═══════════════════════════════════════════════════════════════
const LOCKED = Object.freeze({
    OWNER_NAME      : 'Yousuf Baloch',
    OWNER_NUMBER    : '923710636110',
    TIKTOK          : 'https://tiktok.com/@loser_boy.110',
    YOUTUBE         : 'https://www.youtube.com/@Yousaf_Baloch_Tech',
    WA_CHANNEL      : 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
    GITHUB          : 'https://github.com/musakhanbaloch03-sad',
    MAIN_REPO       : 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
    PAIRING_REPO    : 'https://github.com/musakhanbaloch03-sad/YOUSAF-PAIRING-V1',
    BOT_NAME        : 'YOUSAF BALOCH MD',
    VERSION         : '2.0.0',
    LOGO_URL        : 'https://i.ibb.co/FbyCnmMX/shaban-md.jpg',
});

// ═══════════════════════════════════════════════════════════════
// 🔓  EDITABLE — Users may customize ONLY these via env vars
// ═══════════════════════════════════════════════════════════════
const USER = {
    SESSION_ID      : process.env.SESSION_ID       || '',
    PREFIX          : process.env.PREFIX           || '.',
    MODE            : (process.env.MODE            || 'public').toLowerCase(),
    APP_NAME        : process.env.APP_NAME         || 'yousaf-baloch-md',
    TIMEZONE        : process.env.TIMEZONE         || 'Asia/Karachi',

    // Feature toggles
    AUTO_READ       : process.env.AUTO_READ        === 'true',
    AUTO_STATUS     : process.env.AUTO_STATUS      === 'true',
    ANTI_DELETE     : process.env.ANTI_DELETE      === 'true',
    WELCOME_MSG     : process.env.WELCOME_MSG      !== 'false',
    AUTO_TYPING     : process.env.AUTO_TYPING      === 'true',
    ALWAYS_ONLINE   : process.env.ALWAYS_ONLINE    === 'true',
    READ_CMD        : process.env.READ_CMD         !== 'false',
    AUTO_RECORDING  : process.env.AUTO_RECORDING   !== 'false',
    AUTO_REPLY      : process.env.AUTO_REPLY       !== 'false',
};

// ═══════════════════════════════════════════════════════════════
// 🔗  DERIVED HELPERS
// ═══════════════════════════════════════════════════════════════
const DERIVED = Object.freeze({
    IS_PUBLIC       : USER.MODE === 'public',
    OWNER_JID       : `${LOCKED.OWNER_NUMBER}@s.whatsapp.net`,

    // ── Ultra-Pro Success Message ──────────────────────────────
    getSuccessMessage(sessionId) {
        return `╔═══════════════════════════════════╗
║   ✅  BOT CONNECTED SUCCESSFULLY  ║
╚═══════════════════════════════════╝

🎉 *${LOCKED.BOT_NAME}* is now live!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 *SESSION ID* _(for deployment)_:
\`\`\`${sessionId}\`\`\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 *DEPLOY ON ANY PLATFORM*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ *Heroku* — ${LOCKED.MAIN_REPO}
▸ *Render* — ${LOCKED.MAIN_REPO}
▸ *Railway* — ${LOCKED.MAIN_REPO}
▸ *Koyeb* — ${LOCKED.MAIN_REPO}
▸ *Replit* — ${LOCKED.MAIN_REPO}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 *DEVELOPER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 *Name:* ${LOCKED.OWNER_NAME}
📞 *WhatsApp:* wa.me/${LOCKED.OWNER_NUMBER}
🐙 *GitHub:* ${LOCKED.GITHUB}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *FOLLOW & SUPPORT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📺 *YouTube:*
${LOCKED.YOUTUBE}

🎵 *TikTok:*
${LOCKED.TIKTOK}

📢 *WhatsApp Channel:*
${LOCKED.WA_CHANNEL}

🐙 *GitHub:*
${LOCKED.GITHUB}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ _Star the repo & subscribe!_
_Made with ❤️ by ${LOCKED.OWNER_NAME}_`;
    },
});

// ═══════════════════════════════════════════════════════════════
// 📤  FINAL EXPORT  (LOCKED properties always win)
// ═══════════════════════════════════════════════════════════════
const FINAL_CONFIG = Object.freeze({
    ...USER,
    ...LOCKED,   // ← LOCKED always overwrites USER for same keys
    ...DERIVED,
});

export default FINAL_CONFIG;

// ═══════════════════════════════════════════════════════════════
// 🔍  STARTUP VALIDATION
// ═══════════════════════════════════════════════════════════════
const C = {
    reset : '\x1b[0m', bold : '\x1b[1m',
    cyan  : '\x1b[96m', gold : '\x1b[93m',
    green : '\x1b[92m', red  : '\x1b[91m',
};

if (!USER.SESSION_ID && process.env.NODE_ENV !== 'development') {
    console.warn(`${C.gold}⚠️  SESSION_ID is empty — bot may not connect!${C.reset}`);
    console.warn(`${C.gold}   Get your session at: ${LOCKED.PAIRING_REPO}${C.reset}`);
}

if (!['public', 'private'].includes(USER.MODE)) {
    console.warn(`${C.gold}⚠️  Invalid MODE "${USER.MODE}" — defaulting to "public"${C.reset}`);
}

console.log(`
${C.cyan}${C.bold}╔═══════════════════════════════════════════╗
║  🤖  ${LOCKED.BOT_NAME} v${LOCKED.VERSION}  ║
╚═══════════════════════════════════════════╝${C.reset}
${C.green}  👤 Owner  :${C.reset} ${LOCKED.OWNER_NAME}
${C.green}  🔑 Prefix :${C.reset} ${USER.PREFIX}
${C.green}  🔧 Mode   :${C.reset} ${USER.MODE.toUpperCase()}
${C.green}  🌐 Public :${C.reset} ${DERIVED.IS_PUBLIC ? 'Yes' : 'No'}
`);
