import { watchFile, unwatchFile } from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

global.owner = [
  ['923710636110', 'Yousaf Baloch', true],
];

global.botname = '𝐘𝐎𝐔𝐒𝐀𝐅-𝐁𝐀𝐋𝐎𝐂𝐇-𝐌𝐃 🛡️';
global.ownername = 'Yousaf Baloch';
global.version = '1.0.0';
global.packname = 'YOUSAF-BALOCH-MD';
global.author = 'Yousaf Baloch';

global.socialLinks = {
  youtube: 'https://youtube.com/@Yousaf_Baloch_Tech',
  tiktok: 'https://tiktok.com/@loser_boy.110',
  whatsappChannel: 'https://whatsapp.com/channel/https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j',
  github: 'https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD',
  instagram: 'https://instagram.com/yousaf.baloch110',
};

global.sessionName = 'session';
global.pairingNumber = '';

global.autotyping = false;
global.autoread = false;
global.autobio = false;
global.anticall = true;
global.available = true;

global.antilink = false;
global.antidelete = true;
global.welcome = true;
global.leave = true;

global.prefa = ['', '!', '.', '/', '#'];
global.sp = '⭔';

global.thumb = 'https://i.ibb.co/mS6pL0P/yousaf-md-thumb-gold.jpg';
global.logo = 'https://i.ibb.co/mS6pL0P/yousaf-md-thumb-gold.jpg';

global.APIs = {
  xteam: 'https://api.xteam.xyz',
};

global.wait = '⏳ *Processing your request...*';
global.done = '✅ *Successfully completed!*';
global.error = '❌ *An error occurred!*';
global.admin = '👤 *This command is for admins only!*';
global.botAdmin = '🤖 *I need to be admin to use this!*';
global.owner_only = '👑 *This command is for owner only!*';
global.group = '👥 *This command works in groups only!*';
global.private = '🔒 *This command works in private chat only!*';

global.menuFooter = `
╭━━━━━━━━━━━━━━━━━╮
┃ ✨ *Follow Me* ✨
┃━━━━━━━━━━━━━━━━━
┃ 📺 YouTube: ${global.socialLinks.youtube}
┃ 🎵 TikTok: ${global.socialLinks.tiktok}
┃ 📢 WhatsApp: ${global.socialLinks.whatsappChannel}
┃ 💻 GitHub: ${global.socialLinks.github}
╰━━━━━━━━━━━━━━━━━╯
`;

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Config updated!"));
  import(`${file}?update=${Date.now()}`);
});
