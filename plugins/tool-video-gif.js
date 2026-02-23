/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Video to GIF Plugin   ┃
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
  command    : ['togif', 'gif', 'videogif', 'mp4gif'],
  name       : 'tool-video-gif',
  category   : 'Tools',
  description: 'Convert video to GIF',
  usage      : '.togif [reply to video] [seconds]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎬');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const vidMsg    = msg.message?.videoMessage || quoted?.videoMessage || null;

      if (!vidMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to a video!*\n\n📌 Usage: Reply to video with \`${CONFIG.PREFIX}togif [seconds]\`\n💡 Max 10 seconds for best quality\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const duration = Math.min(parseInt(text?.trim()) || 5, 10);

      await sock.sendMessage(from, {
        text: `🎬 *Converting to GIF...*\n⏱️ Duration: ${duration}s\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.videoMessage ? msg.message : { videoMessage: vidMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tmpIn  = join(tmpdir(), `gif_in_${Date.now()}.mp4`);
      const tmpOut = join(tmpdir(), `gif_out_${Date.now()}.gif`);

      await writeFile(tmpIn, buffer);
      await execAsync(
        `ffmpeg -y -i "${tmpIn}" -t ${duration} -vf "fps=10,scale=320:-1:flags=lanczos" -loop 0 "${tmpOut}"`
      );

      const fs     = await import('fs');
      const gifBuf = fs.readFileSync(tmpOut);

      await unlink(tmpIn).catch(() => {});
      await unlink(tmpOut).catch(() => {});

      if (gifBuf.length > 15 * 1024 * 1024) throw new Error('GIF too large! Try shorter duration.');

      await sock.sendMessage(from, {
        video   : gifBuf,
        caption : `✅ *GIF Created!*\n\n👋 +${senderNum}\n⏱️ Duration: ${duration}s\n📦 Size: ${(gifBuf.length / 1024).toFixed(0)} KB\n\n${ownerFooter()}`,
        gifPlayback: true,
        mimetype: 'video/mp4',
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[GIF ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *GIF failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
