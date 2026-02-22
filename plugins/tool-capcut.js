/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD CapCut Templates     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

'use strict';

const axios = require('axios');

// ━━━ URL Validation ━━━
function isValidCapCutUrl(url) {
  try {
    const parsed = new URL(url);
    const validHosts = [
      'www.capcut.com',
      'capcut.com',
      'www.capcut.net',
      'capcut.net'
    ];
    return (
      validHosts.includes(parsed.hostname) &&
      (parsed.protocol === 'https:' || parsed.protocol === 'http:')
    );
  } catch {
    return false;
  }
}

function isValidHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// ━━━ نمبر فارمیٹ ━━━
function formatNumber(num) {
  if (!num) return '0';
  const n = parseInt(num);
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000)    return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)       return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// ━━━ File Size ━━━
function formatSize(bytes) {
  if (!bytes || bytes === 0) return 'نامعلوم';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return mb.toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}

// ━━━ Buffer حاصل کریں ━━━
async function getBuffer(url) {
  try {
    if (!isValidHttpUrl(url)) return Buffer.from('');
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    return Buffer.from(response.data);
  } catch {
    return Buffer.from('');
  }
}

// ━━━ Video Download with Retry ━━━
async function downloadVideo(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        maxContentLength: 100 * 1024 * 1024 // 100MB max
      });
      return {
        buffer: Buffer.from(response.data),
        size:   response.data.byteLength,
        type:   response.headers['content-type'] || 'video/mp4'
      };
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

