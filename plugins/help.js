/*
 YOUSAF-BALOCH-MD — Help Menu
 Created by MR YOUSAF BALOCH
 WhatsApp: +923710636110
*/

import { OWNER, CONFIG } from '../config.js';

let handler = async (m, { conn, usedPrefix }) => {
  const pfx  = usedPrefix;
  const name = await conn.getName(m.sender) || 'Friend';

  const help = `
╔══════════════════════════════════════╗
║     📚 *YOUSAF-BALOCH-MD HELP*       ║
║      _Complete Commands Guide_       ║
╚══════════════════════════════════════╝

👤 *User:* ${name}
👑 *Owner:* ${OWNER.FULL_NAME}
📱 *Contact:* +${OWNER.NUMBER}
📟 *Prefix:* [ ${pfx} ]

━━━━━『 🏠 MAIN COMMANDS 』━━━━━

❯ *${pfx}menu*
  Shows the full bot menu with all categories.
  Use this to see everything the bot can do.

❯ *${pfx}alive*
  Check if the bot is online and running.
  Returns bot status with ping speed.

❯ *${pfx}ping*
  Test the bot response speed in milliseconds.
  Example: ${pfx}ping

❯ *${pfx}runtime*
  Shows how long the bot has been running.
  Example: ${pfx}runtime

❯ *${pfx}owner*
  Shows owner contact info and social links.
  Example: ${pfx}owner

❯ *${pfx}info*
  Full bot information including version and stats.
  Example: ${pfx}info

❯ *${pfx}support*
  Get the link to the official support group.
  Example: ${pfx}support

❯ *${pfx}script*
  Get the bot script/repo link to use yourself.
  Example: ${pfx}script

❯ *${pfx}contact <message>*
  Send a message directly to the bot owner.
  Example: ${pfx}contact Bot is not working please help

━━━━━『 📥 DOWNLOAD COMMANDS 』━━━━━

❯ *${pfx}ytmp3 <url>*
  Download YouTube video as MP3 audio file.
  Example: ${pfx}ytmp3 youtube.com/watch?v=xxxxx

❯ *${pfx}ytmp4 <url>*
  Download YouTube video as MP4 video file.
  Example: ${pfx}ytmp4 youtube.com/watch?v=xxxxx

❯ *${pfx}play <song name>*
  Search and download any song by name from YouTube.
  Example: ${pfx}play Faded Alan Walker

❯ *${pfx}song <name>*
  Search for a song and download audio only.
  Example: ${pfx}song Shape of You Ed Sheeran

❯ *${pfx}video <name>*
  Search for a video and download it from YouTube.
  Example: ${pfx}video How to code in Python

❯ *${pfx}tiktok <url>*
  Download TikTok video without watermark.
  Example: ${pfx}tiktok tiktok.com/@user/video/123

❯ *${pfx}ttmp3 <url>*
  Download TikTok video as audio/MP3 only.
  Example: ${pfx}ttmp3 tiktok.com/@user/video/123

❯ *${pfx}instagram <url>*
  Download Instagram post photo or video.
  Example: ${pfx}instagram instagram.com/p/xxxxx

❯ *${pfx}igreel <url>*
  Download Instagram Reel video without watermark.
  Example: ${pfx}igreel instagram.com/reel/xxxxx

❯ *${pfx}igstory <username>*
  Download Instagram story of any public account.
  Example: ${pfx}igstory yousafbaloch

❯ *${pfx}facebook <url>*
  Download Facebook video in HD quality.
  Example: ${pfx}facebook facebook.com/video/xxxxx

❯ *${pfx}twitter <url>*
  Download Twitter/X video or GIF from tweet.
  Example: ${pfx}twitter twitter.com/user/status/xxx

❯ *${pfx}pinterest <url>*
  Download Pinterest image or video.
  Example: ${pfx}pinterest pinterest.com/pin/xxxxx

❯ *${pfx}soundcloud <url>*
  Download SoundCloud track as audio file.
  Example: ${pfx}soundcloud soundcloud.com/artist/track

❯ *${pfx}mediafire <url>*
  Download any file from MediaFire link.
  Example: ${pfx}mediafire mediafire.com/file/xxxxx

❯ *${pfx}gdrive <url>*
  Download file from Google Drive share link.
  Example: ${pfx}gdrive drive.google.com/file/xxxxx

❯ *${pfx}apk <app name>*
  Search and download any Android APK file.
  Example: ${pfx}apk WhatsApp

❯ *${pfx}modapk <app name>*
  Download modded/premium version of apps.
  Example: ${pfx}modapk Spotify Premium

❯ *${pfx}playstore <app name>*
  Get Play Store info and download link for any app.
  Example: ${pfx}playstore Instagram

❯ *${pfx}movie <name>*
  Search movie info and get download/watch link.
  Example: ${pfx}movie Avengers Endgame

❯ *${pfx}drama <name>*
  Search and download Pakistani or Turkish drama.
  Example: ${pfx}drama Ertugrul Episode 1

❯ *${pfx}trailer <name>*
  Download official movie or drama trailer.
  Example: ${pfx}trailer Spider-Man No Way Home

❯ *${pfx}naat <name>*
  Search and download any Naat audio.
  Example: ${pfx}naat Lab Pe Aati Hai Dua

❯ *${pfx}bayan <name>*
  Search and download Islamic bayan/lecture.
  Example: ${pfx}bayan Tariq Jameel bayan

❯ *${pfx}wallpaper <query>*
  Download HD wallpaper on any topic.
  Example: ${pfx}wallpaper Pakistan mountains 4K

━━━━━『 🤖 AI COMMANDS 』━━━━━

❯ *${pfx}ai <text>*
  Chat with Gemini AI — ask anything.
  Example: ${pfx}ai What is the capital of Pakistan?

❯ *${pfx}gemini <text>*
  Direct Gemini AI response for any question.
  Example: ${pfx}gemini Explain quantum physics simply

❯ *${pfx}chatgpt <text>*
  ChatGPT style AI response to your question.
  Example: ${pfx}chatgpt Write a poem about Pakistan

❯ *${pfx}imagine <prompt>*
  Generate AI art image from your description.
  Example: ${pfx}imagine A futuristic Lahore city at night

❯ *${pfx}aicode <language> <task>*
  Generate working code using AI assistance.
  Example: ${pfx}aicode python fibonacci calculator

❯ *${pfx}translate <language> <text>*
  Translate any text to any language using AI.
  Example: ${pfx}translate urdu Hello how are you

❯ *${pfx}explain <code>*
  Explain what any code does in simple words.
  Example: ${pfx}explain [reply to code message]

❯ *${pfx}debug <code>*
  Find and fix bugs in your code using AI.
  Example: ${pfx}debug [reply to code message]

━━━━━『 🖼️ IMAGE TOOLS 』━━━━━

❯ *${pfx}remini*
  Enhance photo quality using AI (Remini style).
  Usage: Reply to any image with ${pfx}remini

❯ *${pfx}enhance*
  Make image HD and sharper using AI upscaler.
  Usage: Reply to any image with ${pfx}enhance

❯ *${pfx}watermark <text>*
  Add custom text watermark on any image.
  Example: Reply to image with ${pfx}watermark YousafBaloch

❯ *${pfx}compress <quality>*
  Compress image to reduce file size (1-100).
  Example: Reply to image with ${pfx}compress 60

❯ *${pfx}rembg*
  Remove background from any photo automatically.
  Usage: Reply to any image with ${pfx}rembg

❯ *${pfx}ocr*
  Read and extract text from any image (Urdu+English).
  Usage: Reply to any image with ${pfx}ocr

❯ *${pfx}blur*
  Apply blur effect to any image.
  Usage: Reply to image with ${pfx}blur

❯ *${pfx}sepia*
  Apply vintage sepia brown tone to image.
  Usage: Reply to image with ${pfx}sepia

❯ *${pfx}grayscale*
  Convert image to black and white.
  Usage: Reply to image with ${pfx}grayscale

❯ *${pfx}invert*
  Invert all colors of the image.
  Usage: Reply to image with ${pfx}invert

❯ *${pfx}wanted*
  Create a wanted poster with your photo.
  Usage: Reply to image with ${pfx}wanted

❯ *${pfx}jail*
  Put someone behind jail bars in the photo.
  Usage: Reply to image with ${pfx}jail

━━━━━『 🎭 STICKER COMMANDS 』━━━━━

❯ *${pfx}sticker* or *${pfx}s*
  Convert any image or video into WhatsApp sticker.
  Usage: Reply to image/video with ${pfx}s

❯ *${pfx}toimg*
  Convert WhatsApp sticker back to PNG image.
  Usage: Reply to any sticker with ${pfx}toimg

❯ *${pfx}steal*
  Save a sticker and get its pack info.
  Usage: Reply to any sticker with ${pfx}steal

❯ *${pfx}take <top text> | <bottom text>*
  Add custom top and bottom text to sticker.
  Example: ${pfx}take YOUSAF | BALOCH

❯ *${pfx}ttp <text>*
  Convert any text into a sticker image.
  Example: ${pfx}ttp Muhammad Yousaf Baloch

❯ *${pfx}attp <text>*
  Convert text into animated sticker.
  Example: ${pfx}attp YOUSAF-BALOCH-MD

❯ *${pfx}emojimix <emoji+emoji>*
  Mix two emojis to create unique sticker.
  Example: ${pfx}emojimix 😂+😍

━━━━━『 🎨 DESIGN COMMANDS 』━━━━━

❯ *${pfx}logo <name> [style 1-30]*
  Create stylish text logo in 30 different styles.
  Example: ${pfx}logo Yousaf 5  or  ${pfx}logo Pakistan

❯ *${pfx}dp <name> | <tagline> [style 1-30]*
  Create WhatsApp DP bio in 30 different styles.
  Example: ${pfx}dp Yousaf | King of Pakistan 10

❯ *${pfx}carbon [theme] <code>*
  Create beautiful code screenshot image.
  Example: ${pfx}carbon monokai console.log('Hello')

❯ *${pfx}meme <top> | <bottom>*
  Generate meme with your text on 8 templates.
  Example: ${pfx}meme When you code | And it works

━━━━━『 🔧 TOOLS COMMANDS 』━━━━━

❯ *${pfx}calc <expression>*
  Calculate any math expression including scientific.
  Example: ${pfx}calc sqrt(144) or ${pfx}calc sin(90)

❯ *${pfx}convert <value> <unit>*
  Convert between units — km, miles, kg, lb, °C, °F.
  Example: ${pfx}convert 100 km  or  ${pfx}convert 37 celsius

❯ *${pfx}currency <amount> <FROM> <TO>*
  Convert between world currencies with live rates.
  Example: ${pfx}currency 100 USD PKR

❯ *${pfx}weather <city>*
  Get real-time weather for any city in the world.
  Example: ${pfx}weather Lahore  or  ${pfx}weather Karachi

❯ *${pfx}qr <text or url>*
  Generate QR code for any text or website link.
  Example: ${pfx}qr https://youtube.com/@Yousaf_Baloch_Tech

❯ *${pfx}short <url>*
  Shorten any long URL using TinyURL service.
  Example: ${pfx}short https://very-long-url.com/path

❯ *${pfx}screenshot <url>*
  Take full screenshot of any website page.
  Example: ${pfx}screenshot https://google.com

❯ *${pfx}tts <language> <text>*
  Convert text to voice audio message.
  Example: ${pfx}tts urdu السلام علیکم

❯ *${pfx}pdf <title>*
  Convert any image to PDF document file.
  Usage: Reply to image with ${pfx}pdf My Document

❯ *${pfx}toaudio*
  Extract audio/MP3 from any video file.
  Usage: Reply to video with ${pfx}toaudio

❯ *${pfx}togif <seconds>*
  Convert video clip to GIF animation.
  Usage: Reply to video with ${pfx}togif 5

━━━━━『 ☪️ ISLAMIC COMMANDS 』━━━━━

❯ *${pfx}quran <surah:ayah>*
  Get any Quran verse with Urdu translation.
  Example: ${pfx}quran 2:255  (Ayatul Kursi)

❯ *${pfx}ayat*
  Get a random Quran verse with translation.
  Example: ${pfx}ayat

❯ *${pfx}tafsir <surah:ayah>*
  Get detailed tafsir/explanation of any verse.
  Example: ${pfx}tafsir 1:1

❯ *${pfx}hadith*
  Get a random authentic hadith with reference.
  Example: ${pfx}hadith

❯ *${pfx}prayertime <city>*
  Get today's prayer times for any city.
  Example: ${pfx}prayertime Lahore

❯ *${pfx}hijri*
  Get today's Islamic/Hijri calendar date.
  Example: ${pfx}hijri

❯ *${pfx}dua*
  Get a random Islamic dua with translation.
  Example: ${pfx}dua

❯ *${pfx}asma*
  Show all 99 beautiful names of Allah (Asma-ul-Husna).
  Example: ${pfx}asma

❯ *${pfx}islamicnames*
  Get Islamic/Muslim names with meanings.
  Example: ${pfx}islamicnames

❯ *${pfx}hajjguide*
  Complete step-by-step Hajj & Umrah guide.
  Example: ${pfx}hajjguide

❯ *${pfx}zakatcalc <amount>*
  Calculate your Zakat amount on savings.
  Example: ${pfx}zakatcalc 500000

❯ *${pfx}ramadan*
  Get Ramadan info including sehri/iftar times.
  Example: ${pfx}ramadan

━━━━━『 🏏 CRICKET COMMANDS 』━━━━━

❯ *${pfx}score*
  Get live cricket match score right now.
  Example: ${pfx}score

❯ *${pfx}livescore*
  Show all currently live cricket matches.
  Example: ${pfx}livescore

❯ *${pfx}matchinfo*
  Get full details of current or recent match.
  Example: ${pfx}matchinfo

❯ *${pfx}schedule*
  Show upcoming cricket match schedule.
  Example: ${pfx}schedule

❯ *${pfx}commentary*
  Get live ball-by-ball match commentary.
  Example: ${pfx}commentary

❯ *${pfx}toss*
  Get toss result of current/recent match.
  Example: ${pfx}toss

❯ *${pfx}psl*
  PSL 2025 live scores and points table.
  Example: ${pfx}psl

❯ *${pfx}ipl*
  IPL 2025 live scores and points table.
  Example: ${pfx}ipl

❯ *${pfx}pointstable*
  Show cricket tournament points table.
  Example: ${pfx}pointstable

❯ *${pfx}playerstats <name>*
  Get batting and bowling stats of any player.
  Example: ${pfx}playerstats Babar Azam

❯ *${pfx}football*
  Get latest football/soccer match scores.
  Example: ${pfx}football

❯ *${pfx}matchnews*
  Get latest cricket and sports news.
  Example: ${pfx}matchnews

━━━━━『 👥 GROUP COMMANDS 』━━━━━

❯ *${pfx}add <number>*
  Add a member to the group (admin only).
  Example: ${pfx}add 923001234567

❯ *${pfx}kick <@user>*
  Remove a member from the group (admin only).
  Example: ${pfx}kick @923001234567

❯ *${pfx}promote <@user>*
  Make a group member an admin (admin only).
  Example: ${pfx}promote @923001234567

❯ *${pfx}demote <@user>*
  Remove admin status from a member (admin only).
  Example: ${pfx}demote @923001234567

❯ *${pfx}admins*
  Show list of all group admins with mention.
  Example: ${pfx}admins

❯ *${pfx}members*
  Tag and list all group members (admin only).
  Example: ${pfx}members

❯ *${pfx}tagall <message>*
  Tag all group members with a message (admin only).
  Example: ${pfx}tagall Meeting at 5 PM everyone!

❯ *${pfx}hidetag <message>*
  Tag all members silently — no visible mentions.
  Example: ${pfx}hidetag Important announcement!

❯ *${pfx}warn <@user> <reason>*
  Give a warning to a member. 3 warnings = auto kick.
  Example: ${pfx}warn @user Spamming in group

❯ *${pfx}unwarn <@user>*
  Remove all warnings from a group member.
  Example: ${pfx}unwarn @923001234567

❯ *${pfx}warnlist*
  Show all warned members with their warn count.
  Example: ${pfx}warnlist

❯ *${pfx}grouplink*
  Get the current group invite link.
  Example: ${pfx}grouplink

❯ *${pfx}invite*
  Generate and share group invite link.
  Example: ${pfx}invite

❯ *${pfx}poll <question?option1|option2>*
  Create a voting poll in the group.
  Example: ${pfx}poll Best Player?Babar|Kohli|Root

❯ *${pfx}vote <number>*
  Vote in an active poll by sending option number.
  Example: ${pfx}vote 1

❯ *${pfx}activity*
  Show top 10 most active members in group.
  Example: ${pfx}activity

❯ *${pfx}ghost*
  Find inactive (ghost) members in the group.
  Example: ${pfx}ghost

❯ *${pfx}antivv <on/off>*
  Auto-reveal view-once photos and videos.
  Example: ${pfx}antivv on

❯ *${pfx}antilink <on/off>*
  Auto-delete any links shared in group.
  Example: ${pfx}antilink on

❯ *${pfx}antiabuse <on/off>*
  Auto-delete abusive messages in group.
  Example: ${pfx}antiabuse on

❯ *${pfx}autosticker <on/off>*
  Auto-convert all images to stickers.
  Example: ${pfx}autosticker on

━━━━━『 💰 ECONOMY COMMANDS 』━━━━━

❯ *${pfx}balance* or *${pfx}wallet*
  Check your current coin balance and level.
  Example: ${pfx}balance  or  ${pfx}balance @user

❯ *${pfx}daily*
  Claim your daily reward of 200+ coins.
  Example: ${pfx}daily  (resets every 24 hours)

❯ *${pfx}work*
  Work one of 15 jobs to earn 50-150 coins.
  Example: ${pfx}work  (cooldown: 1 hour)

❯ *${pfx}shop*
  Browse the coin shop with 10 buyable items.
  Example: ${pfx}shop

❯ *${pfx}buy <number>*
  Buy an item from the shop using coins.
  Example: ${pfx}buy 3  (buys item #3)

❯ *${pfx}inventory*
  View all items you have purchased.
  Example: ${pfx}inventory

❯ *${pfx}leaderboard*
  See the top 10 richest players.
  Example: ${pfx}leaderboard  or  ${pfx}lb level

━━━━━『 🎮 GAME COMMANDS 』━━━━━

❯ *${pfx}tictactoe <@user>*
  Challenge someone to Tic Tac Toe game.
  Example: ${pfx}tictactoe @923001234567

❯ *${pfx}math <easy/medium/hard>*
  Solve math problems to win coins.
  Example: ${pfx}math easy  (win 10-50 coins)

❯ *${pfx}quiz <category>*
  Answer quiz questions and win coins.
  Example: ${pfx}quiz pakistan  or  ${pfx}quiz cricket

❯ *${pfx}dice*
  Roll a dice and see your luck.
  Example: ${pfx}dice  or  ${pfx}dice vs  or  ${pfx}dice 3d6

❯ *${pfx}coin*
  Flip a coin — heads or tails.
  Example: ${pfx}coin  or  ${pfx}coin heads  (predict & win)

━━━━━『 😄 FUN COMMANDS 』━━━━━

❯ *${pfx}joke*
  Get a random funny joke.
  Example: ${pfx}joke

❯ *${pfx}quote*
  Get a random motivational or famous quote.
  Example: ${pfx}quote

❯ *${pfx}fact*
  Get an interesting random fact.
  Example: ${pfx}fact

❯ *${pfx}truth*
  Get a truth question for truth or dare game.
  Example: ${pfx}truth

❯ *${pfx}dare*
  Get a dare challenge for dare game.
  Example: ${pfx}dare

❯ *${pfx}meme*
  Generate a random funny meme.
  Example: ${pfx}meme  or reply image with ${pfx}meme Top|Bottom

━━━━━『 👑 OWNER COMMANDS 』━━━━━

❯ *${pfx}broadcast <message>*
  Send a message to all known chats at once.
  Example: ${pfx}broadcast Bot updated! New features added

❯ *${pfx}ban <@user> <reason>*
  Ban a user from using the bot globally.
  Example: ${pfx}ban @user Misusing the bot

❯ *${pfx}unban <@user>*
  Remove ban and allow user to use bot again.
  Example: ${pfx}unban @923001234567

❯ *${pfx}banlist*
  Show list of all globally banned users.
  Example: ${pfx}banlist

❯ *${pfx}block <@user>*
  Block a WhatsApp contact on bot number.
  Example: ${pfx}block @923001234567

❯ *${pfx}restart*
  Restart the bot (owner only).
  Example: ${pfx}restart

❯ *${pfx}shutdown*
  Completely stop the bot (owner only).
  Example: ${pfx}shutdown

❯ *${pfx}status*
  Show full system info — RAM, uptime, ping.
  Example: ${pfx}status

❯ *${pfx}update check*
  Check if a new bot update is available.
  Example: ${pfx}update check

❯ *${pfx}update apply*
  Download and apply latest update from GitHub.
  Example: ${pfx}update apply

❯ *${pfx}backup*
  Create backup of all bot files and send to owner.
  Example: ${pfx}backup

❯ *${pfx}setpp*
  Change bot profile picture (reply to image).
  Usage: Reply to image with ${pfx}setpp

❯ *${pfx}join <group link>*
  Make bot join a group using invite link.
  Example: ${pfx}join https://chat.whatsapp.com/xxxxx

❯ *${pfx}eval <code>*
  Run JavaScript code directly (developer mode).
  Example: ${pfx}eval console.log(process.version)

╔══════════════════════════════════════╗
║    📊 *TOTAL COMMANDS: 500+*         ║
║    🔌 *PLUGINS LOADED: 200+*         ║
╠══════════════════════════════════════╣
║  👑 Owner : ${OWNER.FULL_NAME.padEnd(24)}║
║  📱 WA    : +${OWNER.NUMBER.padEnd(22)}║
║  📢 Channel: @YousafBalochTech       ║
║  📺 YouTube: @Yousaf_Baloch_Tech     ║
║  🎵 TikTok : @loser_boy.110          ║
╠══════════════════════════════════════╣
║  💡 Type ${pfx}menu for full menu        ║
║  💡 Type command name to use it      ║
║  💡 <> = required  [] = optional     ║
╚══════════════════════════════════════╝

_© 2025-2026 ${OWNER.BOT_NAME}_
_Developed by ${OWNER.FULL_NAME}_`;

  await conn.sendMessage(m.chat, { text: help }, { quoted: m });
};

handler.help    = ['help', 'commands', 'h'];
handler.tags    = ['main'];
handler.command = /^(help|commands|h|cmds)$/i;

export default handler;
