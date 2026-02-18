/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃  YOUSAF-BALOCH-MD InShot Helper        ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

export default {
  name: 'inshot',
  aliases: ['inshotpro', 'inshothelp'],
  category: 'tools',
  description: 'InShot editing tips and premium APK info',
  usage: '.inshot',
  cooldown: 3000,

  async execute(msg, args) {
    try {
      await msg.react('🎥');

      const message = `
╭━━━『 *INSHOT VIDEO EDITOR* 』━━━╮

🎥 *InShot - Professional Video Editor*

*Features:*
✅ Video trimming & cutting
✅ Music & sound effects
✅ Text & stickers
✅ Filters & effects
✅ Speed control
✅ Video merger
✅ No watermark (Pro)

*Pro Features:*
💎 Remove watermark
💎 All filters unlocked
💎 Premium effects
💎 4K export quality
💎 Ad-free experience

*How to get Premium:*
📥 Use .apk inshot command to get premium APK

*Editing Tips:*
1️⃣ Use trending music
2️⃣ Add smooth transitions
3️⃣ Color grade your videos
4️⃣ Use text animations
5️⃣ Export in highest quality

*Popular Effects:*
🌟 Glitch effect
🌟 VHS retro look
🌟 Cinematic bars
🌟 Slow motion
🌟 Time lapse

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

_Powered by YOUSAF-BALOCH-MD_
📢 https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
💻 https://github.com/musakhanbaloch03-sad
📺 https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 https://tiktok.com/@loser_boy.110

*Need Premium APK?*
Type: .apk inshot
`.trim();

      await msg.reply(message);
      await msg.react('✅');

    } catch (error) {
      console.error('InShot helper error:', error);
      await msg.react('❌');
      await msg.reply('❌ Error: ' + error.message);
    }
  }
};
