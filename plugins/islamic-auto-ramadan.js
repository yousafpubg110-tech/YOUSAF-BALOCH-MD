/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Auto Ramadan Plugin     ┃
┃        Created by MR YOUSAF BALOCH           ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER, CONFIG } from '../config.js';

// ─── Owner Footer ─────────────────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════
// PAKISTAN RAMADAN 2026 TIMETABLE — All Major Cities
// Source: Based on Islamic calendar calculations
// Ramadan 2026: ~February 17 – March 18, 2026
// ═══════════════════════════════════════════════════════════════════
const RAMADAN_CITIES = {
  lahore: {
    name : 'لاہور — Lahore',
    emoji: '🕌',
    sehri: '05:18',
    iftar: '18:12',
  },
  karachi: {
    name : 'کراچی — Karachi',
    emoji: '🌊',
    sehri: '05:42',
    iftar: '18:24',
  },
  islamabad: {
    name : 'اسلام آباد — Islamabad',
    emoji: '🏛️',
    sehri: '05:08',
    iftar: '18:06',
  },
  multan: {
    name : 'ملتان — Multan',
    emoji: '🌅',
    sehri: '05:24',
    iftar: '18:16',
  },
  sahiwal: {
    name : 'ساہیوال — Sahiwal',
    emoji: '🌾',
    sehri: '05:20',
    iftar: '18:13',
  },
  okara: {
    name : 'اوکاڑہ — Okara',
    emoji: '🌿',
    sehri: '05:22',
    iftar: '18:14',
  },
  pakpattan: {
    name : 'پاک پتن — Pakpattan',
    emoji: '☪️',
    sehri: '05:23',
    iftar: '18:15',
  },
  arifwala: {
    name : 'عارف والا — Arifwala',
    emoji: '🌙',
    sehri: '05:25',
    iftar: '18:16',
  },
};

// ═══════════════════════════════════════════════════════════════════
// DAILY SEHRI FAZILAT — 30 Different (Rotates daily)
// ═══════════════════════════════════════════════════════════════════
const SEHRI_FAZILAT = [
  { ayat: '﴿ وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ ﴾', tarjuma: 'اور وہ سحر کے وقت استغفار کرتے ہیں۔ (الذاریات: 18)', fazilat: 'سحری کھانا سنت ہے — اس میں برکت ہے۔ آپ ﷺ نے فرمایا: سحری کھاؤ کیونکہ سحری میں برکت ہے۔ (بخاری)' },
  { ayat: '﴿ إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ ﴾', tarjuma: 'بے شک اللہ توبہ کرنے والوں سے محبت کرتا ہے۔ (البقرہ: 222)', fazilat: 'سحری کا وقت دعا قبول ہونے کا وقت ہے — اللہ سے خوب مانگیں۔' },
  { ayat: '﴿ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ ﴾', tarjuma: 'نماز قائم کرو اور زکات دو۔ (البقرہ: 43)', fazilat: 'سحری کے بعد فجر کی نماز ضرور ادا کریں — رمضان میں فجر کا اجر دوگنا ہے۔' },
  { ayat: '﴿ شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ ﴾', tarjuma: 'رمضان کا مہینہ جس میں قرآن نازل کیا گیا۔ (البقرہ: 185)', fazilat: 'رمضان قرآن کا مہینہ ہے — سحری کے بعد تلاوت کریں۔' },
  { ayat: '﴿ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ﴾', tarjuma: 'جو اللہ سے ڈرے اللہ اس کے لیے راستہ نکال دیتا ہے۔ (الطلاق: 2)', fazilat: 'روزہ تقویٰ کی تربیت ہے — آج کا دن خوب عبادت میں گزاریں۔' },
  { ayat: '﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ ﴾', tarjuma: 'اے ایمان والو! تم پر روزے فرض کیے گئے۔ (البقرہ: 183)', fazilat: 'روزہ فرض ہے — اس میں جسم اور روح دونوں کی پاکیزگی ہے۔' },
  { ayat: '﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ﴾', tarjuma: 'جب میرے بندے میرے بارے میں پوچھیں تو بے شک میں قریب ہوں۔ (البقرہ: 186)', fazilat: 'سحری میں دل سے دعا کریں — اللہ سنتا ہے اور قریب ہے۔' },
  { ayat: '﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', tarjuma: 'بے شک تکلیف کے ساتھ آسانی ہے۔ (الانشراح: 6)', fazilat: 'بھوک پیاس کی تکلیف جنت کی آسانی کا ذریعہ ہے۔' },
  { ayat: '﴿ وَاذْكُر رَّبَّكَ كَثِيرًا ﴾', tarjuma: 'اور اپنے رب کو بہت یاد کرو۔ (آل عمران: 41)', fazilat: 'سحری سے افطار تک ذکر الٰہی کریں — ہر تسبیح صدقہ ہے۔' },
  { ayat: '﴿ وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ﴾', tarjuma: 'صبر اور نماز سے مدد لو۔ (البقرہ: 45)', fazilat: 'روزہ صبر کی بہترین تربیت ہے — آج صبر کریں اجر پائیں۔' },
];

