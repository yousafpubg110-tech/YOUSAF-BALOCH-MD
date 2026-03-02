/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ultra Pro Max Menu    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import fs     from 'fs';
import path   from 'path';
import moment from 'moment-timezone';
import { OWNER, CONFIG } from '../config.js';

function getTimeMode() {
  const hour = parseInt(moment.tz('Asia/Karachi').format('HH'));
  if (hour >= 5  && hour < 12) return { label: '🌅 Morning',   emoji: '🌅', mode: 'MORNING',   greet: 'Good Morning!',   dua: 'Allahumma bika asbahna wa bika amsayna',  color: '🟡' };
  if (hour >= 12 && hour < 16) return { label: '☀️ Afternoon', emoji: '☀️', mode: 'AFTERNOON', greet: 'Good Afternoon!', dua: 'Subhan Allahi wa bihamdihi',               color: '🔴' };
  if (hour >= 16 && hour < 20) return { label: '🌆 Evening',   emoji: '🌆', mode: 'EVENING',   greet: 'Good Evening!',   dua: 'Allahumma bika amsayna wa bika asbahna',  color: '🟠' };
  return                               { label: '🌙 Night',     emoji: '🌙', mode: 'NIGHT',     greet: 'Good Night!',     dua: 'Bismika Allahumma amutu wa ahya',         color: '🔵' };
}

