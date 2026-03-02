/*
═══════════════════════════════════════════════════
📁 LIB/COMMANDHANDLER.JS
═══════════════════════════════════════════════════
Purpose: Command Processor & Executor
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Features: Owner Lock, Deployer Level, Cooldowns, Anti-spam
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import { getPlugin } from './pluginLoader.js';
import { isAdmin, isBotAdmin } from './serialize.js';
import {
  OWNER,
  CONFIG,
  isOwner,
  isDeployer,
  getPermLevel,
  isRestrictedCommand,
} from '../config.js';

// Cooldown tracker
const cooldowns = new Map();

// Spam tracker
const spamTracker = new Map();

// ═══════════════════════════════════════════════════════════════════
//  🔐 ACCESS DENIED MESSAGE — Level 3 users ko dikhaya jata hai
// ═══════════════════════════════════════════════════════════════════

const ACCESS_DENIED_MSG = `🚫 *Access Denied!*

This command is reserved for the *Bot Admin* only.

👑 *Bot Owner:* ${OWNER.FULL_NAME}
📱 *Contact:* wa.me/${OWNER.NUMBER}

_⚡ ${OWNER.BOT_NAME}_`;

/**
 * Handle incoming commands
 */
export async function handleCommand(sock, m) {
  try {
    // Ignore if no text
    if (!m?.text) return;

    const prefix = CONFIG.PREFIX || '.';

    // Check if message starts with prefix
    if (!m.text.startsWith(prefix)) return;

    // Parse command and args
    const args        = m.text.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Get plugin
    const plugin = getPlugin(commandName);
    if (!plugin) return;

    // ═══════════════════════════════════════════════════════════════
    //  🔐 PERMISSION SYSTEM — 3 LEVELS
    //  Level 1 = Owner (Muhammad Yousaf Baloch) — full access
    //  Level 2 = Deployer (Bot Admin) — admin access
    //  Level 3 = General User — public commands only
    // ═══════════════════════════════════════════════════════════════

    const senderLevel   = getPermLevel(m.sender);   // 1, 2, or 3
    const senderIsOwner    = senderLevel === 1;      // Level 1
    const senderIsDeployer = senderLevel <= 2;       // Level 1 or 2
    const senderIsUser     = senderLevel === 3;      // Level 3 only

    // ── Anti-spam check ──
    const spamOk = await checkSpam(m.sender, m.from);
    if (!spamOk) {
      return m.reply(`❌ ⏳ Slow down! Wait before sending another command.\n_⚡ ${OWNER.BOT_NAME}_`);
    }

    // ═══════════════════════════════════════════════════════════════
    //  🔴 LEVEL 1 CHECK — Owner Only Commands
    //  Plugin flag: ownerOnly: true  OR  owner: true
    // ═══════════════════════════════════════════════════════════════

    if (plugin.ownerOnly || plugin.owner) {
      if (!senderIsOwner) {
        return m.reply(`🔒 *Owner Only Command!*\nThis command is exclusively for:\n👑 *${OWNER.FULL_NAME}*\n_⚡ ${OWNER.BOT_NAME}_`);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    //  🟡 LEVEL 2 CHECK — Deployer/Bot Admin Commands
    //  Plugin flag: deployerOnly: true  OR  botAdmin: true
    //  Also applies to ALL restricted commands from config.js
    // ═══════════════════════════════════════════════════════════════

    const isPluginDeployerOnly = plugin.deployerOnly || plugin.botAdmin || plugin.adminOnly === 'deployer';
    const isCommandRestricted  = isRestrictedCommand(commandName);

    if (isPluginDeployerOnly || isCommandRestricted) {
      if (!senderIsDeployer) {
        // ✅ Send Access Denied — or stay silent (your choice)
        // Option A: Reply with message (uncomment below)
        return m.reply(ACCESS_DENIED_MSG);

        // Option B: Silent — just ignore (comment the above, uncomment below)
        // return;
      }
    }

    // ═══════════════════════════════════════════════════════════════
    //  🟢 LEVEL 3 — General Users
    //  All other commands are allowed by default
    //  (Public commands: video, audio, sticker, tagall, hidetag, etc.)
    // ═══════════════════════════════════════════════════════════════

    // Group-only check
    if (plugin.groupOnly && !m.isGroup) {
      return m.reply(`👥 This command can only be used in groups.\n_⚡ ${OWNER.BOT_NAME}_`);
    }

    // Group admin check (WhatsApp group admin — NOT bot deployer)
    if (plugin.groupAdmin && m.isGroup) {
      const userIsGroupAdmin = await isAdmin(sock, m.from, m.sender);
      if (!userIsGroupAdmin && !senderIsDeployer) {
        return m.reply(`👑 This command is for group admins only.\n_⚡ ${OWNER.BOT_NAME}_`);
      }
    }

    // Bot admin required check
    if (plugin.botAdminRequired && m.isGroup) {
      const botIsAdmin = await isBotAdmin(sock, m.from);
      if (!botIsAdmin) {
        return m.reply(`⚠️ Bot needs to be admin to use this command.\n_⚡ ${OWNER.BOT_NAME}_`);
      }
    }

    // Cooldown check
    if (plugin.cooldown) {
      const cooldownKey  = `${m.sender}-${commandName}`;
      const cooldownTime = cooldowns.get(cooldownKey);

      if (cooldownTime && Date.now() < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - Date.now()) / 1000);
        return m.reply(`❌ ⏳ Cooldown! Wait *${remaining}s* before using this command again.\n_⚡ ${OWNER.BOT_NAME}_`);
      }

      cooldowns.set(cooldownKey, Date.now() + plugin.cooldown * 1000);
      setTimeout(() => cooldowns.delete(cooldownKey), plugin.cooldown * 1000);
    }

    // Premium check
    if (plugin.premiumOnly) {
      const isPremiumUser = await checkPremium(m.sender);
      if (!isPremiumUser && !senderIsOwner) {
        return m.reply(`💎 This is a premium-only feature. Contact owner to get premium.\n_⚡ ${OWNER.BOT_NAME}_`);
      }
    }

    // ✅ Execute plugin
    const handlerFn = plugin.handler || plugin.execute;

    if (typeof handlerFn !== 'function') {
      console.error(`❌ Plugin "${commandName}" has no handler or execute function.`);
      return;
    }

    try {
      await handlerFn(m, {
        conn       : sock,
        usedPrefix : prefix,
        command    : commandName,
        args       : args,
        text       : args.join(' '),

        // ✅ Permission flags passed to plugin
        isOwner    : senderIsOwner,
        isDeployer : senderIsDeployer,
        isUser     : senderIsUser,
        permLevel  : senderLevel,

        isGroup    : m.isGroup || false,
      });
    } catch (error) {
      console.error(`❌ Plugin error [${commandName}]: ${error.message}`);
      try {
        await m.reply(`❌ Error in *${commandName}*\n_${error.message}_\n_⚡ ${OWNER.BOT_NAME}_`);
      } catch (_) {}

      // Send error to owner
      try {
        await sock.sendMessage(OWNER.JID, {
          text: `❌ *Error in command:* ${commandName}\n\n*Sender:* ${m.sender}\n*Error:* ${error.message}`,
        });
      } catch (_) {}
    }

  } catch (error) {
    console.error('❌ Command handler error:', error.message);
  }
}

