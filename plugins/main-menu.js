import fs from 'fs';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let user = global.db.data.users[m.sender];
  let name = await conn.getName(m.sender);
  let totalreg = Object.keys(global.db.data.users).length;
  let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;
  
  let time = moment.tz('Asia/Karachi').format('HH:mm:ss');
  let date = moment.tz('Asia/Karachi').format('DD/MM/YYYY');
  let uptime = process.uptime();
  let hours = Math.floor(uptime / 3600);
  let minutes = Math.floor((uptime % 3600) / 60);
  let seconds = Math.floor(uptime % 60);
  
  let menu = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃     *YOUSAF-BALOCH-MD*
┃   _Premium WhatsApp Bot_
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *BOT INFO* 』━━━╮
┃ 👤 *User:* ${name}
┃ 👑 *Owner:* Muhammad Yousaf Baloch
┃ 📞 *Contact:* +923710636110
┃ 📅 *Date:* ${date}
┃ ⏰ *Time:* ${time}
┃ ⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s
┃ 👥 *Total Users:* ${totalreg}
┃ ✅ *Registered:* ${rtotalreg}
┃ ✨ *Version:* 1.0.0
┃ 🌐 *Prefix:* [ ${usedPrefix} ]
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *MAIN MENU* 』━━━╮
┃ ${usedPrefix}menu
┃ ${usedPrefix}help
┃ ${usedPrefix}alive
┃ ${usedPrefix}ping
┃ ${usedPrefix}speed
┃ ${usedPrefix}runtime
┃ ${usedPrefix}owner
┃ ${usedPrefix}script
┃ ${usedPrefix}repo
┃ ${usedPrefix}donate
┃ ${usedPrefix}listmenu
┃ ${usedPrefix}support
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *AUTO FEATURES* 』━━━╮
┃ ${usedPrefix}autoviewstatus <on/off>
┃ *Example:* ${usedPrefix}autoviewstatus on
┃ *Info:* Bot automatically views all statuses
┃
┃ ${usedPrefix}antidelete <on/off>
┃ *Example:* ${usedPrefix}antidelete on
┃ *Info:* Shows deleted messages
┃
┃ ${usedPrefix}autoreact <on/off>
┃ ${usedPrefix}autoread <on/off>
┃ ${usedPrefix}autotyping <on/off>
┃ ${usedPrefix}autorecording <on/off>
┃ ${usedPrefix}autobio <on/off>
┃ ${usedPrefix}anticall <on/off>
┃ ${usedPrefix}autoreply <on/off>
┃ ${usedPrefix}autodownload <on/off>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *DOWNLOAD MENU* 』━━━╮
┃ ${usedPrefix}ytmp3 <url>
┃ *Example:* ${usedPrefix}ytmp3 youtube.com/watch?v=xxxxx
┃
┃ ${usedPrefix}ytmp4 <url>
┃ *Example:* ${usedPrefix}ytmp4 youtube.com/watch?v=xxxxx
┃
┃ ${usedPrefix}ytaudio <url>
┃ ${usedPrefix}ytvideo <url>
┃ ${usedPrefix}ytdoc <url>
┃ ${usedPrefix}play <song name>
┃ *Example:* ${usedPrefix}play Faded by Alan Walker
┃
┃ ${usedPrefix}song <name>
┃ ${usedPrefix}video <name>
┃
┃ ${usedPrefix}tiktok <url>
┃ *Example:* ${usedPrefix}tiktok tiktok.com/@yousafbaloch/video/xxxxx
┃
┃ ${usedPrefix}tiktokaudio <url>
┃ ${usedPrefix}tiktokslide <url>
┃ ${usedPrefix}ttmp3 <url>
┃ ${usedPrefix}ttmp4 <url>
┃
┃ ${usedPrefix}instagram <url>
┃ *Example:* ${usedPrefix}instagram instagram.com/p/xxxxx
┃
┃ ${usedPrefix}igstory <username>
┃ ${usedPrefix}igreel <url>
┃ ${usedPrefix}igphoto <url>
┃ ${usedPrefix}igvideo <url>
┃
┃ ${usedPrefix}facebook <url>
┃ *Example:* ${usedPrefix}facebook facebook.com/xxxxx
┃
┃ ${usedPrefix}fbmp3 <url>
┃ ${usedPrefix}fbmp4 <url>
┃
┃ ${usedPrefix}twitter <url>
┃ ${usedPrefix}threads <url>
┃ ${usedPrefix}pinterest <url>
┃ ${usedPrefix}snapchat <url>
┃ ${usedPrefix}linkedin <url>
┃
┃ ${usedPrefix}mediafire <url>
┃ ${usedPrefix}gdrive <url>
┃ ${usedPrefix}mega <url>
┃ ${usedPrefix}terabox <url>
┃
┃ ${usedPrefix}spotify <url>
┃ ${usedPrefix}spotifysearch <name>
┃ ${usedPrefix}apk <app name>
┃ *Example:* ${usedPrefix}apk WhatsApp
┃
┃ ${usedPrefix}modapk <app name>
┃ ${usedPrefix}wallpaper <query>
┃ ${usedPrefix}ringtone <name>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *AI FEATURES* 』━━━╮
┃ ${usedPrefix}chatgpt <text>
┃ *Example:* ${usedPrefix}chatgpt What is AI?
┃
┃ ${usedPrefix}ai <text>
┃ *Example:* ${usedPrefix}ai Tell me about Muhammad Yousaf Baloch
┃
┃ ${usedPrefix}gpt <text>
┃ ${usedPrefix}openai <text>
┃ ${usedPrefix}gpt4 <text>
┃
┃ ${usedPrefix}gemini <text>
┃ ${usedPrefix}bard <text>
┃ ${usedPrefix}palm <text>
┃
┃ ${usedPrefix}blackbox <text>
┃ ${usedPrefix}meta <text>
┃ ${usedPrefix}llama <text>
┃
┃ ${usedPrefix}dalle <prompt>
┃ *Example:* ${usedPrefix}dalle A futuristic city
┃
┃ ${usedPrefix}imagine <prompt>
┃ ${usedPrefix}aiimage <prompt>
┃ ${usedPrefix}midjourney <prompt>
┃
┃ ${usedPrefix}bing <text>
┃ ${usedPrefix}bingimage <prompt>
┃
┃ ${usedPrefix}aicode <language> <task>
┃ *Example:* ${usedPrefix}aicode python calculator
┃
┃ ${usedPrefix}explain <code>
┃ ${usedPrefix}debug <code>
┃ ${usedPrefix}translate <lang> <text>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *IMAGE EDITOR* 』━━━╮
┃ ${usedPrefix}blur <reply image>
┃ ${usedPrefix}beautiful <reply image>
┃ ${usedPrefix}facepalm <reply image>
┃ ${usedPrefix}rainbow <reply image>
┃ ${usedPrefix}wanted <reply image>
┃ ${usedPrefix}wasted <reply image>
┃ ${usedPrefix}jail <reply image>
┃ ${usedPrefix}triggered <reply image>
┃ ${usedPrefix}sepia <reply image>
┃ ${usedPrefix}invert <reply image>
┃ ${usedPrefix}grayscale <reply image>
┃ ${usedPrefix}pixelate <reply image>
┃ ${usedPrefix}sharpen <reply image>
┃ ${usedPrefix}contrast <reply image>
┃ ${usedPrefix}brightness <reply image>
┃ ${usedPrefix}rotate <reply image>
┃ ${usedPrefix}flip <reply image>
┃ ${usedPrefix}mirror <reply image>
┃ ${usedPrefix}crop <reply image>
┃ ${usedPrefix}resize <reply image>
┃ ${usedPrefix}compress <reply image>
┃
┃ ${usedPrefix}rembg <reply image>
┃ *Example:* Reply to image with ${usedPrefix}rembg
┃
┃ ${usedPrefix}enhance <reply image>
┃ ${usedPrefix}hd <reply image>
┃ ${usedPrefix}colorize <reply image>
┃ ${usedPrefix}cartoon <reply image>
┃ ${usedPrefix}sketch <reply image>
┃ ${usedPrefix}pencil <reply image>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *STICKER MAKER* 』━━━╮
┃ ${usedPrefix}sticker <reply image/video>
┃ ${usedPrefix}s <reply image/video>
┃ ${usedPrefix}stickergif <reply video>
┃ ${usedPrefix}sgif <reply video>
┃
┃ ${usedPrefix}take <text> | <text>
┃ *Example:* ${usedPrefix}take Yousaf | Baloch
┃
┃ ${usedPrefix}steal <reply sticker>
┃ ${usedPrefix}toimage <reply sticker>
┃ ${usedPrefix}tovideo <reply sticker>
┃
┃ ${usedPrefix}ttp <text>
┃ *Example:* ${usedPrefix}ttp Muhammad Yousaf Baloch
┃
┃ ${usedPrefix}attp <text>
┃ ${usedPrefix}attp2 <text>
┃ ${usedPrefix}ttp2 <text>
┃ ${usedPrefix}ttp3 <text>
┃
┃ ${usedPrefix}emojimix <emoji+emoji>
┃ *Example:* ${usedPrefix}emojimix 😂+😍
┃
┃ ${usedPrefix}smeme <text>
┃ ${usedPrefix}smeme2 <text>|<text>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *SEARCH MENU* 』━━━╮
┃ ${usedPrefix}google <query>
┃ *Example:* ${usedPrefix}google Muhammad Yousaf Baloch
┃
┃ ${usedPrefix}googlesearch <query>
┃ ${usedPrefix}gimage <query>
┃ ${usedPrefix}googleimage <query>
┃
┃ ${usedPrefix}ytsearch <query>
┃ *Example:* ${usedPrefix}ytsearch Coding tutorials
┃
┃ ${usedPrefix}yts <query>
┃ ${usedPrefix}youtubesearch <query>
┃
┃ ${usedPrefix}lyrics <song name>
┃ *Example:* ${usedPrefix}lyrics Believer
┃
┃ ${usedPrefix}lyric <song name>
┃ ${usedPrefix}lirik <song name>
┃
┃ ${usedPrefix}weather <city>
┃ *Example:* ${usedPrefix}weather Karachi
┃
┃ ${usedPrefix}news
┃ ${usedPrefix}latestnews
┃ ${usedPrefix}technews
┃ ${usedPrefix}sportsnews
┃
┃ ${usedPrefix}wiki <query>
┃ ${usedPrefix}wikipedia <query>
┃
┃ ${usedPrefix}npm <package>
┃ ${usedPrefix}github <repo>
┃
┃ ${usedPrefix}movie <name>
┃ ${usedPrefix}imdb <name>
┃ ${usedPrefix}anime <name>
┃ ${usedPrefix}manga <name>
┃
┃ ${usedPrefix}recipe <food>
┃ ${usedPrefix}horoscope <sign>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *GROUP MENU* 』━━━╮
┃ ${usedPrefix}add <number>
┃ *Example:* ${usedPrefix}add 923710636110
┃
┃ ${usedPrefix}kick <@user>
┃ *Example:* ${usedPrefix}kick @923710636110
┃
┃ ${usedPrefix}promote <@user>
┃ *Example:* ${usedPrefix}promote @923710636110
┃
┃ ${usedPrefix}demote <@user>
┃ ${usedPrefix}admins
┃ ${usedPrefix}groupinfo
┃ ${usedPrefix}grouplink
┃ ${usedPrefix}resetlink
┃ ${usedPrefix}revoke
┃
┃ ${usedPrefix}tagall <text>
┃ *Example:* ${usedPrefix}tagall Hello from Muhammad Yousaf Baloch
┃
┃ ${usedPrefix}hidetag <text>
┃ ${usedPrefix}notify <text>
┃ ${usedPrefix}totag <reply>
┃
┃ ${usedPrefix}group <open/close>
┃ ${usedPrefix}grouptime <time>
┃ ${usedPrefix}gcopen
┃ ${usedPrefix}gcclose
┃
┃ ${usedPrefix}antilink <on/off>
┃ ${usedPrefix}antilinkall <on/off>
┃ ${usedPrefix}antitoxic <on/off>
┃ ${usedPrefix}antibot <on/off>
┃ ${usedPrefix}antispam <on/off>
┃
┃ ${usedPrefix}welcome <on/off>
┃ ${usedPrefix}goodbye <on/off>
┃ ${usedPrefix}setwelcome <text>
┃ ${usedPrefix}setgoodbye <text>
┃
┃ ${usedPrefix}delete <reply message>
┃ ${usedPrefix}setname <text>
┃ ${usedPrefix}setdesc <text>
┃ ${usedPrefix}setppgroup <reply image>
┃
┃ ${usedPrefix}mute <@user>
┃ ${usedPrefix}unmute <@user>
┃ ${usedPrefix}warn <@user>
┃ ${usedPrefix}unwarn <@user>
┃ ${usedPrefix}warnings <@user>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *OWNER MENU* 』━━━╮
┃ ${usedPrefix}broadcast <text>
┃ *Example:* ${usedPrefix}broadcast Update from Muhammad Yousaf Baloch
┃
┃ ${usedPrefix}bcgc <text>
┃ ${usedPrefix}bcall <text>
┃
┃ ${usedPrefix}ban <@user>
┃ ${usedPrefix}unban <@user>
┃ ${usedPrefix}banlist
┃
┃ ${usedPrefix}block <@user>
┃ ${usedPrefix}unblock <@user>
┃ ${usedPrefix}blocklist
┃
┃ ${usedPrefix}setpp <reply image>
┃ ${usedPrefix}setbio <text>
┃ ${usedPrefix}setname <text>
┃ ${usedPrefix}setstatus <text>
┃
┃ ${usedPrefix}join <group link>
┃ ${usedPrefix}leave
┃ ${usedPrefix}leaveall
┃
┃ ${usedPrefix}getplugin <name>
┃ ${usedPrefix}getfile <name>
┃ ${usedPrefix}savefile <name>
┃ ${usedPrefix}deletefile <name>
┃
┃ ${usedPrefix}addprem <@user>
┃ ${usedPrefix}delprem <@user>
┃ ${usedPrefix}listprem
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *FUN MENU* 』━━━╮
┃ ${usedPrefix}joke
┃ ${usedPrefix}quotes
┃ ${usedPrefix}quote
┃ ${usedPrefix}motivate
┃ ${usedPrefix}advice
┃ ${usedPrefix}fact
┃ ${usedPrefix}truth
┃ ${usedPrefix}dare
┃ ${usedPrefix}riddle
┃ ${usedPrefix}trivia
┃ ${usedPrefix}meme
┃ ${usedPrefix}pickup
┃ ${usedPrefix}flirt
┃ ${usedPrefix}ship <@user> <@user>
┃ ${usedPrefix}couple
┃ ${usedPrefix}love <name>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *CONVERTER MENU* 』━━━╮
┃ ${usedPrefix}toimage <reply sticker>
┃ ${usedPrefix}tomp3 <reply video>
┃ ${usedPrefix}toaudio <reply video>
┃ ${usedPrefix}tovideo <reply audio>
┃ ${usedPrefix}toptt <reply audio>
┃ ${usedPrefix}tourl <reply media>
┃ ${usedPrefix}tinyurl <url>
┃ ${usedPrefix}shorten <url>
┃ ${usedPrefix}styletext <text>
┃ ${usedPrefix}fancy <text>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *DATABASE MENU* 』━━━╮
┃ ${usedPrefix}setcmd <text>
┃ ${usedPrefix}delcmd <text>
┃ ${usedPrefix}listcmd
┃ ${usedPrefix}lockcmd
┃ ${usedPrefix}addmsg <text>
┃ ${usedPrefix}delmsg <text>
┃ ${usedPrefix}getmsg <text>
┃ ${usedPrefix}listmsg
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *ISLAMIC MENU* 』━━━╮
┃ ${usedPrefix}quran
┃ ${usedPrefix}hadith
┃ ${usedPrefix}ayat
┃ ${usedPrefix}surah <number>
┃ ${usedPrefix}prayertimes <city>
┃ ${usedPrefix}asmaul
┃ ${usedPrefix}kisahnabi
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *TOOLS MENU* 』━━━╮
┃ ${usedPrefix}calculator <expression>
┃ ${usedPrefix}calc <expression>
┃ ${usedPrefix}qrcode <text>
┃ ${usedPrefix}readqr <reply qr>
┃ ${usedPrefix}whatmusic <reply audio>
┃ ${usedPrefix}translate <lang> <text>
┃ ${usedPrefix}tts <lang> <text>
┃ ${usedPrefix}ocr <reply image>
┃ ${usedPrefix}removebg <reply image>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *GAME MENU* 』━━━╮
┃ ${usedPrefix}tictactoe <@user>
┃ ${usedPrefix}math <mode>
┃ ${usedPrefix}guess
┃ ${usedPrefix}family100
┃ ${usedPrefix}akinator
┃ ${usedPrefix}slot
┃ ${usedPrefix}suit <@user>
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *ECONOMY MENU* 』━━━╮
┃ ${usedPrefix}daily
┃ ${usedPrefix}weekly
┃ ${usedPrefix}monthly
┃ ${usedPrefix}claim
┃ ${usedPrefix}balance
┃ ${usedPrefix}bank
┃ ${usedPrefix}transfer <@user> <amount>
┃ ${usedPrefix}leaderboard
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 *ANIME MENU* 』━━━╮
┃ ${usedPrefix}waifu
┃ ${usedPrefix}neko
┃ ${usedPrefix}loli
┃ ${usedPrefix}husbu
┃ ${usedPrefix}naruto
┃ ${usedPrefix}onepiece
┃ ${usedPrefix}attackontitan
╰━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 💻 *Developed By:* Muhammad Yousaf Baloch
┃ 🌟 *Bot Name:* YOUSAF-BALOCH-MD
┃ 📱 *WhatsApp:* +923710636110
┃ 🔒 *Owner Cannot Be Changed*
┃ 📊 *Total Commands:* 280+
┃ ✅ *Auto View Status* ✓
┃ ✅ *Anti Delete Messages* ✓
╰━━━━━━━━━━━━━━━━━━━━━╯

${global.menuFooter}

_© 2026 YOUSAF-BALOCH-MD_
_Developed by Muhammad Yousaf Baloch_
_All Rights Reserved_
_Contact: +923710636110_
`;

  await conn.sendMessage(m.chat, {
    image: { url: global.thumb },
    caption: menu,
    footer: '© Muhammad Yousaf Baloch - Professional WhatsApp Bot Developer',
    buttons: [
      { buttonId: `${usedPrefix}owner`, buttonText: { displayText: '👑 Muhammad Yousaf Baloch' }, type: 1 },
      { buttonId: `${usedPrefix}script`, buttonText: { displayText: '📜 Get Script' }, type: 1 },
      { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '⚡ Bot Speed' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m });
};

handler.help = ['menu', 'help', 'commands', 'allmenu'];
handler.tags = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
