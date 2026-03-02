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

  // ── Professional Menu Design (English Only) ──────────────────
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

━━━━━━━━━━『 📋 *COMPLETE MENUS* 』━━━━━━━━━━

╭━『 🏠 *MAIN MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}menu      » Full Menu Display
┃  ${pfx}alive     » Bot Status Check
┃  ${pfx}ping      » Speed Test
┃  ${pfx}runtime   » Bot Uptime
┃  ${pfx}owner     » Owner Information
┃  ${pfx}support   » Support Group
┃  ${pfx}script    » Get Bot Script
┃  ${pfx}settings  » Bot Settings
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 ⚙️ *AUTO FEATURES* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}autoviewstatus <on/off>  » Auto View Status
┃  ${pfx}antidelete <on/off>      » Anti Delete Messages
┃  ${pfx}autoreact <on/off>       » Auto React
┃  ${pfx}autoread <on/off>        » Auto Read
┃  ${pfx}autotyping <on/off>      » Typing Indicator
┃  ${pfx}autorecording <on/off>   » Recording Status
┃  ${pfx}autobio <on/off>         » Auto Bio Rotate
┃  ${pfx}anticall <on/off>        » Auto Reject Calls
┃  ${pfx}autoreply <on/off>       » Auto Reply
┃  ${pfx}autodownload <on/off>    » Auto Download
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🤖 *AI FEATURES* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  *Chat AI*
┃  ${pfx}ai <text>          » Gemini AI Chat
┃  ${pfx}chatgpt <text>     » ChatGPT Response
┃  ${pfx}gpt <text>         » GPT Response
┃  ${pfx}gpt4 <text>        » GPT-4 AI
┃  ${pfx}bing <text>        » Bing AI
┃  ${pfx}blackbox <text>    » Blackbox AI
┃  ${pfx}mixtral <text>     » Mixtral AI
┃  ${pfx}deepseek <text>    » DeepSeek AI
┃  ${pfx}copilot <text>     » Microsoft Copilot
┃  ${pfx}claude <text>      » Claude AI
┃  ${pfx}perplexity <text>  » Perplexity AI
┃  ${pfx}meta <text>        » Meta AI
┃  ${pfx}bard <text>        » Google Bard
┃
┃  *Specialized AI*
┃  ${pfx}doctor <symptom>   » AI Doctor
┃  ${pfx}lawyer <case>      » AI Lawyer
┃  ${pfx}homework <subject> » Homework Help
┃  ${pfx}khuwab <dream>     » Dream Interpretation
┃  ${pfx}resume <job>       » Resume Builder
┃  ${pfx}romanurdu <text>   » Roman Urdu AI
┃  ${pfx}sentiment <text>   » Sentiment Analysis
┃
┃  *AI Image*
┃  ${pfx}imagine <prompt>   » Generate AI Art
┃  ${pfx}aiimage <prompt>   » Generate Image
┃  ${pfx}dalle <prompt>     » DALL-E Image
┃  ${pfx}upscale <image>    » 8K Upscaler
┃
┃  *AI Code*
┃  ${pfx}aicode <lang> <task> » Generate Code
┃  ${pfx}explain <code>     » Explain Code
┃  ${pfx}debug <code>       » Debug Code
┃
┃  *Translation*
┃  ${pfx}translate <lang> <text> » Translate Text
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 📥 *DOWNLOAD MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  *YouTube*
┃  ${pfx}ytmp3 <url>     » YouTube MP3
┃  ${pfx}ytmp4 <url>     » YouTube MP4
┃  ${pfx}play <name>     » Search & Play
┃  ${pfx}song <name>     » Search Song
┃  ${pfx}video <name>    » Search Video
┃
┃  *TikTok*
┃  ${pfx}tiktok <url>    » TikTok Video
┃  ${pfx}ttmp3 <url>     » TikTok Audio
┃
┃  *Instagram*
┃  ${pfx}instagram <url> » IG Post
┃  ${pfx}igreel <url>    » IG Reel
┃
┃  *Facebook*
┃  ${pfx}facebook <url>  » FB Video
┃
┃  *Twitter/X*
┃  ${pfx}twitter <url>   » Twitter Video
┃
┃  *SoundCloud*
┃  ${pfx}soundcloud <url> » SC Audio
┃
┃  *Audio Downloads*
┃  ${pfx}audio <url>      » Download Audio
┃  ${pfx}songdl <name>    » Download Song
┃
┃  *APK Downloads*
┃  ${pfx}apk <name>       » Download APK
┃  ${pfx}modapk <name>    » Modded APK
┃  ${pfx}playstore <name> » Play Store App
┃
┃  *Movies & Shows*
┃  ${pfx}movie <name>     » Movie Info/Download
┃  ${pfx}drama <name>     » Drama Download
┃  ${pfx}trailer <name>   » Movie Trailer
┃
┃  *Islamic Audio*
┃  ${pfx}naat <name>      » Naat Download
┃  ${pfx}bayan <name>     » Bayan Download
┃
┃  *Images*
┃  ${pfx}wallpaper <q>    » HD Wallpaper
┃  ${pfx}ringtone <name>  » Ringtone
┃  ${pfx}snapshot <url>   » Website Snapshot
┃  ${pfx}threads <url>    » Threads Download
┃
┃  *Cloud Downloads*
┃  ${pfx}gdrive <url>     » Google Drive
┃  ${pfx}mediafire <url>  » MediaFire
┃  ${pfx}pinterest <url>  » Pinterest
┃  ${pfx}islamic <query>  » Islamic Content
┃  ${pfx}download <url>   » Universal Downloader
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🖼️ *IMAGE TOOLS* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}remini        » AI Image Enhancer
┃  ${pfx}enhance       » HD Quality
┃  ${pfx}blur          » Blur Effect
┃  ${pfx}sepia         » Sepia Effect
┃  ${pfx}invert        » Invert Colors
┃  ${pfx}grayscale     » Black & White
┃  ${pfx}cartoon       » Cartoon Effect
┃  ${pfx}sketch        » Pencil Sketch
┃  ${pfx}watermark <t> » Add Watermark
┃  ${pfx}rembg         » Remove Background
┃  ${pfx}wanted        » Wanted Poster
┃  ${pfx}wasted        » Wasted Effect
┃  ${pfx}jail          » Jail Effect
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎭 *STICKER MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}sticker       » Image → Sticker
┃  ${pfx}s             » Quick Sticker
┃  ${pfx}sgif          » Video → Sticker
┃  ${pfx}toimg         » Sticker → Image
┃  ${pfx}ttp <text>    » Text → Sticker
┃  ${pfx}attp <text>   » Animated TTP
┃  ${pfx}emojimix <🤣+😍> » Mix Emojis
┃  ${pfx}take <pack>   » Take Sticker
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎨 *DESIGN TOOLS* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}logo <name>   » 30+ Logo Styles
┃  ${pfx}dp <name>     » 30+ DP Styles
┃  ${pfx}carbon <code> » Code Screenshot
┃  ${pfx}meme <t|b>    » Create Meme
┃  ${pfx}logomaker     » Custom Logo
┃  ${pfx}dpmaker       » Custom DP
┃  ${pfx}capcut        » CapCut Template
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔧 *TOOLS MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}calc <expr>   » Calculator
┃  ${pfx}convert <v> <unit> » Unit Converter
┃  ${pfx}currency <a> <F> <T> » Currency Converter
┃  ${pfx}weather <city> » Weather Info
┃  ${pfx}pdf <title>   » Image → PDF
┃  ${pfx}ocr           » Read Image Text
┃  ${pfx}qr <text>     » Generate QR Code
┃  ${pfx}short <url>   » Shorten URL
┃  ${pfx}screenshot <url> » Website Screenshot
┃  ${pfx}tts <lang> <text> » Text to Speech
┃  ${pfx}compressor    » Compress Media
┃  ${pfx}videoaud <cmd> » Video/Audio Tools
┃  ${pfx}videogif      » Video to GIF
┃  ${pfx}inshot        » InShot Templates
┃  ${pfx}tools         » Utility Tools
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🔍 *SEARCH MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}google <query>  » Google Search
┃  ${pfx}wiki <query>    » Wikipedia
┃  ${pfx}movie <name>    » Movie Info
┃  ${pfx}lyrics <song>   » Song Lyrics
┃  ${pfx}news            » Latest News
┃  ${pfx}technews        » Tech News
┃  ${pfx}sportsnews      » Sports News
┃  ${pfx}github <repo>   » GitHub Info
┃  ${pfx}ytstalk <user>  » YouTube Stats
┃  ${pfx}tiktokstalk <user> » TikTok Stats
┃  ${pfx}xstalk <user>   » X (Twitter) Stats
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 ☪️ *ISLAMIC MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  *Quran*
┃  ${pfx}quran <surah:ayah> » Quran Ayat
┃  ${pfx}ayat           » Random Ayat
┃  ${pfx}tafsir <s:a>   » Tafsir Ibn Kathir
┃
┃  *Hadith*
┃  ${pfx}hadith         » Random Hadith
┃
┃  *Prayer Times*
┃  ${pfx}prayertime <city> » Prayer Times
┃  ${pfx}prayer         » Today's Prayer
┃
┃  *Islamic Info*
┃  ${pfx}hijri          » Hijri Date
┃  ${pfx}dua            » Random Dua
┃  ${pfx}asma           » Asma-ul-Husna
┃  ${pfx}islamicnames   » Muslim Names
┃  ${pfx}zakatcalc <amt> » Zakat Calculator
┃  ${pfx}ramadan        » Ramadan Info
┃  ${pfx}hajj           » Hajj Guide
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🏏 *CRICKET & MATCH* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  *Live Scores*
┃  ${pfx}score          » Live Score
┃  ${pfx}livescore      » Live Matches
┃  ${pfx}cricketlive    » Cricket Live
┃  ${pfx}cricketfull    » Full Scorecard
┃
┃  *Match Info*
┃  ${pfx}matchinfo      » Match Details
┃  ${pfx}schedule       » Match Schedule
┃  ${pfx}commentary     » Live Commentary
┃  ${pfx}toss           » Toss Result
┃  ${pfx}ipinfo         » IP Details
┃  ${pfx}playerstats    » Player Stats
┃
┃  *Tournaments*
┃  ${pfx}psl            » PSL 2025
┃  ${pfx}ipl            » IPL 2025
┃  ${pfx}pointstable    » Points Table
┃
┃  *Football*
┃  ${pfx}football       » Football Score
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 👥 *GROUP MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  *Member Management*
┃  ${pfx}add <number>    » Add Member
┃  ${pfx}kick <@user>    » Kick Member
┃  ${pfx}promote <@user> » Make Admin
┃  ${pfx}demote <@user>  » Remove Admin
┃  ${pfx}tagall <text>   » Tag Everyone
┃  ${pfx}hidetag <text>  » Silent Tag
┃  ${pfx}invite          » Get Group Invite
┃  ${pfx}link            » Group Link
┃  ${pfx}members         » Member List
┃  ${pfx}admins          » Admin List
┃
┃  *Warning System*
┃  ${pfx}warn <@user>    » Warn Member
┃  ${pfx}unwarn <@user>  » Remove Warn
┃  ${pfx}warnlist        » Warn List
┃  ${pfx}bannedlist      » Banned List
┃
┃  *Group Settings*
┃  ${pfx}groupopen       » Open Group
┃  ${pfx}groupclose      » Close Group
┃  ${pfx}groupname <text> » Change Name
┃  ${pfx}groupdesc <text> » Change Desc
┃  ${pfx}groupactivity   » Group Activity
┃  ${pfx}groupleave      » Leave Group
┃
┃  *Protection*
┃  ${pfx}antilink <on/off>  » Anti Link
┃  ${pfx}antivv <on/off>    » Anti View Once
┃  ${pfx}antispam <on/off>  » Anti Spam
┃  ${pfx}antighost <on/off> » Anti Ghost Members
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 💰 *ECONOMY MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}balance        » Check Balance
┃  ${pfx}daily          » Daily Reward
┃  ${pfx}work           » Work for Coins
┃  ${pfx}shop           » View Shop
┃  ${pfx}buy <item>     » Buy Item
┃  ${pfx}leaderboard    » Top 10 Rich
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 🎮 *GAMES MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}tictactoe <@user> » Tic Tac Toe
┃  ${pfx}quiz <category>   » Quiz Game
┃  ${pfx}dice              » Roll Dice
┃  ${pfx}coin              » Coin Flip
┃  ${pfx}math <easy/hard>  » Math Game
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 😄 *FUN MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}joke           » Random Joke
┃  ${pfx}quote          » Motivational Quote
┃  ${pfx}fact           » Random Fact
┃  ${pfx}truth          » Truth Question
┃  ${pfx}dare           » Dare Challenge
┃  ${pfx}meme           » Random Meme
┃  ${pfx}ship <@u1> <@u2> » Love Meter
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━『 👑 *OWNER MENU* 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  ${pfx}broadcast <text>  » Broadcast Message
┃  ${pfx}ban <@user>       » Ban User
┃  ${pfx}unban <@user>     » Unban User
┃  ${pfx}block <@user>     » Block User
┃  ${pfx}unblock <@user>   » Unblock User
┃  ${pfx}restart           » Restart Bot
┃  ${pfx}shutdown          » Shutdown Bot
┃  ${pfx}eval <code>       » Execute Code
┃  ${pfx}join <link>       » Join Group
┃  ${pfx}leavegc           » Leave Group
┃  ${pfx}backup            » Backup Database
┃  ${pfx}update            » Update Bot
┃  ${pfx}setpp             » Set Profile Pic
┃  ${pfx}contact <number>  » Contact Owner
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════════════════════════════════════════════╗
║              💎 *BOT FEATURES* 💎                            ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ 173+ Active Plugins                                      ║
║  ✅ Auto View Status                                         ║
║  ✅ Anti Delete Messages                                     ║
║  ✅ 3-Strike Warning System                                  ║
║  ✅ Economy System (Coins & Shop)                            ║
║  ✅ Islamic Prayer Alerts                                    ║
║  ✅ Live Cricket & PSL Scores                                ║
║  ✅ AI-Powered Chat & Images                                 ║
║  ✅ 30+ Logo & DP Styles                                     ║
║  ✅ Multi-Platform Downloads                                 ║
║  ✅ Time-Based Menu Modes                                    ║
║  ✅ Group Protection System                                  ║
║  ✅ 50+ AI Models                                            ║
╠══════════════════════════════════════════════════════════════╣
║  👑 *Owner:* MR YOUSAF BALOCH                                ║
║  📱 *WA:*    +923710636110                                   ║
║  📺 *YouTube:* @Yousaf_Baloch_Tech                           ║
║  🎵 *TikTok:*  @loser_boy.110                                ║
║  💻 *GitHub:* musakhanbaloch03-sad                           ║
╠══════════════════════════════════════════════════════════════╣
║  📟 *Total Commands:* 200+                                   ║
║  🔒 *Owner Cannot Be Changed*                                ║
║  ⚡ *24/7 Online Support*                                    ║
╚══════════════════════════════════════════════════════════════╝

