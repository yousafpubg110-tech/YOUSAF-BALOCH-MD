/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Settings Plugin       ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
*/

import { OWNER, CONFIG } from '../config.js';

const SETTINGS = {
  autoread: {
    label  : '📖 Auto Read Messages',
    key    : 'AUTO_READ',
    group  : 'Auto Features',
  },
  autoviewstatus: {
    label  : '👁️ Auto View Status',
    key    : 'AUTO_READ_STATUS',
    group  : 'Auto Features',
  },
  autolikestatus: {
    label  : '❤️ Auto Like Status',
    key    : 'AUTO_LIKE_STATUS',
    group  : 'Auto Features',
  },
  autoreact: {
    label  : '😊 Auto React Messages',
    key    : 'AUTO_REACT',
    group  : 'Auto Features',
  },
  antilink: {
    label  : '🔗 Anti Link',
    key    : 'ANTI_LINK',
    group  : 'Anti Features',
  },
  antibad: {
    label  : '🤬 Anti Bad Words',
    key    : 'ANTI_BAD',
    group  : 'Anti Features',
  },
  antispam: {
    label  : '🚫 Anti Spam',
    key    : 'ANTI_SPAM',
    group  : 'Anti Features',
  },
  anticall: {
    label  : '📵 Anti Call',
    key    : 'ANTI_CALL',
    group  : 'Anti Features',
  },
  antiviewonce: {
    label  : '🔒 Anti View Once',
    key    : 'ANTI_VIEW_ONCE',
    group  : 'Anti Features',
  },
  welcome: {
    label  : '👋 Welcome Message',
    key    : 'WELCOME',
    group  : 'Group Features',
  },
  goodbye: {
    label  : '🚪 Goodbye Message',
    key    : 'GOODBYE',
    group  : 'Group Features',
  },
};

let handler = async (m, { conn, usedPrefix, args, isOwner }) => {

  const pfx = usedPrefix;

  if (!args[0]) {
    const groups = {};
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (!groups[info.group]) groups[info.group] = [];
      const current = CONFIG[info.key];
      groups[info.group].push(
        `┃ ${current ? '✅' : '❌'} *${info.label}*\n┃    ${pfx}settings ${cmd} ${current ? 'off' : 'on'}`
      );
    }

    let msg = `╔══════════════════════════════════════╗\n`;
    msg    += `║     ⚙️  *BOT SETTINGS PANEL* ⚙️       ║\n`;
    msg    += `╚══════════════════════════════════════╝\n\n`;
    msg    += `👑 *Owner:* ${OWNER.FULL_NAME}\n`;
    msg    += `🤖 *Bot:* ${OWNER.BOT_NAME}\n\n`;
    msg    += `📌 *Usage:*\n`;
    msg    += `┃ ${pfx}settings <name> on\n`;
    msg    += `┃ ${pfx}settings <name> off\n\n`;

    for (const [groupName, items] of Object.entries(groups)) {
      msg += `╭━━━━『 ${groupName} 』━━━━╮\n`;
      msg += items.join('\n┃\n') + '\n';
      msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    msg += `╭━━━━『 ⚡ QUICK COMMANDS 』━━━━╮\n`;
    msg += `┃ ${pfx}settings all on   » Turn ALL on\n`;
    msg += `┃ ${pfx}settings all off  » Turn ALL off\n`;
    msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    msg += `_⚡ ${OWNER.BOT_NAME} v${OWNER.VERSION}_`;

    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  const settingName = args[0].toLowerCase();
  const action      = args[1]?.toLowerCase();

  if (settingName === 'all') {
    if (!['on', 'off'].includes(action)) {
      return conn.sendMessage(m.chat, {
        text: `❌ *Invalid Action!*\n\nUsage:\n${pfx}settings all on\n${pfx}settings all off`,
      }, { quoted: m });
    }

    const value = action === 'on';
    let changed  = [];

    for (const [cmd, info] of Object.entries(SETTINGS)) {
      CONFIG[info.key] = value;
      changed.push(`${value ? '✅' : '❌'} ${info.label}`);
    }

    const msg = `╔══════════════════════════════════════╗\n`
              + `║   ⚙️  *ALL SETTINGS ${value ? 'ENABLED' : 'DISABLED'}* ⚙️    ║\n`
              + `╚══════════════════════════════════════╝\n\n`
              + changed.join('\n')
              + `\n\n_⚡ ${OWNER.BOT_NAME} — All settings turned ${action.toUpperCase()}!_`;

    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  const setting = SETTINGS[settingName];

  if (!setting) {
    const available = Object.keys(SETTINGS).join(', ');
    return conn.sendMessage(m.chat, {
      text: `❌ *Unknown Setting:* \`${settingName}\`\n\n`
          + `📋 *Available Settings:*\n${available}\n\n`
          + `📌 *Usage:* ${pfx}settings <name> on/off\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!['on', 'off'].includes(action)) {
    const current = CONFIG[setting.key];
    return conn.sendMessage(m.chat, {
      text: `⚙️ *${setting.label}*\n\n`
          + `📌 *Current Status:* ${current ? '✅ ON' : '❌ OFF'}\n\n`
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
      text: `ℹ️ *${setting.label}* is already *${action.toUpperCase()}!*\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  const msg = `╔══════════════════════════════════════╗\n`
            + `║       ⚙️  *SETTING UPDATED* ⚙️         ║\n`
            + `╚══════════════════════════════════════╝\n\n`
            + `📌 *Setting:* ${setting.label}\n`
            + `📊 *Status:*  ${newValue ? '✅ ON' : '❌ OFF'}\n\n`
            + `_⚡ ${OWNER.BOT_NAME} — Setting updated successfully!_`;

  return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.help    = ['settings'];
handler.tags    = ['info'];
handler.command = /^(settings|setting|config)$/i;
// ✅ FIX: owner = false — سب users use کر سکتے ہیں
handler.owner   = false;

export default handler;
