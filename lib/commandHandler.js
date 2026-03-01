/*
═══════════════════════════════════════════════════
📁 LIB/COMMANDHANDLER.JS
═══════════════════════════════════════════════════
Purpose: Command Processor & Executor
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Features: Owner Lock, Cooldowns, Anti-spam
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import { getPlugin } from './pluginLoader.js';
import { isOwner, isAdmin, isBotAdmin } from './serialize.js';
import { OWNER, CONFIG } from '../config.js';

// Cooldown tracker
const cooldowns = new Map();

// Spam tracker
const spamTracker = new Map();

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
    const args = m.text.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    // Get plugin
    const plugin = getPlugin(commandName);
    if (!plugin) return;

    // ✅ FIX: sender number safely
    const senderNumber = m.sender?.replace(/[^0-9]/g, '') || '';
    const ownerCheck   = senderNumber === OWNER.NUMBER;

    // Anti-spam check
    const spamOk = await checkSpam(m.sender, m.from);
    if (!spamOk) {
      return m.reply('❌ ⏳ Cooldown! Wait 1s before using this command again.\n⚡ YOUSAF-BALOCH-MD');
    }

    // Owner-only check
    if (plugin.ownerOnly || plugin.owner) {
      if (!ownerCheck) {
        return m.reply('🔒 This command is for owner only.\n⚡ YOUSAF-BALOCH-MD');
      }
    }

    // ✅ باقی سب users کے لیے allowed — کوئی block نہیں

    // Group-only check
    if (plugin.groupOnly && !m.isGroup) {
      return m.reply('👥 This command can only be used in groups.\n⚡ YOUSAF-BALOCH-MD');
    }

    // Admin-only check
    if (plugin.adminOnly && m.isGroup) {
      const userIsAdmin = await isAdmin(sock, m.from, m.sender);
      if (!userIsAdmin && !ownerCheck) {
        return m.reply('👑 This command is for group admins only.\n⚡ YOUSAF-BALOCH-MD');
      }
    }

    // Bot admin required check
    if (plugin.botAdminRequired && m.isGroup) {
      const botIsAdmin = await isBotAdmin(sock, m.from);
      if (!botIsAdmin) {
        return m.reply('⚠️ Bot needs to be admin to use this command.\n⚡ YOUSAF-BALOCH-MD');
      }
    }

    // Cooldown check
    if (plugin.cooldown) {
      const cooldownKey  = `${m.sender}-${commandName}`;
      const cooldownTime = cooldowns.get(cooldownKey);

      if (cooldownTime && Date.now() < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - Date.now()) / 1000);
        return m.reply(`❌ ⏳ Cooldown! Wait ${remaining}s before using this command again.\n⚡ YOUSAF-BALOCH-MD`);
      }

      cooldowns.set(cooldownKey, Date.now() + plugin.cooldown * 1000);
      setTimeout(() => cooldowns.delete(cooldownKey), plugin.cooldown * 1000);
    }

    // Premium check
    if (plugin.premiumOnly) {
      const isPremiumUser = await checkPremium(m.sender);
      if (!isPremiumUser && !ownerCheck) {
        return m.reply('💎 This is a premium-only feature. Contact owner to get premium.\n⚡ YOUSAF-BALOCH-MD');
      }
    }

    // ✅ FIX: Plugin handler — correct format for all plugins
    const handlerFn = plugin.handler || plugin.execute;

    if (typeof handlerFn !== 'function') {
      console.error(`❌ Plugin "${commandName}" has no handler or execute function.`);
      return;
    }

    // ✅ FIX: Pass (m, { conn, usedPrefix, ... }) format
    try {
      await handlerFn(m, {
        conn       : sock,
        usedPrefix : prefix,
        command    : commandName,
        args       : args,
        text       : args.join(' '),
        isOwner    : ownerCheck,
        isGroup    : m.isGroup || false,
      });
    } catch (error) {
      console.error(`❌ Plugin error [${commandName}]: ${error.message}`);
      try {
        await m.reply(`❌ Error in *${commandName}*\n_${error.message}_\n⚡ YOUSAF-BALOCH-MD`);
      } catch (_) {}

      // Send error to owner
      try {
        await sock.sendMessage(OWNER.JID, {
          text: `❌ *Error in command:* ${commandName}\n\n*Error:* ${error.message}`,
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
    ownerOnly  : plugin.ownerOnly || false,
    groupOnly  : plugin.groupOnly || false,
    adminOnly  : plugin.adminOnly || false,
    cooldown   : plugin.cooldown || 0,
  };
}

export default {
  handleCommand,
  getCommandUsage,
};
