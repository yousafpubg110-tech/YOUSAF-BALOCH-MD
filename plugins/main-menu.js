/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ultra Pro Max Menu    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import fs      from 'fs';
import path    from 'path';
import moment  from 'moment-timezone';
import { OWNER, CONFIG } from '../config.js';

function getTimeMode() {
  const hour = parseInt(moment.tz('Asia/Karachi').format('HH'));
  if (hour >= 5  && hour < 12) return { label: '🌅 Morning',   emoji: '🌅', mode: 'MORNING',   greet: 'Good Morning!',   dua: 'Allahumma bika asbahna wa bika amsayna',   color: '🟡' };
  if (hour >= 12 && hour < 16) return { label: '☀️ Afternoon', emoji: '☀️', mode: 'AFTERNOON', greet: 'Good Afternoon!', dua: 'Subhan Allahi wa bihamdihi',                color: '🔴' };
  if (hour >= 16 && hour < 20) return { label: '🌆 Evening',   emoji: '🌆', mode: 'EVENING',   greet: 'Good Evening!',   dua: 'Allahumma bika amsayna wa bika asbahna',   color: '🟠' };
  return                               { label: '🌙 Night',     emoji: '🌙', mode: 'NIGHT',     greet: 'Good Night!',     dua: 'Bismika Allahumma amutu wa ahya',          color: '🔵' };
}

