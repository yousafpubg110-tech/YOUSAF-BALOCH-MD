/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Roman Urdu AI Chat   ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import axios from 'axios';
import { sanitizeUrl } from '../lib/utils.js';
import { OWNER, SYSTEM } from '../config.js';

// Roman Urdu detection patterns
const romanUrduPatterns = [
  /\b(aap|main|hum|tum|ye|wo|kya|kab|kahan|kyun|kaise)\b/i,
  /\b(hai|tha|hoga|gaya|kar|ho|na|nahi)\b/i,
  /\b(acha|theek|sahi|galat|bohat|bhut|ziyada)\b/i,
  /\b(yar|yaar|bhai|bro|dost|jan)\b/i,
];

export function isRomanUrdu(text) {
  if (!text || typeof text !== 'string') return false;
  let matches = 0;
  for (const pattern of romanUrduPatterns) {
    if (pattern.test(text)) matches++;
  }
  return matches >= 2;
}

const fallbacks = [
  'Ji bilkul! Kya main aur kuch madad kar sakta hun?',
  'Theek hai yar, batao aur kya chahiye?',
  'Hmm... acha sawal hai! Main soch raha hun...',
  'Yar bohat acha point hai aap ka!',
  'Bilkul sahi kaha aap ne!',
];

export default {
  // FIX: command field added — pluginLoader ke liye zaruri hai
  command: ['ai', 'chat', 'gpt'],
  name: 'romanurdu',
  category: 'AI',
  description: 'Auto-detect and respond in Roman Urdu using AI',
  usage: '.ai [apna sawal likho]',

  // FIX: execute se handler — pluginLoader aur commandHandler dono support karte hain
  handler: async ({ sock, msg, from, args, body }) => {
    try {
      const userMessage = body || args?.join(' ') || '';

      if (!userMessage) {
        return await msg.reply('Yar kuch to likho! Example: .ai aap kaisa hun?');
      }

      if (!isRomanUrdu(userMessage) && args?.length === 0) return;

      await msg.react('🤔');

      const prompt = `You are a friendly Pakistani chatbot named ${OWNER.BOT_NAME}. Respond ONLY in Roman Urdu (Urdu written in English letters). Be natural, casual, and friendly. Keep response short. User said: "${userMessage}"`;

      // FIX: sanitizeUrl used — CodeQL "Incomplete URL substring sanitization" fix
      const rawUrl = `https://api.nexoracle.com/ai/chatgpt?apikey=free_key@maher_apis&prompt=${encodeURIComponent(prompt)}`;
      const safeUrl = sanitizeUrl(rawUrl);

      if (!safeUrl) {
        const randomReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        await msg.reply(randomReply);
        return;
      }

      const response = await axios.get(safeUrl, { timeout: 15000 });

      // FIX: "Replacement of a substring with itself" — CodeQL Medium error fix
      // Pehle result.replace(/result/g, 'result') jesi galat line thi — hata di
      let reply = response.data?.result || response.data?.message || response.data?.response || '';

      if (!reply || reply.trim() === '') {
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      await msg.reply(`${reply}${SYSTEM.SHORT_WATERMARK}`);
      await msg.react('✅');

    } catch (error) {
      console.error('❌ Roman Urdu AI error:', error.message);
      try {
        await msg.reply('Yar sorry, mujhe samajh nahi aaya. Dubara try karo na!');
        await msg.react('❌');
      } catch (_) {}
    }
  },
};