// ═══════════════════════════════════════════════════════════════════
// DAILY IFTAR FAZILAT — 30 Different
// ═══════════════════════════════════════════════════════════════════
const IFTAR_FAZILAT = [
  { dua: 'اَللّٰهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', tarjuma: 'اے اللہ! تیرے لیے روزہ رکھا، تجھ پر ایمان لایا، تجھ پر توکل کیا اور تیرے رزق سے افطار کیا۔', fazilat: '🕌 آپ ﷺ نے فرمایا: روزہ دار کو افطار کے وقت دعا رد نہیں ہوتی۔ (ابن ماجہ)' },
  { dua: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ', tarjuma: 'پیاس بجھ گئی، رگیں تر ہو گئیں اور اجر ثابت ہو گیا ان شاء اللہ۔', fazilat: '🌙 یہ دعا آپ ﷺ افطار کرتے وقت پڑھتے تھے۔ (ابو داؤد)' },
  { dua: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ', tarjuma: 'اے اللہ! میں تجھ سے تیری اس رحمت کے واسطے سے مانگتا ہوں جو ہر چیز پر محیط ہے۔', fazilat: '🤲 افطار سے پہلے خوب دعا مانگیں — یہ قبولیت کا وقت ہے۔' },
  { dua: 'اَللّٰهُمَّ اغْفِرْ لِي ذَنْبِي وَوَسِّعْ لِي فِي رِزْقِي', tarjuma: 'اے اللہ! میرے گناہ معاف فرما اور مجھے وسیع رزق دے۔', fazilat: '💛 رمضان میں ہر نیکی کا ثواب 70 گنا بڑھ جاتا ہے۔' },
  { dua: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', tarjuma: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی اور ہمیں آگ کے عذاب سے بچا۔', fazilat: '🌟 افطار کے بعد تراویح ضرور پڑھیں — سنت مؤکدہ ہے۔' },
];

// ─── Get today's rotation index ──────────────────────────────────────────────
function getDayIndex() {
  const start  = new Date('2026-02-17'); // Ramadan start
  const today  = new Date();
  const diff   = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff) % 30;
}

// ─── Get PKT time ─────────────────────────────────────────────────────────────
function getPKTTime() {
  return new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
}

function getPKTHHMM() {
  const pkt  = new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    hour12  : false,
    hour    : '2-digit',
    minute  : '2-digit',
  });
  return pkt; // e.g. "05:18"
}

function getPKTDate() {
  return new Date().toLocaleDateString('en-PK', {
    timeZone: 'Asia/Karachi',
    weekday : 'long',
    day     : 'numeric',
    month   : 'long',
    year    : 'numeric',
  });
}

