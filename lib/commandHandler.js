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
import config from '../config.js';

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
    if (!m.text) return;

    // Get prefix from config
    const prefix = config.PREFIX || '.';
    
    // Check if message starts with prefix
    if (!m.text.startsWith(prefix)) return;

    // Parse command and args
    const args = m.text.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // Get plugin
    const plugin = getPlugin(commandName);
    
    if (!plugin) return; // Command not found

    // Anti-spam check
    if (!await checkSpam(m.sender, m.from)) {
      return m.reply('⚠️ Please wait before using another command.');
    }

    // Owner-only commands check
    if (plugin.ownerOnly) {
      const ownerNumbers = Array.isArray(config.OWNER_NUMBER) 
        ? config.OWNER_NUMBER 
        : [config.OWNER_NUMBER];
        
      if (!isOwner(m.sender, ownerNumbers)) {
        return m.reply('🔒 This command is locked for owner only.');
      }
    }

    // Group-only commands check
    if (plugin.groupOnly && !m.isGroup) {
      return m.reply('👥 This command can only be used in groups.');
    }

    // Admin-only commands check (in groups)
    if (plugin.adminOnly && m.isGroup) {
      const userIsAdmin = await isAdmin(sock, m.from, m.sender);
      
      if (!userIsAdmin) {
        return m.reply('👑 This command is for group admins only.');
      }
    }

    // Bot admin required check
    if (plugin.botAdminRequired && m.isGroup) {
      const botIsAdmin = await isBotAdmin(sock, m.from);
      
      if (!botIsAdmin) {
        return m.reply('⚠️ Bot needs to be admin to use this command.');
      }
    }

    // Cooldown check
    if (plugin.cooldown) {
      const cooldownKey = `${m.sender}-${commandName}`;
      const cooldownTime = cooldowns.get(cooldownKey);
      
      if (cooldownTime && Date.now() < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - Date.now()) / 1000);
        return m.reply(`⏳ Please wait ${remaining} seconds before using this command again.`);
      }
      
      cooldowns.set(cooldownKey, Date.now() + (plugin.cooldown * 1000));
      
      // Auto-delete cooldown after expiry
      setTimeout(() => cooldowns.delete(cooldownKey), plugin.cooldown * 1000);
    }

    // Premium-only commands check (if you have premium system)
    if (plugin.premiumOnly && config.PREMIUM_ENABLED) {
      const isPremiumUser = await checkPremium(m.sender);
      
      if (!isPremiumUser && !isOwner(m.sender, config.OWNER_NUMBER)) {
        return m.reply('💎 This is a premium-only feature. Contact owner to get premium.');
      }
    }

    // React to command (optional)
    if (config.AUTO_REACT) {
      await m.react('⏳');
    }

    // Execute plugin
    try {
      await plugin.execute(sock, m, args);
      
      // Success react (optional)
      if (config.AUTO_REACT) {
        await m.react('✅');
      }
      
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      
      // Error react
      if (config.AUTO_REACT) {
        await m.react('❌');
      }
      
      // Send error message to user
      if (config.SEND_ERROR_MESSAGES) {
        await m.reply(`❌ Error executing command: ${error.message}`);
      }
      
      // Send detailed error to owner
      if (config.SEND_ERROR_TO_OWNER) {
        const ownerJid = `${config.OWNER_NUMBER[0]}@s.whatsapp.net`;
        await sock.sendMessage(ownerJid, {
          text: `❌ Error in ${commandName}:\n\n${error.stack}`
        });
      }
    }

  } catch (error) {
    console.error('Command handler error:', error);
  }
}

/**
 * Check spam (max 3 commands per 5 seconds)
 */
async function checkSpam(sender, chatId) {
  const key = `${sender}-${chatId}`;
  const now = Date.now();
  
  if (!spamTracker.has(key)) {
    spamTracker.set(key, []);
  }
  
  const timestamps = spamTracker.get(key);
  
  // Remove timestamps older than 5 seconds
  const recent = timestamps.filter(t => now - t < 5000);
  
  if (recent.length >= 3) {
    return false; // Spam detected
  }
  
  recent.push(now);
  spamTracker.set(key, recent);
  
  // Clean up old entries
  setTimeout(() => {
    const current = spamTracker.get(key) || [];
    spamTracker.set(key, current.filter(t => now - t < 5000));
  }, 5000);
  
  return true;
}

/**
 * Check if user is premium (placeholder - implement your logic)
 */
async function checkPremium(userId) {
  // TODO: Implement premium check from database
  // Example:
  // const user = await database.getUser(userId);
  // return user?.premium === true;
  
  return false;
}

/**
 * Get command usage
 */
export function getCommandUsage(commandName) {
  const plugin = getPlugin(commandName);
  
  if (!plugin) return null;
  
  return {
    command: plugin.command,
    description: plugin.description || 'No description',
    usage: plugin.usage || `${config.PREFIX}${plugin.command}`,
    category: plugin.category || 'General',
    ownerOnly: plugin.ownerOnly || false,
    groupOnly: plugin.groupOnly || false,
    adminOnly: plugin.adminOnly || false,
    cooldown: plugin.cooldown || 0
  };
}

export default {
  handleCommand,
  getCommandUsage
};
        
