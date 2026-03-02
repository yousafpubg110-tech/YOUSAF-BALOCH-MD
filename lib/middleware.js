/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Middleware Manager    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER } from '../config.js';

// ✅ صرف یہ commands owner-only رہیں گے — باقی سب users کے لیے open
const TRULY_OWNER_ONLY = [
  'eval', 'restart', 'shutdown', 'broadcast', 'bc',
  'ban', 'unban', 'block', 'unblock', 'join', 'leave',
  'backup', 'update',
];

let bannedUsers = new Map();
try {
  const banModule = await import('../plugins/owner-ban.js');
  bannedUsers     = banModule.bannedUsers || new Map();
} catch (_) {}

const spamTracker = new Map();
const SPAM_LIMIT  = parseInt(process.env.ANTI_SPAM_LIMIT) || 5;
const SPAM_WINDOW = 5000;

const rateLimits  = new Map();
const RATE_WINDOW = 60000;
const RATE_MAX    = 30;

const ALLOW  = { pass: true };
const BLOCK  = (reason) => ({ pass: false, reason });

export function banCheck(sender) {
  if (!sender) return ALLOW;
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  if (bannedUsers.has(sender)) {
    const data = bannedUsers.get(sender);
    return BLOCK(`You are banned from using ${OWNER.BOT_NAME}!\nReason: ${data.reason}\nContact owner: +${OWNER.NUMBER}`);
  }
  return ALLOW;
}

export function spamCheck(sender) {
  if (!sender) return ALLOW;
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const now    = Date.now();
  const record = spamTracker.get(sender) || { count: 0, windowStart: now };
  if (now - record.windowStart > SPAM_WINDOW) {
    spamTracker.set(sender, { count: 1, windowStart: now });
    return ALLOW;
  }
  record.count++;
  spamTracker.set(sender, record);
  if (record.count > SPAM_LIMIT) {
    return BLOCK(`Too many messages! Slow down.\nWait ${Math.ceil(SPAM_WINDOW / 1000)} seconds.`);
  }
  return ALLOW;
}

export function rateLimitCheck(sender) {
  if (!sender) return ALLOW;
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const now    = Date.now();
  const record = rateLimits.get(sender) || { count: 0, resetAt: now + RATE_WINDOW };
  if (now > record.resetAt) {
    rateLimits.set(sender, { count: 1, resetAt: now + RATE_WINDOW });
    return ALLOW;
  }
  record.count++;
  rateLimits.set(sender, record);
  if (record.count > RATE_MAX) {
    const waitSec = Math.ceil((record.resetAt - now) / 1000);
    return BLOCK(`Rate limit reached! Wait ${waitSec} seconds.`);
  }
  return ALLOW;
}

export function ownerCheck(sender) {
  if (!sender) return BLOCK('Unknown sender!');
  return sender.split('@')[0] === OWNER.NUMBER
    ? ALLOW
    : BLOCK(`This command is for *Owner* only!\n👑 ${OWNER.FULL_NAME}\n📱 +${OWNER.NUMBER}`);
}

export function adminCheck(sender, groupMetadata) {
  if (!sender || !groupMetadata) return BLOCK('Could not verify admin status!');
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const participants = groupMetadata.participants || [];
  const me           = participants.find(p => p.id === sender);
  if (!me) return BLOCK('You are not in this group!');
  const isAdmin = me.admin === 'admin' || me.admin === 'superadmin';
  return isAdmin ? ALLOW : BLOCK('This command is for *Admins* only! 🛡️');
}

export function botAdminCheck(botId, groupMetadata) {
  if (!botId || !groupMetadata) return false;
  const participants = groupMetadata.participants || [];
  const bot          = participants.find(p => p.id === botId);
  if (!bot) return false;
  return bot.admin === 'admin' || bot.admin === 'superadmin';
}

export function groupOnly(from) {
  return from?.endsWith('@g.us')
    ? ALLOW
    : BLOCK('This command only works in *Groups!*');
}

export function privateOnly(from) {
  return from?.endsWith('@s.whatsapp.net')
    ? ALLOW
    : BLOCK('This command only works in *Private Chat!*');
}

const cooldowns = new Map();

export function cooldownCheck(sender, command, seconds) {
  if (!sender || !command) return ALLOW;
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const key      = `${sender}:${command}`;
  const now      = Date.now();
  const expireAt = cooldowns.get(key) || 0;
  if (now < expireAt) {
    const remaining = Math.ceil((expireAt - now) / 1000);
    return BLOCK(`⏳ Cooldown! Wait *${remaining}s* before using this command again.`);
  }
  cooldowns.set(key, now + seconds * 1000);
  return ALLOW;
}

export async function runMiddleware(ctx) {
  const {
    sender,
    from,
    command,
    cooldown         = parseInt(process.env.COOLDOWN_DEFAULT) || 3,
    ownerOnly        = false,
    adminOnly        = false,
    groupOnlyCmd     = false,
    privateOnlyCmd   = false,
    botAdminRequired = false,
    groupMetadata    = null,
    botId            = null,
  } = ctx;

  // 1 — Ban check
  const banResult = banCheck(sender);
  if (!banResult.pass) return banResult;

  // 2 — Spam check
  if (process.env.ANTI_SPAM === 'true') {
    const spamResult = spamCheck(sender);
    if (!spamResult.pass) return spamResult;
  }

  // 3 — Rate limit
  const rateResult = rateLimitCheck(sender);
  if (!rateResult.pass) return rateResult;

  // ✅ FIX: صرف TRULY_OWNER_ONLY list والی commands lock ہوں گی
  // باقی سب commands users کے لیے open ہیں
  const isReallyOwnerOnly = TRULY_OWNER_ONLY.includes(command?.toLowerCase());
  if (isReallyOwnerOnly) {
    const ownerResult = ownerCheck(sender);
    if (!ownerResult.pass) return ownerResult;
  }

  // 4 — Group only
  if (groupOnlyCmd) {
    const groupResult = groupOnly(from);
    if (!groupResult.pass) return groupResult;
  }

  // 5 — Private only
  if (privateOnlyCmd) {
    const privateResult = privateOnly(from);
    if (!privateResult.pass) return privateResult;
  }

  // 6 — Admin check (group admins only)
  if (adminOnly && groupMetadata) {
    const adminResult = adminCheck(sender, groupMetadata);
    if (!adminResult.pass) return adminResult;
  }

  // 7 — Bot admin check
  if (botAdminRequired && groupMetadata && botId) {
    const isBotAdmin = botAdminCheck(botId, groupMetadata);
    if (!isBotAdmin) {
      return BLOCK('Bot must be *Admin* to use this command!');
    }
  }

  // 8 — Cooldown check
  if (cooldown > 0) {
    const cdResult = cooldownCheck(sender, command, cooldown);
    if (!cdResult.pass) return cdResult;
  }

  return ALLOW;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimits) { if (now > val.resetAt) rateLimits.delete(key); }
  for (const [key, expireAt] of cooldowns) { if (now > expireAt) cooldowns.delete(key); }
  for (const [key, val] of spamTracker) { if (now - val.windowStart > SPAM_WINDOW * 10) spamTracker.delete(key); }
}, 5 * 60 * 1000);

export default {
  banCheck, spamCheck, rateLimitCheck, ownerCheck,
  adminCheck, botAdminCheck, groupOnly, privateOnly,
  cooldownCheck, runMiddleware,
};
