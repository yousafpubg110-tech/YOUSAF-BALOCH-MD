/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Anti View Once Plugin ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

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

// Store anti-vv status
const antivvEnabled = new Map(); // groupJid -> boolean

export default {
  command    : ['vv', 'antivv', 'antiviewonce'],
  name       : 'antivv',
  category   : 'Group',
  description: 'Reveal view-once photos and videos',
  usage      : '.vv [on/off] OR reply to view-once message',
  cooldown   : 3,
  groupOnly  : false,

  handler: async ({ sock, msg, from, sender, text, isAdmin, isOwner }) => {
    try {
      const input = (text || '').toLowerCase().trim();
      const senderNum = sender.split('@')[0];
      
      // ── Check if this is a reply to a message ───────────────
      const isReply = !!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      
      // ── CASE 1: Reply to view-once message ──────────────────
      if (isReply) {
        const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        
        // Check if quoted message is view-once
        const viewOnceMsg = quotedMsg?.viewOnceMessage?.message || 
                           quotedMsg?.viewOnceMessageV2?.message ||
                           quotedMsg?.viewOnceMessageV2Extension?.message;
        
        if (viewOnceMsg) {
          // Reveal view-once media regardless of input
          await msg.react('👁️');
          
          try {
            // Get the quoted message key
            const quotedKey = {
              remoteJid: from,
              id: msg.message.extendedTextMessage.contextInfo.stanzaId,
              participant: msg.message.extendedTextMessage.contextInfo.participant
            };
            
            // Create fake message for download
            const fakeMsg = {
              key: quotedKey,
              message: quotedMsg
            };
            
            // Download media
            const buffer = await downloadMediaMessage(
              fakeMsg,
              'buffer',
              {},
              { logger: console }
            );
            
            if (buffer && buffer.length > 0) {
              const isImage = !!viewOnceMsg.imageMessage;
              const isVideo = !!viewOnceMsg.videoMessage;
              
              if (isImage) {
                await sock.sendMessage(from, {
                  image: buffer,
                  caption: `👁️ *View Once Image Revealed*\n\n👤 Requested by: @${senderNum}\n\n${ownerFooter()}`,
                  mentions: [sender]
                }, { quoted: msg });
              } else if (isVideo) {
                await sock.sendMessage(from, {
                  video: buffer,
                  caption: `👁️ *View Once Video Revealed*\n\n👤 Requested by: @${senderNum}\n\n${ownerFooter()}`,
                  mentions: [sender]
                }, { quoted: msg });
              }
              
              await msg.react('✅');
              return;
            }
          } catch (dlErr) {
            console.error('[VV REVEAL ERROR]:', dlErr);
            await msg.reply(`❌ Failed to reveal media: ${dlErr.message}`);
            await msg.react('❌');
            return;
          }
        }
      }
      
      // ── If we reach here, it's not a view-once reply ────────
      // So handle as settings/toggle
      
      // Check if user is admin/owner for toggle
      if ((input === 'on' || input === 'off') && !isAdmin && !isOwner) {
        return await msg.reply(`❌ Only group admins or owner can change anti-vv settings!\n\n${ownerFooter()}`);
      }
      
      // ── CASE 2: Toggle on/off ───────────────────────────────
      if (input === 'on') {
        antivvEnabled.set(from, true);
        await msg.reply(`╔══════════════════════════════════════╗\n║     ✅ *ANTI VV ENABLED* ✅          ║\n╚══════════════════════════════════════╝\n\n👁️ View-once media will now be revealed automatically.\n\n${ownerFooter()}`);
        await msg.react('✅');
      }
      else if (input === 'off') {
        antivvEnabled.set(from, false);
        await msg.reply(`╔══════════════════════════════════════╗\n║     ❌ *ANTI VV DISABLED* ❌         ║\n╚══════════════════════════════════════╝\n\n${ownerFooter()}`);
        await msg.react('✅');
      }
      // ── CASE 3: Show settings ───────────────────────────────
      else {
        const status = antivvEnabled.get(from) ? '✅ ON' : '❌ OFF';
        await msg.reply(`╔══════════════════════════════════════╗\n║     👁️ *ANTI VIEW ONCE SETTINGS*     ║\n╚══════════════════════════════════════╝\n\n📊 *Status:* ${status}\n\n📌 *Commands:*\n┃ .vv on     » Enable Anti VV\n┃ .vv off    » Disable Anti VV\n┃ .vv (reply) » Reveal hidden media\n\n${ownerFooter()}`);
        await msg.react('✅');
      }
      
    } catch (error) {
      console.error('[ANTIVV ERROR]:', error);
      await msg.react('❌');
      await msg.reply(`❌ Error: ${error.message}\n\n${ownerFooter()}`);
    }
  }
};
