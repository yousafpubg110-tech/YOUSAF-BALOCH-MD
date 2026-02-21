/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD - Set Profile Pic Plugin ┃
┃       Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Helper: Get timestamp ────────────────────────────────────────────────────
function getTimestamp() {
  return new Date().toUTCString().replace(' GMT', ' (UTC)');
}

// ─── Helper: Check if mimetype is image ──────────────────────────────────────
function isImageMime(mime) {
  if (!mime || typeof mime !== 'string') return false;
  return /^image\/(jpeg|png|webp|gif)$/i.test(mime);
}

// ─── Plugin Export ───────────────────────────────────────────────────────────
export default {
  command    : ['setpp', 'setpfp', 'setprofile', 'changepp'],
  name       : 'setpp',
  category   : 'Owner',
  description: 'Change bot profile picture',
  usage      : '.setpp (reply to image)',
  cooldown   : 15,
  ownerOnly  : true,

  handler: async ({ sock, msg, from, sender }) => {
    try {

      // ── React: processing ───────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('⚙️');

      // ── Owner check ─────────────────────────────────────────────
      const senderNum = sender?.split('@')[0] || '';
      const isOwner   = senderNum === String(OWNER.NUMBER);

      if (!isOwner) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `❌ *This command is for owner only!*\n\n👑 *Owner:* ${OWNER.FULL_NAME}`,
        }, { quoted: msg });
      }

      // ── Get quoted or direct message ────────────────────────────
      const target = msg.quoted || msg;
      const mime   = target?.msg?.mimetype || target?.mimetype || '';

      // ── Validate image ──────────────────────────────────────────
      if (!isImageMime(mime)) {
        if (typeof msg.react === 'function') await msg.react('❌');
        return await sock.sendMessage(from, {
          text: `⚠️ *Please reply to an image!*\n\n📌 *Usage:*\n1. Send or reply to an image\n2. Type \`${CONFIG.PREFIX}setpp\`\n\n✅ *Supported formats:*\nJPEG, PNG, WEBP, GIF`,
        }, { quoted: msg });
      }

      // ── Send processing message ─────────────────────────────────
      await sock.sendMessage(from, {
        text: `🔄 *Updating profile picture...*\n⏳ *Please wait...*`,
      }, { quoted: msg });

      // ── Download image ──────────────────────────────────────────
      let media;
      try {
        media = await target.download();
      } catch (dlErr) {
        throw new Error('Failed to download image: ' + dlErr.message);
      }

      if (!media || !Buffer.isBuffer(media)) {
        throw new Error('Downloaded media is invalid or empty.');
      }

      // ── Update profile picture ──────────────────────────────────
      const botJid = sock.user?.id || sock.user?.jid || OWNER.JID;
      await sock.updateProfilePicture(botJid, media);

      // ── Success message ─────────────────────────────────────────
      const successMsg = `
╭━━━『 ✅ *PROFILE UPDATED* 』━━━╮

✅ *Profile picture changed successfully!*

╭─『 📋 *Details* 』
│ 🤖 *Bot:*      ${OWNER.BOT_NAME}
│ 👑 *By:*       ${OWNER.FULL_NAME}
│ 🖼️  *Format:*   ${mime.split('/')[1]?.toUpperCase() || 'IMAGE'}
│ 📅 *Updated:*  ${getTimestamp()}
╰──────────────────────────

_© ${OWNER.YEAR || new Date().getFullYear()} ${OWNER.BOT_NAME}_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      await sock.sendMessage(from, {
        text: successMsg,
      }, { quoted: msg });

      // ── React: done ─────────────────────────────────────────────
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SETPP ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        if (typeof msg.reply === 'function') {
          await msg.reply('❌ Setpp error: ' + error.message);
        } else {
          await sock.sendMessage(from, {
            text: '❌ Setpp error: ' + error.message,
          }, { quoted: msg });
        }
      } catch (_) {}
    }
  },
};
