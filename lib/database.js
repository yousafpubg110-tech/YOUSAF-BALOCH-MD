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

// Ensure database directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

class Database {
  constructor(filename) {
    this.filepath = path.join(dataPath, `${filename}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const data = fs.readFileSync(this.filepath, 'utf-8');
        return JSON.parse(data);
      }
      return {};
    } catch (error) {
      console.error(`❌ Error loading database ${this.filepath}:`, error);
      return {};
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`❌ Error saving database ${this.filepath}:`, error);
      return false;
    }
  }

  get(key) {
    return this.data[key];
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
    return key in this.data;
  }

  all() {
    return this.data;
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
      registered: false
    };
  }

  updateUser(userId, updates) {
    const user = this.getUser(userId);
    this.set(userId, { ...user, ...updates });
  }

  banUser(userId) {
    this.updateUser(userId, { banned: true });
  }

  unbanUser(userId) {
    this.updateUser(userId, { banned: false });
  }

  isBanned(userId) {
    return this.getUser(userId).banned || false;
  }

  isPremium(userId) {
    return this.getUser(userId).premium || false;
  }

  // Group-specific methods
  getGroup(groupId) {
    return this.get(groupId) || { 
      antilink: false, 
      welcome: true, 
      goodbye: true,
      muted: false,
      antidelete: false,
      autodl: false
    };
  }

  updateGroup(groupId, updates) {
    const group = this.getGroup(groupId);
    this.set(groupId, { ...group, ...updates });
  }
}

// Export database instances
export const userDb = new Database('users');
export const groupDb = new Database('groups');
export const settingsDb = new Database('settings');
export const economyDb = new Database('economy');
export const tempDb = new Database('temp');

export default Database;
