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

✅ UPDATED: MongoDB optional — JSON auto fallback
✅ Bot runs with SESSION_ID only — no MongoDB needed
*/

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath  = path.join(__dirname, '../database');

// ✅ Create database directory safely
try {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }
} catch (err) {
  console.error('❌ Could not create database directory:', err.message);
}

// ═══════════════════════════════════════════════════════════════════
//  📁 JSON DATABASE CLASS — Works without MongoDB
//  This is the default database. No setup needed.
// ═══════════════════════════════════════════════════════════════════

class Database {
  constructor(filename) {
    this.filepath = path.join(dataPath, `${filename}.json`);
    this.data     = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const raw = fs.readFileSync(this.filepath, 'utf-8');
        if (!raw.trim()) return {};
        return JSON.parse(raw);
      }
      return {};
    } catch (error) {
      console.error(`❌ Error loading database ${this.filepath}:`, error.message);
      // ✅ Backup corrupted file — no data loss
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
      // ✅ Safe write — temp file first, then rename
      const tempPath = this.filepath + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filepath);
      return true;
    } catch (error) {
      console.error(`❌ Error saving database ${this.filepath}:`, error.message);
      return false;
    }
  }

  get(key)         { return this.data[key] ?? null; }
  set(key, value)  { this.data[key] = value; return this.save(); }
  delete(key)      { delete this.data[key]; return this.save(); }
  has(key)         { return Object.prototype.hasOwnProperty.call(this.data, key); }
  all()            { return { ...this.data }; }
  clear()          { this.data = {}; return this.save(); }
  size()           { return Object.keys(this.data).length; }
  keys()           { return Object.keys(this.data); }
  values()         { return Object.values(this.data); }
  entries()        { return Object.entries(this.data); }

  // ── User Methods ──────────────────────────────────────────────────

  getUser(userId) {
    return this.get(userId) || {
      banned     : false,
      warnings   : 0,
      premium    : false,
      registered : false,
      balance    : parseInt(process.env.START_BALANCE) || 500,
      bank       : 0,
      lastDaily  : null,
      lastWork   : null,
      createdAt  : Date.now(),
    };
  }

  updateUser(userId, updates) {
    const user = this.getUser(userId);
    return this.set(userId, { ...user, ...updates, updatedAt: Date.now() });
  }

  banUser(userId, reason = '') {
    return this.updateUser(userId, {
      banned   : true,
      banReason: reason,
      bannedAt : Date.now(),
    });
  }

  unbanUser(userId) {
    return this.updateUser(userId, {
      banned   : false,
      banReason: '',
      bannedAt : null,
    });
  }

  isBanned(userId)  { return this.getUser(userId).banned   || false; }
  isPremium(userId) { return this.getUser(userId).premium  || false; }

  addWarning(userId) {
    const user = this.getUser(userId);
    return this.updateUser(userId, { warnings: (user.warnings || 0) + 1 });
  }

  resetWarnings(userId) {
    return this.updateUser(userId, { warnings: 0 });
  }

  getWarnings(userId) {
    return this.getUser(userId).warnings || 0;
  }

  // ── Economy Methods ───────────────────────────────────────────────

  getBalance(userId) {
    return this.getUser(userId).balance || 0;
  }

  addBalance(userId, amount) {
    const user = this.getUser(userId);
    return this.updateUser(userId, {
      balance: (user.balance || 0) + amount,
    });
  }

  removeBalance(userId, amount) {
    const user    = this.getUser(userId);
    const current = user.balance || 0;
    const newBal  = Math.max(0, current - amount);
    return this.updateUser(userId, { balance: newBal });
  }

  setLastDaily(userId) {
    return this.updateUser(userId, { lastDaily: Date.now() });
  }

  setLastWork(userId) {
    return this.updateUser(userId, { lastWork: Date.now() });
  }

  // ── Group Methods ─────────────────────────────────────────────────

  getGroup(groupId) {
    return this.get(groupId) || {
      antilink   : false,
      welcome    : true,
      goodbye    : true,
      muted      : false,
      antidelete : false,
      autodl     : false,
      antispam   : false,
      antibot    : false,
      antiabuse  : false,
      antivv     : false,
      autosticker: false,
      warns      : {},
      createdAt  : Date.now(),
    };
  }

  updateGroup(groupId, updates) {
    const group = this.getGroup(groupId);
    return this.set(groupId, { ...group, ...updates, updatedAt: Date.now() });
  }

  toggleGroup(groupId, feature) {
    const group   = this.getGroup(groupId);
    const current = group[feature] || false;
    return this.updateGroup(groupId, { [feature]: !current });
  }

  isGroupFeature(groupId, feature) {
    return this.getGroup(groupId)[feature] || false;
  }

  // ── Warn System ───────────────────────────────────────────────────

  warnUser(groupId, userId) {
    const group = this.getGroup(groupId);
    const warns = group.warns || {};
    warns[userId] = (warns[userId] || 0) + 1;
    this.updateGroup(groupId, { warns });
    return warns[userId];
  }

  resetWarn(groupId, userId) {
    const group = this.getGroup(groupId);
    const warns = group.warns || {};
    warns[userId] = 0;
    return this.updateGroup(groupId, { warns });
  }

  getWarnCount(groupId, userId) {
    const group = this.getGroup(groupId);
    return (group.warns || {})[userId] || 0;
  }
}

