/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Downloader Lib   ┃
┃       Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import axios from 'axios';
import { sanitizeUrl } from './utils.js';

// ═══════════════════════════════════════════════════
//  GENERIC BUFFER FETCHER
// ═══════════════════════════════════════════════════

export async function fetchBuffer(url, options = {}) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid or unsafe URL');
  const res = await axios.get(safeUrl, {
    responseType: 'arraybuffer',
    timeout: 60000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      ...options.headers,
    },
    ...options,
  });
  return Buffer.from(res.data);
}

// ═══════════════════════════════════════════════════
//  YOUTUBE
// ═══════════════════════════════════════════════════

export async function ytSearch(query) {
  try {
    const res = await axios.get(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
    );
    const match = res.data.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!match) throw new Error('No results');
    const data     = JSON.parse(match[1]);
    const contents = data?.contents
      ?.twoColumnSearchResultsRenderer
      ?.primaryContents?.sectionListRenderer
      ?.contents?.[0]?.itemSectionRenderer?.contents || [];
    const results = [];
    for (const item of contents) {
      const v = item?.videoRenderer;
      if (!v) continue;
      results.push({
        title    : v.title?.runs?.[0]?.text || 'Unknown',
        videoId  : v.videoId,
        url      : `https://www.youtube.com/watch?v=${v.videoId}`,
        duration : v.lengthText?.simpleText || 'N/A',
        views    : v.viewCountText?.simpleText || 'N/A',
        thumbnail: v.thumbnail?.thumbnails?.slice(-1)[0]?.url || '',
        channel  : v.ownerText?.runs?.[0]?.text || 'Unknown',
      });
      if (results.length >= 5) break;
    }
    return results;
  } catch (err) {
    throw new Error('YouTube search failed: ' + err.message);
  }
}

export async function ytInfo(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  const idMatch = safeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!idMatch) throw new Error('Invalid YouTube URL');
  const videoId = idMatch[1];
  try {
    const res = await axios.get(
      `https://www.youtube.com/watch?v=${videoId}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
    );
    const match = res.data.match(/var ytInitialData = ({.*?});<\/script>/s);
    if (!match) throw new Error('Could not fetch info');
    const data = JSON.parse(match[1]);
    const vd   = data?.videoDetails || {};
    return {
      title      : vd.title || 'Unknown',
      videoId,
      url        : `https://www.youtube.com/watch?v=${videoId}`,
      duration   : parseInt(vd.lengthSeconds || 0),
      views      : vd.viewCount || '0',
      description: (vd.shortDescription || '').substring(0, 200),
      thumbnail  : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      channel    : vd.author || 'Unknown',
    };
  } catch (err) {
    throw new Error('Could not fetch video info: ' + err.message);
  }
}

async function cobaltDownload(url, options = {}) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  const res = await axios.post(
    'https://cobalt.tools/api/json',
    { url: safeUrl, ...options },
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept'      : 'application/json',
      },
      timeout: 30000,
    }
  );
  if (res.data?.url) return res.data.url;
  throw new Error('No download URL from cobalt');
}

export async function ytmp3(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  const idMatch = safeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!idMatch) throw new Error('Invalid YouTube URL');
  const videoId = idMatch[1];
  try {
    const dlUrl  = await cobaltDownload(safeUrl, { isAudioOnly: true, aFormat: 'mp3' });
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, title: `audio_${videoId}`, ext: 'mp3' };
  } catch (_) {
    try {
      const res = await axios.get(
        `https://yt-dlp-api.vercel.app/audio?url=${encodeURIComponent(safeUrl)}`,
        { responseType: 'arraybuffer', timeout: 60000 }
      );
      return { buffer: Buffer.from(res.data), title: `audio_${videoId}`, ext: 'mp3' };
    } catch (e) {
      throw new Error('YouTube MP3 failed: ' + e.message);
    }
  }
}

export async function ytmp4(url, quality = '720') {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  const idMatch = safeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!idMatch) throw new Error('Invalid YouTube URL');
  const videoId = idMatch[1];
  try {
    const dlUrl  = await cobaltDownload(safeUrl, { vQuality: quality });
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, title: `video_${videoId}`, ext: 'mp4' };
  } catch (e) {
    throw new Error('YouTube MP4 failed: ' + e.message);
  }
}

