/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Calculator Plugin   ┃
┃       Created by MR YOUSAF BALOCH        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Owner Footer ─────────────────────────────────────────────────────
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

// ─── Helper: Safe math ────────────────────────────────────────────────────────
function safeMath(expression) {
  const sanitized = expression
    .replace(/\s+/g,    '')
    .replace(/×/g,      '*')
    .replace(/÷/g,      '/')
    .replace(/π/g,      'Math.PI')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g,  'Math.abs(')
    .replace(/pow\(/g,  'Math.pow(')
    .replace(/log\(/g,  'Math.log10(')
    .replace(/ln\(/g,   'Math.log(')
    .replace(/sin\(/g,  'Math.sin(')
    .replace(/cos\(/g,  'Math.cos(')
    .replace(/tan\(/g,  'Math.tan(')
    .replace(/ceil\(/g, 'Math.ceil(')
    .replace(/floor\(/g,'Math.floor(')
    .replace(/round\(/g,'Math.round(');

  if (!/^[0-9+\-*/().%MathsqrablogincetPIflourde,]+$/.test(sanitized)) {
    throw new Error('Invalid characters in expression.');
  }

  // eslint-disable-next-line no-new-func
  const result = new Function(`'use strict'; return (${sanitized})`)();
  if (typeof result !== 'number') throw new Error('Result is not a number.');
  if (!isFinite(result))          throw new Error('Result is Infinity or NaN.');
  return { sanitized, result };
}

function formatResult(num) {
  if (Number.isInteger(num)) return num.toLocaleString();
  return parseFloat(num.toFixed(10)).toLocaleString();
}

function getOpType(expr) {
  if (/Math\.sqrt/.test(expr)) return '√ Square Root';
  if (/Math\.sin|cos|tan/.test(expr)) return '📐 Trigonometry';
  if (/Math\.log/.test(expr))  return '📊 Logarithm';
  if (/\*\*/.test(expr))       return '⬆️ Power';
  if (/[+]/.test(expr))        return '➕ Addition';
  if (/[-]/.test(expr))        return '➖ Subtraction';
  if (/[*]/.test(expr))        return '✖️ Multiplication';
  if (/[/]/.test(expr))        return '➗ Division';
  if (/[%]/.test(expr))        return '💯 Modulus';
  return '🔢 Calculation';
}

export default {
  command    : ['calc', 'calculator', 'math', 'calculate'],
  name       : 'calculator',
  category   : 'Tools',
  description: 'Safe mathematical expression evaluator',
  usage      : '.calc <expression>',
  cooldown   : 2,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔢');
      const senderNum = sender?.split('@')[0] || 'User';

      if (!text || !text.trim()) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a math expression!*\n\n📌 *Usage:* ${CONFIG.PREFIX}calc <expression>\n\n💡 *Examples:*\n▸ ${CONFIG.PREFIX}calc 25 * 4\n▸ ${CONFIG.PREFIX}calc sqrt(144)\n▸ ${CONFIG.PREFIX}calc (50 + 30) * 2\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const { sanitized, result } = safeMath(text.trim());
      const opType    = getOpType(sanitized);
      const formatted = formatResult(result);

      const calcMsg = `╭━━━『 🔢 *CALCULATOR* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📝 *Expression* 』
│ ${text.trim()}
╰──────────────────────────

╭─『 💡 *Result* 』
│ 🎯 *Answer:* ${formatted}
│ 📊 *Type:*   ${opType}
╰──────────────────────────

╭─『 ✅ *Supported* 』
│ ➕ + ➖ - ✖️ * ➗ / 💯 %
│ sqrt() sin() cos() tan()
│ log() ln() pow() π
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`.trim();

      await sock.sendMessage(from, { text: calcMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[CALC ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Invalid Expression!*\n\n⚠️ ${error.message}\n\n💡 Example: ${CONFIG.PREFIX}calc 25 * 4\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
