/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Middleware Manager    ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER } from '../config.js';

const TRULY_OWNER_ONLY = [
  'eval', 'restart', 'shutdown', 'broadcast', 'bc',
  'ban', 'unban', 'block', 'unblock', 'join', 'leave',
  'backup', 'update',
];

// FIX: top-level await ہٹایا — lazy loading سے replace کیا
let bannedUsers = null;

async function getBannedUsers() {
  if (bannedUsers !== null) return bannedUsers;
  try {
    const banModule = await import('../plugins/owner-ban.js');
    bannedUsers = banModule.bannedUsers || new Map();
  } catch (_) {
    bannedUsers = new Map();
  }
  return bannedUsers;
}

const spamTracker = new Map();
const SPAM_LIMIT  = parseInt(process.env.ANTI_SPAM_LIMIT) || 5;
const SPAM_WINDOW = 5000;

const rateLimits  = new Map();
const RATE_WINDOW = 60000;
const RATE_MAX    = 30;

const ALLOW = { pass: true };
const BLOCK = (reason) => ({ pass: false, reason });

export async function banCheck(sender) {
  if (!sender) return ALLOW;
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const banned = await getBannedUsers();
  if (banned.has(sender)) {
    const data = banned.get(sender);
    return BLOCK(`You are banned!\nReason: ${data.reason}\nContact: +${OWNER.NUMBER}`);
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
  if (record.count > SPAM_LIMIT)
    return BLOCK(`Too many messages! Wait ${Math.ceil(SPAM_WINDOW / 1000)}s.`);
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
    return BLOCK(`Rate limit reached! Wait ${waitSec}s.`);
  }
  return ALLOW;
}

export function ownerCheck(sender) {
  if (!sender) return BLOCK('Unknown sender!');
  return sender.split('@')[0] === OWNER.NUMBER
    ? ALLOW
    : BLOCK(`Owner only!\n👑 ${OWNER.FULL_NAME}\n📱 +${OWNER.NUMBER}`);
}

export function adminCheck(sender, groupMetadata) {
  if (!sender || !groupMetadata) return BLOCK('Could not verify admin status!');
  if (sender.split('@')[0] === OWNER.NUMBER) return ALLOW;
  const me = (groupMetadata.participants || []).find(p => p.id === sender);
  if (!me) return BLOCK('You are not in this group!');
  return (me.admin === 'admin' || me.admin === 'superadmin')
    ? ALLOW
    : BLOCK('Admins only! 🛡️');
}

export function botAdminCheck(botId, groupMetadata) {
  if (!botId || !groupMetadata) return false;
  const bot = (groupMetadata.participants || []).find(p => p.id === botId);
  if (!bot) return false;
  return bot.admin === 'admin' || bot.admin === 'superadmin';
}

export function groupOnly(from) {
  return from?.endsWith('@g.us') ? ALLOW : BLOCK('Groups only!');
}

export function privateOnly(from) {
  return from?.endsWith('@s.whatsapp.net') ? ALLOW : BLOCK('Private chat only!');
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
    return BLOCK(`⏳ Wait *${remaining}s* before using this again.`);
  }
  cooldowns.set(key, now + seconds * 1000);
  return ALLOW;
}

export async function runMiddleware(ctx) {
  const {
    sender, from, command,
    cooldown         = parseInt(process.env.COOLDOWN_DEFAULT) || 3,
    ownerOnly        = false,
    adminOnly        = false,
    groupOnlyCmd     = false,
    privateOnlyCmd   = false,
    botAdminRequired = false,
    groupMetadata    = null,
    botId            = null,
  } = ctx;

  const banResult = await banCheck(sender);
  if (!banResult.pass) return banResult;

  if (process.env.ANTI_SPAM === 'true') {
    const spamResult = spamCheck(sender);
    if (!spamResult.pass) return spamResult;
  }

  const rateResult = rateLimitCheck(sender);
  if (!rateResult.pass) return rateResult;

  if (TRULY_OWNER_ONLY.includes(command?.toLowerCase())) {
    const ownerResult = ownerCheck(sender);
    if (!ownerResult.pass) return ownerResult;
  }

  if (groupOnlyCmd) {
    const r = groupOnly(from);
    if (!r.pass) return r;
  }

  if (privateOnlyCmd) {
    const r = privateOnly(from);
    if (!r.pass) return r;
  }

  if (adminOnly && groupMetadata) {
    const r = adminCheck(sender, groupMetadata);
    if (!r.pass) return r;
  }

  if (botAdminRequired && groupMetadata && botId) {
    if (!botAdminCheck(botId, groupMetadata))
      return BLOCK('Bot must be *Admin* to use this!');
  }

  if (cooldown > 0) {
    const r = cooldownCheck(sender, command, cooldown);
    if (!r.pass) return r;
  }

  return ALLOW;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimits) { if (now > v.resetAt) rateLimits.delete(k); }
  for (const [k, v] of cooldowns)  { if (now > v) cooldowns.delete(k); }
  for (const [k, v] of spamTracker){ if (now - v.windowStart > SPAM_WINDOW * 10) spamTracker.delete(k); }
}, 5 * 60 * 1000);

export default {
  banCheck, spamCheck, rateLimitCheck, ownerCheck,
  adminCheck, botAdminCheck, groupOnly, privateOnly,
  cooldownCheck, runMiddleware,
};
