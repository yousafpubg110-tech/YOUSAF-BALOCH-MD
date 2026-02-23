/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Screenshot Plugin     ┃
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

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch { return false; }
}

async function takeScreenshot(pageUrl, width = 1280, height = 720) {
  const API_KEY = process.env.SCREENSHOTAPI_KEY || '';

  if (API_KEY) {
    // Using screenshotmachine.com
    const url = new URL('https://api.screenshotmachine.com/');
    url.searchParams.set('key',   API_KEY);
    url.searchParams.set('url',   pageUrl);
    url.searchParams.set('device','desktop');
    url.searchParams.set('dimension', `${width}x${height}`);
    url.searchParams.set('format', 'jpg');
    url.searchParams.set('cacheLimit', '0');
    if (url.hostname !== 'api.screenshotmachine.com') throw new Error('Invalid hostname.');

    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Screenshot API error: ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } finally { clearTimeout(timer); }
  }

  // Free fallback: microlink.io
  const mlUrl = new URL('https://api.microlink.io/');
  mlUrl.searchParams.set('url',       pageUrl);
  mlUrl.searchParams.set('screenshot', 'true');
  mlUrl.searchParams.set('meta',       'false');
  if (mlUrl.hostname !== 'api.microlink.io') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(mlUrl.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Screenshot error: ${res.status}`);
    const data     = await res.json();
    const imgUrl   = data?.data?.screenshot?.url;
    if (!imgUrl) throw new Error('No screenshot returned');

    const imgRes = await fetch(imgUrl);
    return Buffer.from(await imgRes.arrayBuffer());
  } finally { clearTimeout(timer); }
}

export default {
  command    : ['screenshot', 'ss', 'webpage', 'webss'],
  name       : 'tool-screenshot',
  category   : 'Tools',
  description: 'Take screenshot of any website',
  usage      : '.screenshot <URL>',
  cooldown   : 15,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📸');

      const senderNum = sender?.split('@')[0] || 'User';
      const url       = (text || '').trim();

      if (!url || !isValidUrl(url)) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a valid URL!*\n\n📌 Usage: \`${CONFIG.PREFIX}ss <URL>\`\n\n💡 Examples:\n▸ \`${CONFIG.PREFIX}ss https://google.com\`\n▸ \`${CONFIG.PREFIX}ss https://youtube.com\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        text: `📸 *Taking screenshot...*\n🔗 ${url}\n⏳ Please wait 10-20 seconds...`,
      }, { quoted: msg });

      const imgBuffer = await takeScreenshot(url);

      await sock.sendMessage(from, {
        image  : imgBuffer,
        caption: `✅ *Screenshot Taken!*\n\n👋 +${senderNum}\n🔗 ${url}\n📦 Size: ${(imgBuffer.length / 1024).toFixed(0)} KB\n\n${ownerFooter()}`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SCREENSHOT ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Screenshot failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
