/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — PDF Maker Plugin      ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG }        from '../config.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { writeFile, unlink }    from 'fs/promises';
import { join }                 from 'path';
import { tmpdir }               from 'os';

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

async function imageToPdf(imageBuffers, title = 'Document') {
  const { default: PDFDocument } = await import('pdfkit');
  const { Writable }             = await import('stream');

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ autoFirstPage: false });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.info.Title  = title;
    doc.info.Author = OWNER.FULL_NAME;

    for (const imgBuf of imageBuffers) {
      doc.addPage();
      doc.image(imgBuf, 0, 0, {
        fit  : [doc.page.width, doc.page.height],
        align: 'center',
        valign: 'center',
      });
    }

    doc.end();
  });
}

export default {
  command    : ['pdf', 'topdf', 'pdfmaker', 'imgpdf'],
  name       : 'tool-pdf-maker',
  category   : 'Tools',
  description: 'Convert images to PDF document',
  usage      : '.pdf [title] [reply to image]',
  cooldown   : 10,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📄');

      const senderNum = sender?.split('@')[0] || 'User';
      const title     = text?.trim() || 'Document';
      const quoted    = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const imgMsg    = msg.message?.imageMessage || quoted?.imageMessage || null;

      if (!imgMsg) {
        return await sock.sendMessage(from, {
          text: `❌ *Reply to an image!*\n\n📌 Usage: Reply to image with \`${CONFIG.PREFIX}pdf [title]\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📄 *Creating PDF...*\n📝 Title: ${title}\n⏳ Please wait...`,
      }, { quoted: msg });

      const buffer = await downloadMediaMessage(
        { message: msg.message?.imageMessage ? msg.message : { imageMessage: imgMsg } },
        'buffer', {},
        { logger: console, reuploadRequest: sock.updateMediaMessage }
      );

      const pdfBuffer = await imageToPdf([buffer], title);
      const tmpPdf    = join(tmpdir(), `doc_${Date.now()}.pdf`);
      await writeFile(tmpPdf, pdfBuffer);

      await sock.sendMessage(from, {
        document : pdfBuffer,
        mimetype : 'application/pdf',
        fileName : `${title.replace(/\s+/g, '_')}.pdf`,
        caption  : `✅ *PDF Created!*\n\n👋 +${senderNum}\n📝 Title: ${title}\n📦 Size: ${(pdfBuffer.length / 1024).toFixed(0)} KB\n\n${ownerFooter()}`,
      }, { quoted: msg });

      await unlink(tmpPdf).catch(() => {});
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[PDF ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *PDF failed!*\n⚠️ ${error.message}\n\n💡 Install: \`npm install pdfkit\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
