/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Cron Job Manager      ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { OWNER } from '../config.js';

// ─── Active Cron Jobs ─────────────────────────────────────────────────────────
const cronJobs = new Map();

// ─── Registered group chats for broadcast crons ──────────────────────────────
const cronGroups = new Set();

export function registerCronGroup(jid) {
  cronGroups.add(jid);
}

export function unregisterCronGroup(jid) {
  cronGroups.delete(jid);
}

// ─── Helper: get PKT time parts ───────────────────────────────────────────────
function getPKT() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
  return {
    hours  : now.getHours(),
    minutes: now.getMinutes(),
    day    : now.getDay(),
    date   : now.getDate(),
    month  : now.getMonth(),
    year   : now.getFullYear(),
    full   : now,
  };
}

// ─── Helper: fetch prayer times ───────────────────────────────────────────────
// FIX: timezoneOffset added — API returns PKT times but we verify with PKT local
async function getPrayerTimes(city = process.env.DEFAULT_CITY || 'Karachi') {
  try {
    const url = new URL('https://api.aladhan.com/v1/timingsByCity');
    url.searchParams.set('city',    city);
    url.searchParams.set('country', process.env.DEFAULT_COUNTRY || 'Pakistan');
    url.searchParams.set('method',  process.env.PRAYER_METHOD   || '1');
    // FIX: timezone parameter — force API to return PKT times
    url.searchParams.set('timezonestring', 'Asia/Karachi');
    if (url.hostname !== 'api.aladhan.com') return null;

    const res  = await fetch(url.toString());
    const data = await res.json();
    return data?.data?.timings || null;
  } catch { return null; }
}

// ─── Parse time string "HH:MM" into { hours, minutes } ───────────────────────
function parseTime(timeStr) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  return { hours: h, minutes: m };
}

// ─── FIX: Check if currently Ramadan using PKT time ──────────────────────────
function isRamadan() {
  const pkt      = getPKT().full;
  const ramStart = new Date(process.env.RAMADAN_START || '2026-02-17');
  const ramEnd   = new Date(process.env.RAMADAN_END   || '2026-03-18');
  // Compare dates only — ignore time
  const today    = new Date(pkt.getFullYear(), pkt.getMonth(), pkt.getDate());
  const start    = new Date(ramStart.getFullYear(), ramStart.getMonth(), ramStart.getDate());
  const end      = new Date(ramEnd.getFullYear(), ramEnd.getMonth(), ramEnd.getDate());
  return today >= start && today <= end;
}

// ─── Send to all opted-in groups ─────────────────────────────────────────────
async function broadcastToGroups(sock, text) {
  for (const jid of cronGroups) {
    try {
      await sock.sendMessage(jid, { text });
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`[CRON] Failed to send to ${jid}:`, e.message);
    }
  }
}

// ─── Prayer info — hadith + fazilat for each prayer ──────────────────────────
const PRAYER_INFO = {
  Fajr: {
    hadith  : '📚 *حدیث:* رسول اللہ ﷺ نے فرمایا: "فجر کی دو رکعت دنیا اور جو کچھ اس میں ہے اس سے بہتر ہیں۔" (صحیح مسلم: 725)',
    fazilat : '✨ *فضیلت:* فجر کی نماز پڑھنے والا اللہ کی حفاظت میں رہتا ہے۔ فرشتے اس کے لیے صبح شام گواہی دیتے ہیں۔',
    dua     : 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا\nوَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    duaTrans: 'اے اللہ! تیرے ساتھ ہم نے صبح کی اور تیرے ساتھ شام کی',
  },
  Dhuhr: {
    hadith  : '📚 *حدیث:* نبی ﷺ نے فرمایا: "ظہر کی نماز کے وقت جہنم کے دروازے کھولے جاتے ہیں — جو اس وقت نماز پڑھے اللہ اسے جہنم سے بچاتا ہے۔" (ترمذی: 478)',
    fazilat : '✨ *فضیلت:* ظہر کی چار سنتیں پڑھنے والے پر جہنم حرام ہو جاتی ہے۔ دوپہر کی نماز دن کے بیچ میں اللہ کی یاد کا وقت ہے۔',
    dua     : 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ\nتَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    duaTrans: 'اے اللہ! تو سلامتی ہے اور تجھ سے سلامتی ہے',
  },
  Asr: {
    hadith  : '📚 *حدیث:* رسول اللہ ﷺ نے فرمایا: "جو شخص عصر کی نماز چھوڑ دے اس کے اعمال ضائع ہو جاتے ہیں۔" (بخاری: 553)',
    fazilat : '✨ *فضیلت:* عصر کی نماز "صلاۃ الوسطیٰ" ہے جس کی خاص طور پر حفاظت کا حکم دیا گیا ہے۔ فرشتے صبح و شام اس نماز میں جمع ہوتے ہیں۔',
    dua     : 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ\nوَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ',
    duaTrans: 'اے اللہ! میں سستی سے اور قبر کے عذاب سے تیری پناہ مانگتا ہوں',
  },
  Maghrib: {
    hadith  : '📚 *حدیث:* نبی ﷺ نے فرمایا: "مغرب کے بعد چھ رکعت پڑھنے والے کے گناہ معاف ہو جاتے ہیں چاہے سمندر کے جھاگ کے برابر ہوں۔" (ترمذی: 435)',
    fazilat : '✨ *فضیلت:* مغرب کی نماز دن کے اختتام پر اللہ کا شکر ادا کرنے کا موقع ہے۔ اس وقت کی دعا قبول ہوتی ہے۔',
    dua     : 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا\nوَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    duaTrans: 'اے اللہ! تیرے ساتھ ہم نے شام کی اور تیرے ساتھ صبح کی',
  },
  Isha: {
    hadith  : '📚 *حدیث:* رسول اللہ ﷺ نے فرمایا: "جو شخص عشاء کی نماز جماعت سے پڑھے گویا اس نے آدھی رات عبادت کی۔" (صحیح مسلم: 656)',
    fazilat : '✨ *فضیلت:* عشاء کی نماز منافقوں پر سب سے بھاری ہے۔ اس کا پڑھنا ایمان کی علامت اور رات کے آخری حصے میں بخشش کا ذریعہ ہے۔',
    dua     : 'اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ\nوَفَوَّضْتُ أَمْرِي إِلَيْكَ',
    duaTrans: 'اے اللہ! میں نے اپنے آپ کو تیرے سپرد کیا اور اپنا معاملہ تجھے سونپ دیا',
  },
};