// play / song / video helper
export async function playSearch(query) {
  const results = await ytSearch(query);
  if (!results.length) throw new Error('No results: ' + query);
  return results[0];
}

export async function playAudio(query) {
  const info = await playSearch(query);
  const dl   = await ytmp3(info.url);
  return { ...dl, info };
}

export async function playVideo(query) {
  const info = await playSearch(query);
  const dl   = await ytmp4(info.url);
  return { ...dl, info };
}

// ═══════════════════════════════════════════════════
//  TIKTOK  (ttmp3 / tiktok)
// ═══════════════════════════════════════════════════

export async function tiktokDl(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  try {
    const res = await axios.post(
      'https://www.tikwm.com/api/',
      `url=${encodeURIComponent(safeUrl)}&hd=1`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 30000,
      }
    );
    const d = res.data?.data;
    if (!d) throw new Error('No data');
    return {
      title        : d.title || 'TikTok Video',
      author       : d.author?.nickname || 'Unknown',
      noWatermark  : d.play || d.hdplay || '',
      withWatermark: d.wmplay || '',
      thumbnail    : d.cover || '',
      duration     : d.duration || 0,
      music        : d.music || '',
    };
  } catch (err) {
    throw new Error('TikTok download failed: ' + err.message);
  }
}

export async function tiktokMp3(url) {
  const info = await tiktokDl(url);
  if (!info.music) throw new Error('No music in this TikTok');
  const buffer = await fetchBuffer(info.music);
  return { buffer, title: info.title, ext: 'mp3' };
}

// ═══════════════════════════════════════════════════
//  INSTAGRAM  (instagram / igreel)
// ═══════════════════════════════════════════════════

