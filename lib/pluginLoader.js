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
import { SYSTEM } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginsPath = path.join(__dirname, '..', SYSTEM.PLUGINS_DIR);

export const plugins = new Map();

/**
 * Load all plugins from plugins folder
 */
export async function loadPlugins() {
  if (!fs.existsSync(pluginsPath)) {
    console.warn('⚠️  Plugins folder not found! Creating...');
    try {
      fs.mkdirSync(pluginsPath, { recursive: true });
    } catch (err) {
      console.error('❌ Could not create plugins folder:', err.message);
      return plugins;
    }
  }

  const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

  if (files.length === 0) {
    console.warn('⚠️  No plugin files found in plugins/ folder.');
    return plugins;
  }

  let loadedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(pluginsPath, file);
      const plugin = await import(`file://${filePath}`);

      const pluginData = plugin.default || plugin;

      // FIX: handler OR execute — both accepted
      const hasHandler = typeof pluginData.handler === 'function' || typeof pluginData.execute === 'function';

      if (!pluginData.command || !hasHandler) {
        console.warn(`⚠️  Skipping ${file} — missing command or handler/execute`);
        errorCount++;
        continue;
      }

      const commands = Array.isArray(pluginData.command)
        ? pluginData.command
        : [pluginData.command];

      for (const cmd of commands) {
        plugins.set(cmd.toLowerCase(), {
          ...pluginData,
          // FIX: handler normalize — always use handler key
          handler: pluginData.handler || pluginData.execute,
          file,
          command: cmd,
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

    // FIX: require.cache removed — ES modules use cache-bust via timestamp
    const plugin = await import(`file://${filePath}?update=${Date.now()}`);
    const pluginData = plugin.default || plugin;

    const hasHandler = typeof pluginData.handler === 'function' || typeof pluginData.execute === 'function';

    if (!pluginData.command || !hasHandler) {
      return { success: false, message: 'Plugin missing command or handler' };
    }

    // Remove old commands for this file
    for (const [key, value] of plugins.entries()) {
      if (value.file === pluginName) {
        plugins.delete(key);
      }
    }

    const commands = Array.isArray(pluginData.command)
      ? pluginData.command
      : [pluginData.command];

    for (const cmd of commands) {
      plugins.set(cmd.toLowerCase(), {
        ...pluginData,
        handler: pluginData.handler || pluginData.execute,
        file: pluginName,
        command: cmd,
      });
    }

    return { success: true, message: `Plugin ${pluginName} reloaded successfully` };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * Get plugin by command
 */
export function getPlugin(command) {
  if (!command) return null;
  return plugins.get(command.toLowerCase()) || null;
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
    if (plugin.category) categories.add(plugin.category);
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
  getCategories,
};
