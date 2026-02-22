/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Hajj Guide Plugin      ┃
┃        Created by MR YOUSAF BALOCH          ┃
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

const HAJJ_DATA = {
  hajj: {
    title: '🕋 حج — Hajj Guide',
    intro: 'حج اسلام کا پانچواں رکن ہے — ہر صاحب استطاعت مسلمان پر زندگی میں ایک بار فرض ہے۔',
    arkan: [
      { day: '1 — 8 ذو الحجہ',  name: 'احرام', detail: 'میقات پر احرام باندھیں، نیت کریں، تلبیہ پڑھیں۔ لبیک اللهم لبیک...' },
      { day: '2 — 9 ذو الحجہ',  name: 'عرفات', detail: 'حج کا رکن اعظم — غروب تک وقوف عرفات — دعائیں مانگیں۔' },
      { day: '3 — 10 ذو الحجہ', name: 'مزدلفہ', detail: 'رات مزدلفہ میں گزاریں — کنکریاں اٹھائیں — فجر پڑھیں۔' },
      { day: '4 — 10 ذو الحجہ', name: 'رمی جمرات', detail: 'شیطان کو 7 کنکریاں ماریں۔ بڑے جمرہ کو — اللہ اکبر کہتے ہوئے۔' },
      { day: '5 — 10 ذو الحجہ', name: 'قربانی', detail: 'جانور ذبح کریں — حلال ہو — اللہ کی خوشنودی کیلئے۔' },
      { day: '6 — 10 ذو الحجہ', name: 'حلق یا قصر', detail: 'سر منڈوائیں یا بال کٹوائیں — احرام کھولیں۔' },
      { day: '7 — 10 ذو الحجہ', name: 'طواف الافاضہ', detail: 'کعبہ کے 7 چکر لگائیں — صفا مروہ کی سعی کریں۔' },
      { day: '8 — 11-13 ذو الحجہ', name: 'منیٰ میں قیام', detail: 'منیٰ میں رہیں — تینوں جمرات کو کنکریاں ماریں۔' },
    ],
    tips: [
      'پاکستان سے حج کا خرچ تقریباً 12-15 لاکھ روپے ہے',
      'وزارت مذہبی امور سے رجسٹریشن کروائیں',
      'بیلٹ کے ذریعے انتخاب ہوتا ہے',
      'پاسپورٹ 6 ماہ valid ہونا چاہیے',
      'ویکسین لازمی — Meningitis, COVID',
    ],
  },
  umrah: {
    title: '🕌 عمرہ — Umrah Guide',
    intro: 'عمرہ سنت موکدہ ہے — سال کے کسی بھی وقت ادا کیا جا سکتا ہے۔',
    arkan: [
      { step: '1', name: 'احرام', detail: 'میقات پر احرام باندھیں — نیت کریں: اللهم إني أريد العمرة فيسرها لي' },
      { step: '2', name: 'طواف', detail: 'کعبہ کے 7 چکر — حجر اسود سے شروع — بسم اللہ اللہ اکبر کہتے ہوئے' },
      { step: '3', name: 'سعی', detail: 'صفا سے مروہ — 7 چکر — حضرت ہاجرہ ؑ کی یاد میں' },
      { step: '4', name: 'حلق/قصر', detail: 'بال منڈوائیں یا کٹوائیں — عمرہ مکمل' },
    ],
    tips: [
      'عمرہ ویزہ آن لائن لگتا ہے: visa.mofa.gov.sa',
      'پاکستان سے خرچ تقریباً 2-4 لاکھ روپے',
      'رمضان میں عمرہ کا ثواب حج کے برابر ہے (بخاری)',
      'ہوٹل مسجد الحرام کے قریب لیں',
    ],
  },
};

export default {
  command    : ['hajj', 'umrah', 'haj', 'حج', 'عمرہ'],
  name       : 'islamic-hajj-guide',
  category   : 'Islamic',
  description: 'Complete Hajj and Umrah guide in Urdu',
  usage      : '.hajj OR .umrah',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🕋');

      const senderNum = sender?.split('@')[0] || 'User';
      const isUmrah   = /umrah|عمرہ/.test((text || '').toLowerCase());
      const data      = isUmrah ? HAJJ_DATA.umrah : HAJJ_DATA.hajj;

      let stepsSection = '';
      if (isUmrah) {
        stepsSection = data.arkan.map(s =>
          `│ *${s.step}.* 🕌 *${s.name}*\n│    ${s.detail}`
        ).join('\n│\n');
      } else {
        stepsSection = data.arkan.map(s =>
          `│ 📅 *${s.day}*\n│ 🕋 *${s.name}*\n│    ${s.detail}`
        ).join('\n│\n');
      }

      const tipsSection = data.tips.map((t, i) => `│ ${i + 1}. ${t}`).join('\n');

      const guideMsg = `╭━━━『 ${data.title} 』━━━╮

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
👋 *Requested by:* +${senderNum}

╭─『 ℹ️ *تعارف* 』
│ ${data.intro}
╰──────────────────────────

╭─『 📋 *${isUmrah ? 'عمرہ کے ارکان' : 'حج کے ارکان'}* 』
│
${stepsSection}
│
╰──────────────────────────

╭─『 💡 *اہم معلومات* 』
${tipsSection}
╰──────────────────────────

╭─『 🤲 *دعا* 』
│ اَللّٰهُمَّ تَقَبَّلْ مِنَّا
│ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ
│ _اے اللہ ہم سے قبول فرما_
│ _بے شک تو سننے والا جاننے والا ہے_
╰──────────────────────────

╭─『 💡 *Commands* 』
│ \`${CONFIG.PREFIX}hajj\`  → حج گائیڈ
│ \`${CONFIG.PREFIX}umrah\` → عمرہ گائیڈ
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await sock.sendMessage(from, { text: guideMsg }, { quoted: msg });
      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[HAJJ ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Hajj guide error!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
