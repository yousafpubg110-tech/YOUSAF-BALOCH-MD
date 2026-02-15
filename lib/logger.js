/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Logger System     ┃
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
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.logFile = path.join(this.logDir, `${this.getDate()}.log`);
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    // Clean old logs (keep last 7 days)
    this.cleanOldLogs();
  }

  getDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  getTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  }

  writeToFile(level, message) {
    const timestamp = `${this.getDate()} ${this.getTime()}`;
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, ...args) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const fullMessage = args.length > 0 ? `${msg} ${args.join(' ')}` : msg;
    
    console.log(chalk.blue(`ℹ [INFO]`), fullMessage);
    this.writeToFile('INFO', fullMessage);
  }

  success(message, ...args) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const fullMessage = args.length > 0 ? `${msg} ${args.join(' ')}` : msg;
    
    console.log(chalk.green(`✅ [SUCCESS]`), fullMessage);
    this.writeToFile('SUCCESS', fullMessage);
  }

  warn(message, ...args) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const fullMessage = args.length > 0 ? `${msg} ${args.join(' ')}` : msg;
    
    console.log(chalk.yellow(`⚠️  [WARN]`), fullMessage);
    this.writeToFile('WARN', fullMessage);
  }

  error(message, ...args) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const fullMessage = args.length > 0 ? `${msg} ${args.join(' ')}` : msg;
    
    console.log(chalk.red(`❌ [ERROR]`), fullMessage);
    this.writeToFile('ERROR', fullMessage);
  }

  debug(message, ...args) {
    const msg = typeof message === 'object' ? JSON.stringify(message) : message;
    const fullMessage = args.length > 0 ? `${msg} ${args.join(' ')}` : msg;
    
    console.log(chalk.gray(`🔍 [DEBUG]`), fullMessage);
    this.writeToFile('DEBUG', fullMessage);
  }

  command(user, command, chat) {
    const message = `Command: ${command} | User: ${user} | Chat: ${chat}`;
    console.log(chalk.cyan(`📝 [COMMAND]`), message);
    this.writeToFile('COMMAND', message);
  }

  connection(status, reason = '') {
    const message = reason ? `${status} - ${reason}` : status;
    console.log(chalk.magenta(`🔌 [CONNECTION]`), message);
    this.writeToFile('CONNECTION', message);
  }

  plugin(name, status) {
    const message = `Plugin ${name}: ${status}`;
    console.log(chalk.blueBright(`🔌 [PLUGIN]`), message);
    this.writeToFile('PLUGIN', message);
  }

  cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = Date.now();
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          fs.unlinkSync(filePath);
          console.log(chalk.gray(`🗑️  Deleted old log: ${file}`));
        }
      });
    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }

  banner() {
    console.log(chalk.cyan('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.green(`
╔═══════════════════════════════════════════╗
║                                           ║
║       YOUSAF-BALOCH-MD WhatsApp Bot       ║
║          Ultra Premium Edition            ║
║                                           ║
║  Created by: MR YOUSAF BALOCH             ║
║  WhatsApp: +923710636110                  ║
║  GitHub: musakhanbaloch03-sad             ║
║                                           ║
╚═══════════════════════════════════════════╝
    `));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
  }
}

export default new Logger();