/**
 * Check spam (max 5 commands per 5 seconds)
 */
async function checkSpam(sender, chatId) {
  const key  = `${sender}-${chatId}`;
  const now  = Date.now();

  if (!spamTracker.has(key)) spamTracker.set(key, []);

  const timestamps = spamTracker.get(key);
  const recent     = timestamps.filter(t => now - t < 5000);

  if (recent.length >= 5) return false;

  recent.push(now);
  spamTracker.set(key, recent);

  setTimeout(() => {
    const current = spamTracker.get(key) || [];
    spamTracker.set(key, current.filter(t => Date.now() - t < 5000));
  }, 5000);

  return true;
}

/**
 * Check if user is premium
 */
async function checkPremium(userId) {
  return false;
}

/**
 * Get command usage info
 */
export function getCommandUsage(commandName) {
  const plugin = getPlugin(commandName);
  if (!plugin) return null;

  return {
    command    : plugin.command,
    description: plugin.description || 'No description',
    usage      : plugin.usage || `${CONFIG.PREFIX}${plugin.command}`,
    category   : plugin.category || 'General',
    ownerOnly  : plugin.ownerOnly    || false,
    deployerOnly: plugin.deployerOnly || isRestrictedCommand(commandName),
    groupOnly  : plugin.groupOnly    || false,
    cooldown   : plugin.cooldown     || 0,
  };
}

export default {
  handleCommand,
  getCommandUsage,
};
