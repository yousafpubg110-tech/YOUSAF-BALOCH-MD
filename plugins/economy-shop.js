/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Economy Shop Plugin     ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG }            from '../config.js';
import { getWallet, removeCoins }   from './economy-balance.js';

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

// ─── Shop items ───────────────────────────────────────────────────────────────
const SHOP_ITEMS = [
  { id: 1,  name: 'Lucky Charm',    emoji: '🍀', price: 200,  description: '10% more coins for 1 hour',   category: 'boost'  },
  { id: 2,  name: 'XP Booster',     emoji: '⭐', price: 300,  description: 'Double XP for 30 minutes',    category: 'boost'  },
  { id: 3,  name: 'Shield',         emoji: '🛡️', price: 150,  description: 'Protect from theft once',     category: 'protect'},
  { id: 4,  name: 'Work Shortcut',  emoji: '⚡', price: 500,  description: 'Skip work cooldown once',      category: 'utility'},
  { id: 5,  name: 'Daily Booster',  emoji: '🎁', price: 400,  description: 'Double daily reward once',    category: 'boost'  },
  { id: 6,  name: 'Coin Magnet',    emoji: '🧲', price: 750,  description: 'Auto-collect 50 coins/hour',  category: 'passive'},
  { id: 7,  name: 'Bank Upgrade',   emoji: '🏦', price: 1000, description: 'Increase bank limit by 1000', category: 'upgrade'},
  { id: 8,  name: 'VIP Badge',      emoji: '💎', price: 2000, description: 'Show VIP status in profile',  category: 'cosmetic'},
  { id: 9,  name: 'Pickpocket Kit', emoji: '🦹', price: 350,  description: 'Steal coins from someone',    category: 'criminal'},
  { id: 10, name: 'Tax Reducer',    emoji: '📉', price: 600,  description: 'Reduce tax by 50% for 1 day', category: 'utility'},
];

// ─── User inventory ───────────────────────────────────────────────────────────
const inventory = new Map(); // userJid → [{ itemId, name, emoji, purchasedAt }]

export function getUserInventory(userJid) {
  if (!inventory.has(userJid)) inventory.set(userJid, []);
  return inventory.get(userJid);
}

export default {
  command    : ['shop', 'store', 'buy', 'inventory'],
  name       : 'economy-shop',
  category   : 'Economy',
  description: 'Buy items from the shop',
  usage      : '.shop [buy <id>] [inventory]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🏪');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim().toLowerCase();

      // ── Show inventory ────────────────────────────────────
      if (input === 'inventory' || input === 'inv' || input === 'bag') {
        const inv = getUserInventory(sender);
        if (inv.length === 0) {
          return await sock.sendMessage(from, {
            text: `╭━━━『 🎒 *INVENTORY EMPTY* 』━━━╮

👋 *Player:* +${senderNum}

│ You have no items yet!
│ Visit the shop: \`${CONFIG.PREFIX}shop\`

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          }, { quoted: msg });
        }

        const invSection = inv.map((item, i) =>
          `│ ${i + 1}. ${item.emoji} *${item.name}*\n│    📅 ${item.purchasedAt}`
        ).join('\n│\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 🎒 *INVENTORY* 』━━━╮

👋 *Player:* +${senderNum}
🛍️ *Items:* ${inv.length}

╭─『 📦 *Your Items* 』
│
${invSection}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        return;
      }

      // ── Buy item ──────────────────────────────────────────
      const buyMatch = input.match(/^buy\s+(\d+)/i);
      if (buyMatch) {
        const itemId = parseInt(buyMatch[1]);
        const item   = SHOP_ITEMS.find(i => i.id === itemId);

        if (!item) {
          return await sock.sendMessage(from, {
            text: `❌ *Item #${itemId} not found!*\n\n💡 Check: \`${CONFIG.PREFIX}shop\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const w = getWallet(sender);
        if (w.coins < item.price) {
          return await sock.sendMessage(from, {
            text: `❌ *Not enough coins!*\n\n💰 *You have:* ${w.coins} coins\n💵 *Item costs:* ${item.price} coins\n📉 *Need:* ${item.price - w.coins} more coins\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        removeCoins(sender, item.price);

        const inv = getUserInventory(sender);
        inv.push({
          itemId, name: item.name, emoji: item.emoji,
          purchasedAt: new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' }),
        });

        const wAfter = getWallet(sender);
        await sock.sendMessage(from, {
          text: `╭━━━『 ✅ *PURCHASE SUCCESSFUL!* 』━━━╮

👋 *Buyer:* +${senderNum}

╭─『 ${item.emoji} *Item Purchased* 』
│ 🛍️ *Item:*      ${item.name}
│ 📋 *Effect:*    ${item.description}
│ 💸 *Paid:*      ${item.price} coins
│ 💳 *Remaining:* ${wAfter.coins.toLocaleString()} coins
╰──────────────────────────

╭─『 💡 *Use Item* 』
│ \`${CONFIG.PREFIX}use ${item.name.toLowerCase()}\`
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Show shop ─────────────────────────────────────────
      const w           = getWallet(sender);
      const categories  = [...new Set(SHOP_ITEMS.map(i => i.category))];

      let shopSection = '';
      for (const cat of categories) {
        const catItems = SHOP_ITEMS.filter(i => i.category === cat);
        shopSection += `╭─『 📂 *${cat.toUpperCase()}* 』\n`;
        shopSection += catItems.map(i =>
          `│ *#${i.id}* ${i.emoji} ${i.name} — 💰 ${i.price} coins\n│    ${i.description}`
        ).join('\n') + '\n╰──────────────────────────\n\n';
      }

      await sock.sendMessage(from, {
        text: `╭━━━『 🏪 *SHOP* 』━━━╮

👋 *Shopper:* +${senderNum}
💰 *Your Balance:* ${w.coins.toLocaleString()} coins

${shopSection}
╭─『 💡 *How to Buy* 』
│ \`${CONFIG.PREFIX}shop buy 1\`  → Buy item #1
│ \`${CONFIG.PREFIX}shop inv\`    → Your inventory
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('🏪');

    } catch (error) {
      console.error('[SHOP ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Shop error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
