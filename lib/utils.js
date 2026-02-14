/*
═══════════════════════════════════════════════════
📁 LIB/UTILS.JS
═══════════════════════════════════════════════════
Purpose: Helper Utility Functions
Standards: Top Trending WhatsApp MD Bots (Feb 2026)
Developer: MR YOUSAF BALOCH
═══════════════════════════════════════════════════
*/

import fs from 'fs';
import path from 'path';
import axios from 'axios';

/**
 * Format file size
 */
export function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format duration (seconds to mm:ss)
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time (milliseconds to readable)
 */
export function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

/**
 * Sleep/delay function
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Random number between min and max
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from array
 */
export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Chunk array into smaller arrays
 */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 */
export function unique(array) {
  return [...new Set(array)];
}

/**
 * Check if URL is valid
 */
export function isUrl(text) {
  const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return urlRegex.test(text);
}

/**
 * Extract URLs from text
 */
export function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * Fetch JSON from URL
 */
export async function fetchJson(url, options = {}) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      ...options
    });
    return response.data;
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
}

/**
 * Fetch buffer from URL
 */
export async function fetchBuffer(url, options = {}) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      ...options
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Fetch buffer error: ${error.message}`);
  }
}

/**
 * Clean temp folder
 */
export function cleanTemp() {
  const tempPath = path.join(process.cwd(), 'temp');
  
  if (!fs.existsSync(tempPath)) return;
  
  const files = fs.readdirSync(tempPath);
  let count = 0;
  
  for (const file of files) {
    try {
      fs.unlinkSync(path.join(tempPath, file));
      count++;
    } catch {}
  }
  
  return count;
}

/**
 * Create temp file
 */
export function createTemp(buffer, ext = '.tmp') {
  const tempPath = path.join(process.cwd(), 'temp');
  
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
  }
  
  const fileName = `temp_${Date.now()}${ext}`;
  const filePath = path.join(tempPath, fileName);
  
  fs.writeFileSync(filePath, buffer);
  
  return filePath;
}

/**
 * Parse time string (1h, 30m, etc)
 */
export function parseTime(timeString) {
  const regex = /(\d+)([smhd])/g;
  let totalMs = 0;
  let match;
  
  while ((match = regex.exec(timeString)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': totalMs += value * 1000; break;
      case 'm': totalMs += value * 60 * 1000; break;
      case 'h': totalMs += value * 60 * 60 * 1000; break;
      case 'd': totalMs += value * 24 * 60 * 60 * 1000; break;
    }
  }
  
  return totalMs;
}

/**
 * Capitalize first letter
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Truncate text
 */
export function truncate(text, length = 100) {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Generate random string
 */
export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default {
  formatSize,
  formatDuration,
  formatTime,
  sleep,
  random,
  pickRandom,
  chunk,
  unique,
  isUrl,
  extractUrls,
  fetchJson,
  fetchBuffer,
  cleanTemp,
  createTemp,
  parseTime,
  capitalize,
  truncate,
  randomString
};
      
