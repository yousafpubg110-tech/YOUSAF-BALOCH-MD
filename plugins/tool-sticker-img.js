/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Sticker to Image      ┃
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
  command    : ['stickerimg', 'toimg', 'sticktopng', 'webptopng'],
  name       : 'tool-sticker-img',
  category   : 'Tools',
  description: 'Convert sticker/WebP to PNG image',
  usage      : '.toimg [reply to sticker]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🖼️');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const stickerMsg = msg.message?.stickerMessage || quoted?.stickerMessage || null;

      if (!stickerMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to a sticker!*\n\n📌 Usage: Reply to any sticker with \`${CONFIG.PREFIX}toimg\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const buffer = await downloadMediaMessage(
        { message: msg.message?.stickerMessage ? msg.message : { stickerMessage: stickerMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tmpIn  = join(tmpdir(), `stk_in_${Date.now()}.webp`);
      const tmpOut = join(tmpdir(), `stk_out_${Date.now()}.png`);

      await writeFile(tmpIn, buffer);
      await execAsync(`ffmpeg -y -i "${tmpIn}" "${tmpOut}"`);

      const fs     = await import('fs');
      const imgBuf = fs.readFileSync(tmpOut);

      await unlink(tmpIn).catch(() => {});
      await unlink(tmpOut).catch(() => {});

      await sock.sendMessage(from, {
        image  : imgBuf,
        caption: `✅ *Sticker → Image!*\n\n👋 +${senderNum}\n📦 Size: ${(imgBuf.length / 1024).toFixed(0)} KB\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[STICKER-IMG ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Conversion failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
