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
  if (hour >= 5  && hour < 12) return { label: '🌅 Morning Time',   emoji: '🌅', mode: 'MORNING',   greet: 'Good Morning!',   dua: 'Allahumma bika asbahna wa bika amsayna',   color: '🌤️' };
  if (hour >= 12 && hour < 16) return { label: '☀️ Afternoon Time', emoji: '☀️', mode: 'AFTERNOON', greet: 'Good Afternoon!', dua: 'Subhan Allahi wa bihamdihi',                color: '☀️' };
  if (hour >= 16 && hour < 20) return { label: '🌆 Evening Time',   emoji: '🌆', mode: 'EVENING',   greet: 'Good Evening!',   dua: 'Allahumma bika amsayna wa bika asbahna',   color: '🌇' };
  return                               { label: '🌙 Night Time',     emoji: '🌙', mode: 'NIGHT',     greet: 'Good Night!',     dua: 'Bismika Allahumma amutu wa ahya',          color: '🌌' };
}

let handler = async (m, { conn, usedPrefix }) => {

  if (!m || !m.chat || !m.key) return;

  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  const name   = conn.contacts?.[sender]?.name ||
                 conn.contacts?.[sender]?.notify ||
                 (sender ? sender.split('@')[0] : 'Friend') ||
                 'Friend';

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

  let pluginCount = 160;
  try { pluginCount = fs.readdirSync('./plugins').filter(f => f.endsWith('.js')).length; } catch (_) {}

  // ── Menu text ─────────────────────────────────────────────────
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
┃ ${pfx}menu       » Full Menu
┃ ${pfx}alive      » Bot Status
┃ ${pfx}ping       » Speed Test
┃ ${pfx}runtime    » Uptime
┃ ${pfx}owner      » Owner Info
┃ ${pfx}support    » Support Group
┃ ${pfx}script     » Get Bot Script
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 ⚙️ *AUTO FEATURES* 』━━━━╮
┃ ${pfx}autoviewstatus <on/off>
┃  _Auto view all statuses_
┃ ${pfx}antidelete <on/off>
┃  _Show deleted messages_
┃ ${pfx}autoreact <on/off>
┃  _Auto react to messages_
┃ ${pfx}autoread <on/off>
┃  _Auto read messages_
┃ ${pfx}autotyping <on/off>
┃  _Show typing indicator_
┃ ${pfx}autorecording <on/off>
┃  _Show recording status_
┃ ${pfx}autobio <on/off>
┃  _Auto rotate bio_
┃ ${pfx}anticall <on/off>
┃  _Auto reject calls_
┃ ${pfx}autoreply <on/off>
┃  _Auto reply offline_
┃ ${pfx}autodownload <on/off>
┃  _Auto download media_
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 📥 *DOWNLOAD MENU* 』━━━━╮
┃ ▸ 🎵 *YouTube*
┃ ${pfx}ytmp3 <url>    » YouTube MP3
┃ ${pfx}ytmp4 <url>    » YouTube MP4
┃ ${pfx}play <name>    » Search & Play
┃ ${pfx}song <name>    » Search Song
┃ ${pfx}video <name>   » Search Video
┃
┃ ▸ 🎵 *TikTok*
┃ ${pfx}tiktok <url>   » TikTok Video
┃ ${pfx}ttmp3 <url>    » TikTok Audio
┃
┃ ▸ 📸 *Instagram*
┃ ${pfx}instagram <url>» IG Post
┃ ${pfx}igreel <url>   » IG Reel
┃
┃ ▸ 📘 *Facebook*
┃ ${pfx}facebook <url> » FB Video
┃
┃ ▸ 🐦 *Twitter/X*
┃ ${pfx}twitter <url>  » Twitter Video
┃
┃ ▸ 🎵 *SoundCloud*
┃ ${pfx}soundcloud <url>» SC Audio
┃
┃ ▸ 📱 *APK Downloads*
┃ ${pfx}apk <name>     » Download APK
┃ ${pfx}modapk <name>  » Modded APK
┃ ${pfx}playstore <n>  » Play Store
┃
┃ ▸ 🎬 *Movies & Shows*
┃ ${pfx}movie <name>   » Movie Info
┃ ${pfx}drama <name>   » Drama DL
┃ ${pfx}trailer <name> » Movie Trailer
┃
┃ ▸ 🎵 *Islamic Audio*
┃ ${pfx}naat <name>    » Naat DL
┃ ${pfx}bayan <name>   » Bayan DL
┃
┃ ▸ 🖼️ *Images*
┃ ${pfx}wallpaper <q>  » HD Wallpaper
┃ ${pfx}ringtone <n>   » Ringtone
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🤖 *AI FEATURES* 』━━━━╮
┃ ▸ 💬 *Chat AI*
┃ ${pfx}ai <text>      » Gemini AI
┃ ${pfx}chatgpt <text> » ChatGPT
┃ ${pfx}gpt <text>     » GPT Response
┃
┃ ▸ 🖼️ *AI Image*
┃ ${pfx}imagine <prompt>» AI Art
┃ ${pfx}aiimage <prompt>» Generate Img
┃
┃ ▸ 💻 *AI Code*
┃ ${pfx}aicode <lang> <task>
┃ ${pfx}explain <code> » Explain Code
┃ ${pfx}debug <code>   » Debug Code
┃
┃ ▸ 🌍 *Translation*
┃ ${pfx}translate <lang> <text>
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🖼️ *IMAGE TOOLS* 』━━━━╮
┃ ${pfx}remini        » AI Enhance
┃ ${pfx}enhance       » HD Enhance
┃ ${pfx}blur          » Blur Effect
┃ ${pfx}sepia         » Sepia Effect
┃ ${pfx}invert        » Invert Colors
┃ ${pfx}grayscale     » Black & White
┃ ${pfx}cartoon       » Cartoon Effect
┃ ${pfx}sketch        » Pencil Sketch
┃ ${pfx}watermark <t> » Add Watermark
┃ ${pfx}rembg         » Remove BG
┃ ${pfx}wanted        » Wanted Poster
┃ ${pfx}wasted        » Wasted Effect
┃ ${pfx}jail          » Jail Effect
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎭 *STICKER MENU* 』━━━━╮
┃ ${pfx}sticker       » Image → Sticker
┃ ${pfx}s             » Quick Sticker
┃ ${pfx}sgif          » Video → Sticker
┃ ${pfx}toimg         » Sticker → Image
┃ ${pfx}ttp <text>    » Text → Sticker
┃ ${pfx}attp <text>   » Animated TTP
┃ ${pfx}emojimix <🤣+😍>» Mix Emojis
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎨 *DESIGN TOOLS* 』━━━━╮
┃ ${pfx}logo <name>   » 30 Logo Styles
┃  _Example: ${pfx}logo Yousaf 5_
┃ ${pfx}dp <name|tag> » 30 DP Styles
┃  _Example: ${pfx}dp Yousaf | King_
┃ ${pfx}carbon <code> » Code Screenshot
┃ ${pfx}meme <t|b>    » Create Meme
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔧 *TOOLS MENU* 』━━━━╮
┃ ${pfx}calc <expr>   » Calculator
┃ ${pfx}convert <v> <unit>» Convert
┃ ${pfx}currency <a> <F> <T>» Currency
┃ ${pfx}weather <city>» Weather
┃ ${pfx}pdf <title>   » Image → PDF
┃ ${pfx}ocr           » Read Image Text
┃ ${pfx}qr <text>     » QR Code
┃ ${pfx}short <url>   » Short URL
┃ ${pfx}screenshot <url>» Website SS
┃ ${pfx}tts <lang> <text>» Text → Voice
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🔍 *SEARCH MENU* 』━━━━╮
┃ ${pfx}google <query>» Google Search
┃ ${pfx}wiki <query>  » Wikipedia
┃ ${pfx}movie <name>  » Movie Info
┃ ${pfx}lyrics <song> » Song Lyrics
┃ ${pfx}news          » Latest News
┃ ${pfx}technews      » Tech News
┃ ${pfx}sportsnews    » Sports News
┃ ${pfx}github <repo> » GitHub Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 ☪️ *ISLAMIC MENU* 』━━━━╮
┃ ▸ 📖 *Quran*
┃ ${pfx}quran <surah:ayah>» Quran Ayat
┃  _Example: ${pfx}quran 2:255_
┃ ${pfx}ayat           » Random Ayat
┃ ${pfx}tafsir <s:a>   » Tafsir
┃
┃ ▸ 📚 *Hadith*
┃ ${pfx}hadith         » Random Hadith
┃
┃ ▸ 🕌 *Prayer Times*
┃ ${pfx}prayertime <city>» Prayer Times
┃ ${pfx}prayer         » Today's Times
┃
┃ ▸ 🌙 *Islamic Info*
┃ ${pfx}hijri          » Hijri Date
┃ ${pfx}dua            » Random Dua
┃ ${pfx}asma           » Asma-ul-Husna
┃ ${pfx}islamicnames   » Muslim Names
┃ ${pfx}zakatcalc <amt>» Zakat Calc
┃ ${pfx}ramadan        » Ramadan Info
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🏏 *CRICKET & MATCH* 』━━━━╮
┃ ▸ 🔴 *Live Scores*
┃ ${pfx}score          » Live Score
┃ ${pfx}livescore      » Live Matches
┃ ${pfx}cricketlive    » Cricket Live
┃
┃ ▸ 📊 *Match Info*
┃ ${pfx}matchinfo      » Match Details
┃ ${pfx}schedule       » Match Schedule
┃ ${pfx}commentary     » Live Commentary
┃ ${pfx}toss           » Toss Result
┃
┃ ▸ 🏆 *Tournaments*
┃ ${pfx}psl            » PSL 2025
┃ ${pfx}ipl            » IPL 2025
┃ ${pfx}pointstable    » Points Table
┃
┃ ▸ ⚽ *Football*
┃ ${pfx}football       » Football Score
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 👥 *GROUP MENU* 』━━━━╮
┃ ▸ 👤 *Members*
┃ ${pfx}add <number>   » Add Member
┃ ${pfx}kick <@user>   » Kick Member
┃ ${pfx}promote <@user>» Make Admin
┃ ${pfx}demote <@user> » Remove Admin
┃ ${pfx}tagall <text>  » Tag Everyone
┃ ${pfx}hidetag <text> » Silent Tag
┃
┃ ▸ ⚠️ *Warning System*
┃ ${pfx}warn <@user>   » Warn Member
┃  _3 Warnings = Auto Kick!_
┃ ${pfx}unwarn <@user> » Remove Warn
┃
┃ ▸ ⚙️ *Group Settings*
┃ ${pfx}groupopen      » Open Group
┃ ${pfx}groupclose     » Close Group
┃ ${pfx}groupname <t>  » Change Name
┃ ${pfx}groupdesc <t>  » Change Desc
┃
┃ ▸ 🛡️ *Protection*
┃ ${pfx}antilink <on/off>» Anti Link
┃ ${pfx}antivv <on/off>  » Anti VV
┃ ${pfx}antispam <on/off>» Anti Spam
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 💰 *ECONOMY MENU* 』━━━━╮
┃ ${pfx}balance        » Check Balance
┃ ${pfx}daily          » Daily Reward
┃  _200 coins + streak bonus_
┃ ${pfx}work           » Work for Coins
┃ ${pfx}shop           » View Shop
┃ ${pfx}buy <number>   » Buy Item
┃ ${pfx}leaderboard    » Top 10 Rich
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 🎮 *GAMES MENU* 』━━━━╮
┃ ${pfx}tictactoe <@user>» Tic Tac Toe
┃ ${pfx}quiz <category>  » Quiz Game
┃  _general pakistan cricket islam_
┃ ${pfx}dice             » Roll Dice
┃ ${pfx}coin             » Coin Flip
┃ ${pfx}math <easy/hard> » Math Game
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 😄 *FUN MENU* 』━━━━╮
┃ ${pfx}joke           » Random Joke
┃ ${pfx}quote          » Motivational
┃ ${pfx}fact           » Random Fact
┃ ${pfx}truth          » Truth Question
┃ ${pfx}dare           » Dare Challenge
┃ ${pfx}meme           » Random Meme
┃ ${pfx}ship <@u1> <@u2>» Love Meter
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━━『 👑 *OWNER MENU* 』━━━━╮
┃ ${pfx}broadcast <text>» Broadcast
┃ ${pfx}ban <@user>     » Ban User
┃ ${pfx}unban <@user>   » Unban User
┃ ${pfx}block <@user>   » Block
┃ ${pfx}unblock <@user> » Unblock
┃ ${pfx}restart         » Restart Bot
┃ ${pfx}shutdown        » Stop Bot
┃ ${pfx}eval <code>     » Run JS Code
┃ ${pfx}join <link>     » Join Group
┃ ${pfx}leave           » Leave Group
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
║ ✅ Live Cricket & PSL Scores         ║
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
_All Rights Reserved ⚡_`.trim();

  // ── 1. تصویر + پوری مینیو ─────────────────────────────────────
  try {
    const thumbPath  = path.resolve('./assets/menu-thumb.png');
    const thumbBuf   = fs.readFileSync(thumbPath);

    await conn.sendMessage(m.chat, {
      image  : thumbBuf,
      caption: menu,
      // ✅ تصویر پر کلک = YouTube channel کھلے گا
      contextInfo: {
        externalAdReply: {
          title      : `${OWNER.BOT_NAME} — Professional WhatsApp Bot`,
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
    // Fallback: تصویر نہ ملے تو صرف text
    await conn.sendMessage(m.chat, { text: menu }, { quoted: m });
  }

  // ── 2. WhatsApp Channel بٹن ───────────────────────────────────
  await conn.sendMessage(m.chat, {
    text   : `📢 *Join Our WhatsApp Channel!*\n\n_Bot updates, new features & support_\n\n👇 *Click below to join:*\n${OWNER.CHANNEL}`,
    contextInfo: {
      externalAdReply: {
        title    : `📢 ${OWNER.BOT_NAME} — Official Channel`,
        body     : 'Join for updates & support!',
        thumbnail: (() => { try { return fs.readFileSync('./assets/menu-thumb.png'); } catch { return Buffer.from(''); } })(),
        mediaType: 1,
        mediaUrl : OWNER.CHANNEL,
        sourceUrl: OWNER.CHANNEL,
      },
    },
  }, { quoted: m });

  // ── 3. Voice note — مینیو کے بالکل آخر میں ──────────────────
  try {
    const voicePath = path.resolve('./assets/menu-voice.m4a');
    const voiceBuf  = fs.readFileSync(voicePath);

    await conn.sendMessage(m.chat, {
      audio   : voiceBuf,
      mimetype: 'audio/mp4',
      ptt     : true,   // ← voice note format
    }, { quoted: m });
  } catch (e) {
    console.error('[MENU VOICE ERROR]:', e.message);
  }
};

handler.help    = ['menu', 'help', 'commands', 'allmenu', 'list'];
handler.tags    = ['main'];
handler.command = /^(menu|help|commands|allmenu|list)$/i;

export default handler;
