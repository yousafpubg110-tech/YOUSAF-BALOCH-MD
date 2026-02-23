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
const cronJobs = new Map(); // jobId → { interval, name, running }

// ─── Registered group chats for broadcast crons ──────────────────────────────
const cronGroups = new Set(); // JIDs that opted-in to scheduled messages

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
    day    : now.getDay(),    // 0 = Sunday
    date   : now.getDate(),
    month  : now.getMonth(),  // 0-indexed
    year   : now.getFullYear(),
    full   : now,
  };
}

// ─── Helper: fetch prayer times ───────────────────────────────────────────────
async function getPrayerTimes(city = process.env.DEFAULT_CITY || 'Lahore') {
  try {
    const url = new URL('https://api.aladhan.com/v1/timingsByCity');
    url.searchParams.set('city',    city);
    url.searchParams.set('country', process.env.DEFAULT_COUNTRY || 'Pakistan');
    url.searchParams.set('method',  process.env.PRAYER_METHOD   || '1');
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

// ─── Islamic prayer alert ─────────────────────────────────────────────────────
async function prayerAlert(sock, prayerName, arabicName) {
  const msg = `╭━━━『 🕌 *${prayerName} KA WAQT* 』━━━╮

🕌 *${prayerName} کی نماز کا وقت ہو گیا!*
🌙 *${arabicName}*

╭─『 🤲 *دعا* 』
│ اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ
│ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّا
╰──────────────────────────

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
اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
_اے اللہ! میں نے تیرے لیے روزہ رکھا اور
تیرے رزق سے افطار کیا_

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
│ بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا
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

  // Run every minute
  const mainInterval = setInterval(async () => {
    const { hours, minutes } = getPKT();
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Skip if no groups registered
    if (cronGroups.size === 0) return;

    try {

      // ── Good Morning (7:00 AM) ──────────────────────────
      if (hours === 7 && minutes === 0) {
        await goodMorning(sock);
      }

      // ── Good Night (10:00 PM) ───────────────────────────
      if (hours === 22 && minutes === 0) {
        await goodNight(sock);
      }

      // ── Daily Quran Verse (8:00 AM) ─────────────────────
      if (hours === 8 && minutes === 0) {
        await dailyQuranVerse(sock);
      }

      // ── Prayer Times — Fetch once at start of day ────────
      if (hours === 0 && minutes === 0) {
        // Reset daily prayer times
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
          // Also Iftar alert (same time in Ramadan)
          if (process.env.RAMADAN_AUTO_MSG === 'true') {
            const now     = new Date();
            const ramStart = new Date(process.env.RAMADAN_START || '2026-02-17');
            const ramEnd   = new Date(process.env.RAMADAN_END   || '2026-03-18');
            if (now >= ramStart && now <= ramEnd) {
              await iftarAlert(sock);
            }
          }
        }

        // Isha
        const isha = parseTime(timings.Isha);
        if (hours === isha.hours && minutes === isha.minutes) {
          await prayerAlert(sock, 'Isha', 'العشاء');
        }

        // Sehri alert (30 min before Fajr in Ramadan)
        if (process.env.RAMADAN_SEHRI_ALERT === 'true') {
          const now      = new Date();
          const ramStart = new Date(process.env.RAMADAN_START || '2026-02-17');
          const ramEnd   = new Date(process.env.RAMADAN_END   || '2026-03-18');
          if (now >= ramStart && now <= ramEnd) {
            const sehriH = fajr.minutes >= 30
              ? fajr.hours
              : fajr.hours - 1;
            const sehriM = fajr.minutes >= 30
              ? fajr.minutes - 30
              : 60 + fajr.minutes - 30;
            if (hours === sehriH && minutes === sehriM) {
              await sehriAlert(sock);
            }
          }
        }
      }

    } catch (e) {
      console.error('[CRON] Error in job:', e.message);
    }

  }, 60000); // Every 60 seconds

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
    activeJobs  : cronJobs.size,
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
  
