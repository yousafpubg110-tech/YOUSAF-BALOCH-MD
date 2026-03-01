/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Ultra Pro Max Menu    ┃
┃        Created by MR YOUSAF BALOCH         ┰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import fs      from 'fs';
import moment  from 'moment-timezone';
import { OWNER, CONFIG } from '../config.js';

// ─── Time-based mode config ───────────────────────────────────────────────────
function getTimeMode() {
  const hour = parseInt(moment.tz('Asia/Karachi').format('HH'));

  if (hour >= 5  && hour < 12) return {
    label  : '🌅 Morning Time',
    emoji  : '🌅',
    mode   : 'MORNING',
    greet  : 'Good Morning!',
    dua    : 'Allahumma bika asbahna wa bika amsayna',
    border : '━',
    color  : '🌤️',
  };
  if (hour >= 12 && hour < 16) return {
    label  : '☀️ Afternoon Time',
    emoji  : '☀️',
    mode   : 'AFTERNOON',
    greet  : 'Good Afternoon!',
    dua    : 'Subhan Allahi wa bihamdihi',
    border : '─',
    color  : '☀️',
  };
  if (hour >= 16 && hour < 20) return {
    label  : '🌆 Evening Time',
    emoji  : '🌆',
    mode   : 'EVENING',
    greet  : 'Good Evening!',
    dua    : 'Allahumma bika amsayna wa bika asbahna',
    border : '═',
    color  : '🌇',
  };
  return {
    label  : '🌙 Night Time',
    emoji  : '🌙',
    mode   : 'NIGHT',
    greet  : 'Good Night!',
    dua    : 'Bismika Allahumma amutu wa ahya',
    border : '◈',
    color  : '🌌',
  };
}

