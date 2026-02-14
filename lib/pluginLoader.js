/*
═══════════════════════════════════════════════════
📁 LIB/PLUGINLOADER.JS
═══════════════════════════════════════════════════
Purpose: Auto-load All Plugins from plugins/ Folder
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginsPath = path.join(__dirname, '../plugins');

export const plugins = new Map();

/**
 * Load all plugins from plugins folder
 */
export async function loadPlugins() {
  if (!fs.existsSync(pluginsPath)) {
    console.error('Plugins folder not found!');
    return;
  }

  const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
  
  let loadedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(pluginsPath, file);
      const plugin = await import(`file://${filePath}`);
      
      // Validate plugin structure
      if (!plugin.default && !plugin.command) {
        console.warn(`⚠️  Plugin ${file} has no default export or command`);
        continue;
      }

      const pluginData = plugin.default || plugin;
      
      // Required fields
      if (!pluginData.command || !pluginData.execute) {
        console.warn(`⚠️  Plugin ${file} missing required fields (command or execute)`);
        continue;
      }

      // Store plugin
      const commands = Array.isArray(pluginData.command) 
        ? pluginData.command 
        : [pluginData.command];

      for (const cmd of commands) {
        plugins.set(cmd.toLowerCase(), {
          ...pluginData,
          file,
          command: cmd
        });
      }

      loadedCount++;
      console.log(`✅ Loaded: ${file}`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Error loading ${file}:`, error.message);
    }
  }

  console.log(`\n📊 Plugin Loading Summary:`);
  console.log(`✅ Loaded: ${loadedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📦 Total Commands: ${plugins.size}\n`);
  
  return plugins;
}

/**
 * Reload a specific plugin
 */
export async function reloadPlugin(pluginName) {
  try {
    const filePath = path.join(pluginsPath, pluginName);
    
    if (!fs.existsSync(filePath)) {
      return { success: false, message: 'Plugin file not found' };
    }

    // Delete from cache
    delete require.cache[require.resolve(filePath)];
    
    // Reload
    const plugin = await import(`file://${filePath}?update=${Date.now()}`);
    const pluginData = plugin.default || plugin;
    
    const commands = Array.isArray(pluginData.command) 
      ? pluginData.command 
      : [pluginData.command];

    // Remove old commands
    for (const [key, value] of plugins.entries()) {
      if (value.file === pluginName) {
        plugins.delete(key);
      }
    }

    // Add new commands
    for (const cmd of commands) {
      plugins.set(cmd.toLowerCase(), {
        ...pluginData,
        file: pluginName,
        command: cmd
      });
    }

    return { success: true, message: 'Plugin reloaded successfully' };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Get plugin by command
 */
export function getPlugin(command) {
  return plugins.get(command.toLowerCase());
}

/**
 * Get all plugins
 */
export function getAllPlugins() {
  return Array.from(plugins.values());
}

/**
 * Get plugins by category
 */
export function getPluginsByCategory(category) {
  return Array.from(plugins.values()).filter(p => p.category === category);
}

/**
 * Get plugin categories
 */
export function getCategories() {
  const categories = new Set();
  for (const plugin of plugins.values()) {
    if (plugin.category) {
      categories.add(plugin.category);
    }
  }
  return Array.from(categories);
}

export default {
  plugins,
  loadPlugins,
  reloadPlugin,
  getPlugin,
  getAllPlugins,
  getPluginsByCategory,
  getCategories
};
      
