/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Islamic Names Plugin  ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

// ─── Islamic Names Database ───────────────────────────────────────────────────
const BOY_NAMES = [
  { name: 'Muhammad', urdu: 'محمد',  meaning: 'تعریف کیا گیا — قابل تعریف',   origin: 'عربی' },
  { name: 'Ahmad',    urdu: 'احمد',  meaning: 'بہت زیادہ تعریف کرنے والا',     origin: 'عربی' },
  { name: 'Ali',      urdu: 'علی',   meaning: 'بلند — اعلیٰ — برتر',          origin: 'عربی' },
  { name: 'Hassan',   urdu: 'حسن',   meaning: 'خوبصورت — اچھا',               origin: 'عربی' },
  { name: 'Hussain',  urdu: 'حسین',  meaning: 'خوبصورت — اچھائی',             origin: 'عربی' },
  { name: 'Ibrahim',  urdu: 'ابراہیم',meaning: 'باپ کی طرح محبت کرنے والا',   origin: 'عبرانی/عربی' },
  { name: 'Yusuf',    urdu: 'یوسف',  meaning: 'اللہ بڑھائے — اللہ دے',       origin: 'عبرانی/عربی' },
  { name: 'Usman',    urdu: 'عثمان', meaning: 'سانپ — طاقتور — چھوٹا اونٹ', origin: 'عربی' },
  { name: 'Umar',     urdu: 'عمر',   meaning: 'زندگی — عمر — آبادی',         origin: 'عربی' },
  { name: 'Bilal',    urdu: 'بلال',  meaning: 'تازگی — نمی — سیلاب',         origin: 'عربی' },
  { name: 'Zaid',     urdu: 'زید',   meaning: 'بڑھنا — افزائش — ترقی',       origin: 'عربی' },
  { name: 'Khalid',   urdu: 'خالد',  meaning: 'ابدی — ہمیشہ باقی رہنے والا', origin: 'عربی' },
  { name: 'Tariq',    urdu: 'طارق',  meaning: 'رات کو آنے والا — ستارہ',     origin: 'عربی' },
  { name: 'Hamza',    urdu: 'حمزہ',  meaning: 'مضبوط — بہادر — شیر',        origin: 'عربی' },
  { name: 'Sufyan',   urdu: 'سفیان', meaning: 'تیز — تند — ہوا کی طرح',     origin: 'عربی' },
  { name: 'Rayyan',   urdu: 'ریان',  meaning: 'جنت کا دروازہ روزہ داروں کا', origin: 'عربی' },
  { name: 'Ayman',    urdu: 'ایمن',  meaning: 'خوش قسمت — مبارک — دائیں',   origin: 'عربی' },
  { name: 'Faris',    urdu: 'فارس',  meaning: 'گھڑ سوار — بہادر',           origin: 'عربی' },
  { name: 'Noor',     urdu: 'نور',   meaning: 'روشنی — نور',                 origin: 'عربی' },
  { name: 'Saad',     urdu: 'سعد',   meaning: 'خوشحالی — برکت — سعادت',    origin: 'عربی' },
];