// ─── Islamic prayer alert — with hadith & fazilat ────────────────────────────
async function prayerAlert(sock, prayerName, arabicName) {
  const info = PRAYER_INFO[prayerName] || {};

  const msg = `╭━━━『 🕌 *${prayerName.toUpperCase()} KA WAQT* 』━━━╮

🕌 *${prayerName} کی نماز کا وقت ہو گیا!*
🌙 *${arabicName}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${info.hadith || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${info.fazilat || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╭─『 🤲 *دعا* 』
│ ${info.dua || 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّا'}
╰──────────────────────────
_${info.duaTrans || ''}_

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
📢 ${OWNER.CHANNEL}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  await broadcastToGroups(sock, msg);
}

// ─── Sehri alert ─────────────────────────────────────────────────────────────
async function sehriAlert(sock) {
  const msg = `╭━━━『 🌙 *SEHRI ALERT* 』━━━╮

⏰ *سحری کا وقت ختم ہونے والا ہے!*

🤲 *سحری کی دعا:*
وَبِصَوْمِ غَدٍ نَّوَيْتُ مِن شَهْرِ رَمَضَانَ
_میں نے رمضان کے کل کے روزے کی نیت کی_

🍽️ جلدی سحری کریں — اذان میں صرف 30 منٹ باقی!

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  await broadcastToGroups(sock, msg);
}

// ─── Iftar alert ─────────────────────────────────────────────────────────────
async function iftarAlert(sock) {
  const msg = `╭━━━『 🌅 *IFTAR ALERT* 』━━━╮

🌅 *افطار کا وقت ہو گیا!*

🤲 *افطار کی دعا:*
اَللّٰھُمَّ اِنِّی لَکَ صُمْتُ وَبِکَ اٰمَنْتُ وَعَلَیْکَ تَوَکَّلْتُ وَعَلٰی رِزْقِکَ اَفْطَرْتُ

_اے اللہ! میں نے تیرے ہی لیے روزہ رکھا اور تجھ پر ہی ایمان لایا اور تجھ پر ہی بھروسہ کیا اور تیرے ہی دیے ہوئے رزق سے افطار کیا۔_

🍉 *افطار مبارک ہو!* 🌙

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  await broadcastToGroups(sock, msg);
}

// ─── Daily Quran verse ────────────────────────────────────────────────────────
async function dailyQuranVerse(sock) {
  try {
    const randomVerse = Math.floor(Math.random() * 6236) + 1;
    const url = new URL(`https://api.alquran.cloud/v1/ayah/${randomVerse}/editions/quran-uthmani,ur.maududi`);
    if (url.hostname !== 'api.alquran.cloud') return;

    const res  = await fetch(url.toString());
    const data = await res.json();
    const arabic = data?.data?.[0]?.text || '';
    const urdu   = data?.data?.[1]?.text || '';
    const surah  = data?.data?.[0]?.surah?.englishName || '';
    const ayah   = data?.data?.[0]?.numberInSurah || '';

    const msg = `╭━━━『 📖 *آیت روز* 』━━━╮

🌟 *روزانہ کی آیت*

╭─『 📖 *Arabic* 』
│ ${arabic}
╰──────────────────────────

╭─『 🇵🇰 *اردو ترجمہ* 』
│ ${urdu?.substring(0, 200)}
╰──────────────────────────

📍 *سورۃ ${surah} — آیت ${ayah}*

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
📢 ${OWNER.CHANNEL}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    await broadcastToGroups(sock, msg);
  } catch (e) {
    console.error('[CRON] Daily Quran error:', e.message);
  }
}

// ─── Good morning message ─────────────────────────────────────────────────────
async function goodMorning(sock) {
  const greetings = [
    'السلام علیکم! صبح بخیر 🌅',
    'آج کا دن مبارک ہو! ☀️',
    'اللہ آپ کا دن بہترین بنائے! 🌸',
    'صبح بخیر — نیا دن نئی امید! 🌞',
    'السلام علیکم — آج کا دن خیر و برکت والا ہو! 🤲',
  ];
  const msg = `╭━━━『 🌅 *صبح بخیر* 』━━━╮

${greetings[Math.floor(Math.random() * greetings.length)]}

╭─『 🤲 *صبح کی دعا* 』
│ اللَّهُمَّ بِكَ أَصْبَحْنَا
│ وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا
│ وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ
╰──────────────────────────

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
📢 ${OWNER.CHANNEL}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  await broadcastToGroups(sock, msg);
}