_✨ © 2025-2026 ${OWNER.BOT_NAME} ✨_
_⚡ Developed by ${OWNER.FULL_NAME} ⚡_
_🌟 All Rights Reserved 🌟_`.trim();

  // ── Send Menu with Image ────────────────────────────────────
  try {
    const thumbPath  = path.resolve('./assets/menu-thumb.png');
    const thumbBuf   = fs.readFileSync(thumbPath);

    await conn.sendMessage(m.chat, {
      image  : thumbBuf,
      caption: menu,
      contextInfo: {
        externalAdReply: {
          title      : `🚀 ${OWNER.BOT_NAME} — Ultra Pro Max Bot 🚀`,
          body       : `👑 ${OWNER.FULL_NAME} | 📺 @Yousaf_Baloch_Tech`,
          thumbnail  : thumbBuf,
          mediaType  : 2,
          mediaUrl   : OWNER.YOUTUBE,
          sourceUrl  : OWNER.YOUTUBE,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });
  } catch (_) {
    await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
  }

  // ── WhatsApp Channel Button ──────────────────────────────────
  await conn.sendMessage(m.chat, {
    text   : `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃     📢 *${OWNER.BOT_NAME} OFFICIAL*     ┃\n┃         ✨ *CHANNEL* ✨         ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n👆 *Click the button below to join* 👆`,
    contextInfo: {
      externalAdReply: {
        title    : `📢 Join ${OWNER.BOT_NAME} Channel`,
        body     : 'Click here to join WhatsApp Channel',
        thumbnail: (() => { try { return fs.readFileSync('./assets/menu-thumb.png'); } catch { return Buffer.from(''); } })(),
        mediaType: 1,
        mediaUrl : OWNER.CHANNEL,
        sourceUrl: OWNER.CHANNEL,
      },
    },
  }, { quoted: m });

  // ── Voice Note ───────────────────────────────────────────────
  try {
    const voicePath = path.resolve('./assets/menu-voice.m4a');
    const voiceBuf  = fs.readFileSync(voicePath);

    await conn.sendMessage(m.chat, {
      audio   : voiceBuf,
      mimetype: 'audio/mp4',
      ptt     : true,
    }, { quoted: m });
  } catch (e) {
    console.error('[MENU VOICE ERROR]:', e.message);
  }
};

handler.help    = ['menu', 'help', 'commands', 'allmenu', 'list'];
handler.tags    = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
