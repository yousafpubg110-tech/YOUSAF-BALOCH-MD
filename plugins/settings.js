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
    group: '🤖 Auto Features',
    desc : 'تمام messages automatically read ہوں گے',
  },
  autoviewstatus: {
    label: '👁️ Auto View Status',
    key  : 'AUTO_READ_STATUS',
    group: '🤖 Auto Features',
    desc : 'تمام contacts کے status automatically دیکھے جائیں گے',
  },
  autolikestatus: {
    label: '❤️ Auto Like Status',
    key  : 'AUTO_LIKE_STATUS',
    group: '🤖 Auto Features',
    desc : 'Status پر automatically like/react ہوگا',
  },
  autoreact: {
    label: '😊 Auto React Messages',
    key  : 'AUTO_REACT',
    group: '🤖 Auto Features',
    desc : 'Messages پر automatically emoji react ہوگا',
  },
  autoreply: {
    label: '💬 Auto Reply (Offline)',
    key  : 'AUTO_REPLY',
    group: '🤖 Auto Features',
    desc : 'Offline ہونے پر automatically reply ہوگا',
  },
  autodownload: {
    label: '⬇️ Auto Download Media',
    key  : 'AUTO_DOWNLOAD',
    group: '🤖 Auto Features',
    desc : 'Status کی media automatically download ہوگی',
  },
  autotyping: {
    label: '⌨️ Auto Typing Indicator',
    key  : 'AUTO_TYPING',
    group: '🤖 Auto Features',
    desc : 'Reply سے پہلے typing... دکھائے گا',
  },
  autorecording: {
    label: '🎙️ Auto Recording Status',
    key  : 'AUTO_RECORDING',
    group: '🤖 Auto Features',
    desc : 'Audio reply سے پہلے recording... دکھائے گا',
  },
  autobio: {
    label: '📝 Auto Rotate Bio',
    key  : 'AUTO_BIO',
    group: '🤖 Auto Features',
    desc : 'Bot کی bio automatically rotate ہوگی',
  },

  // ══════════════════════════════════════════
  // 🛡️ ANTI FEATURES
  // ══════════════════════════════════════════
  antilink: {
    label: '🔗 Anti Link',
    key  : 'ANTI_LINK',
    group: '🛡️ Anti Features',
    desc : 'Group میں links send کرنے پر ban ہوگا',
  },
  antibadwords: {
    label: '🤬 Anti Bad Words',
    key  : 'ANTI_BAD',
    group: '🛡️ Anti Features',
    desc : 'گالیاں دینے پر automatically warn/kick ہوگا',
  },
  antispam: {
    label: '🚫 Anti Spam',
    key  : 'ANTI_SPAM',
    group: '🛡️ Anti Features',
    desc : 'Spam messages پر action لیا جائے گا',
  },
  anticall: {
    label: '📵 Anti Call',
    key  : 'ANTI_CALL',
    group: '🛡️ Anti Features',
    desc : 'Unknown calls automatically reject ہوں گی',
  },
  antiviewonce: {
    label: '🔒 Anti View Once',
    key  : 'ANTI_VIEW_ONCE',
    group: '🛡️ Anti Features',
    desc : 'View once media automatically reveal ہوگی',
  },
  antidelete: {
    label: '🗑️ Anti Delete',
    key  : 'ANTI_DELETE',
    group: '🛡️ Anti Features',
    desc : 'Delete شدہ messages دوبارہ forward ہوں گے',
  },
  antiabuse: {
    label: '😤 Anti Abuse',
    key  : 'ANTI_ABUSE',
    group: '🛡️ Anti Features',
    desc : 'Abusive behavior پر automatically warn ہوگا',
  },
  antiraid: {
    label: '⚔️ Anti Raid',
    key  : 'ANTI_RAID',
    group: '🛡️ Anti Features',
    desc : 'Group raid attack سے protection',
  },

  // ══════════════════════════════════════════
  // 👥 GROUP FEATURES
  // ══════════════════════════════════════════
  welcome: {
    label: '👋 Welcome Message',
    key  : 'WELCOME',
    group: '👥 Group Features',
    desc : 'نئے member کو welcome message بھیجا جائے گا',
  },
  goodbye: {
    label: '🚪 Goodbye Message',
    key  : 'GOODBYE',
    group: '👥 Group Features',
    desc : 'Member leave کرے تو goodbye message آئے گا',
  },
  autosticker: {
    label: '🎭 Auto Sticker',
    key  : 'AUTO_STICKER',
    group: '👥 Group Features',
    desc : 'Images automatically sticker بن جائیں گی',
  },
  levelup: {
    label: '📈 Level Up Message',
    key  : 'LEVEL_UP',
    group: '👥 Group Features',
    desc : 'Level up ہونے پر notification آئے گی',
  },
  warnautokick: {
    label: '⚠️ Auto Kick (3 Warns)',
    key  : 'WARN_AUTO_KICK',
    group: '👥 Group Features',
    desc : '3 warnings کے بعد automatically kick ہوگا',
  },

  // ══════════════════════════════════════════
  // ☪️ ISLAMIC FEATURES
  // ══════════════════════════════════════════
  dailyayat: {
    label: '📖 Daily Quran Ayat',
    key  : 'DAILY_AYAT',
    group: '☪️ Islamic Features',
    desc : 'روزانہ group میں Quran کی آیت آئے گی',
  },
  dailyhadith: {
    label: '📜 Daily Hadith',
    key  : 'DAILY_HADITH',
    group: '☪️ Islamic Features',
    desc : 'روزانہ group میں حدیث آئے گی',
  },
  prayeralert: {
    label: '🕌 Prayer Time Alert',
    key  : 'PRAYER_ALERT',
    group: '☪️ Islamic Features',
    desc : 'نماز کے وقت automatically alert آئے گا',
  },
  dailydua: {
    label: '🤲 Daily Dua',
    key  : 'DAILY_DUA',
    group: '☪️ Islamic Features',
    desc : 'روزانہ group میں دعا آئے گی',
  },
  jummareminder: {
    label: '🕋 Jummah Reminder',
    key  : 'JUMMA_REMINDER',
    group: '☪️ Islamic Features',
    desc : 'جمعہ کے دن خصوصی reminder آئے گا',
  },
  islamicgreeting: {
    label: '☮️ Islamic Greeting',
    key  : 'ISLAMIC_GREETING',
    group: '☪️ Islamic Features',
    desc : 'Welcome message میں اسلامی سلام شامل ہوگا',
  },

  // ══════════════════════════════════════════
  // 🏏 CRICKET & MATCH FEATURES
  // ══════════════════════════════════════════
  livescore: {
    label: '🔴 Live Score Alerts',
    key  : 'LIVE_SCORE',
    group: '🏏 Cricket & Match',
    desc : 'Live cricket score automatically آئے گا',
  },
  matchstart: {
    label: '🏏 Match Start Alert',
    key  : 'MATCH_START',
    group: '🏏 Cricket & Match',
    desc : 'Match شروع ہونے پر notification آئے گی',
  },
  matchresult: {
    label: '🏆 Match Result Alert',
    key  : 'MATCH_RESULT',
    group: '🏏 Cricket & Match',
    desc : 'Match ختم ہونے پر result automatically آئے گا',
  },
  pslalerts: {
    label: '🟢 PSL Alerts',
    key  : 'PSL_ALERTS',
    group: '🏏 Cricket & Match',
    desc : 'PSL میچز کے alerts آئیں گے',
  },
  ipialerts: {
    label: '🔵 IPL Alerts',
    key  : 'IPL_ALERTS',
    group: '🏏 Cricket & Match',
    desc : 'IPL میچز کے alerts آئیں گے',
  },

  // ══════════════════════════════════════════
  // 🤖 AI FEATURES
  // ══════════════════════════════════════════
  chatbot: {
    label: '🤖 AI Chatbot',
    key  : 'CHATBOT',
    group: '🤖 AI Features',
    desc : 'AI chatbot automatically reply کرے گا',
  },
  aiimage: {
    label: '🖼️ AI Image Generation',
    key  : 'AI_IMAGE',
    group: '🤖 AI Features',
    desc : 'AI سے images generate ہوں گی',
  },
  autotranslate: {
    label: '🌐 Auto Translate',
    key  : 'AUTO_TRANSLATE',
    group: '🤖 AI Features',
    desc : 'Messages automatically translate ہوں گے',
  },

  // ══════════════════════════════════════════
  // ⚡ ADVANCED FEATURES
  // ══════════════════════════════════════════
  tts: {
    label: '🔊 Text To Speech',
    key  : 'TTS',
    group: '⚡ Advanced Features',
    desc : 'Text کو آواز میں تبدیل کیا جائے گا',
  },
  stickerreact: {
    label: '🎭 Sticker React',
    key  : 'STICKER_REACT',
    group: '⚡ Advanced Features',
    desc : 'Stickers پر automatically react ہوگا',
  },
  broadcastnews: {
    label: '📰 News Broadcast',
    key  : 'BROADCAST_NEWS',
    group: '⚡ Advanced Features',
    desc : 'Latest news automatically broadcast ہوگی',
  },
  weatheralert: {
    label: '🌤️ Weather Alert',
    key  : 'WEATHER_ALERT',
    group: '⚡ Advanced Features',
    desc : 'موسم کا حال automatically آئے گا',
  },
  economysystem: {
    label: '💰 Economy System',
    key  : 'ECONOMY',
    group: '⚡ Advanced Features',
    desc : 'Coins، wallet اور shop system',
  },
};

