/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Settings Plugin       ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';

const SETTINGS = {

  // ══════════════════════════════════════════
  // 🤖 AUTO FEATURES
  // ══════════════════════════════════════════
  autoread: {
    label: '📖 Auto Read Messages',
    key  : 'AUTO_READ',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto read all messages',
  },
  autoviewstatus: {
    label: '👁️ Auto View Status',
    key  : 'AUTO_VIEW_STATUS',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto view status updates',
  },
  autolikestatus: {
    label: '❤️ Auto Like Status',
    key  : 'AUTO_LIKE_STATUS',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto like status updates',
  },
  autoreact: {
    label: '😊 Auto React',
    key  : 'AUTO_REACT',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto react to messages',
  },
  autoreply: {
    label: '💬 Auto Reply',
    key  : 'AUTO_REPLY',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto reply when offline',
  },
  autodownload: {
    label: '⬇️ Auto Download',
    key  : 'AUTO_DOWNLOAD',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto download media',
  },
  autotyping: {
    label: '⌨️ Auto Typing',
    key  : 'AUTO_TYPING',
    group: '🤖 AUTO FEATURES',
    desc : 'Show typing indicator',
  },
  autorecording: {
    label: '🎙️ Auto Recording',
    key  : 'AUTO_RECORDING',
    group: '🤖 AUTO FEATURES',
    desc : 'Show recording status',
  },
  autobio: {
    label: '📝 Auto Bio',
    key  : 'AUTO_BIO',
    group: '🤖 AUTO FEATURES',
    desc : 'Auto rotate bio',
  },
  botmode: {
    label: '🌐 Bot Mode',
    key  : 'BOT_MODE',
    group: '🤖 AUTO FEATURES',
    desc : 'Public (everyone) / Private (owner only)',
  },

  // ══════════════════════════════════════════
  // 🛡️ ANTI FEATURES
  // ══════════════════════════════════════════
  antilink: {
    label: '🔗 Anti Link',
    key  : 'ANTI_LINK',
    group: '🛡️ ANTI FEATURES',
    desc : 'Delete links & warn users (3 strikes)',
  },
  antibadwords: {
    label: '🤬 Anti Bad Words',
    key  : 'ANTI_BAD',
    group: '🛡️ ANTI FEATURES',
    desc : 'Filter abusive language',
  },
  antispam: {
    label: '🚫 Anti Spam',
    key  : 'ANTI_SPAM',
    group: '🛡️ ANTI FEATURES',
    desc : 'Block spam messages',
  },
  anticall: {
    label: '📵 Anti Call',
    key  : 'ANTI_CALL',
    group: '🛡️ ANTI FEATURES',
    desc : 'Auto reject calls',
  },
  antiviewonce: {
    label: '🔒 Anti View Once',
    key  : 'ANTI_VIEW_ONCE',
    group: '🛡️ ANTI FEATURES',
    desc : 'Reveal view-once media',
  },
  antidelete: {
    label: '🗑️ Anti Delete',
    key  : 'ANTI_DELETE',
    group: '🛡️ ANTI FEATURES',
    desc : 'Show deleted messages',
  },
  antiabuse: {
    label: '😤 Anti Abuse',
    key  : 'ANTI_ABUSE',
    group: '🛡️ ANTI FEATURES',
    desc : 'Auto warn for abusive behavior',
  },
  antiraid: {
    label: '⚔️ Anti Raid',
    key  : 'ANTI_RAID',
    group: '🛡️ ANTI FEATURES',
    desc : 'Protect from group raid',
  },

  // ══════════════════════════════════════════
  // 👥 GROUP FEATURES
  // ══════════════════════════════════════════
  welcome: {
    label: '👋 Welcome Message',
    key  : 'WELCOME',
    group: '👥 GROUP FEATURES',
    desc : 'Send welcome to new members',
  },
  goodbye: {
    label: '🚪 Goodbye Message',
    key  : 'GOODBYE',
    group: '👥 GROUP FEATURES',
    desc : 'Send goodbye to leaving members',
  },
  autosticker: {
    label: '🎭 Auto Sticker',
    key  : 'AUTO_STICKER',
    group: '👥 GROUP FEATURES',
    desc : 'Auto convert images to sticker',
  },
  levelup: {
    label: '📈 Level Up',
    key  : 'LEVEL_UP',
    group: '👥 GROUP FEATURES',
    desc : 'Level up notifications',
  },
  warnautokick: {
    label: '⚠️ Auto Kick (3 Warns)',
    key  : 'WARN_AUTO_KICK',
    group: '👥 GROUP FEATURES',
    desc : 'Auto kick after 3 warnings',
  },

  // ══════════════════════════════════════════
  // ☪️ ISLAMIC FEATURES
  // ══════════════════════════════════════════
  dailyayat: {
    label: '📖 Daily Ayat',
    key  : 'DAILY_AYAT',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Daily Quran verses',
  },
  dailyhadith: {
    label: '📜 Daily Hadith',
    key  : 'DAILY_HADITH',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Daily hadith',
  },
  prayeralert: {
    label: '🕌 Prayer Alert',
    key  : 'PRAYER_ALERT',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Prayer time alerts',
  },
  dailydua: {
    label: '🤲 Daily Dua',
    key  : 'DAILY_DUA',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Daily duas',
  },
  jummareminder: {
    label: '🕋 Jummah Reminder',
    key  : 'JUMMA_REMINDER',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Friday reminder',
  },
  islamicgreeting: {
    label: '☮️ Islamic Greeting',
    key  : 'ISLAMIC_GREETING',
    group: '☪️ ISLAMIC FEATURES',
    desc : 'Islamic greeting in welcome',
  },

  // ══════════════════════════════════════════
  // 🏏 CRICKET & MATCH FEATURES
  // ══════════════════════════════════════════
  livescore: {
    label: '🔴 Live Score',
    key  : 'LIVE_SCORE',
    group: '🏏 CRICKET FEATURES',
    desc : 'Live cricket score alerts',
  },
  matchstart: {
    label: '🏏 Match Start',
    key  : 'MATCH_START',
    group: '🏏 CRICKET FEATURES',
    desc : 'Match start alerts',
  },
  matchresult: {
    label: '🏆 Match Result',
    key  : 'MATCH_RESULT',
    group: '🏏 CRICKET FEATURES',
    desc : 'Match result alerts',
  },
  pslalerts: {
    label: '🟢 PSL Alerts',
    key  : 'PSL_ALERTS',
    group: '🏏 CRICKET FEATURES',
    desc : 'PSL match alerts',
  },
  ipialerts: {
    label: '🔵 IPL Alerts',
    key  : 'IPL_ALERTS',
    group: '🏏 CRICKET FEATURES',
    desc : 'IPL match alerts',
  },

  // ══════════════════════════════════════════
  // 🤖 AI FEATURES
  // ══════════════════════════════════════════
  chatbot: {
    label: '🤖 AI Chatbot',
    key  : 'CHATBOT',
    group: '🤖 AI FEATURES',
    desc : 'AI chat responses',
  },
  aiimage: {
    label: '🖼️ AI Image',
    key  : 'AI_IMAGE',
    group: '🤖 AI FEATURES',
    desc : 'AI image generation',
  },
  autotranslate: {
    label: '🌐 Auto Translate',
    key  : 'AUTO_TRANSLATE',
    group: '🤖 AI FEATURES',
    desc : 'Auto translate messages',
  },
  gemini: {
    label: '🧠 Gemini AI',
    key  : 'GEMINI',
    group: '🤖 AI FEATURES',
    desc : 'Google Gemini AI',
  },
  chatgpt: {
    label: '💬 ChatGPT',
    key  : 'CHATGPT',
    group: '🤖 AI FEATURES',
    desc : 'OpenAI ChatGPT',
  },
  bing: {
    label: '🔍 Bing AI',
    key  : 'BING',
    group: '🤖 AI FEATURES',
    desc : 'Microsoft Bing AI',
  },
  blackbox: {
    label: '⬛ Blackbox AI',
    key  : 'BLACKBOX',
    group: '🤖 AI FEATURES',
    desc : 'Blackbox coding AI',
  },
  mixtral: {
    label: '🔄 Mixtral AI',
    key  : 'MIXTRAL',
    group: '🤖 AI FEATURES',
    desc : 'Mixtral AI model',
  },

  // ══════════════════════════════════════════
  // 📥 DOWNLOAD FEATURES
  // ══════════════════════════════════════════
  youtube: {
    label: '🎵 YouTube',
    key  : 'YOUTUBE',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'YouTube downloads',
  },
  tiktok: {
    label: '📱 TikTok',
    key  : 'TIKTOK',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'TikTok downloads',
  },
  instagram: {
    label: '📸 Instagram',
    key  : 'INSTAGRAM',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'Instagram downloads',
  },
  facebook: {
    label: '📘 Facebook',
    key  : 'FACEBOOK',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'Facebook downloads',
  },
  twitter: {
    label: '🐦 Twitter',
    key  : 'TWITTER',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'Twitter downloads',
  },
  apk: {
    label: '📱 APK',
    key  : 'APK',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'APK downloads',
  },
  movie: {
    label: '🎬 Movie',
    key  : 'MOVIE',
    group: '📥 DOWNLOAD FEATURES',
    desc : 'Movie downloads',
  },

  // ══════════════════════════════════════════
  // 🎮 GAMES FEATURES
  // ══════════════════════════════════════════
  tictactoe: {
    label: '⭕ Tic Tac Toe',
    key  : 'TICTACTOE',
    group: '🎮 GAMES FEATURES',
    desc : 'Tic Tac Toe game',
  },
  quiz: {
    label: '❓ Quiz',
    key  : 'QUIZ',
    group: '🎮 GAMES FEATURES',
    desc : 'Quiz game',
  },
  dice: {
    label: '🎲 Dice',
    key  : 'DICE',
    group: '🎮 GAMES FEATURES',
    desc : 'Dice game',
  },
  coin: {
    label: '🪙 Coin Flip',
    key  : 'COIN',
    group: '🎮 GAMES FEATURES',
    desc : 'Coin flip game',
  },
  math: {
    label: '🔢 Math Game',
    key  : 'MATH',
    group: '🎮 GAMES FEATURES',
    desc : 'Math game',
  },

  // ══════════════════════════════════════════
  // 💰 ECONOMY FEATURES
  // ══════════════════════════════════════════
  economy: {
    label: '💰 Economy',
    key  : 'ECONOMY',
    group: '💰 ECONOMY FEATURES',
    desc : 'Economy system',
  },
  daily: {
    label: '📅 Daily',
    key  : 'DAILY',
    group: '💰 ECONOMY FEATURES',
    desc : 'Daily rewards',
  },
  work: {
    label: '💼 Work',
    key  : 'WORK',
    group: '💰 ECONOMY FEATURES',
    desc : 'Work for coins',
  },
  shop: {
    label: '🛒 Shop',
    key  : 'SHOP',
    group: '💰 ECONOMY FEATURES',
    desc : 'Shop system',
  },
  leaderboard: {
    label: '🏆 Leaderboard',
    key  : 'LEADERBOARD',
    group: '💰 ECONOMY FEATURES',
    desc : 'Top users',
  },

  // ══════════════════════════════════════════
  // 🛠️ TOOLS FEATURES
  // ══════════════════════════════════════════
  calculator: {
    label: '🧮 Calculator',
    key  : 'CALCULATOR',
    group: '🛠️ TOOLS FEATURES',
    desc : 'Calculator tool',
  },
  converter: {
    label: '🔄 Converter',
    key  : 'CONVERTER',
    group: '🛠️ TOOLS FEATURES',
    desc : 'Unit converter',
  },
  weather: {
    label: '🌤️ Weather',
    key  : 'WEATHER',
    group: '🛠️ TOOLS FEATURES',
    desc : 'Weather info',
  },
  qr: {
    label: '📱 QR Code',
    key  : 'QR',
    group: '🛠️ TOOLS FEATURES',
    desc : 'QR generator',
  },
  tts: {
    label: '🔊 Text to Speech',
    key  : 'TTS',
    group: '🛠️ TOOLS FEATURES',
    desc : 'Text to speech',
  },
};