// ━━━ Multiple APIs try کریں ━━━
async function fetchCapCutData(url) {
  const encodedUrl = encodeURIComponent(url);

  const apis = [
    `https://api.nexoracle.com/downloader/capcut?apikey=free_key@maher_apis&url=${encodedUrl}`,
    `https://api.ryzendesu.vip/api/downloader/capcut?url=${encodedUrl}`,
    `https://api.agatz.xyz/api/capcut?url=${encodedUrl}`
  ];

  for (const apiUrl of apis) {
    try {
      const response = await axios.get(apiUrl, { timeout: 15000 });
      if (response.data) {
        const d = response.data;
        // مختلف APIs کے مختلف response formats handle کریں
        const result = d.result || d.data || d;
        if (result && (result.video || result.download || result.url)) {
          return result;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

module.exports = {
  name: 'capcut',
  aliases: ['capcuttemplate', 'cctemplate', 'cc', 'capkut', 'کیپ کٹ'],
  category: 'tools',
  description: 'CapCut templates ڈاؤنلوڈ کریں — watermark کے بغیر',
  usage: '.capcut <CapCut template URL>',
  cooldown: 8000,

  async execute(sock, msg, args) {
    try {
      const jid = msg.key.remoteJid;

      // ━━━ URL نہیں دیا ━━━
      if (!args[0]) {
        await sock.sendMessage(jid, {
          text: `
🎬 *CapCut Template Downloader*

*استعمال کا طریقہ:*
.capcut <template link>

*مثال:*
.capcut https://www.capcut.com/template/xxxxx

*Template Link کیسے لیں:*
1️⃣ CapCut app کھولیں
2️⃣ پسندیدہ template تلاش کریں
3️⃣ "Use Template" پر tap کریں
4️⃣ Share بٹن → "Copy Link"
5️⃣ یہاں link paste کریں

✨ *Features:*
• Watermark کے بغیر ڈاؤنلوڈ
• Template کی مکمل معلومات
• Template استعمال کرنے کا طریقہ
• تیز رفتار ڈاؤنلوڈ

_YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j`.trim()
        }, { quoted: msg });
        return;
      }

      const url = args[0].trim();

      // ━━━ URL Validation ━━━
      if (!isValidCapCutUrl(url)) {
        await sock.sendMessage(jid, {
          text: `❌ *غلط URL!*\n\nصرف CapCut کے links کام کریں گے۔\n\n*صحیح مثال:*\nhttps://www.capcut.com/template/xxxxx`
        }, { quoted: msg });
        return;
      }

      // ━━━ Processing شروع ━━━
      await sock.sendMessage(jid, {
        react: { text: '🎬', key: msg.key }
      });

      const processingMsg = await sock.sendMessage(jid, {
        text: `⏳ *CapCut Template ڈاؤنلوڈ ہو رہی ہے...*\n\n🔍 Template تلاش کی جا رہی ہے\n📥 براہ کرم انتظار کریں...`
      }, { quoted: msg });

      // ━━━ API سے Data لیں ━━━
      const result = await fetchCapCutData(url);

      if (!result) {
        await sock.sendMessage(jid, {
          react: { text: '❌', key: msg.key }
        });
        await sock.sendMessage(jid, {
          text: `❌ *Template ڈاؤنلوڈ نہیں ہو سکی!*\n\n*وجوہات:*\n• Link غلط ہو سکتا ہے\n• Template expired ہو سکتی ہے\n• Internet connection چیک کریں\n\nدوبارہ کوشش کریں۔`
        }, { quoted: msg });
        return;
      }

      // ━━━ Video URL نکالیں ━━━
      const videoUrl = result.video || result.download || result.url ||
                       result.videoUrl || result.video_url;

      if (!videoUrl || !isValidHttpUrl(videoUrl)) {
        await sock.sendMessage(jid, {
          react: { text: '❌', key: msg.key }
        });
        await sock.sendMessage(jid, {
          text: `❌ *Video URL نہیں ملا!*\n\nدوسری template آزمائیں۔`
        }, { quoted: msg });
        return;
      }

      // ━━━ Video ڈاؤنلوڈ کریں ━━━
      await sock.sendMessage(jid, {
        react: { text: '⬇️', key: msg.key }
      });

      let videoData;
      try {
        videoData = await downloadVideo(videoUrl);
      } catch (dlErr) {
        await sock.sendMessage(jid, {
          react: { text: '❌', key: msg.key }
        });
        await sock.sendMessage(jid, {
          text: `❌ *Video ڈاؤنلوڈ ناکام!*\n\n*Error:* ${dlErr.message}\n\nدوبارہ کوشش کریں۔`
        }, { quoted: msg });
        return;
      }

      // ━━━ Thumbnail لیں ━━━
      const thumbUrl = result.thumbnail || result.cover ||
                       result.image || result.thumb || '';
      let thumbBuffer = Buffer.from('');
      if (thumbUrl && isValidHttpUrl(thumbUrl)) {
        thumbBuffer = await getBuffer(thumbUrl);
      }

      // ━━━ Template معلومات ━━━
      const title    = result.title    || result.name     || 'CapCut Template';
      const author   = result.author   || result.creator  || result.username || 'نامعلوم';
      const uses     = result.uses     || result.use_count|| result.views || 0;
      const duration = result.duration || result.time     || '';
      const size     = formatSize(videoData.size);

      const caption = `
╭━━━『 🎬 *CapCut Template* 』━━━╮

📝 *نام:* ${title}
👤 *Creator:* ${author}
${uses   ? `🔥 *استعمال:* ${formatNumber(uses)}+ بار\n` : ''}${duration ? `⏱️ *مدت:* ${duration} سیکنڈ\n` : ''}📦 *سائز:* ${size}

━━━━━『 📱 *استعمال کا طریقہ* 』━━━━━

1️⃣ CapCut app کھولیں
2️⃣ نیچے *"Templates"* tab پر جائیں
3️⃣ *"Use Template"* پر tap کریں
4️⃣ اپنی photos/videos شامل کریں
5️⃣ Edit کریں اور Export کریں
6️⃣ TikTok / Instagram پر share کریں! 🚀

━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *Watermark Free Download*
🤖 *by YOUSAF-BALOCH-MD*

📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech`.trim();

      // ━━━ Video بھیجیں ━━━
      await sock.sendMessage(jid, {
        video:   videoData.buffer,
        caption: caption,
        mimetype: 'video/mp4',
        contextInfo: {
          externalAdReply: {
            title:     title,
            body:      `CapCut Template • YOUSAF-BALOCH-MD`,
            thumbnail: thumbBuffer.length > 0 ? thumbBuffer : undefined,
            sourceUrl: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
            mediaType: 1
          }
        }
      }, { quoted: msg });

      // ━━━ Thumbnail بھی بھیجیں ━━━
      if (thumbBuffer.length > 0) {
        await sock.sendMessage(jid, {
          image:   thumbBuffer,
          caption: `🖼️ *Template Preview*\n📝 ${title}\n👤 by ${author}`
        }, { quoted: msg });
      }

      await sock.sendMessage(jid, {
        react: { text: '✅', key: msg.key }
      });

    } catch (error) {
      console.error('[CAPCUT ERROR]', error);
      const jid = msg.key.remoteJid;
      await sock.sendMessage(jid, {
        react: { text: '❌', key: msg.key }
      });
      await sock.sendMessage(jid, {
        text: `❌ *غلطی آ گئی!*\n\n*Error:* ${error.message}\n\nدوبارہ کوشش کریں یا link چیک کریں۔`
      }, { quoted: msg });
    }
  }
};
