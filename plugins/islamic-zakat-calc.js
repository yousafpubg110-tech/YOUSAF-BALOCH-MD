/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Zakat Calculator      ┃
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

// ─── Owner Footer ─────────────────────────────────────────────────────────────
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

// ─── Nisab Values (Updated 2025-2026) ─────────────────────────────────────────
const NISAB = {
  gold  : { grams: 87.48,  pkrPerGram: 26000, name: 'Gold (87.48g)'   },
  silver: { grams: 612.36, pkrPerGram: 310,   name: 'Silver (612.36g)' },
};

// ─── Zakat Rate ───────────────────────────────────────────────────────────────
const ZAKAT_RATE = 0.025; // 2.5%

// ─── Helper: Format PKR ───────────────────────────────────────────────────────
function formatPKR(amount) {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

// ─── Helper: Parse amount from text ──────────────────────────────────────────
function parseAmount(text) {
  // Remove commas, Rs., rupees etc.
  const clean = text
    .replace(/rs\.?|rupees?|pkr|lakh|lac/gi, '')
    .replace(/,/g, '')
    .trim();

  // Handle lakh
  if (/lakh|lac/i.test(text)) {
    return parseFloat(clean) * 100000;
  }

  return parseFloat(clean);
}

// ─── Helper: Detect input type ────────────────────────────────────────────────
function detectType(input) {
  const lower = (input || '').toLowerCase();
  if (/gold|sona|سونا/.test(lower))          return 'gold';
  if (/silver|chandi|چاندی/.test(lower))     return 'silver';
  if (/cash|paise|رقم|نقد/.test(lower))      return 'cash';
  if (/business|karobar|کاروبار/.test(lower)) return 'business';
  if (/total|sab|سب|all/.test(lower))        return 'total';
  return 'cash'; // default
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['zakat', 'zakaat', 'زکات', 'zakath'],
  name       : 'islamic-zakat-calc',
  category   : 'Islamic',
  description: 'Calculate Zakat on wealth, gold, silver, cash',
  usage      : '.zakat <amount>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('☪️');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── No input — show guide ───────────────────────────────
      if (!text || !text.trim()) {
        const nisabGold   = NISAB.gold.grams * NISAB.gold.pkrPerGram;
        const nisabSilver = NISAB.silver.grams * NISAB.silver.pkrPerGram;

        return await sock.sendMessage(from, {
          text: `☪️ *زکات کیلکولیٹر*

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

📌 *Usage:*
\`${CONFIG.PREFIX}zakat <amount>\`

💡 *Examples:*
▸ \`${CONFIG.PREFIX}zakat 500000\`
▸ \`${CONFIG.PREFIX}zakat 5 lakh\`
▸ \`${CONFIG.PREFIX}zakat gold 100g\`
▸ \`${CONFIG.PREFIX}zakat silver 500g\`
▸ \`${CONFIG.PREFIX}zakat total cash=200000 gold=50g\`

╭─『 📊 *Nisab 2025-26* 』
│ 🥇 *Gold Nisab:*   ${formatPKR(nisabGold)}
│    (87.48 grams of gold)
│
│ 🥈 *Silver Nisab:* ${formatPKR(nisabSilver)}
│    (612.36 grams of silver)
│
│ 💰 *Zakat Rate:*   2.5%
│ 📅 *Condition:*    1 year ownership
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const input = text.trim();
      const type  = detectType(input);

      // ── Parse gold grams ────────────────────────────────────
      if (type === 'gold') {
        const gramsMatch = input.match(/(\d+\.?\d*)\s*g/i);
        const grams      = gramsMatch ? parseFloat(gramsMatch[1]) : 0;

        if (!grams) {
          return await sock.sendMessage(from, {
            text: `❌ *Please specify gold in grams!*\n\n💡 Example: \`${CONFIG.PREFIX}zakat gold 100g\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const goldValue  = grams * NISAB.gold.pkrPerGram;
        const nisabValue = NISAB.gold.grams * NISAB.gold.pkrPerGram;
        const zakatDue   = goldValue >= nisabValue ? goldValue * ZAKAT_RATE : 0;

        const goldMsg = `╭━━━『 ☪️ *زکات — سونا* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 🥇 *Gold Details* 』
│ ⚖️ *Gold:*       ${grams}g
│ 💰 *Value:*      ${formatPKR(goldValue)}
│ 📊 *Rate/gram:*  ${formatPKR(NISAB.gold.pkrPerGram)}
╰──────────────────────────

╭─『 📏 *Nisab Check* 』
│ 📐 *Nisab:*      ${formatPKR(nisabValue)}
│ ✅ *Status:*     ${goldValue >= nisabValue ? '✅ Zakat Wajib ہے' : '❌ Nisab Poori Nahi'}
╰──────────────────────────

${zakatDue > 0 ? `╭─『 💸 *Zakat Due* 』
│ 🕌 *Zakat (2.5%):* *${formatPKR(zakatDue)}*
│ 📅 *Per Month:*    ${formatPKR(zakatDue / 12)}
╰──────────────────────────` : `╭─『 ℹ️ *Info* 』
│ آپ کا سونا نصاب سے کم ہے
│ زکات واجب نہیں ہے
╰──────────────────────────`}

╭─『 ☪️ *Hadith* 』
│ _"زکات ادا کرنا فرض ہے_
│ _ہر صاحب نصاب مسلمان پر"_
│ *(Sahih Bukhari)*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { text: goldMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Parse silver grams ──────────────────────────────────
      if (type === 'silver') {
        const gramsMatch = input.match(/(\d+\.?\d*)\s*g/i);
        const grams      = gramsMatch ? parseFloat(gramsMatch[1]) : 0;

        if (!grams) {
          return await sock.sendMessage(from, {
            text: `❌ *Please specify silver in grams!*\n\n💡 Example: \`${CONFIG.PREFIX}zakat silver 500g\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const silverValue = grams * NISAB.silver.pkrPerGram;
        const nisabValue  = NISAB.silver.grams * NISAB.silver.pkrPerGram;
        const zakatDue    = silverValue >= nisabValue ? silverValue * ZAKAT_RATE : 0;

        const silverMsg = `╭━━━『 ☪️ *زکات — چاندی* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 🥈 *Silver Details* 』
│ ⚖️ *Silver:*     ${grams}g
│ 💰 *Value:*      ${formatPKR(silverValue)}
│ 📊 *Rate/gram:*  ${formatPKR(NISAB.silver.pkrPerGram)}
╰──────────────────────────

╭─『 📏 *Nisab Check* 』
│ 📐 *Nisab:*      ${formatPKR(nisabValue)}
│ ✅ *Status:*     ${silverValue >= nisabValue ? '✅ Zakat Wajib ہے' : '❌ Nisab Poori Nahi'}
╰──────────────────────────

${zakatDue > 0 ? `╭─『 💸 *Zakat Due* 』
│ 🕌 *Zakat (2.5%):* *${formatPKR(zakatDue)}*
╰──────────────────────────` : ''}

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { text: silverMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Default: Cash / Total ───────────────────────────────
      const amount = parseAmount(input);

      if (isNaN(amount) || amount <= 0) {
        return await sock.sendMessage(from, {
          text: `❌ *Invalid amount!*\n\n💡 Example: \`${CONFIG.PREFIX}zakat 500000\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const nisabGold   = NISAB.gold.grams   * NISAB.gold.pkrPerGram;
      const nisabSilver = NISAB.silver.grams * NISAB.silver.pkrPerGram;
      const nisabMin    = Math.min(nisabGold, nisabSilver);
      const zakatDue    = amount >= nisabMin ? amount * ZAKAT_RATE : 0;
      const isWajib     = amount >= nisabMin;

      const zakatMsg = `╭━━━『 ☪️ *زکات کیلکولیٹر* 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

👋 *Requested by:* +${senderNum}

╭─『 💰 *Your Wealth* 』
│ 💵 *Total Amount:* ${formatPKR(amount)}
╰──────────────────────────

╭─『 📏 *Nisab 2025-26* 』
│ 🥇 *Gold Nisab:*   ${formatPKR(nisabGold)}
│ 🥈 *Silver Nisab:* ${formatPKR(nisabSilver)}
│ 📌 *Min Nisab:*    ${formatPKR(nisabMin)}
╰──────────────────────────

╭─『 ✅ *Zakat Status* 』
│ 📊 *Nisab Reached:* ${isWajib ? '✅ ہاں — Zakat Wajib' : '❌ نہیں — Zakat Wajib Nahi'}
╰──────────────────────────

${isWajib ? `╭─『 💸 *Zakat Due (2.5%)* 』
│ 🕌 *Total Zakat:*  *${formatPKR(zakatDue)}*
│ 📅 *Per Month:*    ${formatPKR(zakatDue / 12)}
│ 📅 *Per Week:*     ${formatPKR(zakatDue / 52)}
╰──────────────────────────

╭─『 🤲 *Zakat Dua* 』
│ _اَللّٰھُمَّ اجْعَلْھَا مَغْنَمًا_
│ _وَلَا تَجْعَلْھَا مَغْرَمًا_
│ "اے اللہ اسے غنیمت بنا دے
│ اور نقصان نہ بنا"
╰──────────────────────────` : `╭─『 ℹ️ *Info* 』
│ آپ کی دولت نصاب سے کم ہے
│ ابھی زکات فرض نہیں
│ اللہ برکت دے — آمین 🤲
╰──────────────────────────`}

╭─『 ☪️ *Reminder* 』
│ زکات غریبوں کا حق ہے
│ ادا کریں اللہ کی رضا کیلئے
│ *آمین يا رب العالمين*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: zakatMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[ZAKAT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Zakat calc failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
