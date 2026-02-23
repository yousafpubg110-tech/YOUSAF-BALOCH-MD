/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Image Compressor      ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

export default {
  command    : ['compress', 'compressor', 'smallimg'],
  name       : 'tool-compressor',
  category   : 'Tools',
  description: 'Compress image to reduce file size',
  usage      : '.compress [quality 1-100] [reply to image]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🗜️');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to an image!*\n\n📌 Usage: \`${CONFIG.PREFIX}compress [quality] [reply to image]\`\n💡 Quality: 1-100 (default 60)\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const quality = Math.min(100, Math.max(1, parseInt(text?.trim()) || 60));

      await sock.sendMessage(from, {
        text: `🗜️ *Compressing image...*\n📊 Quality: ${quality}%\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tmpIn  = join(tmpdir(), `comp_in_${Date.now()}.jpg`);
      const tmpOut = join(tmpdir(), `comp_out_${Date.now()}.jpg`);

      await writeFile(tmpIn, buffer);
      await execAsync(`ffmpeg -y -i "${tmpIn}" -q:v ${Math.round((100 - quality) / 4 + 1)} "${tmpOut}"`);

      const fs     = await import('fs');
      const outBuf = fs.readFileSync(tmpOut);

      await unlink(tmpIn).catch(() => {});
      await unlink(tmpOut).catch(() => {});

      const saved = (((buffer.length - outBuf.length) / buffer.length) * 100).toFixed(1);

      await sock.sendMessage(from, {
        image  : outBuf,
        caption: `✅ *Image Compressed!*

👋 *Requested by:* +${senderNum}
📊 *Quality:* ${quality}%
📦 *Before:* ${(buffer.length / 1024).toFixed(0)} KB
📦 *After:*  ${(outBuf.length / 1024).toFixed(0)} KB
💾 *Saved:*  ${saved}%

${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[COMPRESS ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Compression failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
