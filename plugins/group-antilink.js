/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Anti Link Plugin      ┃
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

// Store anti-link status for each group
const antilinkGroups = new Set();

// Store warning count for each user in each group
// Format: warningCount[groupJid][userJid] = number
const warningCount = {};

// Regular expression to detect URLs
const LINK_REGEX = /(https?:\/\/)?(www\.)?(chat\.whatsapp\.com|wa\.me|t\.me|telegram\.me|youtu\.be|youtube\.com|instagram\.com|facebook\.com|twitter\.com|x\.com|tiktok\.com|snapchat\.com|discord\.gg|github\.com|bit\.ly|tinyurl\.com|goo\.gl|rb\.gy|shorturl\.at|)[^\s]+/i;

export default {
  command    : ['antilink', 'anti-link', 'اینٹی لنک'],
  name       : 'group-antilink',
  category   : 'Group',
  description: 'Automatically delete links and warn members',
  usage      : '.antilink [on/off]',
  cooldown   : 5,
  groupOnly  : true,  // Only works in groups

  // ── Main handler for commands ──────────────────────────────
  handler: async ({ sock, msg, from, sender, text, isAdmin, isOwner }) => {
    try {
      // React to command
      await sock.sendMessage(from, { react: { text: '🔗', key: msg.key } });

      const input = (text || '').toLowerCase().trim();
      const senderNum = sender.split('@')[0];

      // ── Check if user is admin or owner ────────────────────
      if (!isAdmin && !isOwner) {
        await sock.sendMessage(from, {
          text: `❌ *Only group admins or owner can change anti-link settings!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        return;
      }

      // ── Toggle on/off ──────────────────────────────────────
      if (input === 'on' || input === 'enable') {
        antilinkGroups.add(from);
        
        // Initialize warning count for this group
        if (!warningCount[from]) {
          warningCount[from] = {};
        }
        
        await sock.sendMessage(from, {
          text: `╔══════════════════════════════════════╗\n`
              + `║     🔗 *ANTI LINK ENABLED* 🔗         ║\n`
              + `╚══════════════════════════════════════╝\n\n`
              + `✅ All links will be automatically deleted.\n`
              + `⚠️ Members will receive warnings for sending links.\n`
              + `🔴 *3 Warnings = Auto Kick*\n\n`
              + `${ownerFooter()}`,
        }, { quoted: msg });
      } 
      else if (input === 'off' || input === 'disable') {
        antilinkGroups.delete(from);
        
        // Clear warnings for this group
        if (warningCount[from]) {
          delete warningCount[from];
        }
        
        await sock.sendMessage(from, {
          text: `╔══════════════════════════════════════╗\n`
              + `║     🔓 *ANTI LINK DISABLED* 🔓        ║\n`
              + `╚══════════════════════════════════════╝\n\n`
              + `❌ Links will no longer be deleted.\n\n`
              + `${ownerFooter()}`,
        }, { quoted: msg });
      } 
      // ── Show settings ──────────────────────────────────────
      else {
        const status = antilinkGroups.has(from) ? '✅ ON' : '❌ OFF';
        
        // Get warning list
        let warningList = '';
        if (warningCount[from] && Object.keys(warningCount[from]).length > 0) {
          warningList = '\n📋 *Current Warnings:*\n';
          for (const [user, count] of Object.entries(warningCount[from])) {
            const userShort = user.split('@')[0];
            warningList += `┃ 👤 @${userShort}: ${count}/3 warnings\n`;
          }
        } else {
          warningList = '\n┃ No warnings yet.\n';
        }
        
        await sock.sendMessage(from, {
          text: `╔══════════════════════════════════════╗\n`
              + `║     🔗 *ANTI LINK SETTINGS* 🔗        ║\n`
              + `╚══════════════════════════════════════╝\n\n`
              + `📊 *Status:* ${status}\n`
              + `👑 *Owner:* MR YOUSAF BALOCH\n\n`
              + `📌 *Commands:*\n`
              + `┃ ${CONFIG.PREFIX}antilink on     » Enable Anti Link\n`
              + `┃ ${CONFIG.PREFIX}antilink off    » Disable Anti Link\n\n`
              + `⚠️ *3 Warning System:*\n`
              + `┃ 1st Warning → Warning message\n`
              + `┃ 2nd Warning → Final warning\n`
              + `┃ 3rd Warning → Auto kick from group\n`
              + `${warningList}\n`
              + `${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });

    } catch (error) {
      console.error('[ANTILINK ERROR]:', error.message);
      try {
        await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
        await sock.sendMessage(from, {
          text: `❌ *AntiLink error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },

  // ── Auto-delete links from messages ───────────────────────
  autoDeleteLinks: async ({ sock, msg, from, sender, isAdmin, isOwner }) => {
    try {
      // Only check in groups
      if (!from.endsWith('@g.us')) return false;

      // Check if anti-link is enabled for this group
      if (!antilinkGroups.has(from)) return false;

      // Don't delete if sender is admin or owner
      if (isAdmin || isOwner) return false;

      // Get message text
      let messageText = '';
      const msgType = Object.keys(msg.message || {})[0];
      
      if (msgType === 'conversation') {
        messageText = msg.message.conversation || '';
      } else if (msgType === 'extendedTextMessage') {
        messageText = msg.message.extendedTextMessage.text || '';
      } else if (msgType === 'imageMessage') {
        messageText = msg.message.imageMessage.caption || '';
      } else if (msgType === 'videoMessage') {
        messageText = msg.message.videoMessage.caption || '';
      }

      // Check if message contains a link
      if (LINK_REGEX.test(messageText)) {
        const senderNum = sender.split('@')[0];
        
        // Initialize warning count for this group if needed
        if (!warningCount[from]) {
          warningCount[from] = {};
        }
        
        // Initialize warning count for this user if needed
        if (!warningCount[from][sender]) {
          warningCount[from][sender] = 0;
        }
        
        // Increment warning count
        warningCount[from][sender] += 1;
        const currentWarnings = warningCount[from][sender];
        
        // Delete the message
        await sock.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: sender,
          },
        });

        // Check if user reached 3 warnings
        if (currentWarnings >= 3) {
          // Kick the user
          await sock.sendMessage(from, {
            text: `╔══════════════════════════════════════╗\n`
                + `║        🚫 *USER REMOVED* 🚫          ║\n`
                + `╚══════════════════════════════════════╝\n\n`
                + `👤 *User:* @${senderNum}\n`
                + `⚠️ *Reason:* 3 warnings for sending links\n`
                + `👑 *Action:* Removed from group by MR YOUSAF BALOCH\n\n`
                + `_Anti Link System — 3 Strike Rule_\n\n`
                + `${ownerFooter()}`,
            mentions: [sender],
          });
          
          // Remove user from group
          await sock.groupParticipantsUpdate(from, [sender], 'remove');
          
          // Reset warning count for this user
          delete warningCount[from][sender];
          
          console.log(`[ANTILINK] Kicked ${senderNum} from ${from} for 3 warnings`);
        } 
        else {
          // Send warning message
          const remainingWarnings = 3 - currentWarnings;
          let warningMessage = '';
          
          if (currentWarnings === 1) {
            warningMessage = `⚠️ *FIRST WARNING* ⚠️\n\n`
                           + `👤 *User:* @${senderNum}\n`
                           + `🔗 *Action:* Link deleted\n`
                           + `👑 *Warning from:* MR YOUSAF BALOCH\n\n`
                           + `📌 *Reason:* Links are not allowed in this group.\n`
                           + `⚠️ *You have received 1/3 warnings.*\n`
                           + `❗ *${remainingWarnings} more warnings and you will be removed!*`;
          } else if (currentWarnings === 2) {
            warningMessage = `⚠️ *FINAL WARNING* ⚠️\n\n`
                           + `👤 *User:* @${senderNum}\n`
                           + `🔗 *Action:* Link deleted\n`
                           + `👑 *Warning from:* MR YOUSAF BALOCH\n\n`
                           + `📌 *Reason:* Links are not allowed in this group.\n`
                           + `⚠️ *You have received 2/3 warnings.*\n`
                           + `❗ *ONE MORE WARNING and you will be removed!*`;
          }
          
          await sock.sendMessage(from, {
            text: `╔══════════════════════════════════════╗\n`
                + `║        ⚠️ *WARNING* ⚠️                ║\n`
                + `╚══════════════════════════════════════╝\n\n`
                + `${warningMessage}\n\n`
                + `_Anti Link System — Warning ${currentWarnings}/3_\n\n`
                + `${ownerFooter()}`,
            mentions: [sender],
          });
        }

        console.log(`[ANTILINK] Deleted link message from ${senderNum} in ${from}. Warning: ${currentWarnings}/3`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[ANTILINK AUTO-DELETE ERROR]:', error.message);
      return false;
    }
  },
};
