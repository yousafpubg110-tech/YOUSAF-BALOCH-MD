/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Economy Work Plugin     ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }       from '../config.js';
import { getWallet, addCoins } from './economy-balance.js';

function ownerFooter() {
  const year = OWNER.YEAR || new Date().getFullYear();
  return `╭─『 👑 *${OWNER.BOT_NAME}* 』
│ 👤 *Owner:*   ${OWNER.FULL_NAME}
│ 📱 *Number:*  +${OWNER.NUMBER}
│ 📢 *Channel:* ${OWNER.CHANNEL}
│ 📺 *YouTube:* ${OWNER.YOUTUBE}
│ 🎵 *TikTok:*  ${OWNER.TIKTOK}
╰──────────────────────────
_© ${year} ${OWNER.BOT_NAME}_`;
}

// ─── Work cooldown (1 hour) ───────────────────────────────────────────────────
const lastWork    = new Map();
const WORK_COOLDOWN = 60 * 60 * 1000; // 1 hour
const WORK_MIN    = parseInt(process.env.WORK_MIN || '50');
const WORK_MAX    = parseInt(process.env.WORK_MAX || '150');

// ─── Jobs database ────────────────────────────────────────────────────────────
const JOBS = [
  { title: 'Software Developer',  emoji: '💻', action: 'wrote 500 lines of clean code' },
  { title: 'Food Delivery Rider', emoji: '🛵', action: 'delivered 20 orders across the city' },
  { title: 'Cricket Coach',       emoji: '🏏', action: 'trained the U19 team for 3 hours' },
  { title: 'YouTube Creator',     emoji: '📹', action: 'uploaded a viral video that got 100K views' },
  { title: 'Teacher',             emoji: '📚', action: 'taught 40 students today' },
  { title: 'Doctor',              emoji: '🏥', action: 'treated 25 patients successfully' },
  { title: 'Farmer',              emoji: '🌾', action: 'harvested 5 acres of wheat' },
  { title: 'Truck Driver',        emoji: '🚛', action: 'drove 300km to deliver goods' },
  { title: 'Chef',                emoji: '👨‍🍳', action: 'cooked biryani for 200 guests' },
  { title: 'Mechanic',            emoji: '🔧', action: 'repaired 8 cars today' },
  { title: 'Security Guard',      emoji: '💂', action: 'kept the building safe for 12 hours' },
  { title: 'Graphic Designer',    emoji: '🎨', action: 'designed 5 logos for clients' },
  { title: 'Fisherman',           emoji: '🎣', action: 'caught 50kg of fish' },
  { title: 'Electrician',         emoji: '⚡', action: 'fixed power outages in 10 homes' },
  { title: 'Shopkeeper',          emoji: '🏪', action: 'sold goods worth 5,000 rupees' },
];

export default {
  command    : ['work', 'earn', 'job'],
  name       : 'economy-work',
  category   : 'Economy',
  description: 'Work to earn coins (1 hour cooldown)',
  usage      : '.work',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('💼');

      const senderNum = sender?.split('@')[0] || 'User';
      const now       = Date.now();
      const last      = lastWork.get(sender) || 0;
      const elapsed   = now - last;
      const remaining = WORK_COOLDOWN - elapsed;

      // ── Cooldown ──────────────────────────────────────────
      if (remaining > 0) {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        return await sock.sendMessage(from, {
          text: `╭━━━『 ⏰ *WORK COOLDOWN* 』━━━╮

👋 *Worker:* +${senderNum}

╭─『 ⏳ *Rest Time* 』
│ ⏰ *Back to work in:* ${mins}m ${secs}s
│ 💡 Next pay: *${WORK_MIN}-${WORK_MAX} coins*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
      }

      // ── Assign random job ─────────────────────────────────
      const job    = JOBS[Math.floor(Math.random() * JOBS.length)];
      const earned = Math.floor(Math.random() * (WORK_MAX - WORK_MIN + 1)) + WORK_MIN;

      // ── Bonus chance (10%) ────────────────────────────────
      const isBonus  = Math.random() < 0.1;
      const bonus    = isBonus ? Math.floor(earned * 0.5) : 0;
      const total    = earned + bonus;

      lastWork.set(sender, now);
      addCoins(sender, total);
      const w = getWallet(sender);

      await sock.sendMessage(from, {
        text: `╭━━━『 💼 *WORK COMPLETED!* 』━━━╮

👋 *Worker:* +${senderNum}

╭─『 ${job.emoji} *Job* 』
│ 💼 *Position:* ${job.title}
│ 📋 *Task:* ${job.action}
╰──────────────────────────

╭─『 💰 *Earnings* 』
│ 💵 *Base Pay:*  +${earned} coins
${isBonus ? `│ 🎉 *Bonus:*     +${bonus} coins (Lucky!)\n` : ''}│ 💰 *Total:*    *+${total} coins*
│ 💳 *Balance:*  ${w.coins.toLocaleString()} coins
╰──────────────────────────

╭─『 💡 *Tip* 』
│ Come back in 1 hour to work again!
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('💰');

    } catch (error) {
      console.error('[WORK ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Work error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