// Category list for main menu
const CATEGORIES = [
  '🤖 AUTO FEATURES',
  '🛡️ ANTI FEATURES',
  '👥 GROUP FEATURES',
  '☪️ ISLAMIC FEATURES',
  '🏏 CRICKET FEATURES',
  '🤖 AI FEATURES',
  '📥 DOWNLOAD FEATURES',
  '🎮 GAMES FEATURES',
  '💰 ECONOMY FEATURES',
  '🛠️ TOOLS FEATURES'
];

// ═══════════════════════════════════════════════════════════════
// Handler
// ═══════════════════════════════════════════════════════════════
let handler = async (m, { conn, usedPrefix, args }) => {

  const pfx = usedPrefix || '.';
  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  const name = conn.contacts?.[sender]?.name || conn.contacts?.[sender]?.notify || sender.split('@')[0] || 'User';

  // ── No args → show categories ──────────────────────────────
  if (!args[0]) {
    let msg = `╔══════════════════════════════════════╗\n`;
    msg += `║     ⚙️  *BOT SETTINGS* ⚙️              ║\n`;
    msg += `╚══════════════════════════════════════╝\n\n`;
    msg += `👤 *User:* ${name}\n`;
    msg += `👑 *Owner:* ${OWNER.FULL_NAME}\n\n`;
    msg += `📌 *Categories:*\n\n`;

    for (let cat of CATEGORIES) {
      const count = Object.values(SETTINGS).filter(s => s.group === cat).length;
      msg += `┃ ${cat} (${count} settings)\n`;
      msg += `┃ ${pfx}settings ${cat.toLowerCase().replace(/[^a-z]/g, '')}\n\n`;
    }

    msg += `📌 *Quick Commands:*\n`;
    msg += `┃ ${pfx}settings all on    » Enable all\n`;
    msg += `┃ ${pfx}settings all off   » Disable all\n`;
    msg += `┃ ${pfx}settings public    » Public mode\n`;
    msg += `┃ ${pfx}settings private   » Private mode\n\n`;
    
    msg += `_⚡ ${OWNER.BOT_NAME} — Total Settings: ${Object.keys(SETTINGS).length}_`;

    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  const input = args[0].toLowerCase();
  const action = args[1]?.toLowerCase();

  // ── Public/Private mode ────────────────────────────────────
  if (input === 'public') {
    CONFIG.BOT_MODE = 'public';
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║     ✅ *PUBLIC MODE ENABLED* ✅       ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `🌐 Everyone can use bot commands.\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (input === 'private') {
    CONFIG.BOT_MODE = 'private';
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║     🔒 *PRIVATE MODE ENABLED* 🔒     ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `👑 Only owner can use bot commands.\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  // ── All settings toggle ────────────────────────────────────
  if (input === 'all') {
    if (!action || !['on', 'off'].includes(action)) {
      return conn.sendMessage(m.chat, {
        text: `❌ *Usage:* ${pfx}settings all on / ${pfx}settings all off`,
      }, { quoted: m });
    }
    
    const value = action === 'on';
    const changed = [];
    
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      CONFIG[info.key] = value;
      changed.push(`${value ? '✅' : '❌'} ${info.label}`);
    }
    
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║  ⚙️  *ALL SETTINGS ${value ? 'ON' : 'OFF'}*  ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + changed.slice(0, 15).join('\n')
          + (changed.length > 15 ? `\n... and ${changed.length - 15} more` : '')
          + `\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  // ── Category mapping ───────────────────────────────────────
  const categoryMap = {
    'auto': '🤖 AUTO FEATURES',
    'anti': '🛡️ ANTI FEATURES',
    'group': '👥 GROUP FEATURES',
    'islamic': '☪️ ISLAMIC FEATURES',
    'cricket': '🏏 CRICKET FEATURES',
    'ai': '🤖 AI FEATURES',
    'download': '📥 DOWNLOAD FEATURES',
    'games': '🎮 GAMES FEATURES',
    'economy': '💰 ECONOMY FEATURES',
    'tools': '🛠️ TOOLS FEATURES'
  };

  // ── Show category settings ─────────────────────────────────
  if (categoryMap[input]) {
    const targetCategory = categoryMap[input];
    let msg = `╭━『 ${targetCategory} 』━━━━━━━━━━━━━━━━━━━━╮\n\n`;
    
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (info.group === targetCategory) {
        const status = CONFIG[info.key] ? '✅' : '❌';
        msg += `┃ ${status} *${info.label}*\n`;
        msg += `┃    ↳ ${info.desc}\n`;
        msg += `┃    ${pfx}settings ${cmd} ${CONFIG[info.key] ? 'off' : 'on'}\n\n`;
      }
    }
    
    msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    msg += `_⚡ ${OWNER.BOT_NAME}_`;
    
    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  // ── Single setting ─────────────────────────────────────────
  const setting = SETTINGS[input];

  if (!setting) {
    return conn.sendMessage(m.chat, {
      text: `❌ *Unknown Setting:* \`${input}\`\n\n`
          + `📌 *Available Categories:* ${Object.keys(categoryMap).join(', ')}\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!action) {
    const current = CONFIG[setting.key] ? '✅ ON' : '❌ OFF';
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║        ⚙️  *SETTING INFO* ⚙️          ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `📌 *Setting:* ${setting.label}\n`
          + `📊 *Status:*  ${current}\n`
          + `📝 *Info:*    ${setting.desc}\n`
          + `📂 *Group:*   ${setting.group}\n\n`
          + `📌 *Toggle:*\n`
          + `┃ ${pfx}settings ${input} on\n`
          + `┃ ${pfx}settings ${input} off\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!['on', 'off'].includes(action)) {
    return conn.sendMessage(m.chat, {
      text: `❌ *Invalid Action!* Use \`on\` or \`off\``,
    }, { quoted: m });
  }

  const newValue = action === 'on';
  const oldValue = CONFIG[setting.key];

  if (oldValue === newValue) {
    return conn.sendMessage(m.chat, {
      text: `ℹ️ *${setting.label}* is already *${action.toUpperCase()}*!`,
    }, { quoted: m });
  }

  CONFIG[setting.key] = newValue;

  return conn.sendMessage(m.chat, {
    text: `╔══════════════════════════════════════╗\n`
        + `║     ⚙️  *SETTING UPDATED* ⚙️          ║\n`
        + `╚══════════════════════════════════════╝\n\n`
        + `📌 *Setting:* ${setting.label}\n`
        + `📊 *Status:*  ${newValue ? '✅ ON' : '❌ OFF'}\n`
        + `📝 *Info:*    ${setting.desc}\n\n`
        + `_⚡ ${OWNER.BOT_NAME} — Updated!_`,
  }, { quoted: m });
};

handler.help    = ['settings'];
handler.tags    = ['info'];
handler.command = /^(settings|setting|config)$/i;
handler.owner   = false;

export default handler;
