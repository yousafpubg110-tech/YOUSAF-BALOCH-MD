/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Auto Sticker Plugin    ┃
┃        Created by MR YOUSAF BALOCH          ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { writeFile, unlink }    from 'fs/promises';
import { join }                 from 'path';
import { tmpdir }               from 'os';
import { exec }                 from 'child_process';
import { promisify }            from 'util';

const execAsync = promisify(exec);

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

// ─── Auto sticker groups ──────────────────────────────────────────────────────
const autoStickerGroups = new Set();

// ─── Convert image to sticker ─────────────────────────────────────────────────
async function toSticker(buffer, isAnimated = false) {
  const tmpIn  = join(tmpdir(), `sticker_in_${Date.now()}.${isAnimated ? 'gif' : 'png'}`);
  const tmpOut = join(tmpdir(), `sticker_out_${Date.now()}.webp`);

  await writeFile(tmpIn, buffer);

  const ffmpegCmd = isAnimated
    ? `ffmpeg -y -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 50 -loop 0 -preset default -an -vsync 0 "${tmpOut}"`
    : `ffmpeg -y -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 0 "${tmpOut}"`;

  await execAsync(ffmpegCmd);

  const stickerBuffer = await import('fs').then(fs =>
    new Promise((res, rej) => {
      fs.readFile(tmpOut, (err, data) => err ? rej(err) : res(data));
    })
  );

  // Cleanup
  await unlink(tmpIn).catch(() => {});
  await unlink(tmpOut).catch(() => {});

  return stickerBuffer;
}

export default {
  command    : ['autosticker', 'as', 'اٹو اسٹیکر'],
  name       : 'group-auto-sticker',
  category   : 'Group',
  description: 'Auto convert images to stickers in group',
  usage      : '.autosticker [on/off]',
  cooldown   : 5,
  groupOnly  : true,

  // ── Auto handler (listens for image messages) ─────────────────────────────
  autoHandle: async ({ sock, msg, from }) => {
    try {
      if (!autoStickerGroups.has(from)) return;

      const imgMsg = msg.message?.imageMessage;
      if (!imgMsg) return;

      const buffer = await downloadMediaMessage(
        msg, 'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      if (!Buffer.isBuffer(buffer) || buffer.length === 0) return;

      const stickerBuffer = await toSticker(buffer);

      await sock.sendMessage(from, {
        sticker: stickerBuffer,
      }, { quoted: msg });

    } catch (e) {
      console.error('[AUTO STICKER ERROR]:', e.message);
    }
  },

  handler: async ({ sock, msg, from, sender, text, isAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎨');

      const input = (text || '').toLowerCase().trim();

      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin auto sticker on/off کر سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      if (input === 'on' || input === 'enable') {
        autoStickerGroups.add(from);
        await sock.sendMessage(from, {
          text: `✅ *Auto Sticker چالو!*\n\n🎨 اب ہر image automatically sticker بنے گی۔\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } else if (input === 'off' || input === 'disable') {
        autoStickerGroups.delete(from);
        await sock.sendMessage(from, {
          text: `🔕 *Auto Sticker بند!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } else {
        const status = autoStickerGroups.has(from) ? '✅ ON' : '❌ OFF';
        await sock.sendMessage(from, {
          text: `╭━━━『 🎨 *AUTO STICKER* 』━━━╮

📊 *Status:* ${status}

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}autosticker on\`  → چالو
│ \`${CONFIG.PREFIX}autosticker off\` → بند
╰──────────────────────────

ℹ️ چالو ہونے پر ہر image automatically
sticker میں بدل جائے گی!

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[AUTO-STICKER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Auto sticker error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