// ─── Build Sehri Alert Message ────────────────────────────────────────────────
function buildSehriMsg(roza) {
  const dayIdx  = getDayIndex();
  const fazilat = SEHRI_FAZILAT[dayIdx % SEHRI_FAZILAT.length];
  const date    = getPKTDate();

  // Cities table
  const citiesTable = Object.values(RAMADAN_CITIES)
    .map(c => `│ ${c.emoji} *${c.name}*\n│    🌙 سحری: ${c.sehri} تک`)
    .join('\n│\n');

  return `🌙🌙🌙 *سحری کا وقت* 🌙🌙🌙

╭━━━『 🌙 *سحری الرٹ — SEHRI ALERT* 』━━━╮

📅 *تاریخ:* ${date}
☪️ *رمضان:* ${roza}واں روزہ | 1447 ہجری

╭─『 🕐 *پاکستان سحری اوقات* 』
│
${citiesTable}
│
╰──────────────────────────

╭─『 ⚠️ *اہم* 』
│ ⏰ سحری بند ہونے میں تھوڑا وقت
│ 🍽️ جلدی سحری مکمل کریں
│ 🤲 سحری کی نیت کریں
╰──────────────────────────

╭─『 📖 *آج کی آیت* 』
│ ${fazilat.ayat}
│
│ 🌸 *ترجمہ:*
│ ${fazilat.tarjuma}
╰──────────────────────────

╭─『 ✨ *سحری کی فضیلت* 』
│ ${fazilat.fazilat}
╰──────────────────────────

╭─『 🤲 *سحری کی دعا* 』
│ نَوَيْتُ صَوْمَ غَدٍ مِنْ شَهْرِ
│ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ
│ يَا اللَّهُ فَتَقَبَّلْ مِنِّي
│
│ _میں نے کل کے رمضان کے_
│ _فرض روزے کی نیت کی_
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

_🌙 رمضان مبارک — سحری بروقت کریں_`;
}

// ─── Build Iftar Alert Message ────────────────────────────────────────────────
function buildIftarMsg(roza) {
  const dayIdx  = getDayIndex();
  const fazilat = IFTAR_FAZILAT[dayIdx % IFTAR_FAZILAT.length];
  const date    = getPKTDate();

  // Cities table
  const citiesTable = Object.values(RAMADAN_CITIES)
    .map(c => `│ ${c.emoji} *${c.name}*\n│    🌅 افطاری: ${c.iftar}`)
    .join('\n│\n');

  return `🌅🌅🌅 *افطاری کا وقت* 🌅🌅🌅

╭━━━『 🌅 *افطاری الرٹ — IFTAR ALERT* 』━━━╮

📅 *تاریخ:* ${date}
☪️ *رمضان:* ${roza}واں روزہ | 1447 ہجری

╭─『 🕐 *پاکستان افطاری اوقات* 』
│
${citiesTable}
│
╰──────────────────────────

╭─『 🤲 *افطاری کی دعا* 』
│ ${fazilat.dua}
│
│ 🌸 *ترجمہ:*
│ ${fazilat.tarjuma}
╰──────────────────────────

╭─『 ✨ *افطاری کی فضیلت* 』
│ ${fazilat.fazilat}
╰──────────────────────────

╭─『 🍽️ *افطاری سنت طریقہ* 』
│ 🌴 کھجور سے افطار کریں
│ 💧 پانی سے روزہ کھولیں
│ 🤲 افطار سے پہلے دعا مانگیں
│ 🕌 مغرب کی نماز ادا کریں
╰──────────────────────────

╭─『 ⭐ *اجر و ثواب* 』
│ آپ ﷺ نے فرمایا:
│ _"روزہ دار کو دو خوشیاں ہیں:_
│ _ایک افطار کے وقت اور_
│ _ایک اللہ سے ملاقات کے وقت"_
│ *(صحیح بخاری)*
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

_🌅 اللہ آپ کا روزہ قبول فرمائے — آمین_`;
}

