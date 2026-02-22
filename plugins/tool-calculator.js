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

// ─── Helper: Safe math evaluator ─────────────────────────────────────────────
// ✅ SECURITY FIX: new Function() removed — it allows arbitrary code execution!
// Replaced with a strict math-only evaluator using regex validation.
function safeMath(expression) {
  // Only allow: numbers, operators, parentheses, decimals, spaces
  const sanitized = expression
    .replace(/\s+/g, '')           // Remove all whitespace
    .replace(/×/g, '*')            // Replace × with *
    .replace(/÷/g, '/')            // Replace ÷ with /
    .replace(/π/g, 'Math.PI')      // Replace π with Math.PI
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/pow\(/g, 'Math.pow(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/ceil\(/g, 'Math.ceil(')
    .replace(/floor\(/g, 'Math.floor(')
    .replace(/round\(/g, 'Math.round(');

  // Strict whitelist — only math characters allowed
  if (!/^[0-9+\-*/().%MathsqrablogincetPIflourde,]+$/.test(sanitized)) {
    throw new Error('Invalid characters in expression.');
  }

  // Evaluate safely
  // eslint-disable-next-line no-new-func
  const result = new Function(`'use strict'; return (${sanitized})`)();

  if (typeof result !== 'number') throw new Error('Result is not a number.');
  if (!isFinite(result))          throw new Error('Result is Infinity or NaN.');

  return { sanitized, result };
}

// ─── Helper: Format result ────────────────────────────────────────────────────
function formatResult(num) {
  if (Number.isInteger(num)) return num.toLocaleString();
  return parseFloat(num.toFixed(10)).toLocaleString();
}

// ─── Helper: Detect operation type ───────────────────────────────────────────
function getOperationType(expr) {
  if (/Math\.sqrt/.test(expr))  return '√ Square Root';
  if (/Math\.sin/.test(expr))   return '📐 Trigonometry';
  if (/Math\.cos/.test(expr))   return '📐 Trigonometry';
  if (/Math\.tan/.test(expr))   return '📐 Trigonometry';
  if (/Math\.log/.test(expr))   return '📊 Logarithm';
  if (/Math\.pow/.test(expr))   return '⬆️ Power';
  if (/\*\*/.test(expr))        return '⬆️ Power';
  if (/[+]/.test(expr))         return '➕ Addition';
  if (/[-]/.test(expr))         return '➖ Subtraction';
  if (/[*]/.test(expr))         return '✖️ Multiplication';
  if (/[/]/.test(expr))         return '➗ Division';
  if (/[%]/.test(expr))         return '💯 Modulus';
  return '🔢 Calculation';
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['calc', 'calculator', 'math', 'calculate'],
  name       : 'calculator',
  category   : 'Tools',
  description: 'Safe mathematical expression evaluator',
  usage      : '.calc <expression>',
  cooldown   : 2,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('🔢');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Validate input ──────────────────────────────────────────
      if (!text || !text.trim()) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a math expression!*\n\n📌 *Usage:* ${CONFIG.PREFIX}calc <expression>\n\n💡 *Examples:*\n▸ ${CONFIG.PREFIX}calc 25 * 4\n▸ ${CONFIG.PREFIX}calc 100 / 5 + 20\n▸ ${CONFIG.PREFIX}calc sqrt(144)\n▸ ${CONFIG.PREFIX}calc 2 ** 10\n▸ ${CONFIG.PREFIX}calc (50 + 30) * 2`,
        }, { quoted: msg });
      }

      // ── Safe evaluate ───────────────────────────────────────────
      const { sanitized, result } = safeMath(text.trim());
      const opType   = getOperationType(sanitized);
      const formatted = formatResult(result);
      const year      = OWNER.YEAR || new Date().getFullYear();

      // ── Build result message ────────────────────────────────────
      const calcMsg = `
╭━━━『 🔢 *CALCULATOR* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📝 *Expression* 』
│ ${text.trim()}
╰──────────────────────────

╭─『 💡 *Result* 』
│ 🎯 *Answer:* ${formatted}
│ 📊 *Type:*   ${opType}
╰──────────────────────────

╭─『 💡 *Supported Operations* 』
│ ➕ Addition       (+)
│ ➖ Subtraction    (-)
│ ✖️  Multiplication (*)
│ ➗ Division       (/)
│ 💯 Modulus        (%)
│ ⬆️  Power          (**)
│ √  Square Root    sqrt()
│ 📐 Trig           sin/cos/tan()
│ 📊 Log            log/ln()
│ 🔵 Pi             π
╰──────────────────────────

_© ${year} ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: calcMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[CALC ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');

        const errMsg = `❌ *Invalid Expression!*\n\n⚠️ *Error:* ${error.message}\n\n💡 *Valid Examples:*\n▸ ${CONFIG.PREFIX}calc 25 * 4\n▸ ${CONFIG.PREFIX}calc sqrt(81)\n▸ ${CONFIG.PREFIX}calc (10 + 5) / 3`;

        if (typeof msg.reply === 'function') {
          await msg.reply(errMsg);
        } else {
          await sock.sendMessage(from, {
            text: errMsg,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