let handler = async (m, { conn, usedPrefix }) => {

  if (!m || !m.chat || !m.key) return;

  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  const name   = conn.contacts?.[sender]?.name ||
                 conn.contacts?.[sender]?.notify ||
                 (sender ? sender.split('@')[0] : 'User') ||
                 'User';

  const totalreg  = Object.keys(global.db?.data?.users || {}).length;
  const rtotalreg = Object.values(global.db?.data?.users || {}).filter(u => u.registered).length;

  const time    = moment.tz('Asia/Karachi').format('hh:mm:ss A');
  const date    = moment.tz('Asia/Karachi').format('DD MMMM YYYY');
  const day     = moment.tz('Asia/Karachi').format('dddd');
  const uptime  = process.uptime();
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

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
┃  ⏱️ *Uptime*   : ${hours}h ${minutes}m ${seconds}s
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
┃  ${pfx}public    » Public Mode
┃  ${pfx}private   » Private Mode
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
┃  ${pfx}bing            » Bing AI
┃  ${pfx}blackbox        » Blackbox AI
┃  ${pfx}mixtral         » Mixtral AI
┃  ${pfx}deepseek        » DeepSeek AI
┃  ${pfx}copilot         » Microsoft Copilot
┃  ${pfx}claude          » Claude AI
┃  ${pfx}perplexity      » Perplexity AI
┃  ${pfx}meta            » Meta AI
┃  ${pfx}bard            » Google Bard
┃  ${pfx}doctor          » AI Doctor
┃  ${pfx}lawyer          » AI Lawyer
┃  ${pfx}homework        » Homework Help
┃  ${pfx}khuwab          » Dream Interpretation
┃  ${pfx}resume          » Resume Builder
┃  ${pfx}romanurdu       » Roman Urdu AI
┃  ${pfx}sentiment       » Sentiment Analysis
┃  ${pfx}imagine         » Generate AI Art
┃  ${pfx}aiimage         » Generate Image
┃  ${pfx}dalle           » DALL-E Image
┃  ${pfx}upscale         » 8K Upscaler
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
┃  ${pfx}movie           » Movie Info/Download
┃  ${pfx}drama           » Drama Download
┃  ${pfx}trailer         » Movie Trailer
┃  ${pfx}naat            » Naat Download
┃  ${pfx}bayan           » Bayan Download
┃  ${pfx}wallpaper       » HD Wallpaper
┃  ${pfx}ringtone        » Ringtone
┃  ${pfx}gdrive          » Google Drive
┃  ${pfx}mediafire       » MediaFire
┃  ${pfx}pinterest       » Pinterest
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🖼️ *IMAGE* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}remini          » AI Image Enhancer
┃  ${pfx}enhance         » HD Quality
┃  ${pfx}blur            » Blur Effect
┃  ${pfx}sepia           » Sepia Effect
┃  ${pfx}invert          » Invert Colors
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
┃  ${pfx}take            » Take Sticker
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎨 *DESIGN* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}logo            » 30+ Logo Styles
┃  ${pfx}dp              » 30+ DP Styles
┃  ${pfx}carbon          » Code Screenshot
┃  ${pfx}meme            » Create Meme
┃  ${pfx}logomaker       » Custom Logo
┃  ${pfx}dpmaker         » Custom DP
┃  ${pfx}capcut          » CapCut Template
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
┃  ${pfx}compressor      » Compress Media
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔍 *SEARCH* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}google          » Google Search
┃  ${pfx}wiki            » Wikipedia
┃  ${pfx}lyrics          » Song Lyrics
┃  ${pfx}news            » Latest News
┃  ${pfx}technews        » Tech News
┃  ${pfx}sportsnews      » Sports News
┃  ${pfx}github          » GitHub Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 ☪️ *ISLAMIC* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}quran           » Quran Ayat
┃  ${pfx}ayat            » Random Ayat
┃  ${pfx}tafsir          » Tafsir
┃  ${pfx}hadith          » Random Hadith
┃  ${pfx}prayertime      » Prayer Times
┃  ${pfx}prayer          » Today's Prayer
┃  ${pfx}hijri           » Hijri Date
┃  ${pfx}dua             » Random Dua
┃  ${pfx}asma            » Asma-ul-Husna
┃  ${pfx}islamicnames    » Muslim Names
┃  ${pfx}zakatcalc       » Zakat Calculator
┃  ${pfx}ramadan         » Ramadan Info
┃  ${pfx}hajj            » Hajj Guide
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🏏 *CRICKET* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}score           » Live Score
┃  ${pfx}livescore       » Live Matches
┃  ${pfx}cricketlive     » Cricket Live
┃  ${pfx}matchinfo       » Match Details
┃  ${pfx}schedule        » Match Schedule
┃  ${pfx}commentary      » Live Commentary
┃  ${pfx}toss            » Toss Result
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
┃  ${pfx}invite          » Get Group Invite
┃  ${pfx}link            » Group Link
┃  ${pfx}members         » Member List
┃  ${pfx}admins          » Admin List
┃  ${pfx}warn            » Warn Member
┃  ${pfx}unwarn          » Remove Warn
┃  ${pfx}groupopen       » Open Group
┃  ${pfx}groupclose      » Close Group
┃  ${pfx}groupname       » Change Name
┃  ${pfx}groupdesc       » Change Desc
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
┃  ${pfx}backup          » Backup Database
┃  ${pfx}update          » Update Bot
┃  ${pfx}setpp           » Set Profile Pic
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

  try {
    // Try to send image with menu
    const thumbPath = path.resolve('./assets/menu-thumb.png');
    
    // Check if file exists
    if (fs.existsSync(thumbPath)) {
      const thumbBuf = fs.readFileSync(thumbPath);
      
      await conn.sendMessage(m.chat, {
        image: thumbBuf,
        caption: menu,
        contextInfo: {
          externalAdReply: {
            title: `🚀 ${OWNER.BOT_NAME} — Ultra Pro Max Bot 🚀`,
            body: `👑 ${OWNER.FULL_NAME} | 📺 @Yousaf_Baloch_Tech`,
            thumbnail: thumbBuf,
            mediaType: 1,
            sourceUrl: OWNER.YOUTUBE,
          },
        },
      }, { quoted: m });
    } else {
      // If image doesn't exist, send only text
      await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
    }
  } catch (e) {
    console.error('[MENU IMAGE ERROR]:', e.message);
    // Fallback to text only
    await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
  }

  // Send WhatsApp Channel button
  try {
    const thumbPath = path.resolve('./assets/menu-thumb.png');
    const thumbBuf = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : Buffer.from('');
    
    await conn.sendMessage(m.chat, {
      text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃     📢 *${OWNER.BOT_NAME} OFFICIAL*     ┃\n┃         ✨ *CHANNEL* ✨                 ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n👆 *Click the button below to join* 👆`,
      contextInfo: {
        externalAdReply: {
          title: `📢 Join ${OWNER.BOT_NAME} Channel`,
          body: 'Click here to join WhatsApp Channel',
          thumbnail: thumbBuf,
          mediaType: 1,
          mediaUrl: OWNER.CHANNEL,
          sourceUrl: OWNER.CHANNEL,
        },
      },
    }, { quoted: m });
  } catch (e) {
    console.error('[CHANNEL BUTTON ERROR]:', e.message);
  }

  // Send voice note (but don't let it be the only thing)
  try {
    const voicePath = path.resolve('./assets/menu-voice.m4a');
    if (fs.existsSync(voicePath)) {
      const voiceBuf = fs.readFileSync(voicePath);
      await conn.sendMessage(m.chat, {
        audio: voiceBuf,
        mimetype: 'audio/mp4',
        ptt: true,
      }, { quoted: m });
    }
  } catch (e) {
    console.error('[MENU VOICE ERROR]:', e.message);
  }
};

handler.help = ['menu', 'help', 'commands', 'allmenu', 'list'];
handler.tags = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
