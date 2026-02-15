/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Command Handler   ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.cooldowns = new Map();
  }

  // Register a command
  register(command) {
    if (!command.name) {
      throw new Error('Command must have a name');
    }

    this.commands.set(command.name.toLowerCase(), command);

    // Register aliases
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
      });
    }

    return true;
  }

  // Get command
  get(name) {
    name = name.toLowerCase();
    return this.commands.get(name) || this.commands.get(this.aliases.get(name));
  }

  // Check if command exists
  has(name) {
    name = name.toLowerCase();
    return this.commands.has(name) || this.aliases.has(name);
  }

  // Get all commands
  all() {
    return Array.from(this.commands.values());
  }

  // Get commands by category
  getByCategory(category) {
    return this.all().filter(cmd => cmd.category === category);
  }

  // Load plugins from directory
  async loadPlugins(dir = path.join(__dirname, '../plugins')) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      return;
    }

    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (const file of files) {
      try {
        const filePath = path.join(dir, file);
        const module = await import(`file://${filePath}?update=${Date.now()}`);
        
        if (module.default) {
          const command = module.default;
          
          // Validate command structure
          if (command.name && typeof command.execute === 'function') {
            this.register(command);
            console.log(`✅ Loaded plugin: ${command.name}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error loading plugin ${file}:`, error);
      }
    }

    console.log(`\n📦 Total plugins loaded: ${this.commands.size}\n`);
  }

  // Check cooldown
  checkCooldown(userId, commandName, cooldownTime = 3000) {
    const now = Date.now();
    const cooldownKey = `${userId}-${commandName}`;

    if (this.cooldowns.has(cooldownKey)) {
      const expirationTime = this.cooldowns.get(cooldownKey) + cooldownTime;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return { 
          onCooldown: true, 
          timeLeft: timeLeft.toFixed(1) 
        };
      }
    }

    this.cooldowns.set(cooldownKey, now);
    return { onCooldown: false };
  }

  // Execute command
  async execute(msg, args, prefix) {
    const commandName = args[0].toLowerCase();
    const command = this.get(commandName);

    if (!command) return false;

    // Check if owner only
    if (command.ownerOnly && !msg.isOwner()) {
      await msg.reply('❌ This command is only for the bot owner!');
      return true;
    }

    // Check if group only
    if (command.groupOnly && !msg.isGroup) {
      await msg.reply('❌ This command can only be used in groups!');
      return true;
    }

    // Check if admin only
    if (command.adminOnly && !(await msg.isAdmin())) {
      await msg.reply('❌ This command is only for group admins!');
      return true;
    }

    // Check if bot admin required
    if (command.botAdminRequired && !(await msg.isBotAdmin())) {
      await msg.reply('❌ I need to be a group admin to use this command!');
      return true;
    }

    // Check cooldown
    if (command.cooldown) {
      const cooldownCheck = this.checkCooldown(msg.sender, commandName, command.cooldown);
      if (cooldownCheck.onCooldown) {
        await msg.reply(`⏱️ Please wait ${cooldownCheck.timeLeft} seconds before using this command again!`);
        return true;
      }
    }

    // Execute command
    try {
      await command.execute(msg, args.slice(1), prefix);
      return true;
    } catch (error) {
      console.error(`❌ Error executing command ${commandName}:`, error);
      await msg.reply(`❌ Error executing command: ${error.message}`);
      return true;
    }
  }

  // Reload a plugin
  async reload(commandName) {
    const command = this.get(commandName);
    if (!command) return false;

    // Remove from maps
    this.commands.delete(command.name.toLowerCase());
    if (command.aliases) {
      command.aliases.forEach(alias => {
        this.aliases.delete(alias.toLowerCase());
      });
    }

    // Reload
    const pluginsDir = path.join(__dirname, '../plugins');
    const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    for (const file of files) {
      const filePath = path.join(pluginsDir, file);
      const module = await import(`file://${filePath}?update=${Date.now()}`);
      
      if (module.default && module.default.name === commandName) {
        this.register(module.default);
        return true;
      }
    }

    return false;
  }
}

export default new CommandHandler();
