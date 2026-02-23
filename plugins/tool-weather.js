/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Weather Plugin        ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
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

function weatherEmoji(code) {
  if (code <= 232) return '⛈️'; // Thunderstorm
  if (code <= 321) return '🌧️'; // Drizzle
  if (code <= 531) return '🌧️'; // Rain
  if (code <= 622) return '❄️'; // Snow
  if (code <= 781) return '🌪️'; // Atmosphere
  if (code === 800) return '☀️'; // Clear
  if (code <= 804) return '☁️'; // Clouds
  return '🌤️';
}

async function getWeather(city) {
  const API_KEY = process.env.OPENWEATHER_KEY || '';
  if (!API_KEY) throw new Error('OPENWEATHER_KEY not set in .env\n🔗 Free: openweathermap.org');

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q',     city);
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', 'metric');
  if (url.hostname !== 'api.openweathermap.org') throw new Error('Invalid hostname.');

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
    if (res.status === 404) throw new Error(`City "${city}" not found!`);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

export default {
  command    : ['weather', 'mausam', 'temp'],
  name       : 'tool-weather',
  category   : 'Tools',
  description: 'Get real-time weather for any city',
  usage      : '.weather <city>',
  cooldown   : 5,

  handler: async ({ sock, msg, from, sender, text }) => {
    try {
      if (typeof msg.react === 'function') await msg.react('🌤️');

      const senderNum = sender?.split('@')[0] || 'User';
      const city      = (text || '').trim();

      if (!city) {
        return await sock.sendMessage(from, {
          text: `❌ *Please provide a city name!*\n\n📌 Usage: \`${CONFIG.PREFIX}weather <city>\`\n\n💡 Examples:\n▸ \`${CONFIG.PREFIX}weather Lahore\`\n▸ \`${CONFIG.PREFIX}weather Karachi\`\n▸ \`${CONFIG.PREFIX}weather London\`\n\n${ownerFooter()}`,
        }, { quoted: msg });
      }

      const data    = await getWeather(city);
      const emoji   = weatherEmoji(data.weather[0].id);
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });
      const sunset  = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit' });

      await sock.sendMessage(from, {
        text: `╭━━━『 🌤️ *WEATHER* 』━━━╮

👋 *Requested by:* +${senderNum}

╭─『 📍 *Location* 』
│ 🏙️ *City:*    ${data.name}, ${data.sys.country}
│ 🌍 *Coords:*  ${data.coord.lat.toFixed(2)}, ${data.coord.lon.toFixed(2)}
╰──────────────────────────

╭─『 ${emoji} *Current Weather* 』
│ 🌡️ *Temp:*      ${data.main.temp}°C
│ 🌡️ *Feels Like:* ${data.main.feels_like}°C
│ 📊 *Min/Max:*   ${data.main.temp_min}° / ${data.main.temp_max}°C
│ ☁️ *Condition:* ${data.weather[0].description}
│ 💧 *Humidity:*  ${data.main.humidity}%
│ 💨 *Wind:*      ${data.wind.speed} m/s
│ 👁️ *Visibility:* ${(data.visibility / 1000).toFixed(1)} km
│ 🔵 *Pressure:*  ${data.main.pressure} hPa
╰──────────────────────────

╭─『 ☀️ *Sun Times (PKT)* 』
│ 🌅 *Sunrise:* ${sunrise}
│ 🌇 *Sunset:*  ${sunset}
╰──────────────────────────

${ownerFooter()}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
      }, { quoted: msg });

      if (typeof msg.react === 'function') await msg.react('✅');

    } catch (error) {
      console.error('[WEATHER ERROR]:', error.message);
      try {
        if (typeof msg.react === 'function') await msg.react('❌');
        await sock.sendMessage(from, {
          text: `❌ *Weather failed!*\n⚠️ ${error.message}\n\n${ownerFooter()}`,
        }, { quoted: msg });
      } catch (_) {}
    }
  },
};
