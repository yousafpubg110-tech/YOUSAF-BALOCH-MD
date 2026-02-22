/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Group Poll Plugin     ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

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

// ─── Active polls store ───────────────────────────────────────────────────────
const activePolls = new Map(); // groupJid → { question, options, votes, createdAt }

export default {
  command    : ['poll', 'vote', 'پول'],
  name       : 'group-poll',
  category   : 'Group',
  description: 'Create and manage polls in groups',
  usage      : '.poll <question> | <option1> | <option2>',
  cooldown   : 5,
  groupOnly  : true,

  handler: async ({ sock, msg, from, sender, text, isAdmin, isBotAdmin }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📊');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').trim();

      // ── Show results if no input ────────────────────────
      if (!input || input === 'results' || input === 'result') {
        const poll = activePolls.get(from);
        if (!poll) {
          return await sock.sendMessage(from, {
            text: `❌ *کوئی active poll نہیں ہے!*\n\n💡 نیا poll بنائیں:\n\`${CONFIG.PREFIX}poll سوال | آپشن 1 | آپشن 2\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const totalVotes  = Object.values(poll.votes).reduce((a, b) => a + b.length, 0);
        const resultsSection = poll.options.map((opt, i) => {
          const voteCount  = poll.votes[i]?.length || 0;
          const percent    = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const bar        = '█'.repeat(Math.round(percent / 10)) + '░'.repeat(10 - Math.round(percent / 10));
          return `│ *${i + 1}.* ${opt}\n│    ${bar} ${percent}% (${voteCount} votes)`;
        }).join('\n│\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 📊 *POLL RESULTS* 』━━━╮

❓ *Question:* ${poll.question}
👥 *Total Votes:* ${totalVotes}

╭─『 📊 *Results* 』
│
${resultsSection}
│
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── End poll ─────────────────────────────────────────
      if (input === 'end' || input === 'close') {
        if (!isAdmin) {
          return await sock.sendMessage(from, {
            text: `❌ *صرف Admin poll بند کر سکتا ہے!*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }
        activePolls.delete(from);
        await sock.sendMessage(from, {
          text: `✅ *Poll بند ہو گیا!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
        return;
      }

      // ── Vote: number input ────────────────────────────────
      const voteNum = parseInt(input);
      if (!isNaN(voteNum)) {
        const poll = activePolls.get(from);
        if (!poll) {
          return await sock.sendMessage(from, {
            text: `❌ *کوئی active poll نہیں ہے!*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const idx = voteNum - 1;
        if (idx < 0 || idx >= poll.options.length) {
          return await sock.sendMessage(from, {
            text: `❌ *غلط نمبر! 1 سے ${poll.options.length} تک چنیں۔*\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        // Remove previous vote
        for (const votes of Object.values(poll.votes)) {
          const i = votes.indexOf(sender);
          if (i > -1) votes.splice(i, 1);
        }

        poll.votes[idx] = poll.votes[idx] || [];
        poll.votes[idx].push(sender);

        await sock.sendMessage(from, {
          text: `✅ *Vote recorded!*\n\n👤 *+${senderNum}* نے vote دیا:\n📌 *${poll.options[idx]}*\n\n${ownerFooter()}`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Create new poll ───────────────────────────────────
      if (!isAdmin) {
        return await sock.sendMessage(from, {
          text: `❌ *صرف Admin poll بنا سکتا ہے!*\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const parts = input.split('|').map(p => p.trim()).filter(Boolean);
      if (parts.length < 3) {
        return await sock.sendMessage(from, {
          text: `❌ *کم از کم 2 options دیں!*\n\n📌 *Usage:*\n\`${CONFIG.PREFIX}poll سوال | آپشن 1 | آپشن 2 | آپشن 3\`\n\n💡 *Example:*\n\`${CONFIG.PREFIX}poll پسندیدہ رنگ؟ | لال | نیلا | سبز\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const question = parts[0];
      const options  = parts.slice(1);
      const votes    = {};
      options.forEach((_, i) => { votes[i] = []; });

      activePolls.set(from, { question, options, votes, createdAt: Date.now(), createdBy: sender });

      const optionsSection = options.map((opt, i) =>
        `│ *${i + 1}.* ${opt}`
      ).join('\n');

      await sock.sendMessage(from, {
        text: `╭━━━『 📊 *NEW POLL* 』━━━╮

❓ *Question:*
│ ${question}

╭─『 🗳️ *Options* 』
${optionsSection}
╰──────────────────────────

╭─『 💡 *How to Vote* 』
│ Vote کریں: \`${CONFIG.PREFIX}poll 1\`
│ Results: \`${CONFIG.PREFIX}poll results\`
│ End Poll: \`${CONFIG.PREFIX}poll end\`
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[POLL ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Poll error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