// ─── Active alerts store ──────────────────────────────────────────────────────
const activeAlerts  = new Map(); // groupJid → { sehriTimer, iftarTimer }

// ─── Schedule next Sehri/Iftar for a group ────────────────────────────────────
function scheduleDailyAlerts(sock, groupJid, roza = 1) {
  // Clear existing timers
  if (activeAlerts.has(groupJid)) {
    const old = activeAlerts.get(groupJid);
    if (old.sehriTimer) clearTimeout(old.sehriTimer);
    if (old.iftarTimer)  clearTimeout(old.iftarTimer);
  }

  const now   = new Date();
  const pktNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));

  // ── Calculate next Sehri time (Lahore: 05:18) ────────────
  const sehriTime = new Date(pktNow);
  sehriTime.setHours(5, 13, 0, 0); // 5 min before end (05:13)
  if (sehriTime <= pktNow) sehriTime.setDate(sehriTime.getDate() + 1);

  // ── Calculate next Iftar time (Lahore: 18:12) ────────────
  const iftarTime = new Date(pktNow);
  iftarTime.setHours(18, 12, 0, 0);
  if (iftarTime <= pktNow) iftarTime.setDate(iftarTime.getDate() + 1);

  const sehriDelay = sehriTime - pktNow;
  const iftarDelay = iftarTime - pktNow;

  const sehriTimer = setTimeout(async () => {
    try {
      const msg = buildSehriMsg(roza);
      await sock.sendMessage(groupJid, { text: msg });
      // Schedule tomorrow's sehri
      scheduleDailyAlerts(sock, groupJid, roza + 1);
    } catch (e) {
      console.error('[SEHRI ALERT ERROR]:', e.message);
    }
  }, sehriDelay);

  const iftarTimer = setTimeout(async () => {
    try {
      const msg = buildIftarMsg(roza);
      await sock.sendMessage(groupJid, { text: msg });
    } catch (e) {
      console.error('[IFTAR ALERT ERROR]:', e.message);
    }
  }, iftarDelay);

  activeAlerts.set(groupJid, { sehriTimer, iftarTimer, roza });

  return {
    sehriIn: Math.round(sehriDelay / 1000 / 60),
    iftarIn : Math.round(iftarDelay  / 1000 / 60),
  };
}

