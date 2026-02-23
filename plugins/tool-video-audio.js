/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Video to Audio        ┃
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
  command    : ['toaudio', 'mp3', 'videoaudio', 'extractaudio'],
  name       : 'tool-video-audio',
  category   : 'Tools',
  description: 'Extract audio from video (MP4 to MP3)',
  usage      : '.toaudio [reply to video]',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🎵');

      const senderNum = sender?.split('@')[0] || 'User';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const vidMsg    = msg.message?.videoMessage || quoted?.videoMessage || null;

      if (!vidMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to a video!*\n\n📌 Usage: Reply to video with \`${CONFIG.PREFIX}toaudio\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `🎵 *Extracting audio...*\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.videoMessage ? msg.message : { videoMessage: vidMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const tmpIn  = join(tmpdir(), `va_in_${Date.now()}.mp4`);
      const tmpOut = join(tmpdir(), `va_out_${Date.now()}.mp3`);

      await writeFile(tmpIn, buffer);
      await execAsync(`ffmpeg -y -i "${tmpIn}" -vn -acodec libmp3lame -q:a 2 "${tmpOut}"`);

      const fs       = await import('fs');
      const outBuf   = fs.readFileSync(tmpOut);

      await unlink(tmpIn).catch(() => {});
      await unlink(tmpOut).catch(() => {});

      await sock.sendMessage(from, {
        audio   : outBuf,
        mimetype: 'audio/mpeg',
        ptt     : false,
      }, { quoted: msg });

      await sock.sendMessage(from, {
        text: `✅ *Audio Extracted!*\n\n👋 +${senderNum}\n📦 Size: ${(outBuf.length / 1024).toFixed(0)} KB\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[VIDEO-AUDIO ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Extraction failed!*\n⚠️ ${error.message}\n\n💡 Make sure ffmpeg is installed.\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
