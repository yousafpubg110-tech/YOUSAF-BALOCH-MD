/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Unit Converter        ┃
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

const CONVERSIONS = {
  // Length
  km: { to: 'miles', fn: v => v * 0.621371, reverse: { from: 'miles', fn: v => v / 0.621371 } },
  miles: { to: 'km', fn: v => v / 0.621371 },
  meter: { to: 'feet', fn: v => v * 3.28084 },
  feet: { to: 'meter', fn: v => v / 3.28084 },
  cm: { to: 'inch', fn: v => v / 2.54 },
  inch: { to: 'cm', fn: v => v * 2.54 },
  // Weight
  kg: { to: 'pounds', fn: v => v * 2.20462 },
  pounds: { to: 'kg', fn: v => v / 2.20462 },
  gram: { to: 'ounce', fn: v => v / 28.3495 },
  ounce: { to: 'gram', fn: v => v * 28.3495 },
  // Temperature
  celsius: { to: 'fahrenheit', fn: v => (v * 9 / 5) + 32 },
  fahrenheit: { to: 'celsius', fn: v => (v - 32) * 5 / 9 },
  // Volume
  liter: { to: 'gallon', fn: v => v * 0.264172 },
  gallon: { to: 'liter', fn: v => v / 0.264172 },
  ml: { to: 'oz_fluid', fn: v => v / 29.5735 },
  // Speed
  kmh: { to: 'mph', fn: v => v * 0.621371 },
  mph: { to: 'kmh', fn: v => v / 0.621371 },
  // Data
  mb: { to: 'gb', fn: v => v / 1024 },
  gb: { to: 'mb', fn: v => v * 1024 },
  tb: { to: 'gb', fn: v => v * 1024 },
};

function convert(value, fromUnit) {
  const unit = CONVERSIONS[fromUnit.toLowerCase()];
  if (!unit) return null;
  const result = unit.fn(value);
  return { result: parseFloat(result.toFixed(6)), to: unit.to };
}

export default {
  command    : ['convert', 'unit', 'unitconv'],
  name       : 'tool-unit-convert',
  category   : 'Tools',
  description: 'Convert units — length, weight, temperature, speed',
  usage      : '.convert <value> <unit>',
  cooldown   : 2,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔄');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `╭━━━『 🔄 *UNIT CONVERTER* 』━━━╮

📌 *Usage:* \`${CONFIG.PREFIX}convert <value> <unit>\`

💡 *Examples:*
▸ \`${CONFIG.PREFIX}convert 100 km\`
▸ \`${CONFIG.PREFIX}convert 37 celsius\`
▸ \`${CONFIG.PREFIX}convert 75 kg\`
▸ \`${CONFIG.PREFIX}convert 60 mph\`

╭─『 📐 *Units Supported* 』
│ 📏 km miles meter feet cm inch
│ ⚖️ kg pounds gram ounce
│ 🌡️ celsius fahrenheit
│ 🚗 kmh mph
│ 💾 mb gb tb
│ 🥤 liter gallon ml
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      const parts = input.split(/\s+/);
      const value = parseFloat(parts[0]);
      const unit  = parts[1] || '';

      if (isNaN(value) || !unit) {
        return await sock.sendMessage(from, {
          text: `❌ *Invalid format!*\n\n📌 Usage: \`${CONFIG.PREFIX}convert 100 km\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const result = convert(value, unit);
      if (!result) {
        return await sock.sendMessage(from, {
          text: `❌ *Unit "${unit}" not supported!*\n\n💡 Try: km, miles, kg, celsius, mph, etc.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `╭━━━『 🔄 *UNIT CONVERTER* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 ✅ *Result* 』
│ 📥 *Input:*  ${value} ${unit}
│ 📤 *Output:* *${result.result} ${result.to}*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[UNIT CONV ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Conversion failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