// ═══════════════════════════════════════════════════════════════
// Handler
// ═══════════════════════════════════════════════════════════════
let handler = async (m, { conn, usedPrefix, args }) => {

  const pfx = usedPrefix || CONFIG.PREFIX;

  // ── No args → show ALL settings ──────────────────────────────
  if (!args[0]) {

    // Group کر کے settings بناؤ
    const groups = {};
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (!groups[info.group]) groups[info.group] = [];
      const current = CONFIG[info.key];
      groups[info.group].push(
        `┃ ${current ? '✅' : '❌'} *${info.label}*\n┃    ↳ _${info.desc}_\n┃    ${pfx}settings ${cmd} ${current ? 'off' : 'on'}`
      );
    }

    let msg = `╔══════════════════════════════════════╗\n`;
    msg    += `║     ⚙️  *BOT SETTINGS PANEL* ⚙️       ║\n`;
    msg    += `╚══════════════════════════════════════╝\n\n`;
    msg    += `👑 *Owner:* ${OWNER.FULL_NAME}\n`;
    msg    += `🤖 *Bot:* ${OWNER.BOT_NAME}\n\n`;
    msg    += `📌 *Usage:*\n`;
    msg    += `┃ ${pfx}settings <name> on/off\n`;
    msg    += `┃ ${pfx}settings all on/off\n`;
    msg    += `┃ ${pfx}settings <category> on/off\n\n`;

    for (const [groupName, items] of Object.entries(groups)) {
      msg += `╭━━━━『 ${groupName} 』━━━━╮\n`;
      msg += items.join('\n┃\n') + '\n';
      msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    msg += `╭━━━━『 ⚡ QUICK COMMANDS 』━━━━╮\n`;
    msg += `┃ ${pfx}settings all on     » سب ON\n`;
    msg += `┃ ${pfx}settings all off    » سب OFF\n`;
    msg += `┃ ${pfx}settings auto on    » سب Auto ON\n`;
    msg += `┃ ${pfx}settings anti on    » سب Anti ON\n`;
    msg += `┃ ${pfx}settings group on   » سب Group ON\n`;
    msg += `┃ ${pfx}settings islamic on » سب Islamic ON\n`;
    msg += `┃ ${pfx}settings cricket on » سب Cricket ON\n`;
    msg += `┃ ${pfx}settings ai on      » سب AI ON\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    msg += `_⚡ ${OWNER.BOT_NAME} — Total Settings: ${Object.keys(SETTINGS).length}_`;

    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  const settingName = args[0].toLowerCase();
  const action      = args[1]?.toLowerCase();

  // ── settings all on/off ───────────────────────────────────────
  if (settingName === 'all') {
    if (!['on', 'off'].includes(action)) {
      return conn.sendMessage(m.chat, {
        text: `❌ *Usage:*\n${pfx}settings all on\n${pfx}settings all off`,
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
          + `║  ⚙️  *ALL SETTINGS ${value ? 'ON' : 'OFF'}* ⚙️  ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + changed.join('\n')
          + `\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  // ── Category toggle ───────────────────────────────────────────
  const categoryMap = {
    'auto'    : '🤖 Auto Features',
    'anti'    : '🛡️ Anti Features',
    'group'   : '👥 Group Features',
    'islamic' : '☪️ Islamic Features',
    'cricket' : '🏏 Cricket & Match',
    'ai'      : '🤖 AI Features',
    'advanced': '⚡ Advanced Features',
  };

  if (categoryMap[settingName] && ['on', 'off'].includes(action)) {
    const targetGroup = categoryMap[settingName];
    const value       = action === 'on';
    const changed     = [];
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (info.group === targetGroup) {
        CONFIG[info.key] = value;
        changed.push(`${value ? '✅' : '❌'} ${info.label}`);
      }
    }
    return conn.sendMessage(m.chat, {
      text: `⚙️ *${targetGroup} — ${action.toUpperCase()}*\n\n`
          + changed.join('\n')
          + `\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  // ── Single setting ────────────────────────────────────────────
  const setting = SETTINGS[settingName];

  if (!setting) {
    const available = Object.keys(SETTINGS).join(', ');
    return conn.sendMessage(m.chat, {
      text: `❌ *Unknown Setting:* \`${settingName}\`\n\n`
          + `📋 *تمام Settings:*\n${available}\n\n`
          + `📌 *Usage:* ${pfx}settings <name> on/off\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!['on', 'off'].includes(action)) {
    const current = CONFIG[setting.key];
    return conn.sendMessage(m.chat, {
      text: `⚙️ *${setting.label}*\n\n`
          + `📌 *Status:* ${current ? '✅ ON' : '❌ OFF'}\n`
          + `📝 *Info:* ${setting.desc}\n\n`
          + `📌 *Usage:*\n`
          + `${pfx}settings ${settingName} on\n`
          + `${pfx}settings ${settingName} off\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  const newValue      = action === 'on';
  const oldValue      = CONFIG[setting.key];
  CONFIG[setting.key] = newValue;

  if (oldValue === newValue) {
    return conn.sendMessage(m.chat, {
      text: `ℹ️ *${setting.label}* already *${action.toUpperCase()}* ہے!\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  return conn.sendMessage(m.chat, {
    text: `╔══════════════════════════════════════╗\n`
        + `║       ⚙️  *SETTING UPDATED* ⚙️         ║\n`
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