// ═══════════════════════════════════════════════════════════════════
//  🗄️  MONGODB ADAPTER — Optional
//  Only used if MONGODB_URI is set in .env
//  If not set — JSON Database is used automatically
// ═══════════════════════════════════════════════════════════════════

class MongoAdapter {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection     = null;
    this.ready          = false;
  }

  async connect(mongoose) {
    try {
      const schema = new mongoose.Schema({
        _id  : String,
        value: mongoose.Schema.Types.Mixed,
      });
      this.collection = mongoose.model(
        this.collectionName,
        schema,
        this.collectionName,
      );
      this.ready = true;
    } catch (err) {
      // Model already exists — reuse it
      this.collection = mongoose.model(this.collectionName);
      this.ready      = true;
    }
  }

  async get(key) {
    if (!this.ready) return null;
    try {
      const doc = await this.collection.findById(key).lean();
      return doc ? doc.value : null;
    } catch { return null; }
  }

  async set(key, value) {
    if (!this.ready) return false;
    try {
      await this.collection.findByIdAndUpdate(
        key,
        { _id: key, value },
        { upsert: true, new: true },
      );
      return true;
    } catch { return false; }
  }

  async delete(key) {
    if (!this.ready) return false;
    try { await this.collection.findByIdAndDelete(key); return true; }
    catch { return false; }
  }

  async has(key) {
    if (!this.ready) return false;
    try { return !!(await this.collection.findById(key).lean()); }
    catch { return false; }
  }

  async all() {
    if (!this.ready) return {};
    try {
      const docs = await this.collection.find().lean();
      return Object.fromEntries(docs.map(d => [d._id, d.value]));
    } catch { return {}; }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  ✅ SMART DATABASE FACTORY
//  Auto-selects JSON or MongoDB based on MONGODB_URI
//  No MongoDB = JSON used automatically — bot never crashes
// ═══════════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || '';
let   dbReady     = false;

export async function connectDatabase() {
  if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_uri_here') {
    try {
      const mongoose = (await import('mongoose')).default;
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('[DB] ✅ MongoDB connected!');
      dbReady = true;
      return 'mongodb';
    } catch (err) {
      console.warn('[DB] ⚠️  MongoDB failed — falling back to JSON database');
      console.warn('[DB] Reason: ' + err.message);
      dbReady = true;
      return 'json';
    }
  } else {
    console.log('[DB] 📁 Using local JSON database (no MongoDB URI set)');
    dbReady = true;
    return 'json';
  }
}

// ═══════════════════════════════════════════════════════════════════
//  📦 EXPORT DATABASE INSTANCES
//  These work immediately — no setup needed
//  JSON files auto-created in ./database/ folder
// ═══════════════════════════════════════════════════════════════════

export const userDb     = new Database('users');
export const groupDb    = new Database('groups');
export const settingsDb = new Database('settings');
export const economyDb  = new Database('economy');
export const tempDb     = new Database('temp');
export const banDb      = new Database('banned');
export const warnDb     = new Database('warnings');

export default Database;
