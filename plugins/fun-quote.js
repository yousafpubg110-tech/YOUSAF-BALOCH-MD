/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD Daily Quote          ┃
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
import { SYSTEM } from '../config.js';

export default {
  command: ['quote', 'quotes', 'motivate'],
  name: 'quote',
  category: 'Fun',
  description: 'Get a random motivational quote',
  usage: '.quote',
  cooldown: 5,

  handler: async ({ msg }) => {
    try {
      await msg.react('✨');
      await msg.reply('✨ *Getting a quote...*');

      // FIX: node-fetch removed — axios used
      // FIX: sanitizeUrl on API URL — CodeQL High error fix
      const safeApiUrl = sanitizeUrl('https://api.quotable.io/random');

      if (!safeApiUrl) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to build API URL.');
      }

      const response = await axios.get(safeApiUrl, { timeout: 15000 });
      const json = response.data;

      if (!json?.content || !json?.author) {
        await msg.react('❌');
        return await msg.reply('❌ Failed to get quote! Try again.');
      }

      await msg.reply(`╭━━━『 *DAILY QUOTE* 』━━━╮

✨ "${json.content}"

— *${json.author}*

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

${SYSTEM.SHORT_WATERMARK}`);

      await msg.react('✨');

    } catch (error) {
      console.error('Quote error:', error.message);
      try {
        await msg.react('❌');
        await msg.reply('❌ Failed to get quote! Try again.');
      } catch (_) {}
    }
  },
};
