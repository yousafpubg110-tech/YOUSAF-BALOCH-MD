/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Owner Guard       ┃
┃       Created by MR YOUSAF BALOCH      ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

// ─── PROTECTED OWNER DATA ────────────────────────────────────────────────────
// WARNING: DO NOT EDIT — This file is protected.
// Changing owner info is a violation of bot terms.
// All data here is permanently locked via Object.freeze().
// ─────────────────────────────────────────────────────────────────────────────

const _PROTECTED_OWNER = Object.freeze({
  FULL_NAME  : 'Yousaf Baloch',
  BOT_NAME   : 'YOUSAF-BALOCH-MD',
  NUMBER     : '923710636110',
  VERSION    : '2.0.0',
  YEAR       : '2026',
  COUNTRY    : 'Pakistan',

  // ── Social Links — LOCKED ─────────────────────────────────
  YOUTUBE    : 'https://www.youtube.com/@Yousaf_Baloch_Tech',
  TIKTOK     : 'https://tiktok.com/@loser_boy.110',
  GITHUB     : 'https://github.com/musakhanbaloch03-sad',
  REPO       : 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
  CHANNEL    : 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
  WHATSAPP   : 'https://wa.me/923710636110',
});

// ─── RUNTIME PROTECTION ──────────────────────────────────────────────────────
// Prevents any runtime modification attempts
const OWNER_GUARD = new Proxy(_PROTECTED_OWNER, {

  set(target, key, value) {
    console.warn(
      `[OWNER GUARD] ⛔ Blocked attempt to modify "${String(key)}" → "${value}"`
    );
    return false; // Silently block — no crash
  },

  deleteProperty(target, key) {
    console.warn(
      `[OWNER GUARD] ⛔ Blocked attempt to delete "${String(key)}"`
    );
    return false;
  },

  defineProperty(target, key) {
    console.warn(
      `[OWNER GUARD] ⛔ Blocked attempt to redefine "${String(key)}"`
    );
    return false;
  },
});

// ─── INTEGRITY CHECKER ───────────────────────────────────────────────────────
// Runs on startup — verifies owner data is untampered
export function checkOwnerIntegrity() {
  const required = [
    'FULL_NAME', 'BOT_NAME', 'NUMBER',
    'YOUTUBE', 'TIKTOK', 'GITHUB',
    'CHANNEL', 'REPO',
  ];

  const missing = required.filter(key => !OWNER_GUARD[key]);

  if (missing.length > 0) {
    console.error(
      `[OWNER GUARD] ❌ CRITICAL: Missing owner fields: ${missing.join(', ')}`
    );
    process.exit(1); // Stop bot if owner data is corrupted
  }

  // Verify key values are unchanged
  const checks = [
    { key: 'NUMBER',   expected: '923710636110'              },
    { key: 'YOUTUBE',  expected: 'https://www.youtube.com/@Yousaf_Baloch_Tech' },
    { key: 'CHANNEL',  expected: 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j' },
  ];

  for (const { key, expected } of checks) {
    if (OWNER_GUARD[key] !== expected) {
      console.error(
        `[OWNER GUARD] ❌ TAMPERED: "${key}" has been modified!`
      );
      process.exit(1);
    }
  }

  console.log('[OWNER GUARD] ✅ Owner data integrity verified.');
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
export const OWNER = OWNER_GUARD;
export default OWNER_GUARD;