// ─── Plugin Export ────────────────────────────────────────────────────────────
export default {
  command    : ['ramadan', 'ramazan', 'sehri', 'iftar', 'suhoor', 'رمضان', 'سحری', 'افطار'],
  name       : 'islamic-auto-ramadan',
  category   : 'Islamic',
  description: 'Auto Sehri/Iftar alerts for all Pakistani cities',
  usage      : '.ramadan [on/off/sehri/iftar/times]',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text, isGroup }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🌙');

      const senderNum = sender?.split('@')[0] || 'User';
      const input     = (text || '').toLowerCase().trim();
      const dayIdx    = getDayIndex();
      const roza      = dayIdx + 1;

      // ── COMMAND: sehri — show now ─────────────────────────
      if (/sehri|suhoor|sahri|سحری/.test(input) && !/on|off/.test(input)) {
        const sehriMsg = buildSehriMsg(roza);
        await sock.sendMessage(from, { text: sehriMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('🌙');
        return;
      }

      // ── COMMAND: iftar — show now ─────────────────────────
      if (/iftar|iftaar|افطار/.test(input) && !/on|off/.test(input)) {
        const iftarMsg = buildIftarMsg(roza);
        await sock.sendMessage(from, { text: iftarMsg }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('🌅');
        return;
      }

      // ── COMMAND: times — show all cities ─────────────────
      if (/times?|time|اوقات|ٹائم/.test(input)) {
        const citiesSection = Object.values(RAMADAN_CITIES)
          .map(c => `│ ${c.emoji} *${c.name}*\n│    🌙 سحری: ${c.sehri}  🌅 افطار: ${c.iftar}`)
          .join('\n│\n');

        await sock.sendMessage(from, {
          text: `╭━━━『 ☪️ *رمضان اوقات 2026* 』━━━╮

📅 *${getPKTDate()}*
☪️ *${roza}واں روزہ | 1447 ہجری*

╭─『 🕐 *تمام شہروں کے اوقات* 』
│
${citiesSection}
│
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}sehri\`        → سحری الرٹ
│ \`${CONFIG.PREFIX}iftar\`        → افطاری الرٹ
│ \`${CONFIG.PREFIX}ramadan on\`   → Auto alerts on
│ \`${CONFIG.PREFIX}ramadan off\`  → Auto alerts off
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── COMMAND: on — enable auto alerts ─────────────────
      if (/^on$|enable|start/.test(input)) {
        if (!isGroup && !from.endsWith('@g.us')) {
          return await sock.sendMessage(from, {
            text: `❌ *Auto alerts صرف گروپ میں کام کرتے ہیں!*\n\n💡 گروپ میں لکھیں: \`${CONFIG.PREFIX}ramadan on\`\n\n${ownerFooter()}`,
          }, { quoted: msg });
        }

        const { sehriIn, iftarIn } = scheduleDailyAlerts(sock, from, roza);

        await sock.sendMessage(from, {
          text: `✅ *رمضان Auto Alerts چالو ہو گئے!*

╭━━━『 🌙 *RAMADAN AUTO ALERTS* 』━━━╮

✅ *Status:* Active ہے اس گروپ میں

╭─『 ⏰ *Next Alerts* 』
│ 🌙 *سحری:* ${sehriIn} منٹ میں
│ 🌅 *افطاری:* ${iftarIn} منٹ میں
╰──────────────────────────

╭─『 📋 *کیا ملے گا؟* 』
│ ✅ سحری سے 5 منٹ پہلے الرٹ
│ ✅ افطاری کے وقت الرٹ
│ ✅ ہر روز نئی آیت
│ ✅ ہر روز نئی دعا
│ ✅ تمام شہروں کے اوقات
│ ✅ سحری/افطاری کی فضیلت
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── COMMAND: off — disable alerts ─────────────────────
      if (/^off$|disable|stop/.test(input)) {
        if (activeAlerts.has(from)) {
          const old = activeAlerts.get(from);
          if (old.sehriTimer) clearTimeout(old.sehriTimer);
          if (old.iftarTimer)  clearTimeout(old.iftarTimer);
          activeAlerts.delete(from);
        }

        await sock.sendMessage(from, {
          text: `🔕 *Ramadan Auto Alerts بند ہو گئے!*\n\n💡 دوبارہ چالو کریں: \`${CONFIG.PREFIX}ramadan on\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
        if (typeof msg.react === 'function') await msg.react('✅');
        return;
      }

      // ── DEFAULT: Show main menu ─────────────────────────
      const citiesSection = Object.values(RAMADAN_CITIES)
        .map(c => `│ ${c.emoji} ${c.name}: سحری ${c.sehri} | افطار ${c.iftar}`)
        .join('\n');

      const menuMsg = `╭━━━『 🌙 *رمضان الرٹ سسٹم* 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

👋 *Requested by:* +${senderNum}
📅 *${getPKTDate()}*
☪️ *${roza}واں روزہ — 1447 ہجری*

╭─『 🕐 *آج کے اوقات (2026)* 』
${citiesSection}
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}sehri\`          → سحری میسج ابھی
│ \`${CONFIG.PREFIX}iftar\`          → افطاری میسج ابھی
│ \`${CONFIG.PREFIX}ramadan times\`  → تمام شہروں کے اوقات
│ \`${CONFIG.PREFIX}ramadan on\`     → Auto alerts (گروپ)
│ \`${CONFIG.PREFIX}ramadan off\`    → Alerts بند
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: menuMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('🌙');

    } catch (error) {
      console.error('[RAMADAN ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Ramadan plugin error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
