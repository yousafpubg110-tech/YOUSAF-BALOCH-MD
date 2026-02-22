/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Warn Plugin     ┃
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

// ─── Warnings Store ───────────────────────────────────────────────────────────
// Format: warnings.get(groupJid)?.get(userJid) → { count, reasons[], lastWarn }
export const warnings = new Map();

const MAX_WARNS = 3;

// ─── Helper: get user warnings ────────────────────────────────────────────────
export function getUserWarns(groupJid, userJid) {
  if (!warnings.has(groupJid)) warnings.set(groupJid, new Map());
  const groupWarns = warnings.get(groupJid);
  if (!groupWarns.has(userJid)) {
    groupWarns.set(userJid, { count: 0, reasons: [], lastWarn: null });
  }
  return groupWarns.get(userJid);
}

// ─── Helper: add warning ──────────────────────────────────────────────────────
export function addWarning(groupJid, userJid, reason) {
  const data = getUserWarns(groupJid, userJid);
  data.count++;
  data.reasons.push(reason || 'No reason given');
  data.lastWarn = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  return data;
}

// ─── Helper: reset warnings ───────────────────────────────────────────────────
export function resetWarnings(groupJid, userJid) {
  if (warnings.has(groupJid)) {
    warnings.get(groupJid).delete(userJid);
  }
}

export default {
  command    : ['warn', 'warning', 'وارننگ'],
  name       : 'group-warn',
  category   : 'Group',
  description: 'Warn a group member (3 warns = kick)',
  usage      : '.warn @user [reason]',
  cooldown   : 3,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin, isBotAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('⚠️');

      const senderNum = sender?.split('@')[0] || 'User';

      // ── Admin check ───────────────────────────────────────
      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin warn دے سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Get mentioned user ────────────────────────────────
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        || msg.message?.extendedTextMessage?.contextInfo?.participant;

      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const target = mentioned || quotedParticipant;

      if (!target) {
        return await sock.sendMessage(from, {
          text: `❌ *کسی کو mention کریں یا reply کریں!*\n\n📌 *Usage:* \`${CONFIG.PREFIX}warn @user reason\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Don't warn admins ─────────────────────────────────
      const groupMeta    = await sock.groupMetadata(from);
      const targetMember = groupMeta.participants.find(p => p.id === target);
      if (targetMember?.admin) {
        return await sock.sendMessage(from, {
          text: `❌ *Admin کو warn نہیں دے سکتے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      // ── Extract reason ────────────────────────────────────
      const reason = text?.replace(/@\d+/g, '').trim() || 'کوئی وجہ نہیں دی';

      // ── Add warning ───────────────────────────────────────
      const warnData   = addWarning(from, target, reason);
      const targetNum  = target.split('@')[0];
      const remaining  = MAX_WARNS - warnData.count;

      // ── Build warn message based on count ─────────────────
      let warnLevel  = '';
      let warnEmoji  = '';
      let warnAction = '';

      if (warnData.count === 1) {
        warnLevel  = '1️⃣ *پہلی وارننگ*';
        warnEmoji  = '⚠️';
        warnAction = `آپ کے پاس ابھی *2 چانس* باقی ہیں۔\n│ اگلی غلطی پر دوسری وارننگ ملے گی۔`;
      } else if (warnData.count === 2) {
        warnLevel  = '2️⃣ *دوسری وارننگ*';
        warnEmoji  = '🔴';
        warnAction = `آپ کے پاس ابھی *آخری 1 چانس* باقی ہے!\n│ ⛔ اگلی غلطی پر آپ کو *گروپ سے نکال دیا جائے گا!*`;
      } else {
        warnLevel  = '3️⃣ *تیسری اور آخری وارننگ*';
        warnEmoji  = '🚫';
        warnAction = `آپ کے تمام چانس ختم ہو گئے!\n│ 🚫 آپ کو ابھی گروپ سے *REMOVE* کیا جا رہا ہے!`;
      }

      const warnMsg = `╭━━━『 ${warnEmoji} *WARNING* 』━━━╮

👑 *${OWNER.FULL_NAME} کی طرف سے وارننگ*

╭─『 👤 *Member* 』
│ @${targetNum}
╰──────────────────────────

╭─『 ${warnLevel} 』
│ 📋 *وجہ:*    ${reason}
│ 📊 *Warns:* ${warnData.count}/${MAX_WARNS}
│ 📅 *وقت:*   ${warnData.lastWarn}
╰──────────────────────────

╭─『 ⚡ *Action* 』
│ ${warnAction}
╰──────────────────────────

╭─『 📜 *Warn History* 』
${warnData.reasons.map((r, i) => `│ ${i + 1}. ${r}`).join('\n')}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, {
        text    : warnMsg,
        mentions: [target],
      }, { quoted: msg });

      // ── Kick on 3rd warning ────────────────────────────────
      if (warnData.count >= MAX_WARNS) {
        if (!isBotAdmin) {
          await sock.sendMessage(from, {
            text: `⚠️ *Bot Admin نہیں ہے — manually remove کریں!*\n👤 @${targetNum}\n\n${ownerFooter()}`,
            mentions: [target],
          });
        } else {
          await new Promise(r => setTimeout(r, 2000));
          await sock.groupParticipantsUpdate(from, [target], 'remove');
          resetWarnings(from, target);
          await sock.sendMessage(from, {
            text: `🚫 *@${targetNum} کو 3 warnings کے بعد remove کر دیا گیا!*\n\n👑 *Action by:* ${OWNER.FULL_NAME}\n\n${ownerFooter()}`,
            mentions: [target],
          });
        }
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[WARN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Warn failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
