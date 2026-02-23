/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Currency Converter    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

async function getExchangeRate(from, to) {
  // ✅ CodeQL Fix
  const url = new URL(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
  if (url.hostname !== 'api.exchangerate-api.com') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Rate API error: ${res.status}`);
    const data = await res.json();
    const rate  = data?.rates?.[to.toUpperCase()];
    if (!rate) throw new Error(`Currency "${to}" not found`);
    return { rate, base: from.toUpperCase(), date: data?.date || 'Today' };
  } finally { clearTimeout(timer); }
}

const CURRENCY_FLAGS = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', PKR: '🇵🇰',
  SAR: '🇸🇦', AED: '🇦🇪', INR: '🇮🇳', CNY: '🇨🇳',
  JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺', TRY: '🇹🇷',
};

export default {
  command    : ['currency', 'rate', 'exchange', 'forex'],
  name       : 'tool-currency',
  category   : 'Tools',
  description: 'Live currency converter — PKR, USD, EUR, etc.',
  usage      : '.currency <amount> <FROM> <TO>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💱');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toUpperCase();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 💱 *CURRENCY CONVERTER* 』━━━╮

📌 *Usage:* \`${CONFIG.PREFIX}currency <amount> <FROM> <TO>\`

💡 *Examples:*
▸ \`${CONFIG.PREFIX}currency 100 USD PKR\`
▸ \`${CONFIG.PREFIX}currency 1 GBP PKR\`
▸ \`${CONFIG.PREFIX}currency 500 SAR INR\`
▸ \`${CONFIG.PREFIX}rate 1 EUR USD\`

🌍 *Popular Currencies:*
│ 🇺🇸 USD  🇪🇺 EUR  🇬🇧 GBP
│ 🇵🇰 PKR  🇸🇦 SAR  🇦🇪 AED
│ 🇮🇳 INR  🇨🇳 CNY  🇹🇷 TRY

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const parts  = input.split(/\s+/);
      const amount = parseFloat(parts[0]);
      const fromC  = parts[1] || 'USD';
      const toC    = parts[2] || 'PKR';

      if (isNaN(amount)) {
        return await sock.sendMessage(from, {
          text: `❌ *Invalid amount!*\n\n📌 Usage: \`${CONFIG.PREFIX}currency 100 USD PKR\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const { rate, date } = await getExchangeRate(fromC, toC);
      const converted      = parseFloat((amount * rate).toFixed(2));
      const fromFlag       = CURRENCY_FLAGS[fromC] || '🌍';
      const toFlag         = CURRENCY_FLAGS[toC]   || '🌍';

      await sock.sendMessage(from, {
        text: `╭━━━『 💱 *CURRENCY CONVERTER* 』━━━╮

👋 *Requested by:* +${senderNum}
📅 *Rate Date:* ${date}

╭─『 💰 *Conversion* 』
│ ${fromFlag} *${amount} ${fromC}*
│         ↓
│ ${toFlag} *${converted} ${toC}*
╰──────────────────────────

╭─『 📊 *Rate* 』
│ 1 ${fromC} = ${rate.toFixed(4)} ${toC}
│ 1 ${toC} = ${(1 / rate).toFixed(4)} ${fromC}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[CURRENCY ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Currency conversion failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