// ─── Good night message ───────────────────────────────────────────────────────
async function goodNight(sock) {
  const msg = `╭━━━『 🌙 *شب بخیر* 』━━━╮

🌙 *شب بخیر — اللہ حافظ!*

╭─『 🤲 *سونے کی دعا* 』
│  اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا
╰──────────────────────────

💤 *اچھی نیند لیں، کل ملیں گے!*

👑 *${OWNER.BOT_NAME}* — ${OWNER.FULL_NAME}
📢 ${OWNER.CHANNEL}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

  await broadcastToGroups(sock, msg);
}

// ─── Main Cron Scheduler ──────────────────────────────────────────────────────
export function startCronJobs(sock) {
  console.log('[CRON] Starting cron job manager...');

  const mainInterval = setInterval(async () => {
    const { hours, minutes } = getPKT();

    if (cronGroups.size === 0) return;

    try {

      if (hours === 7 && minutes === 0) {
        await goodMorning(sock);
      }

      if (hours === 22 && minutes === 0) {
        await goodNight(sock);
      }

      if (hours === 8 && minutes === 0) {
        await dailyQuranVerse(sock);
      }

      // FIX: Reset prayer times at midnight PKT
      if (hours === 0 && minutes === 0) {
        global._prayerTimesToday = null;
      }

      if (!global._prayerTimesToday) {
        global._prayerTimesToday = await getPrayerTimes();
      }

      const timings = global._prayerTimesToday;

      if (timings) {

        // Fajr
        const fajr = parseTime(timings.Fajr);
        if (hours === fajr.hours && minutes === fajr.minutes) {
          await prayerAlert(sock, 'Fajr', 'الفجر');
        }

        // Dhuhr
        const dhuhr = parseTime(timings.Dhuhr);
        if (hours === dhuhr.hours && minutes === dhuhr.minutes) {
          await prayerAlert(sock, 'Dhuhr', 'الظهر');
        }

        // Asr
        const asr = parseTime(timings.Asr);
        if (hours === asr.hours && minutes === asr.minutes) {
          await prayerAlert(sock, 'Asr', 'العصر');
        }

        // Maghrib
        const maghrib = parseTime(timings.Maghrib);
        if (hours === maghrib.hours && minutes === maghrib.minutes) {
          await prayerAlert(sock, 'Maghrib', 'المغرب');
          // FIX: isRamadan() uses PKT time
          if (process.env.RAMADAN_AUTO_MSG === 'true' && isRamadan()) {
            await iftarAlert(sock);
          }
        }

        // Isha
        const isha = parseTime(timings.Isha);
        if (hours === isha.hours && minutes === isha.minutes) {
          await prayerAlert(sock, 'Isha', 'العشاء');
        }

        // Sehri alert — 30 min before Fajr in Ramadan
        if (process.env.RAMADAN_SEHRI_ALERT === 'true' && isRamadan()) {
          // FIX: correct sehri time calculation
          let sehriH = fajr.hours;
          let sehriM = fajr.minutes - 30;
          if (sehriM < 0) {
            sehriM += 60;
            sehriH -= 1;
            if (sehriH < 0) sehriH = 23;
          }
          if (hours === sehriH && minutes === sehriM) {
            await sehriAlert(sock);
          }
        }
      }

    } catch (e) {
      console.error('[CRON] Error in job:', e.message);
    }

  }, 60000);

  cronJobs.set('main', { interval: mainInterval, name: 'Main Cron', running: true });
  console.log('[CRON] ✅ Cron jobs started successfully!');
}

// ─── Stop all cron jobs ───────────────────────────────────────────────────────
export function stopCronJobs() {
  for (const [id, job] of cronJobs) {
    clearInterval(job.interval);
    console.log(`[CRON] Stopped job: ${job.name}`);
  }
  cronJobs.clear();
  console.log('[CRON] All cron jobs stopped.');
}

// ─── Get cron status ──────────────────────────────────────────────────────────
export function getCronStatus() {
  return {
    activeJobs      : cronJobs.size,
    registeredGroups: cronGroups.size,
    jobs: [...cronJobs.entries()].map(([id, j]) => ({
      id, name: j.name, running: j.running,
    })),
  };
}

export default {
  startCronJobs,
  stopCronJobs,
  getCronStatus,
  registerCronGroup,
  unregisterCronGroup,
};
