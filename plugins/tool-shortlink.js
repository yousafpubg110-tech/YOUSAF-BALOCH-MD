/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Short Link Plugin     ┃
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

async function shortenUrl(longUrl) {
  // Using TinyURL (no API key needed)
  const url = new URL('https://tinyurl.com/api-create.php');
  url.searchParams.set('url', longUrl);
  if (url.hostname !== 'tinyurl.com') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Shortener error: ${res.status}`);
    const short = await res.text();
    if (!short.startsWith('https://')) throw new Error('Invalid shortened URL');
    return short.trim();
  } finally { clearTimeout(timer); }
}

export default {
  command    : ['shortlink', 'short', 'tinyurl', 'shorten'],
  name       : 'tool-shortlink',
  category   : 'Tools',
  description: 'Shorten long URLs',
  usage      : '.short <URL>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🔗');

      const senderNum = sender?.split('@')[0] || 'User';
      const longUrl   = (text || '').trim();

      if (!longUrl || !longUrl.startsWith('http')) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a valid URL!*\n\n📌 Usage: \`${CONFIG.PREFIX}short <URL>\`\n\n💡 Example:\n▸ \`${CONFIG.PREFIX}short https://www.youtube.com/@Yousaf_Baloch_Tech\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const shortUrl = await shortenUrl(longUrl);

      await sock.sendMessage(from, {
        text: `╭━━━『 🔗 *URL SHORTENER* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📎 *Original URL* 』
│ ${longUrl.substring(0, 60)}${longUrl.length > 60 ? '...' : ''}
╰──────────────────────────

╭─『 ✅ *Short URL* 』
│ 🔗 *${shortUrl}*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[SHORTLINK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *URL shortening failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