export async function instagramDl(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  try {
    const dlUrl  = await cobaltDownload(safeUrl);
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, ext: 'mp4', title: 'instagram_video' };
  } catch (err) {
    throw new Error('Instagram download failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  FACEBOOK
// ═══════════════════════════════════════════════════

export async function facebookDl(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  try {
    const dlUrl  = await cobaltDownload(safeUrl);
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, ext: 'mp4', title: 'facebook_video' };
  } catch (err) {
    throw new Error('Facebook download failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  TWITTER / X
// ═══════════════════════════════════════════════════

export async function twitterDl(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  try {
    const dlUrl  = await cobaltDownload(safeUrl);
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, ext: 'mp4', title: 'twitter_video' };
  } catch (err) {
    throw new Error('Twitter download failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  SOUNDCLOUD
// ═══════════════════════════════════════════════════

export async function soundcloudDl(url) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid URL');
  try {
    const dlUrl  = await cobaltDownload(safeUrl, { isAudioOnly: true, aFormat: 'mp3' });
    const buffer = await fetchBuffer(dlUrl);
    return { buffer, ext: 'mp3', title: 'soundcloud_audio' };
  } catch (err) {
    throw new Error('SoundCloud download failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  APK / PLAYSTORE
// ═══════════════════════════════════════════════════

export async function playstoreSearch(query) {
  try {
    const res = await axios.get(
      `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
    );
    const matches = res.data.match(
      /href="\/store\/apps\/details\?id=([^"]+)"/g
    ) || [];
    const appIds = [...new Set(
      matches.map(m => m.match(/id=([^"]+)/)?.[1]).filter(Boolean)
    )].slice(0, 5);
    if (!appIds.length) throw new Error('No apps found');
    return appIds.map(id => ({
      name    : id,
      id,
      url     : `https://play.google.com/store/apps/details?id=${id}`,
      apkpure : `https://apkpure.com/search?q=${encodeURIComponent(id)}`,
    }));
  } catch (err) {
    throw new Error('Play Store search failed: ' + err.message);
  }
}

export async function apkDownload(query) {
  try {
    const res = await axios.get(
      `https://apkpure.com/search?q=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
    );
    const match = res.data.match(/href="(\/[^"]+\/download\?from=details[^"]*)"/);
    if (!match) throw new Error('APK not found');
    return {
      title      : query,
      downloadUrl: `https://apkpure.com${match[1]}`,
      source     : 'APKPure',
    };
  } catch (err) {
    throw new Error('APK download failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  MOVIE INFO
// ═══════════════════════════════════════════════════

export async function movieSearch(query) {
  try {
    const res = await axios.get(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=thewb`,
      { timeout: 15000 }
    );
    if (res.data?.Search?.length) return res.data.Search[0];

    // Fallback: TMDB free search
    const tmdb = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=8265bd1679663a7ea12ac168da84d2e8`,
      { timeout: 15000 }
    );
    const m = tmdb.data?.results?.[0];
    if (!m) throw new Error('Movie not found');
    return {
      Title   : m.title,
      Year    : m.release_date?.split('-')[0] || 'N/A',
      Plot    : m.overview || 'N/A',
      Poster  : m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      Rating  : m.vote_average || 'N/A',
      imdbID  : m.id,
    };
  } catch (err) {
    throw new Error('Movie search failed: ' + err.message);
  }
}

// ═══════════════════════════════════════════════════
//  NAAT / BAYAN  (Islamic audio search via YouTube)
// ═══════════════════════════════════════════════════

export async function naatSearch(query) {
  const results = await ytSearch(`naat ${query}`);
  if (!results.length) throw new Error('No naat found');
  return results[0];
}

export async function naatDownload(query) {
  const info = await naatSearch(query);
  const dl   = await ytmp3(info.url);
  return { ...dl, info };
}

export async function bayanSearch(query) {
  const results = await ytSearch(`bayan ${query}`);
  if (!results.length) throw new Error('No bayan found');
  return results[0];
}

export async function bayanDownload(query) {
  const info = await bayanSearch(query);
  const dl   = await ytmp3(info.url);
  return { ...dl, info };
}

// ═══════════════════════════════════════════════════
//  WALLPAPER
// ═══════════════════════════════════════════════════

export async function wallpaperSearch(query) {
  try {
    const res = await axios.get(
      `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(query)}&categories=111&purity=100&atleast=1920x1080&sorting=relevance`,
      { timeout: 15000 }
    );
    const results = res.data?.data || [];
    if (!results.length) throw new Error('No wallpapers found');
    return results.slice(0, 5).map(w => ({
      url      : w.path,
      thumbnail: w.thumbs?.large || w.path,
      resolution: w.resolution,
      size     : w.file_size,
    }));
  } catch (err) {
    // Fallback: Unsplash
    try {
      const fallback = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&client_id=YOUR_KEY`,
        { timeout: 15000 }
      );
      const items = fallback.data?.results || [];
      return items.map(i => ({
        url      : i.urls?.full || i.urls?.regular,
        thumbnail: i.urls?.thumb,
        resolution: `${i.width}x${i.height}`,
      }));
    } catch {
      throw new Error('Wallpaper search failed: ' + err.message);
    }
  }
}

// ═══════════════════════════════════════════════════
//  PINTEREST
// ═══════════════════════════════════════════════════

export async function pinterestDl(query) {
  try {
    const res = await axios.get(
      `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept'    : 'text/html',
        },
        timeout: 15000,
      }
    );
    const matches = res.data.match(/"orig":\{"url":"(https:\/\/i\.pinimg\.com[^"]+)"/g) || [];
    const images  = matches
      .map(m => m.match(/"url":"([^"]+)"/)?.[1])
      .filter(Boolean)
      .slice(0, 5);
    if (!images.length) throw new Error('No images found');
    return images;
  } catch (err) {
    throw new Error('Pinterest failed: ' + err.message);
  }
}

export default {
  fetchBuffer,
  ytSearch, ytInfo, ytmp3, ytmp4,
  playSearch, playAudio, playVideo,
  tiktokDl, tiktokMp3,
  instagramDl,
  facebookDl,
  twitterDl,
  soundcloudDl,
  playstoreSearch, apkDownload,
  movieSearch,
  naatSearch, naatDownload,
  bayanSearch, bayanDownload,
  wallpaperSearch,
  pinterestDl,
};