let handler = async (m, { conn, usedPrefix }) => {

  if (!m || !m.chat) return;

  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  const name   = conn.contacts?.[sender]?.name  ||
                 conn.contacts?.[sender]?.notify ||
                 (sender ? sender.split('@')[0] : 'User') ||
                 'User';

  const totalreg  = Object.keys(global.db?.data?.users || {}).length;
  const rtotalreg = Object.values(global.db?.data?.users || {}).filter(u => u.registered).length;

  const time    = moment.tz('Asia/Karachi').format('hh:mm:ss A');
  const date    = moment.tz('Asia/Karachi').format('DD MMMM YYYY');
  const day     = moment.tz('Asia/Karachi').format('dddd');
  const uptime  = process.uptime();
  const hrs     = Math.floor(uptime / 3600);
  const mins    = Math.floor((uptime % 3600) / 60);
  const secs    = Math.floor(uptime % 60);

  const T   = getTimeMode();
  const pfx = usedPrefix || CONFIG.PREFIX;

  let pluginCount = 173;
  try { pluginCount = fs.readdirSync('./plugins').filter(f => f.endsWith('.js')).length; } catch (_) {}

  const menu = `
╔══════════════════════════════════════════════════════════════╗
║     🚀 *YOUSAF-BALOCH-MD* ─ *Ultra Pro Max* 🚀              ║
║           ✨ *Best WhatsApp Bot Ever* ✨                      ║
║              👑 *By MR YOUSAF BALOCH* 👑                      ║
╚══════════════════════════════════════════════════════════════╝

╭━『 ⏰ *TIME MODE* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${T.emoji} *${T.label}* — ${T.greet}
┃  🤲 *${T.dua}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 📊 *BOT INFORMATION* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  👤 *User*     : ${name}
┃  👑 *Owner*    : ${OWNER.FULL_NAME}
┃  📱 *Number*   : +${OWNER.NUMBER}
┃  🤖 *Bot Name* : ${OWNER.BOT_NAME}
┃  📅 *Date*     : ${date}
┃  📆 *Day*      : ${day}
┃  ⏰ *Time*     : ${time}
┃  ⏱️ *Uptime*   : ${hrs}h ${mins}m ${secs}s
┃  👥 *Users*    : ${totalreg} (✅ ${rtotalreg} Registered)
┃  🔌 *Plugins*  : ${pluginCount}+ Active
┃  📟 *Prefix*   : [ ${pfx} ]
┃  🌐 *Mode*     : ${T.mode}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔗 *SOCIAL MEDIA* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  📢 *Channel*   : @YousafBalochTech
┃  📺 *YouTube*   : @Yousaf_Baloch_Tech
┃  🎵 *TikTok*    : @loser_boy.110
┃  💻 *GitHub*    : musakhanbaloch03-sad
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

━━━━━━━━━━『 📋 *MAIN MENU* 』━━━━━━━━━━

╭━『 🏠 *MAIN* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}menu      » Full Menu Display
┃  ${pfx}alive     » Bot Status Check
┃  ${pfx}ping      » Speed Test
┃  ${pfx}runtime   » Bot Uptime
┃  ${pfx}owner     » Owner Information
┃  ${pfx}support   » Support Group
┃  ${pfx}script    » Get Bot Script
┃  ${pfx}settings  » Bot Settings
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 ⚙️ *AUTO* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}autoviewstatus  » Auto View Status
┃  ${pfx}antidelete      » Anti Delete Messages
┃  ${pfx}autoreact       » Auto React
┃  ${pfx}autoread        » Auto Read
┃  ${pfx}autotyping      » Typing Indicator
┃  ${pfx}autorecording   » Recording Status
┃  ${pfx}autobio         » Auto Bio Rotate
┃  ${pfx}anticall        » Auto Reject Calls
┃  ${pfx}autoreply       » Auto Reply
┃  ${pfx}autodownload    » Auto Download
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🤖 *AI* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}ai              » Gemini AI Chat
┃  ${pfx}chatgpt         » ChatGPT Response
┃  ${pfx}gpt4            » GPT-4 AI
┃  ${pfx}deepseek        » DeepSeek AI
┃  ${pfx}claude          » Claude AI
┃  ${pfx}doctor          » AI Doctor
┃  ${pfx}lawyer          » AI Lawyer
┃  ${pfx}homework        » Homework Help
┃  ${pfx}khuwab          » Dream Interpretation
┃  ${pfx}resume          » Resume Builder
┃  ${pfx}romanurdu       » Roman Urdu AI
┃  ${pfx}imagine         » Generate AI Art
┃  ${pfx}aicode          » Generate Code
┃  ${pfx}explain         » Explain Code
┃  ${pfx}debug           » Debug Code
┃  ${pfx}translate       » Translate Text
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 📥 *DOWNLOAD* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}ytmp3           » YouTube MP3
┃  ${pfx}ytmp4           » YouTube MP4
┃  ${pfx}play            » Search & Play
┃  ${pfx}song            » Search Song
┃  ${pfx}video           » Search Video
┃  ${pfx}tiktok          » TikTok Video
┃  ${pfx}ttmp3           » TikTok Audio
┃  ${pfx}instagram       » IG Post
┃  ${pfx}igreel          » IG Reel
┃  ${pfx}facebook        » FB Video
┃  ${pfx}twitter         » Twitter Video
┃  ${pfx}soundcloud      » SC Audio
┃  ${pfx}apk             » Download APK
┃  ${pfx}modapk          » Modded APK
┃  ${pfx}playstore       » Play Store App
┃  ${pfx}movie           » Movie Info
┃  ${pfx}naat            » Naat Download
┃  ${pfx}bayan           » Bayan Download
┃  ${pfx}wallpaper       » HD Wallpaper
┃  ${pfx}pinterest       » Pinterest
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🖼️ *IMAGE* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}remini          » AI Image Enhancer
┃  ${pfx}enhance         » HD Quality
┃  ${pfx}blur            » Blur Effect
┃  ${pfx}sepia           » Sepia Effect
┃  ${pfx}grayscale       » Black & White
┃  ${pfx}cartoon         » Cartoon Effect
┃  ${pfx}sketch          » Pencil Sketch
┃  ${pfx}watermark       » Add Watermark
┃  ${pfx}rembg           » Remove Background
┃  ${pfx}wanted          » Wanted Poster
┃  ${pfx}wasted          » Wasted Effect
┃  ${pfx}jail            » Jail Effect
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎭 *STICKER* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}sticker         » Image → Sticker
┃  ${pfx}s               » Quick Sticker
┃  ${pfx}sgif            » Video → Sticker
┃  ${pfx}toimg           » Sticker → Image
┃  ${pfx}ttp             » Text → Sticker
┃  ${pfx}attp            » Animated TTP
┃  ${pfx}emojimix        » Mix Emojis
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎨 *DESIGN* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}logo            » 30+ Logo Styles
┃  ${pfx}dp              » 30+ DP Styles
┃  ${pfx}carbon          » Code Screenshot
┃  ${pfx}meme            » Create Meme
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔧 *TOOLS* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}calc            » Calculator
┃  ${pfx}convert         » Unit Converter
┃  ${pfx}currency        » Currency Converter
┃  ${pfx}weather         » Weather Info
┃  ${pfx}pdf             » Image → PDF
┃  ${pfx}ocr             » Read Image Text
┃  ${pfx}qr              » Generate QR Code
┃  ${pfx}short           » Shorten URL
┃  ${pfx}screenshot      » Website Screenshot
┃  ${pfx}tts             » Text to Speech
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔍 *SEARCH* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}google          » Google Search
┃  ${pfx}wiki            » Wikipedia
┃  ${pfx}lyrics          » Song Lyrics
┃  ${pfx}news            » Latest News
┃  ${pfx}technews        » Tech News
┃  ${pfx}github          » GitHub Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 ☪️ *ISLAMIC* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}quran           » Quran Ayat
┃  ${pfx}ayat            » Random Ayat
┃  ${pfx}hadith          » Random Hadith
┃  ${pfx}prayertime      » Prayer Times
┃  ${pfx}hijri           » Hijri Date
┃  ${pfx}dua             » Random Dua
┃  ${pfx}asma            » Asma-ul-Husna
┃  ${pfx}zakatcalc       » Zakat Calculator
┃  ${pfx}ramadan         » Ramadan Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🏏 *CRICKET* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}score           » Live Score
┃  ${pfx}livescore       » Live Matches
┃  ${pfx}matchinfo       » Match Details
┃  ${pfx}schedule        » Match Schedule
┃  ${pfx}psl             » PSL 2025
┃  ${pfx}pointstable     » Points Table
┃  ${pfx}football        » Football Score
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 👥 *GROUP* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}add             » Add Member
┃  ${pfx}kick            » Kick Member
┃  ${pfx}promote         » Make Admin
┃  ${pfx}demote          » Remove Admin
┃  ${pfx}tagall          » Tag Everyone
┃  ${pfx}hidetag         » Silent Tag
┃  ${pfx}warn            » Warn Member
┃  ${pfx}unwarn          » Remove Warn
┃  ${pfx}groupopen       » Open Group
┃  ${pfx}groupclose      » Close Group
┃  ${pfx}antilink        » Anti Link
┃  ${pfx}antivv          » Anti View Once
┃  ${pfx}antispam        » Anti Spam
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 💰 *ECONOMY* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}balance         » Check Balance
┃  ${pfx}daily           » Daily Reward
┃  ${pfx}work            » Work for Coins
┃  ${pfx}shop            » View Shop
┃  ${pfx}buy             » Buy Item
┃  ${pfx}leaderboard     » Top 10 Rich
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎮 *GAMES* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}tictactoe       » Tic Tac Toe
┃  ${pfx}quiz            » Quiz Game
┃  ${pfx}dice            » Roll Dice
┃  ${pfx}coin            » Coin Flip
┃  ${pfx}math            » Math Game
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 😄 *FUN* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}joke            » Random Joke
┃  ${pfx}quote           » Motivational Quote
┃  ${pfx}fact            » Random Fact
┃  ${pfx}truth           » Truth Question
┃  ${pfx}dare            » Dare Challenge
┃  ${pfx}meme            » Random Meme
┃  ${pfx}ship            » Love Meter
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 👑 *OWNER* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}broadcast       » Broadcast Message
┃  ${pfx}ban             » Ban User
┃  ${pfx}unban           » Unban User
┃  ${pfx}block           » Block User
┃  ${pfx}unblock         » Unblock User
┃  ${pfx}restart         » Restart Bot
┃  ${pfx}shutdown        » Shutdown Bot
┃  ${pfx}eval            » Execute Code
┃  ${pfx}join            » Join Group
┃  ${pfx}leave           » Leave Group
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════════════════════════════════════════════╗
║              💎 *BOT FEATURES* 💎                            ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ 200+ Active Plugins                                      ║
║  ✅ Auto View Status                                         ║
║  ✅ Anti Delete Messages                                     ║
║  ✅ 3-Strike Warning System                                  ║
║  ✅ Economy System (Coins & Shop)                            ║
║  ✅ Live Cricket Scores                                      ║
║  ✅ AI-Powered Chat & Images                                 ║
║  ✅ 30+ Logo & DP Styles                                     ║
╠══════════════════════════════════════════════════════════════╣
║  👑 *Owner:* MR YOUSAF BALOCH                                ║
║  📱 *Number:* +923710636110                                  ║
║  📢 *Channel:* @YousafBalochTech                             ║
║  📺 *YouTube:* @Yousaf_Baloch_Tech                           ║
╚══════════════════════════════════════════════════════════════╝

_✨ © 2025-2026 ${OWNER.BOT_NAME} ✨_
_⚡ Developed by ${OWNER.FULL_NAME} ⚡_`.trim();

  // ── تصویر پڑھیں ───────────────────────────────────────────────
  const thumbPath = path.resolve('./assets/menu-thumb.png');
  let thumbBuf = null;
  try {
    if (fs.existsSync(thumbPath)) {
      thumbBuf = fs.readFileSync(thumbPath);
    }
  } catch (_) {}

  // ── Step 1: پہلے صرف menu text بھیجیں ────────────────────────
  // یہ ہمیشہ چلے گا — چاہے image ہو یا نہ ہو
  if (thumbBuf) {
    // تصویر کے ساتھ مینیو
    try {
      await conn.sendMessage(m.chat, {
        image  : thumbBuf,
        caption: menu,
        contextInfo: {
          externalAdReply: {
            title    : `🚀 ${OWNER.BOT_NAME}`,
            body     : `📺 @Yousaf_Baloch_Tech`,
            thumbnail: thumbBuf,
            mediaType: 1,
            mediaUrl : 'https://www.youtube.com/@Yousaf_Baloch_Tech',
            sourceUrl: 'https://www.youtube.com/@Yousaf_Baloch_Tech',
          },
        },
      }, { quoted: m });
      console.log('[MENU] ✅ Image + menu sent!');
    } catch (e) {
      console.error('[MENU] Image failed:', e.message);
      // Image fail — text بھیجیں
      try {
        await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
        console.log('[MENU] ✅ Text menu sent (fallback)');
      } catch (e2) {
        console.error('[MENU] Text also failed:', e2.message);
      }
    }
  } else {
    // تصویر نہیں — صرف text
    try {
      await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
      console.log('[MENU] ✅ Text menu sent (no image)');
    } catch (e) {
      console.error('[MENU] Text failed:', e.message);
    }
  }

  // ── Step 2: WhatsApp Channel بٹن ─────────────────────────────
  try {
    await conn.sendMessage(m.chat, {
      text: `📢 *Join ${OWNER.BOT_NAME} Official Channel!*\n_Updates, Support & New Features_\n\nhttps://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j`,
      contextInfo: {
        externalAdReply: {
          title    : `📢 ${OWNER.BOT_NAME} — Official Channel`,
          body     : 'Join for updates & support! ✅',
          thumbnail: thumbBuf || Buffer.from(''),
          mediaType: 1,
          mediaUrl : 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
          sourceUrl: 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
        },
      },
    }, { quoted: m });
    console.log('[MENU] ✅ Channel button sent!');
  } catch (e) {
    console.error('[MENU] Channel button failed:', e.message);
  }

  // ── Step 3: Voice Note — بالکل آخر میں ──────────────────────
  try {
    const voicePath = path.resolve('./assets/menu-voice.m4a');
    if (fs.existsSync(voicePath)) {
      const voiceBuf = fs.readFileSync(voicePath);
      await conn.sendMessage(m.chat, {
        audio   : voiceBuf,
        mimetype: 'audio/mp4',
        ptt     : true,
      }, { quoted: m });
      console.log('[MENU] ✅ Voice sent!');
    } else {
      console.log('[MENU] ⚠️ Voice file not found:', voicePath);
    }
  } catch (e) {
    console.error('[MENU] Voice failed:', e.message);
  }
};

handler.help    = ['menu', 'help', 'commands', 'allmenu', 'list'];
handler.tags    = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
