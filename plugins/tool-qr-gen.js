/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — QR Generator Plugin   ┃
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

async function generateQR(text, size = 300, color = '000000', bg = 'ffffff') {
  // ✅ CodeQL Fix
  const url = new URL('https://api.qrserver.com/v1/create-qr-code/');
  url.searchParams.set('size',  `${size}x${size}`);
  url.searchParams.set('data',  text);
  url.searchParams.set('color', color);
  url.searchParams.set('bgcolor', bg);
  url.searchParams.set('format', 'png');
  url.searchParams.set('qzone', '2');

  if (url.hostname !== 'api.qrserver.com') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`QR API error: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally { clearTimeout(timer); }
}

export default {
  command    : ['qr', 'qrgen', 'qrcode', 'makeqr'],
  name       : 'tool-qr-gen',
  category   : 'Tools',
  description: 'Generate QR code for any text or URL',
  usage      : '.qr <text or URL>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔲');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      if (!input) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide text or URL!*\n\n📌 Usage: \`${CONFIG.PREFIX}qr <text>\`\n\n💡 Examples:\n▸ \`${CONFIG.PREFIX}qr https://youtube.com/@Yousaf_Baloch_Tech\`\n▸ \`${CONFIG.PREFIX}qr My WhatsApp: +923710636110\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const qrBuffer = await generateQR(input);

      await sock.sendMessage(from, {
        image  : qrBuffer,
        caption: `✅ *QR Code Generated!*

👋 *Requested by:* +${senderNum}
📝 *Content:* ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}

${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[QR ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *QR generation failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