// ─── Handler ──────────────────────────────────────────────────────────────────
let handler = async (m, { conn, usedPrefix, command, text }) => {

  // ✅ FIX: Safety check — m.chat یا m.sender undefined ہو تو stop
  if (!m || !m.chat || !m.key) return;

  // ← CHANGED: Safe global.db access with fallback
  const user = global.db?.data?.users?.[m.sender] || {};

  // ← CHANGED: Safe sender + name extraction without conn.contacts
  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  
  // ← CHANGED: Get name from m.pushName (Baileys provides this) or fallback to sender number
  const name = m.pushName || 
               (sender ? sender.split('@')[0] : 'Friend');

  // ← CHANGED: Safe user count with fallback
  const totalreg   = global.db?.data?.users ? Object.keys(global.db.data.users).length : 0;
  const rtotalreg  = global.db?.data?.users ? Object.values(global.db.data.users).filter(u => u.registered).length : 0;

  const time    = moment.tz('Asia/Karachi').format('hh:mm:ss A');
  const date    = moment.tz('Asia/Karachi').format('DD MMMM YYYY');
  const day     = moment.tz('Asia/Karachi').format('dddd');
  const uptime  = process.uptime();
  const hours   = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const T    = getTimeMode();
  const pfx  = usedPrefix;

  // ── Count plugins ─────────────────────────────────────────────────────────
  let pluginCount = 160;
  try {
    pluginCount = fs.readdirSync('./plugins').filter(f => f.endsWith('.js')).length;
  } catch (_) {}

  const menu = `
╔══════════════════════════════════════╗
║  ${T.color} *YOUSAF-BALOCH-MD* ${T.color}  ║
║   ⚡ _Ultra Pro Max WhatsApp Bot_ ⚡   ║
╚══════════════════════════════════════╝

${T.emoji} *${T.label}* — ${T.greet}
🤲 _${T.dua}_

╭━━━━『 📊 *BOT INFORMATION* 』━━━━╮
┃ 👤 *User :* ${name}
┃ 👑 *Owner:* ${OWNER.FULL_NAME}
┃ 📱 *WA   :* +${OWNER.NUMBER}
┃ 🤖 *Bot  :* ${OWNER.BOT_NAME}
┃ 📅 *Date :* ${date}
┃ 📆 *Day  :* ${day}
┃ ⏰ *Time :* ${time}
┃ ⏱️ *Up   :* ${hours}h ${minutes}m ${seconds}s
┃ 👥 *Users:* ${totalreg} (✅ ${rtotalreg} Reg)
┃ 🔌 *Plugins:* ${pluginCount}+
┃ 📟 *Prefix :* [ ${pfx} ]
┃ 🌐 *Mode  :* ${T.mode}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔗 *SOCIAL MEDIA* 』━━━━╮
┃ 📢 *Channel :* wa.me/channel/0029Vb3Uzps6buMH2RvGef0j
┃ 📺 *YouTube :* @Yousaf_Baloch_Tech
┃ 🎵 *TikTok  :* @loser_boy.110
┃ 💻 *GitHub  :* musakhanbaloch03-sad
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

━━━━━━━『 📋 *ALL MENUS* 』━━━━━━━

╭━━━━『 🏠 *MAIN MENU* 』━━━━╮
┃ ${pfx}menu          » Full Menu
┃ ${pfx}help          » Commands List
┃ ${pfx}alive         » Bot Status Check
┃ ${pfx}ping          » Bot Speed Test
┃ ${pfx}runtime       » Bot Uptime
┃ ${pfx}owner         » Owner Info
┃ ${pfx}info          » Bot Information
┃ ${pfx}support       » Support Group
┃ ${pfx}script        » Get Bot Script
┃ ${pfx}repo          » GitHub Repo
┃ ${pfx}contact       » Contact Owner
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 ⚙️ *AUTO FEATURES* 』━━━━╮
┃ ${pfx}autoviewstatus <on/off>
┃  _Auto view all statuses_
┃ ${pfx}antidelete <on/off>
┃  _Show deleted messages_
┃ ${pfx}autoreact <on/off>
┃  _Auto react to messages_
┃ ${pfx}autoread <on/off>
┃  _Auto read all messages_
┃ ${pfx}autotyping <on/off>
┃  _Show typing indicator_
┃ ${pfx}autorecording <on/off>
┃  _Show recording status_
┃ ${pfx}autobio <on/off>
┃  _Auto rotate bio/status_
┃ ${pfx}anticall <on/off>
┃  _Auto reject unknown calls_
┃ ${pfx}autoreply <on/off>
┃  _Auto reply when offline_
┃ ${pfx}autodownload <on/off>
┃  _Auto download media_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 📥 *DOWNLOAD MENU* 』━━━━╮
┃ ▸ 🎵 *YouTube*
┃ ${pfx}ytmp3 <url>     » YouTube MP3
┃ ${pfx}ytmp4 <url>     » YouTube MP4
┃ ${pfx}ytaudio <url>   » YT Audio
┃ ${pfx}ytvideo <url>   » YT Video
┃ ${pfx}play <name>     » Search & Play
┃ ${pfx}song <name>     » Search Song
┃ ${pfx}video <name>    » Search Video
┃
┃ ▸ 🎵 *TikTok*
┃ ${pfx}tiktok <url>    » TikTok Video
┃ ${pfx}ttmp3 <url>     » TikTok Audio
┃ ${pfx}ttmp4 <url>     » TikTok Video
┃ ${pfx}tiktokslide <url> » TikTok Slides
┃
┃ ▸ 📸 *Instagram*
┃ ${pfx}instagram <url> » IG Post
┃ ${pfx}igreel <url>    » IG Reel
┃ ${pfx}igstory <user>  » IG Story
┃ ${pfx}igphoto <url>   » IG Photo
┃ ${pfx}igvideo <url>   » IG Video
┃
┃ ▸ 📘 *Facebook*
┃ ${pfx}facebook <url>  » FB Video
┃ ${pfx}fbmp3 <url>     » FB Audio
┃ ${pfx}fbmp4 <url>     » FB Video
┃
┃ ▸ 🐦 *Twitter/X*
┃ ${pfx}twitter <url>   » Twitter Video
┃
┃ ▸ 📌 *Pinterest*
┃ ${pfx}pinterest <url> » Pinterest Media
┃
┃ ▸ 🎵 *SoundCloud*
┃ ${pfx}soundcloud <url> » SoundCloud Audio
┃
┃ ▸ 🔥 *Other Platforms*
┃ ${pfx}mediafire <url> » MediaFire File
┃ ${pfx}gdrive <url>    » Google Drive
┃ ${pfx}mega <url>      » MEGA File
┃ ${pfx}terabox <url>   » TeraBox File
┃ ${pfx}spotify <url>   » Spotify Song
┃
┃ ▸ 📱 *APK Downloads*
┃ ${pfx}apk <name>      » Download APK
┃ ${pfx}modapk <name>   » Modded APK
┃ ${pfx}playstore <name>» Play Store App
┃
┃ ▸ 🎬 *Movies & Shows*
┃ ${pfx}movie <name>    » Movie Info+Link
┃ ${pfx}drama <name>    » Drama Download
┃ ${pfx}trailer <name>  » Movie Trailer
┃
┃ ▸ 🎵 *Islamic Audio*
┃ ${pfx}naat <name>     » Naat Download
┃ ${pfx}bayan <name>    » Bayan Download
┃ ${pfx}islamicaudio <name> » Islamic Audio
┃
┃ ▸ 🖼️ *Images*
┃ ${pfx}wallpaper <query> » HD Wallpaper
┃ ${pfx}ringtone <name> » Ringtone
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🤖 *AI FEATURES* 』━━━━╮
┃ ▸ 💬 *Chat AI*
┃ ${pfx}ai <text>       » Gemini AI Chat
┃ ${pfx}gemini <text>   » Gemini AI
┃ ${pfx}chatgpt <text>  » ChatGPT Style
┃ ${pfx}gpt <text>      » GPT Response
┃
┃ ▸ 🖼️ *AI Image*
┃ ${pfx}imagine <prompt> » AI Art
┃ ${pfx}aiimage <prompt> » Generate Image
┃ ${pfx}dalle <prompt>  » DALL-E Style
┃
┃ ▸ 💻 *AI Code*
┃ ${pfx}aicode <lang> <task> » Generate Code
┃ ${pfx}explain <code> » Explain Code
┃ ${pfx}debug <code>   » Debug Code
┃
┃ ▸ 🌍 *Translation*
┃ ${pfx}translate <lang> <text>
┃  _Example: ${pfx}translate urdu Hello_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🖼️ *IMAGE TOOLS* 』━━━━╮
┃ ▸ ✨ *Enhance*
┃ ${pfx}remini        » AI Photo Enhance
┃ ${pfx}enhance       » HD Enhance
┃ ${pfx}hd            » Make HD
┃ ${pfx}sharpen       » Sharpen Image
┃
┃ ▸ 🎨 *Effects*
┃ ${pfx}blur          » Blur Effect
┃ ${pfx}sepia         » Sepia Effect
┃ ${pfx}invert        » Invert Colors
┃ ${pfx}grayscale     » Black & White
┃ ${pfx}pixelate      » Pixel Effect
┃ ${pfx}cartoon       » Cartoon Effect
┃ ${pfx}sketch        » Pencil Sketch
┃
┃ ▸ ✂️ *Edit*
┃ ${pfx}compress      » Compress Image
┃ ${pfx}watermark <text> » Add Watermark
┃ ${pfx}rembg         » Remove Background
┃ ${pfx}crop          » Crop Image
┃
┃ ▸ 🎭 *Fun Effects*
┃ ${pfx}wanted        » Wanted Poster
┃ ${pfx}wasted        » Wasted Effect
┃ ${pfx}jail          » Jail Effect
┃ ${pfx}triggered     » Triggered GIF
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎭 *STICKER MENU* 』━━━━╮
┃ ▸ 🖼️ *Make Sticker*
┃ ${pfx}sticker       » Image to Sticker
┃ ${pfx}s             » Quick Sticker
┃ ${pfx}sgif          » Video to Sticker
┃
┃ ▸ 🔄 *Convert*
┃ ${pfx}toimg         » Sticker to Image
┃ ${pfx}steal         » Steal Sticker Info
┃ ${pfx}take <top|bottom> » Add Text to Sticker
┃
┃ ▸ ✍️ *Text Sticker*
┃ ${pfx}ttp <text>    » Text to Sticker
┃ ${pfx}attp <text>   » Animated TTP
┃
┃ ▸ 😎 *Emoji*
┃ ${pfx}emojimix <😂+😍> » Mix 2 Emojis
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎨 *DESIGN TOOLS* 』━━━━╮
┃ ${pfx}logo <name>   » 30 Logo Styles
┃  _Example: ${pfx}logo Yousaf 5_
┃ ${pfx}dp <name|tag> » 30 DP Bio Styles
┃  _Example: ${pfx}dp Yousaf | King_
┃ ${pfx}carbon <code> » Code Screenshot
┃  _8 Themes: monokai dracula nord..._
┃ ${pfx}meme <top|bottom> » Create Meme
┃  _8 Templates available_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔧 *TOOLS MENU* 』━━━━╮
┃ ▸ 🧮 *Calculator*
┃ ${pfx}calc <expression>
┃  _Example: ${pfx}calc sqrt(144)_
┃  _Supports: sin cos tan log sqrt_
┃
┃ ▸ 🔄 *Converters*
┃ ${pfx}convert <value> <unit>
┃  _Example: ${pfx}convert 100 km_
┃  _Units: km miles kg lb C F mph_
┃ ${pfx}currency <amt> <FROM> <TO>
┃  _Example: ${pfx}currency 100 USD PKR_
┃
┃ ▸ 🌤️ *Weather*
┃ ${pfx}weather <city>
┃  _Example: ${pfx}weather Lahore_
┃
┃ ▸ 📄 *File Tools*
┃ ${pfx}pdf <title>    » Image to PDF
┃ ${pfx}compress       » Compress Image
┃ ${pfx}toaudio        » Video to Audio
┃ ${pfx}togif <sec>    » Video to GIF
┃ ${pfx}toimg          » Sticker to PNG
┃
┃ ▸ 🔍 *Scanner*
┃ ${pfx}ocr            » Read Image Text
┃  _Supports Urdu + English_
┃ ${pfx}qr <text>      » Generate QR Code
┃
┃ ▸ 🔗 *Web Tools*
┃ ${pfx}short <url>    » Shorten URL
┃ ${pfx}screenshot <url> » Website SS
┃
┃ ▸ 🎙️ *Audio*
┃ ${pfx}tts <lang> <text> » Text to Voice
┃  _Langs: urdu english arabic hindi_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔍 *SEARCH MENU* 』━━━━╮
┃ ${pfx}google <query>  » Google Search
┃ ${pfx}wiki <query>    » Wikipedia
┃ ${pfx}movie <name>    » Movie Info
┃ ${pfx}imdb <name>     » IMDB Search
┃ ${pfx}lyrics <song>   » Song Lyrics
┃ ${pfx}weather <city>  » Weather Info
┃ ${pfx}news            » Latest News
┃ ${pfx}technews        » Tech News
┃ ${pfx}sportsnews      » Sports News
┃ ${pfx}ytsearch <query>» YouTube Search
┃ ${pfx}github <repo>   » GitHub Info
┃ ${pfx}npm <package>   » NPM Package
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 ☪️ *ISLAMIC MENU* 』━━━━╮
┃ ▸ 📖 *Quran*
┃ ${pfx}quran <surah:ayah> » Quran Ayat
┃  _Example: ${pfx}quran 2:255 (Ayatul Kursi)_
┃ ${pfx}ayat              » Random Ayat
┃ ${pfx}tafsir <surah:ayah> » Tafsir
┃ ${pfx}ayatstatus        » Ayat as Status
┃
┃ ▸ 📚 *Hadith*
┃ ${pfx}hadith            » Random Hadith
┃
┃ ▸ 🕌 *Prayer Times*
┃ ${pfx}prayertime <city> » Prayer Times
┃  _Example: ${pfx}prayertime Lahore_
┃ ${pfx}prayer            » Today's Times
┃
┃ ▸ 🌙 *Islamic Info*
┃ ${pfx}hijri             » Hijri Date
┃ ${pfx}dua               » Random Dua
┃ ${pfx}asma              » Asma-ul-Husna
┃ ${pfx}islamicnames      » Muslim Names
┃ ${pfx}hajjguide         » Hajj Guide
┃ ${pfx}zakatcalc <amt>   » Zakat Calculator
┃ ${pfx}ramadan           » Ramadan Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🏏 *CRICKET & MATCH* 』━━━━╮
┃ ▸ 🔴 *Live Scores*
┃ ${pfx}score             » Live Score
┃ ${pfx}livescore         » Live Matches
┃ ${pfx}cricketlive       » Cricket Live
┃
┃ ▸ 📊 *Match Info*
┃ ${pfx}matchinfo         » Match Details
┃ ${pfx}schedule          » Match Schedule
┃ ${pfx}commentary        » Live Commentary
┃ ${pfx}toss              » Toss Result
┃
┃ ▸ 🏆 *Tournaments*
┃ ${pfx}psl               » PSL 2025 Scores
┃ ${pfx}ipl               » IPL 2025 Scores
┃ ${pfx}pointstable       » Points Table
┃
┃ ▸ 👤 *Players*
┃ ${pfx}playerstats <name>» Player Stats
┃
┃ ▸ ⚽ *Football*
┃ ${pfx}football          » Football Score
┃
┃ ▸ 📰 *News*
┃ ${pfx}matchnews         » Match News
┃ ${pfx}sportsnews        » Sports News
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 👥 *GROUP MENU* 』━━━━╮
┃ ▸ 👤 *Members*
┃ ${pfx}add <number>     » Add Member
┃ ${pfx}kick <@user>     » Kick Member
┃ ${pfx}promote <@user>  » Make Admin
┃ ${pfx}demote <@user>   » Remove Admin
┃ ${pfx}admins           » List Admins
┃ ${pfx}members          » Tag All Members
┃ ${pfx}tagall <text>    » Tag Everyone
┃ ${pfx}hidetag <text>   » Silent Tag All
┃
┃ ▸ ⚠️ *Warning System*
┃ ${pfx}warn <@user> <reason>
┃  _3 Warnings = Auto Kick!_
┃ ${pfx}unwarn <@user>   » Remove Warning
┃ ${pfx}warnlist         » All Warnings
┃
┃ ▸ ⚙️ *Group Settings*
┃ ${pfx}grouplink        » Get Group Link
┃ ${pfx}invite           » Invite Link
┃ ${pfx}groupsettings    » Group Settings
┃ ${pfx}groupopen        » Open Group
┃ ${pfx}groupclose       » Close Group
┃ ${pfx}groupname <text> » Change Name
┃ ${pfx}groupdesc <text> » Change Desc
┃
┃ ▸ 🛡️ *Protection*
┃ ${pfx}antilink <on/off>» Anti Link
┃ ${pfx}antiabuse <on/off>» Anti Abuse
┃ ${pfx}antivv <on/off>  » Anti View Once
┃ ${pfx}antispam <on/off>» Anti Spam
┃ ${pfx}autosticker <on/off> » Auto Sticker
┃
┃ ▸ 👻 *Activity*
┃ ${pfx}activity         » Top Active Members
┃ ${pfx}ghost            » Find Ghost Members
┃ ${pfx}bannedlist       » Banned Members
┃
┃ ▸ 📊 *Polls*
┃ ${pfx}poll <q?op1|op2> » Create Poll
┃ ${pfx}vote <number>    » Vote in Poll
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 💰 *ECONOMY MENU* 』━━━━╮
┃ ▸ 💳 *Wallet*
┃ ${pfx}balance          » Check Balance
┃ ${pfx}wallet           » Your Wallet
┃ ${pfx}leaderboard      » Top 10 Rich
┃
┃ ▸ 💵 *Earn Coins*
┃ ${pfx}daily            » Daily Reward
┃  _200 coins + streak bonus_
┃ ${pfx}work             » Work for Coins
┃  _15 different jobs!_
┃
┃ ▸ 🏪 *Shop*
┃ ${pfx}shop             » View Shop Items
┃ ${pfx}buy <number>     » Buy Item
┃ ${pfx}inventory        » Your Items
┃  _10 Items: Lucky Charm Shield VIP..._
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎮 *GAMES MENU* 』━━━━╮
┃ ${pfx}tictactoe <@user>» Tic Tac Toe
┃  _Send 1-9 to place your mark_
┃
┃ ${pfx}math <easy/med/hard> » Math Game
┃  _Easy:10c | Medium:25c | Hard:50c_
┃
┃ ${pfx}quiz <category>  » Quiz Game
┃  _Categories: general pakistan_
┃  _cricket islam_
┃
┃ ${pfx}dice             » Roll Dice
┃ ${pfx}dice vs          » Dice Battle
┃ ${pfx}dice 3d6         » Multi Dice
┃
┃ ${pfx}coin             » Coin Flip
┃ ${pfx}coin heads       » Predict & Win
┃ ${pfx}coin stats       » Your Stats
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 😄 *FUN MENU* 』━━━━╮
┃ ${pfx}joke             » Random Joke
┃ ${pfx}quote            » Motivational Quote
┃ ${pfx}fact             » Random Fact
┃ ${pfx}truth            » Truth Question
┃ ${pfx}dare             » Dare Challenge
┃ ${pfx}riddle           » Brain Teaser
┃ ${pfx}meme             » Random Meme
┃ ${pfx}ship <@u1> <@u2> » Love Meter
┃ ${pfx}love <name>      » Love Percent
┃ ${pfx}flirt <@user>    » Flirt Line
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 👑 *OWNER MENU* 』━━━━╮
┃ ▸ 📢 *Broadcast*
┃ ${pfx}broadcast <text> » All Chats
┃ ${pfx}bc groups <text> » Groups Only
┃ ${pfx}bc all <text>    » Everyone
┃
┃ ▸ 🚫 *Ban System*
┃ ${pfx}ban <@user> <reason>
┃ ${pfx}unban <@user>
┃ ${pfx}banlist
┃
┃ ▸ 🔒 *Block System*
┃ ${pfx}block <@user>
┃ ${pfx}unblock <@user>
┃ ${pfx}blocklist
┃
┃ ▸ 📞 *Contact*
┃ ${pfx}contact <msg>    » Message Owner
┃ ${pfx}inbox            » View Messages
┃ ${pfx}reply <num> <msg>» Reply to User
┃
┃ ▸ ⚙️ *Bot Control*
┃ ${pfx}restart          » Restart Bot
┃ ${pfx}shutdown         » Stop Bot
┃ ${pfx}status           » System Status
┃ ${pfx}update check     » Check Updates
┃ ${pfx}update apply     » Apply Update
┃ ${pfx}backup           » Backup Files
┃ ${pfx}backup info      » System Info
┃
┃ ▸ 🤖 *Bot Settings*
┃ ${pfx}setpp            » Change Bot PP
┃ ${pfx}join <link>      » Join Group
┃ ${pfx}leave            » Leave Group
┃ ${pfx}eval <code>      » Run JS Code
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔄 *CONVERTER MENU* 』━━━━╮
┃ ${pfx}toaudio          » Video to MP3
┃ ${pfx}togif <sec>      » Video to GIF
┃ ${pfx}toimg            » Sticker to PNG
┃ ${pfx}pdf <title>      » Image to PDF
┃ ${pfx}tts <lang> <text>» Text to Voice
┃ ${pfx}short <url>      » Long to Short URL
┃ ${pfx}qr <text>        » Text to QR Code
┃ ${pfx}convert <v> <unit>» Unit Convert
┃ ${pfx}currency <a> <F> <T>» Currency
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 📊 *STATS MENU* 』━━━━╮
┃ ${pfx}ping             » Bot Ping
┃ ${pfx}alive            » Bot Alive Check
┃ ${pfx}runtime          » Bot Runtime
┃ ${pfx}status           » Full System Info
┃ ${pfx}balance          » Your Balance
┃ ${pfx}leaderboard      » Top Players
┃ ${pfx}activity         » Group Activity
┃ ${pfx}warnlist         » Group Warnings
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╔══════════════════════════════════════╗
║    💎 *YOUSAF-BALOCH-MD FEATURES*    ║
╠══════════════════════════════════════╣
║ ✅ 200+ Plugins Loaded               ║
║ ✅ Auto View Status                  ║
║ ✅ Anti Delete Messages              ║
║ ✅ 3-Strike Warning System           ║
║ ✅ Economy System (Coins & Shop)     ║
║ ✅ Islamic Prayer Alerts             ║
║ ✅ Live Cricket Scores               ║
║ ✅ AI-Powered Chat & Images          ║
║ ✅ 30 Logo + 30 DP Styles            ║
║ ✅ Multi-Platform Downloads          ║
║ ✅ Time-Based Menu Modes             ║
║ ✅ Group Protection System           ║
╠══════════════════════════════════════╣
║  👑 *Owner:* MR YOUSAF BALOCH        ║
║  📱 *WA:*    +923710636110           ║
║  📢 *Channel:* @YousafBalochTech     ║
║  📺 *YouTube:* @Yousaf_Baloch_Tech   ║
║  🎵 *TikTok:*  @loser_boy.110        ║
╠══════════════════════════════════════╣
║  📟 *Total Commands:* 500+           ║
║  🔒 *Owner Cannot Be Changed*        ║
║  ⚡ *24/7 Online Support*            ║
╚══════════════════════════════════════╝

_© 2025-2026 ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_
_All Rights Reserved_
_+${OWNER.NUMBER}_
`;

  // ── Send with thumbnail ───────────────────────────────────────────────────
  try {
    // ← CHANGED: Removed buttons (not supported in Baileys v6+), use simple image + caption
    await conn.sendMessage(m.chat, {
      image  : { url: global.thumb || 'https://i.ibb.co/your-thumb-url/thumb.jpg' },
      caption: menu,
    }, { quoted: m });
  } catch (_) {
    // Fallback: send without image
    await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
  }
};

handler.help    = ['menu', 'help', 'commands', 'allmenu', 'list'];
handler.tags    = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
   
