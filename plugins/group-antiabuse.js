/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Anti Abuse System    ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, SYSTEM } from '../config.js';

// Banned keywords — 18+ and inappropriate content
const BANNED_KEYWORDS = [
  'sexy', 'sex', 'porn', 'xxx', 'nude', 'naked', 'nudes',
  'adult', 'hot girl', 'hot boy', 'boobs', 'penis', 'vagina',
  'fuck', 'fucking', 'bitch', 'slut', 'whore', 'dick', 'pussy',
  'rape', 'nsfw', '18+', 'onlyfans', 'xvideos', 'xnxx', 'pornhub',
];

// Warning tracker — in memory per session
const warningMap = new Map();

function containsBannedContent(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return BANNED_KEYWORDS.some(keyword => lower.includes(keyword));
}

function getWarnings(jid) {
  return warningMap.get(jid) || 0;
}

function addWarning(jid) {
  const current = getWarnings(jid);
  warningMap.set(jid, current + 1);
  return current + 1;
}

function resetWarnings(jid) {
  warningMap.delete(jid);
}

export default {
  command: ['antiabuse'],
  name: 'antiabuse',
  category: 'Group',
  description: 'Enable/disable anti-abuse system',
  usage: '.antiabuse on/off',
  cooldown: 5,
  groupOnly: true,
  adminOnly: true,

  handler: async ({ msg, from, args, isAdmin, isOwner }) => {
    try {
      if (!isAdmin && !isOwner) {
        return await msg.reply('❌ Only admins can use this command!');
      }

      const setting = args[0]?.toLowerCase();

      if (!setting || !['on', 'off'].includes(setting)) {
        return await msg.reply(`Anti-Abuse System Settings:

*Usage:*
.antiabuse on
.antiabuse off

*How it works:*
⚠️ Warning 1 — Message deleted + warning with owner name
⚠️ Warning 2 — Message deleted + final warning with owner name
🚫 Warning 3 — Message deleted + auto kick from group

${SYSTEM.SHORT_WATERMARK}`);
      }

      if (!global.db) global.db = { data: { chats: {} } };
      if (!global.db.data.chats[from]) global.db.data.chats[from] = {};
      global.db.data.chats[from].antiabuse = setting === 'on';

      await msg.reply(`Anti-Abuse System has been turned *${setting.toUpperCase()}* ${setting === 'on' ? '✅' : '❌'}\n\n${SYSTEM.SHORT_WATERMARK}`);
      await msg.react(setting === 'on' ? '✅' : '❌');

    } catch (error) {
      console.error('Anti-abuse command error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Error: ' + error.message);
      } catch (_) {}
    }
  },

  // Event listener — monitors all group messages
  onMessage: async ({ sock, msg, from }) => {
    try {
      // Only run in groups
      if (!from.endsWith('@g.us')) return;

      // Check if antiabuse is enabled for this group
      if (!global.db?.data?.chats?.[from]?.antiabuse) return;

      const text = msg.message?.conversation
        || msg.message?.extendedTextMessage?.text
        || msg.message?.imageMessage?.caption
        || msg.message?.videoMessage?.caption
        || '';

      if (!containsBannedContent(text)) return;

      const sender = msg.key.participant || msg.key.remoteJid;
      const senderNumber = sender.split('@')[0];

      // Delete the abusive message first
      try {
        await sock.sendMessage(from, { delete: msg.key });
      } catch (_) {}

      const warnings = addWarning(sender);

      if (warnings === 1) {
        // First warning
        await sock.sendMessage(from, {
          text: `⚠️ *WARNING 1/3* ⚠️

@${senderNumber}, do not misuse *${OWNER.BOT_NAME}*!

🚫 Inappropriate or 18+ content is strictly not allowed here.
👤 Owner *${OWNER.FULL_NAME}* (+${OWNER.NUMBER}) is warning you.
❌ You will be kicked if this continues.

_Your message has been deleted._`,
          mentions: [sender],
        });

      } else if (warnings === 2) {
        // Second warning — final warning
        await sock.sendMessage(from, {
          text: `⚠️ *WARNING 2/3 — FINAL WARNING* ⚠️

@${senderNumber}, this is your LAST chance!

🚫 Stop sending inappropriate content immediately!
👤 Owner *${OWNER.FULL_NAME}* (+${OWNER.NUMBER}) is giving you a final warning.
❌ Next violation = AUTO KICK, no exceptions!

_Your message has been deleted._`,
          mentions: [sender],
        });

      } else if (warnings >= 3) {
        // Third warning — auto kick
        try {
          await sock.groupParticipantsUpdate(from, [sender], 'remove');
        } catch (_) {}

        resetWarnings(sender);

        await sock.sendMessage(from, {
          text: `🚫 *USER KICKED* 🚫

@${senderNumber} has been removed from this group!

❌ *Reason:* Repeated inappropriate/18+ content
👤 *Kicked by:* ${OWNER.BOT_NAME} on behalf of *${OWNER.FULL_NAME}*
📱 *Owner:* +${OWNER.NUMBER}

_3 warnings issued. Zero tolerance enforced._

${SYSTEM.SHORT_WATERMARK}`,
          mentions: [sender],
        });
      }

    } catch (error) {
      console.error('Anti-abuse monitor error:', error.message);
    }
  },
};