const GIRL_NAMES = [
  { name: 'Fatima',   urdu: 'فاطمہ',  meaning: 'دودھ چھڑانے والی — پاک',     origin: 'عربی' },
  { name: 'Aisha',    urdu: 'عائشہ',  meaning: 'زندہ دل — خوش — آباد',      origin: 'عربی' },
  { name: 'Zainab',   urdu: 'زینب',   meaning: 'خوشبودار درخت — باپ کی زینت',origin: 'عربی' },
  { name: 'Maryam',   urdu: 'مریم',   meaning: 'پاک — معزز عبادت گزار',     origin: 'عبرانی/عربی' },
  { name: 'Khadija',  urdu: 'خدیجہ',  meaning: 'قبل از وقت پیدا ہونے والی', origin: 'عربی' },
  { name: 'Asma',     urdu: 'اسماء',  meaning: 'اعلیٰ — عالیشان — نام',     origin: 'عربی' },
  { name: 'Hafsa',    urdu: 'حفصہ',   meaning: 'شیر کی بچی — شیرنی',        origin: 'عربی' },
  { name: 'Ruqayyah', urdu: 'رقیہ',   meaning: 'چڑھنا — اٹھنا — ترقی',      origin: 'عربی' },
  { name: 'Safiyya',  urdu: 'صفیہ',   meaning: 'پاک — صاف — چنی ہوئی',     origin: 'عربی' },
  { name: 'Iman',     urdu: 'ایمان',  meaning: 'ایمان — یقین — اعتماد',     origin: 'عربی' },
  { name: 'Noor',     urdu: 'نور',    meaning: 'روشنی — چمک',               origin: 'عربی' },
  { name: 'Hana',     urdu: 'ہنا',    meaning: 'خوشی — مسرت — سعادت',      origin: 'عربی' },
  { name: 'Sara',     urdu: 'سارہ',   meaning: 'شہزادی — خوش — خالص',      origin: 'عبرانی/عربی' },
  { name: 'Layla',    urdu: 'لیلیٰ',  meaning: 'رات — سیاہ بال',           origin: 'عربی' },
  { name: 'Amina',    urdu: 'آمنہ',   meaning: 'امانت دار — پرامن — معتبر', origin: 'عربی' },
  { name: 'Sana',     urdu: 'ثنا',    meaning: 'تعریف — چمک — روشنی',      origin: 'عربی' },
  { name: 'Rabia',    urdu: 'رابعہ',  meaning: 'چوتھی — بہار',             origin: 'عربی' },
  { name: 'Sumayya',  urdu: 'سمیہ',   meaning: 'اونچا — بلند نام',          origin: 'عربی' },
  { name: 'Zuhra',    urdu: 'زہرہ',   meaning: 'چمکدار — زہرہ ستارہ',      origin: 'عربی' },
  { name: 'Aliya',    urdu: 'عالیہ',  meaning: 'بلند — اعلیٰ — شاندار',    origin: 'عربی' },
];

export default {
  command    : ['names', 'islamicnames', 'naam', 'نام', 'babynames'],
  name       : 'islamic-names',
  category   : 'Islamic',
  description: 'Islamic names with meanings in Urdu',
  usage      : '.names [boy/girl/search]',
  cooldown   : 3,

  handler: async ({ sock, msg, from, sender, text, args }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('📖');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();

      // ── Search specific name ─────────────────────────────
      if (input && !/^(boy|girl|لڑکا|لڑکی)$/.test(input)) {
        const searchTerm = input;
        const allNames   = [...BOY_NAMES, ...GIRL_NAMES];
        const found      = allNames.filter(n =>
          n.name.toLowerCase().includes(searchTerm) ||
          n.urdu.includes(searchTerm) ||
          n.meaning.includes(searchTerm)
        );

        if (found.length === 0) {
          return await sock.sendMessage(from, {
            text: `❌ *"${text}" نام نہیں ملا!*\n\n💡 Try: \`${CONFIG.PREFIX}names boy\` or \`${CONFIG.PREFIX}names girl\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const foundSection = found.slice(0, 5).map(n =>
          `╭─『 📖 *${n.name} — ${n.urdu}* 』\n│ 🌸 *معنی:* ${n.meaning}\n│ 🌍 *ماخذ:* ${n.origin}\n╰──────────────────────────`
        ).join('\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 📖 *نام تلاش* 』━━━╮

👋 *Requested by:* +${senderNum}
🔍 *Search:* ${text}

${foundSection}

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── Boy or Girl names list ───────────────────────────
      const isBoy  = /boy|لڑکا|boys/.test(input) || !input;
      const isGirl = /girl|لڑکی|girls/.test(input);
      const list   = isGirl ? GIRL_NAMES : BOY_NAMES;
      const title  = isGirl ? '👧 لڑکیوں کے نام' : '👦 لڑکوں کے نام';

      // Show random 8 names
      const shuffled = [...list].sort(() => 0.5 - Math.random()).slice(0, 8);
      const nameSection = shuffled.map(n =>
        `│ 📖 *${n.name}* (${n.urdu})\n│    🌸 ${n.meaning}`
      ).join('\n│\n');

      const namesMsg = `╭━━━『 📖 *اسلامی نام* 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
👋 *Requested by:* +${senderNum}

╭─『 ${title} 』
│
${nameSection}
│
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}names boy\`    → لڑکوں کے نام
│ \`${CONFIG.PREFIX}names girl\`   → لڑکیوں کے نام
│ \`${CONFIG.PREFIX}names Ahmad\`  → نام تلاش کریں
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: namesMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[NAMES ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Names error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
