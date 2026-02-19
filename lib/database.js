/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Database System   ┃
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
const dataPath = path.join(__dirname, '../database');

// FIX: try-catch added — crash nahi hoga agar folder na bane
try {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
} catch (err) {
  console.error('❌ Could not create database directory:', err.message);
}

class Database {
  constructor(filename) {
    this.filepath = path.join(dataPath, `${filename}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const raw = fs.readFileSync(this.filepath, 'utf-8');
        // FIX: Empty file check — JSON.parse('') crash karta tha
        if (!raw.trim()) return {};
        return JSON.parse(raw);
      }
      return {};
    } catch (error) {
      console.error(`❌ Error loading database ${this.filepath}:`, error.message);
      // FIX: Corrupted file backup — data loss se bachao
      try {
        const backupPath = this.filepath + '.backup';
        if (fs.existsSync(this.filepath)) {
          fs.copyFileSync(this.filepath, backupPath);
          console.warn(`⚠️  Corrupted DB backed up to: ${backupPath}`);
        }
      } catch (_) {}
      return {};
    }
  }

  save() {
    try {
      // FIX: Write to temp file first, then rename — safe write
      const tempPath = this.filepath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filepath);
      return true;
    } catch (error) {
      console.error(`❌ Error saving database ${this.filepath}:`, error.message);
      return false;
    }
  }

  get(key) {
    return this.data[key] ?? null;
  }

  set(key, value) {
    this.data[key] = value;
    return this.save();
  }

  delete(key) {
    delete this.data[key];
    return this.save();
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  all() {
    return { ...this.data };
  }

  clear() {
    this.data = {};
    return this.save();
  }

  size() {
    return Object.keys(this.data).length;
  }

  keys() {
    return Object.keys(this.data);
  }

  values() {
    return Object.values(this.data);
  }

  entries() {
    return Object.entries(this.data);
  }

  // User-specific methods
  getUser(userId) {
    return this.get(userId) || {
      banned: false,
      warnings: 0,
      premium: false,
      registered: false,
      createdAt: Date.now(),
    };
  }

  updateUser(userId, updates) {
    const user = this.getUser(userId);
    return this.set(userId, { ...user, ...updates, updatedAt: Date.now() });
  }

  banUser(userId, reason = '') {
    return this.updateUser(userId, { banned: true, banReason: reason, bannedAt: Date.now() });
  }

  unbanUser(userId) {
    return this.updateUser(userId, { banned: false, banReason: '', bannedAt: null });
  }

  isBanned(userId) {
    return this.getUser(userId).banned || false;
  }

  isPremium(userId) {
    return this.getUser(userId).premium || false;
  }

  addWarning(userId) {
    const user = this.getUser(userId);
    return this.updateUser(userId, { warnings: (user.warnings || 0) + 1 });
  }

  resetWarnings(userId) {
    return this.updateUser(userId, { warnings: 0 });
  }

  // Group-specific methods
  getGroup(groupId) {
    return this.get(groupId) || {
      antilink: false,
      welcome: true,
      goodbye: true,
      muted: false,
      antidelete: false,
      autodl: false,
      antispam: false,
      antibot: false,
      createdAt: Date.now(),
    };
  }

  updateGroup(groupId, updates) {
    const group = this.getGroup(groupId);
    return this.set(groupId, { ...group, ...updates, updatedAt: Date.now() });
  }
}

// Export database instances
export const userDb = new Database('users');
export const groupDb = new Database('groups');
export const settingsDb = new Database('settings');
export const economyDb = new Database('economy');
export const tempDb = new Database('temp');

export default Database;
