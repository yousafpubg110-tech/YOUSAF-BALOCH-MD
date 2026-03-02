/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃   YOUSAF-BALOCH-MD — Settings Menu        ┃
┃        Created by MR YOUSAF BALOCH         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
*/

import { OWNER, CONFIG } from '../config.js';
import fs from 'fs';
import path from 'path';

// ── تمام Settings کی تعریف (مینو کے مطابق) ─────────────────────
const SETTINGS = {
  // ══════════════════════════════════════════
  // 🏠 MAIN MENU (8)
  // ══════════════════════════════════════════
  menu: {
    label: '📋 Main Menu',
    key  : 'MENU',
    desc : 'Full menu display',
    category: '🏠 MAIN MENU'
  },
  alive: {
    label: '💓 Bot Status',
    key  : 'ALIVE',
    desc : 'Check bot alive status',
    category: '🏠 MAIN MENU'
  },
  ping: {
    label: '🏓 Speed Test',
    key  : 'PING',
    desc : 'Check bot response speed',
    category: '🏠 MAIN MENU'
  },
  runtime: {
    label: '⏱️ Bot Uptime',
    key  : 'RUNTIME',
    desc : 'Check bot running time',
    category: '🏠 MAIN MENU'
  },
  owner: {
    label: '👑 Owner Info',
    key  : 'OWNER_INFO',
    desc : 'Show owner information',
    category: '🏠 MAIN MENU'
  },
  support: {
    label: '🤝 Support Group',
    key  : 'SUPPORT',
    desc : 'Join support group',
    category: '🏠 MAIN MENU'
  },
  script: {
    label: '📜 Bot Script',
    key  : 'SCRIPT',
    desc : 'Get bot script link',
    category: '🏠 MAIN MENU'
  },
  settings: {
    label: '⚙️ Bot Settings',
    key  : 'SETTINGS',
    desc : 'Configure bot settings',
    category: '🏠 MAIN MENU'
  },

  // ══════════════════════════════════════════
  // ⚙️ AUTO FEATURES (10)
  // ══════════════════════════════════════════
  autoviewstatus: {
    label: '👁️ Auto View Status',
    key  : 'AUTO_VIEW_STATUS',
    desc : 'Automatically view all statuses',
    category: '⚙️ AUTO FEATURES'
  },
  antidelete: {
    label: '🗑️ Anti Delete',
    key  : 'ANTI_DELETE',
    desc : 'Show deleted messages',
    category: '⚙️ AUTO FEATURES'
  },
  autoreact: {
    label: '😊 Auto React',
    key  : 'AUTO_REACT',
    desc : 'Auto react to messages',
    category: '⚙️ AUTO FEATURES'
  },
  autoread: {
    label: '📖 Auto Read',
    key  : 'AUTO_READ',
    desc : 'Auto read messages',
    category: '⚙️ AUTO FEATURES'
  },
  autotyping: {
    label: '⌨️ Auto Typing',
    key  : 'AUTO_TYPING',
    desc : 'Show typing indicator',
    category: '⚙️ AUTO FEATURES'
  },
  autorecording: {
    label: '🎙️ Auto Recording',
    key  : 'AUTO_RECORDING',
    desc : 'Show recording status',
    category: '⚙️ AUTO FEATURES'
  },
  autobio: {
    label: '📝 Auto Bio',
    key  : 'AUTO_BIO',
    desc : 'Auto rotate bio',
    category: '⚙️ AUTO FEATURES'
  },
  anticall: {
    label: '📵 Anti Call',
    key  : 'ANTI_CALL',
    desc : 'Auto reject calls',
    category: '⚙️ AUTO FEATURES'
  },
  autoreply: {
    label: '💬 Auto Reply',
    key  : 'AUTO_REPLY',
    desc : 'Auto reply when offline',
    category: '⚙️ AUTO FEATURES'
  },
  autodownload: {
    label: '⬇️ Auto Download',
    key  : 'AUTO_DOWNLOAD',
    desc : 'Auto download media',
    category: '⚙️ AUTO FEATURES'
  },

  // ══════════════════════════════════════════
  // 🤖 AI FEATURES (30)
  // ══════════════════════════════════════════
  ai: {
    label: '🤖 Gemini AI',
    key  : 'GEMINI_AI',
    desc : 'Google Gemini AI chat',
    category: '🤖 AI FEATURES'
  },
  chatgpt: {
    label: '💬 ChatGPT',
    key  : 'CHATGPT',
    desc : 'OpenAI ChatGPT response',
    category: '🤖 AI FEATURES'
  },
  gpt: {
    label: '🔄 GPT Response',
    key  : 'GPT',
    desc : 'GPT model response',
    category: '🤖 AI FEATURES'
  },
  gpt4: {
    label: '🚀 GPT-4 AI',
    key  : 'GPT4',
    desc : 'GPT-4 advanced AI',
    category: '🤖 AI FEATURES'
  },
  bing: {
    label: '🔍 Bing AI',
    key  : 'BING',
    desc : 'Microsoft Bing AI',
    category: '🤖 AI FEATURES'
  },
  blackbox: {
    label: '⬛ Blackbox AI',
    key  : 'BLACKBOX',
    desc : 'Blackbox coding AI',
    category: '🤖 AI FEATURES'
  },
  mixtral: {
    label: '🔄 Mixtral AI',
    key  : 'MIXTRAL',
    desc : 'Mixtral 8x7B AI',
    category: '🤖 AI FEATURES'
  },
  deepseek: {
    label: '🔍 DeepSeek AI',
    key  : 'DEEPSEEK',
    desc : 'DeepSeek AI assistant',
    category: '🤖 AI FEATURES'
  },
  copilot: {
    label: '👨‍💻 Copilot AI',
    key  : 'COPILOT',
    desc : 'Microsoft Copilot',
    category: '🤖 AI FEATURES'
  },
  claude: {
    label: '🧠 Claude AI',
    key  : 'CLAUDE',
    desc : 'Anthropic Claude AI',
    category: '🤖 AI FEATURES'
  },
  perplexity: {
    label: '🤔 Perplexity AI',
    key  : 'PERPLEXITY',
    desc : 'Perplexity AI search',
    category: '🤖 AI FEATURES'
  },
  meta: {
    label: '📘 Meta AI',
    key  : 'META',
    desc : 'Meta Llama AI',
    category: '🤖 AI FEATURES'
  },
  bard: {
    label: '🎭 Google Bard',
    key  : 'BARD',
    desc : 'Google Bard AI',
    category: '🤖 AI FEATURES'
  },
  imagine: {
    label: '🖼️ AI Imagine',
    key  : 'IMAGINE',
    desc : 'Generate AI art',
    category: '🤖 AI FEATURES'
  },
  aiimage: {
    label: '🎨 AI Image',
    key  : 'AI_IMAGE',
    desc : 'Generate AI images',
    category: '🤖 AI FEATURES'
  },
  dalle: {
    label: '🎭 DALL-E',
    key  : 'DALLE',
    desc : 'DALL-E image generation',
    category: '🤖 AI FEATURES'
  },
  upscale: {
    label: '🔍 8K Upscaler',
    key  : 'UPSCALE',
    desc : 'Upscale images to 8K',
    category: '🤖 AI FEATURES'
  },
  aicode: {
    label: '💻 AI Code Generator',
    key  : 'AI_CODE',
    desc : 'Generate code with AI',
    category: '🤖 AI FEATURES'
  },
  explain: {
    label: '📚 Explain Code',
    key  : 'EXPLAIN',
    desc : 'Explain programming code',
    category: '🤖 AI FEATURES'
  },
  debug: {
    label: '🐛 Debug Code',
    key  : 'DEBUG',
    desc : 'Debug code with AI',
    category: '🤖 AI FEATURES'
  },
  translate: {
    label: '🌐 Translate',
    key  : 'TRANSLATE',
    desc : 'Translate text',
    category: '🤖 AI FEATURES'
  },
  doctor: {
    label: '👨‍⚕️ AI Doctor',
    key  : 'DOCTOR',
    desc : 'Medical advice AI',
    category: '🤖 AI FEATURES'
  },
  lawyer: {
    label: '⚖️ AI Lawyer',
    key  : 'LAWYER',
    desc : 'Legal advice AI',
    category: '🤖 AI FEATURES'
  },
  homework: {
    label: '📝 Homework Help',
    key  : 'HOMEWORK',
    desc : 'Homework assistance AI',
    category: '🤖 AI FEATURES'
  },
  khuwab: {
    label: '💭 Dream Tafsir',
    key  : 'KHUWAB',
    desc : 'Dream interpretation',
    category: '🤖 AI FEATURES'
  },
  resume: {
    label: '📄 Resume Builder',
    key  : 'RESUME',
    desc : 'AI resume builder',
    category: '🤖 AI FEATURES'
  },
  romanurdu: {
    label: '🇵🇰 Roman Urdu AI',
    key  : 'ROMAN_URDU',
    desc : 'Roman Urdu AI chat',
    category: '🤖 AI FEATURES'
  },
  sentiment: {
    label: '😊 Sentiment Analysis',
    key  : 'SENTIMENT',
    desc : 'Analyze text sentiment',
    category: '🤖 AI FEATURES'
  },
  ocr: {
    label: '📷 OCR Reader',
    key  : 'OCR',
    desc : 'Read text from images',
    category: '🤖 AI FEATURES'
  },
  bgremover: {
    label: '🎨 Remove Background',
    key  : 'BG_REMOVER',
    desc : 'Remove image background',
    category: '🤖 AI FEATURES'
  },

  // ══════════════════════════════════════════
  // 📥 DOWNLOAD MENU (32)
  // ══════════════════════════════════════════
  ytmp3: {
    label: '🎵 YouTube MP3',
    key  : 'YTMP3',
    desc : 'Download YouTube audio',
    category: '📥 DOWNLOAD MENU'
  },
  ytmp4: {
    label: '🎬 YouTube MP4',
    key  : 'YTMP4',
    desc : 'Download YouTube video',
    category: '📥 DOWNLOAD MENU'
  },
  play: {
    label: '▶️ Play',
    key  : 'PLAY',
    desc : 'Search and play audio',
    category: '📥 DOWNLOAD MENU'
  },
  song: {
    label: '🎵 Song',
    key  : 'SONG',
    desc : 'Search and download song',
    category: '📥 DOWNLOAD MENU'
  },
  video: {
    label: '📹 Video',
    key  : 'VIDEO',
    desc : 'Search and download video',
    category: '📥 DOWNLOAD MENU'
  },
  tiktok: {
    label: '📱 TikTok',
    key  : 'TIKTOK',
    desc : 'Download TikTok video',
    category: '📥 DOWNLOAD MENU'
  },
  ttmp3: {
    label: '🎵 TikTok MP3',
    key  : 'TTMP3',
    desc : 'Download TikTok audio',
    category: '📥 DOWNLOAD MENU'
  },
  instagram: {
    label: '📸 Instagram',
    key  : 'INSTAGRAM',
    desc : 'Download Instagram post',
    category: '📥 DOWNLOAD MENU'
  },
  igreel: {
    label: '🎬 IG Reel',
    key  : 'IGREEL',
    desc : 'Download Instagram reel',
    category: '📥 DOWNLOAD MENU'
  },
  facebook: {
    label: '📘 Facebook',
    key  : 'FACEBOOK',
    desc : 'Download Facebook video',
    category: '📥 DOWNLOAD MENU'
  },
  twitter: {
    label: '🐦 Twitter/X',
    key  : 'TWITTER',
    desc : 'Download Twitter video',
    category: '📥 DOWNLOAD MENU'
  },
  soundcloud: {
    label: '🎧 SoundCloud',
    key  : 'SOUNDCLOUD',
    desc : 'Download SoundCloud audio',
    category: '📥 DOWNLOAD MENU'
  },
  audio: {
    label: '🎵 Audio Download',
    key  : 'AUDIO_DL',
    desc : 'Download audio from URL',
    category: '📥 DOWNLOAD MENU'
  },
  songdl: {
    label: '🎵 Song Download',
    key  : 'SONG_DL',
    desc : 'Download song by name',
    category: '📥 DOWNLOAD MENU'
  },
  apk: {
    label: '📱 APK Download',
    key  : 'APK',
    desc : 'Download APK files',
    category: '📥 DOWNLOAD MENU'
  },
  modapk: {
    label: '🛠️ Mod APK',
    key  : 'MOD_APK',
    desc : 'Download modded APKs',
    category: '📥 DOWNLOAD MENU'
  },
  playstore: {
    label: '🏪 Play Store',
    key  : 'PLAYSTORE',
    desc : 'Search Play Store apps',
    category: '📥 DOWNLOAD MENU'
  },
  movie: {
    label: '🎬 Movie',
    key  : 'MOVIE',
    desc : 'Movie info/download',
    category: '📥 DOWNLOAD MENU'
  },
  drama: {
    label: '📺 Drama',
    key  : 'DRAMA',
    desc : 'Download dramas',
    category: '📥 DOWNLOAD MENU'
  },
  trailer: {
    label: '🎬 Trailer',
    key  : 'TRAILER',
    desc : 'Download movie trailer',
    category: '📥 DOWNLOAD MENU'
  },
  naat: {
    label: '🕋 Naat',
    key  : 'NAAT',
    desc : 'Download naats',
    category: '📥 DOWNLOAD MENU'
  },
  bayan: {
    label: '📖 Bayan',
    key  : 'BAYAN',
    desc : 'Download bayans',
    category: '📥 DOWNLOAD MENU'
  },
  wallpaper: {
    label: '🖼️ Wallpaper',
    key  : 'WALLPAPER',
    desc : 'Download HD wallpapers',
    category: '📥 DOWNLOAD MENU'
  },
  ringtone: {
    label: '🔔 Ringtone',
    key  : 'RINGTONE',
    desc : 'Download ringtones',
    category: '📥 DOWNLOAD MENU'
  },
  snapshot: {
    label: '📸 Snapshot',
    key  : 'SNAPSHOT',
    desc : 'Website snapshot',
    category: '📥 DOWNLOAD MENU'
  },
  threads: {
    label: '🧵 Threads',
    key  : 'THREADS',
    desc : 'Threads download',
    category: '📥 DOWNLOAD MENU'
  },
  gdrive: {
    label: '☁️ Google Drive',
    key  : 'GDRIVE',
    desc : 'Download from GDrive',
    category: '📥 DOWNLOAD MENU'
  },
  mediafire: {
    label: '🔥 MediaFire',
    key  : 'MEDIAFIRE',
    desc : 'Download from MediaFire',
    category: '📥 DOWNLOAD MENU'
  },
  pinterest: {
    label: '📌 Pinterest',
    key  : 'PINTEREST',
    desc : 'Download from Pinterest',
    category: '📥 DOWNLOAD MENU'
  },
  islamic: {
    label: '🕋 Islamic Downloads',
    key  : 'ISLAMIC_DL',
    desc : 'Download Islamic content',
    category: '📥 DOWNLOAD MENU'
  },
  download: {
    label: '⬇️ Universal Download',
    key  : 'DOWNLOAD',
    desc : 'Universal downloader',
    category: '📥 DOWNLOAD MENU'
  },

  // ══════════════════════════════════════════
  // 🖼️ IMAGE TOOLS (13)
  // ══════════════════════════════════════════
  remini: {
    label: '✨ AI Enhancer',
    key  : 'REMINI',
    desc : 'AI image enhancement',
    category: '🖼️ IMAGE TOOLS'
  },
  enhance: {
    label: '🌟 HD Enhance',
    key  : 'ENHANCE',
    desc : 'HD quality enhancement',
    category: '🖼️ IMAGE TOOLS'
  },
  blur: {
    label: '🌀 Blur Effect',
    key  : 'BLUR',
    desc : 'Apply blur effect',
    category: '🖼️ IMAGE TOOLS'
  },
  sepia: {
    label: '🟫 Sepia Effect',
    key  : 'SEPIA',
    desc : 'Apply sepia effect',
    category: '🖼️ IMAGE TOOLS'
  },
  invert: {
    label: '🔄 Invert Colors',
    key  : 'INVERT',
    desc : 'Invert image colors',
    category: '🖼️ IMAGE TOOLS'
  },
  grayscale: {
    label: '⚫ Grayscale',
    key  : 'GRAYSCALE',
    desc : 'Black & white effect',
    category: '🖼️ IMAGE TOOLS'
  },
  cartoon: {
    label: '🎨 Cartoon Effect',
    key  : 'CARTOON',
    desc : 'Cartoonify image',
    category: '🖼️ IMAGE TOOLS'
  },
  sketch: {
    label: '✏️ Pencil Sketch',
    key  : 'SKETCH',
    desc : 'Convert to sketch',
    category: '🖼️ IMAGE TOOLS'
  },
  watermark: {
    label: '💧 Watermark',
    key  : 'WATERMARK',
    desc : 'Add watermark to image',
    category: '🖼️ IMAGE TOOLS'
  },
  rembg: {
    label: '🎭 Remove BG',
    key  : 'REMOVE_BG',
    desc : 'Remove background',
    category: '🖼️ IMAGE TOOLS'
  },
  wanted: {
    label: '🔫 Wanted Poster',
    key  : 'WANTED',
    desc : 'Create wanted poster',
    category: '🖼️ IMAGE TOOLS'
  },
  wasted: {
    label: '💀 Wasted Effect',
    key  : 'WASTED',
    desc : 'GTA wasted effect',
    category: '🖼️ IMAGE TOOLS'
  },
  jail: {
    label: '⛓️ Jail Effect',
    key  : 'JAIL',
    desc : 'Jail effect on image',
    category: '🖼️ IMAGE TOOLS'
  },

  // ══════════════════════════════════════════
  // 🎭 STICKER MENU (8)
  // ══════════════════════════════════════════
  sticker: {
    label: '🎭 Sticker Maker',
    key  : 'STICKER',
    desc : 'Image to sticker',
    category: '🎭 STICKER MENU'
  },
  s: {
    label: '⚡ Quick Sticker',
    key  : 'QUICK_STICKER',
    desc : 'Quick sticker maker',
    category: '🎭 STICKER MENU'
  },
  sgif: {
    label: '🎬 Video Sticker',
    key  : 'VIDEO_STICKER',
    desc : 'Video to sticker',
    category: '🎭 STICKER MENU'
  },
  toimg: {
    label: '📸 Sticker to Image',
    key  : 'STICKER_TO_IMG',
    desc : 'Convert sticker to image',
    category: '🎭 STICKER MENU'
  },
  ttp: {
    label: '📝 Text to Sticker',
    key  : 'TTP',
    desc : 'Text to sticker',
    category: '🎭 STICKER MENU'
  },
  attp: {
    label: '✨ Animated TTP',
    key  : 'ATTP',
    desc : 'Animated text sticker',
    category: '🎭 STICKER MENU'
  },
  emojimix: {
    label: '😍 Emoji Mix',
    key  : 'EMOJI_MIX',
    desc : 'Mix two emojis',
    category: '🎭 STICKER MENU'
  },
  take: {
    label: '📦 Take Sticker',
    key  : 'TAKE',
    desc : 'Take sticker with pack',
    category: '🎭 STICKER MENU'
  },

  // ══════════════════════════════════════════
  // 🎨 DESIGN TOOLS (7)
  // ══════════════════════════════════════════
  logo: {
    label: '🎨 Logo Maker',
    key  : 'LOGO',
    desc : 'Create custom logos',
    category: '🎨 DESIGN TOOLS'
  },
  dp: {
    label: '🖼️ DP Maker',
    key  : 'DP',
    desc : 'Create profile pictures',
    category: '🎨 DESIGN TOOLS'
  },
  carbon: {
    label: '💻 Carbon Code',
    key  : 'CARBON',
    desc : 'Code to beautiful image',
    category: '🎨 DESIGN TOOLS'
  },
  meme: {
    label: '😂 Meme Generator',
    key  : 'MEME',
    desc : 'Create memes',
    category: '🎨 DESIGN TOOLS'
  },
  logomaker: {
    label: '🎯 Custom Logo',
    key  : 'CUSTOM_LOGO',
    desc : 'Advanced logo maker',
    category: '🎨 DESIGN TOOLS'
  },
  dpmaker: {
    label: '🖼️ Custom DP',
    key  : 'CUSTOM_DP',
    desc : 'Advanced DP maker',
    category: '🎨 DESIGN TOOLS'
  },
  capcut: {
    label: '✂️ CapCut Template',
    key  : 'CAPCUT',
    desc : 'CapCut video templates',
    category: '🎨 DESIGN TOOLS'
  },

  // ══════════════════════════════════════════
  // 🔧 TOOLS MENU (14)
  // ══════════════════════════════════════════
  calc: {
    label: '🧮 Calculator',
    key  : 'CALC',
    desc : 'Mathematical calculator',
    category: '🔧 TOOLS MENU'
  },
  convert: {
    label: '🔄 Unit Converter',
    key  : 'CONVERT',
    desc : 'Convert units',
    category: '🔧 TOOLS MENU'
  },
  currency: {
    label: '💰 Currency Converter',
    key  : 'CURRENCY',
    desc : 'Convert currencies',
    category: '🔧 TOOLS MENU'
  },
  weather: {
    label: '🌤️ Weather',
    key  : 'WEATHER',
    desc : 'Check weather',
    category: '🔧 TOOLS MENU'
  },
  pdf: {
    label: '📄 PDF Maker',
    key  : 'PDF',
    desc : 'Images to PDF',
    category: '🔧 TOOLS MENU'
  },
  qr: {
    label: '📱 QR Generator',
    key  : 'QR',
    desc : 'Generate QR code',
    category: '🔧 TOOLS MENU'
  },
  short: {
    label: '🔗 URL Shortener',
    key  : 'SHORT',
    desc : 'Shorten URLs',
    category: '🔧 TOOLS MENU'
  },
  screenshot: {
    label: '📸 Screenshot',
    key  : 'SCREENSHOT',
    desc : 'Take website screenshot',
    category: '🔧 TOOLS MENU'
  },
  tts: {
    label: '🔊 Text to Speech',
    key  : 'TTS',
    desc : 'Convert text to speech',
    category: '🔧 TOOLS MENU'
  },
  compressor: {
    label: '🗜️ Compressor',
    key  : 'COMPRESSOR',
    desc : 'Compress media files',
    category: '🔧 TOOLS MENU'
  },
  videoaud: {
    label: '🎵 Video/Audio Tools',
    key  : 'VIDEO_AUDIO',
    desc : 'Video/audio conversion',
    category: '🔧 TOOLS MENU'
  },
  videogif: {
    label: '🎬 Video to GIF',
    key  : 'VIDEO_GIF',
    desc : 'Convert video to GIF',
    category: '🔧 TOOLS MENU'
  },
  inshot: {
    label: '✂️ InShot Tools',
    key  : 'INSHOT',
    desc : 'InShot video editor',
    category: '🔧 TOOLS MENU'
  },
  tools: {
    label: '🔨 Utility Tools',
    key  : 'UTILITY_TOOLS',
    desc : 'Various utility tools',
    category: '🔧 TOOLS MENU'
  },

  // ══════════════════════════════════════════
  // 🔍 SEARCH MENU (10)
  // ══════════════════════════════════════════
  google: {
    label: '🌐 Google Search',
    key  : 'GOOGLE',
    desc : 'Search on Google',
    category: '🔍 SEARCH MENU'
  },
  wiki: {
    label: '📚 Wikipedia',
    key  : 'WIKI',
    desc : 'Search Wikipedia',
    category: '🔍 SEARCH MENU'
  },
  lyrics: {
    label: '🎵 Lyrics',
    key  : 'LYRICS',
    desc : 'Search song lyrics',
    category: '🔍 SEARCH MENU'
  },
  news: {
    label: '📰 News',
    key  : 'NEWS',
    desc : 'Latest news',
    category: '🔍 SEARCH MENU'
  },
  technews: {
    label: '💻 Tech News',
    key  : 'TECH_NEWS',
    desc : 'Technology news',
    category: '🔍 SEARCH MENU'
  },
  sportsnews: {
    label: '⚽ Sports News',
    key  : 'SPORTS_NEWS',
    desc : 'Sports news',
    category: '🔍 SEARCH MENU'
  },
  github: {
    label: '🐙 GitHub',
    key  : 'GITHUB',
    desc : 'GitHub repository info',
    category: '🔍 SEARCH MENU'
  },
  ytstalk: {
    label: '📺 YouTube Stats',
    key  : 'YT_STALK',
    desc : 'YouTube channel stats',
    category: '🔍 SEARCH MENU'
  },
  tiktokstalk: {
    label: '🎵 TikTok Stats',
    key  : 'TIKTOK_STALK',
    desc : 'TikTok profile stats',
    category: '🔍 SEARCH MENU'
  },
  xstalk: {
    label: '🐦 X Stats',
    key  : 'X_STALK',
    desc : 'X (Twitter) profile stats',
    category: '🔍 SEARCH MENU'
  },

  // ══════════════════════════════════════════
  // ☪️ ISLAMIC MENU (13)
  // ══════════════════════════════════════════
  quran: {
    label: '📖 Quran',
    key  : 'QURAN',
    desc : 'Read Quran verses',
    category: '☪️ ISLAMIC MENU'
  },
  ayat: {
    label: '✨ Random Ayat',
    key  : 'AYAT',
    desc : 'Random Quran verse',
    category: '☪️ ISLAMIC MENU'
  },
  tafsir: {
    label: '📚 Tafsir',
    key  : 'TAFSIR',
    desc : 'Quran tafsir',
    category: '☪️ ISLAMIC MENU'
  },
  hadith: {
    label: '📜 Hadith',
    key  : 'HADITH',
    desc : 'Random hadith',
    category: '☪️ ISLAMIC MENU'
  },
  prayertime: {
    label: '🕌 Prayer Times',
    key  : 'PRAYER_TIME',
    desc : 'Get prayer times',
    category: '☪️ ISLAMIC MENU'
  },
  prayer: {
    label: '🤲 Today\'s Prayer',
    key  : 'PRAYER',
    desc : 'Today\'s prayer times',
    category: '☪️ ISLAMIC MENU'
  },
  hijri: {
    label: '🌙 Hijri Date',
    key  : 'HIJRI',
  desc : 'Islamic date',
    category: '☪️ ISLAMIC MENU'
  },
  dua: {
    label: '🤲 Dua',
    key  : 'DUA',
    desc : 'Random dua',
    category: '☪️ ISLAMIC MENU'
  },
  asma: {
    label: '✨ Asma-ul-Husna',
    key  : 'ASMA',
    desc : '99 names of Allah',
    category: '☪️ ISLAMIC MENU'
  },
  islamicnames: {
    label: '👶 Islamic Names',
    key  : 'ISLAMIC_NAMES',
    desc : 'Muslim baby names',
    category: '☪️ ISLAMIC MENU'
  },
  zakatcalc: {
    label: '💰 Zakat Calculator',
    key  : 'ZAKAT',
    desc : 'Calculate zakat',
    category: '☪️ ISLAMIC MENU'
  },
  ramadan: {
    label: '🌙 Ramadan Info',
    key  : 'RAMADAN',
    desc : 'Ramadan information',
    category: '☪️ ISLAMIC MENU'
  },
  hajj: {
    label: '🕋 Hajj Guide',
    key  : 'HAJJ',
    desc : 'Hajj & Umrah guide',
    category: '☪️ ISLAMIC MENU'
  },

  // ══════════════════════════════════════════
  // 🏏 CRICKET & MATCH (12)
  // ══════════════════════════════════════════
  score: {
    label: '🏏 Live Score',
    key  : 'SCORE',
    desc : 'Live cricket score',
    category: '🏏 CRICKET & MATCH'
  },
  livescore: {
    label: '🔴 Live Matches',
    key  : 'LIVE_SCORE',
    desc : 'All live matches',
    category: '🏏 CRICKET & MATCH'
  },
  cricketlive: {
    label: '🏏 Cricket Live',
    key  : 'CRICKET_LIVE',
    desc : 'Live cricket updates',
    category: '🏏 CRICKET & MATCH'
  },
  cricketfull: {
    label: '📊 Full Scorecard',
    key  : 'CRICKET_FULL',
    desc : 'Complete scorecard',
    category: '🏏 CRICKET & MATCH'
  },
  matchinfo: {
    label: 'ℹ️ Match Info',
    key  : 'MATCH_INFO',
    desc : 'Match details',
    category: '🏏 CRICKET & MATCH'
  },
  schedule: {
    label: '📅 Match Schedule',
    key  : 'SCHEDULE',
    desc : 'Upcoming matches',
    category: '🏏 CRICKET & MATCH'
  },
  commentary: {
    label: '🎤 Live Commentary',
    key  : 'COMMENTARY',
    desc : 'Ball by ball commentary',
    category: '🏏 CRICKET & MATCH'
  },
  toss: {
    label: '🪙 Toss Result',
    key  : 'TOSS',
    desc : 'Match toss details',
    category: '🏏 CRICKET & MATCH'
  },
  ipinfo: {
    label: '🌐 IP Info',
    key  : 'IP_INFO',
    desc : 'IP address details',
    category: '🏏 CRICKET & MATCH'
  },
  playerstats: {
    label: '📊 Player Stats',
    key  : 'PLAYER_STATS',
    desc : 'Cricket player statistics',
    category: '🏏 CRICKET & MATCH'
  },
  psl: {
    label: '🟢 PSL 2025',
    key  : 'PSL',
    desc : 'PSL updates',
    category: '🏏 CRICKET & MATCH'
  },
  pointstable: {
    label: '📊 Points Table',
    key  : 'POINTS_TABLE',
    desc : 'Tournament points table',
    category: '🏏 CRICKET & MATCH'
  },
  football: {
    label: '⚽ Football',
    key  : 'FOOTBALL',
    desc : 'Football scores',
    category: '🏏 CRICKET & MATCH'
  },

  // ══════════════════════════════════════════
  // 👥 GROUP MENU (24)
  // ══════════════════════════════════════════
  add: {
    label: '➕ Add Member',
    key  : 'ADD',
    desc : 'Add member to group',
    category: '👥 GROUP MENU'
  },
  kick: {
    label: '👢 Kick Member',
    key  : 'KICK',
    desc : 'Remove member from group',
    category: '👥 GROUP MENU'
  },
  promote: {
    label: '👑 Promote',
    key  : 'PROMOTE',
    desc : 'Make admin',
    category: '👥 GROUP MENU'
  },
  demote: {
    label: '⬇️ Demote',
    key  : 'DEMOTE',
    desc : 'Remove admin',
    category: '👥 GROUP MENU'
  },
  tagall: {
    label: '🏷️ Tag All',
    key  : 'TAGALL',
    desc : 'Tag all members',
    category: '👥 GROUP MENU'
  },
  hidetag: {
    label: '🤫 Hidetag',
    key  : 'HIDETAG',
    desc : 'Silent tag all',
    category: '👥 GROUP MENU'
  },
  invite: {
    label: '📨 Invite',
    key  : 'INVITE',
    desc : 'Get group invite link',
    category: '👥 GROUP MENU'
  },
  link: {
    label: '🔗 Group Link',
    key  : 'GROUP_LINK',
    desc : 'Get group link',
    category: '👥 GROUP MENU'
  },
  members: {
    label: '👥 Member List',
    key  : 'MEMBERS',
    desc : 'List all members',
    category: '👥 GROUP MENU'
  },
  admins: {
    label: '👑 Admin List',
    key  : 'ADMINS',
    desc : 'List all admins',
    category: '👥 GROUP MENU'
  },
  warn: {
    label: '⚠️ Warn',
    key  : 'WARN',
    desc : 'Warn a member',
    category: '👥 GROUP MENU'
  },
  unwarn: {
    label: '✅ Unwarn',
    key  : 'UNWARN',
    desc : 'Remove warning',
    category: '👥 GROUP MENU'
  },
  warnlist: {
    label: '📋 Warn List',
    key  : 'WARN_LIST',
    desc : 'List warned members',
    category: '👥 GROUP MENU'
  },
  bannedlist: {
    label: '🚫 Banned List',
    key  : 'BANNED_LIST',
    desc : 'List banned members',
    category: '👥 GROUP MENU'
  },
  groupopen: {
    label: '🔓 Open Group',
    key  : 'GROUP_OPEN',
    desc : 'Open group for all',
    category: '👥 GROUP MENU'
  },
  groupclose: {
    label: '🔒 Close Group',
    key  : 'GROUP_CLOSE',
    desc : 'Close group',
    category: '👥 GROUP MENU'
  },
  groupname: {
    label: '📝 Change Name',
    key  : 'GROUP_NAME',
    desc : 'Change group name',
    category: '👥 GROUP MENU'
  },
  groupdesc: {
    label: '📄 Change Desc',
    key  : 'GROUP_DESC',
    desc : 'Change group description',
    category: '👥 GROUP MENU'
  },
  groupactivity: {
    label: '📊 Group Activity',
    key  : 'GROUP_ACTIVITY',
    desc : 'Group activity stats',
    category: '👥 GROUP MENU'
  },
  groupleave: {
    label: '🚪 Leave Group',
    key  : 'GROUP_LEAVE',
    desc : 'Bot leave group',
    category: '👥 GROUP MENU'
  },
  antilink: {
    label: '🔗 Anti Link',
    key  : 'ANTI_LINK',
    desc : 'Block links in group',
    category: '👥 GROUP MENU'
  },
  antivv: {
    label: '🔄 Anti VV',
    key  : 'ANTI_VV',
    desc : 'Anti view once',
    category: '👥 GROUP MENU'
  },
  antispam: {
    label: '🚫 Anti Spam',
    key  : 'ANTI_SPAM',
    desc : 'Block spam messages',
    category: '👥 GROUP MENU'
  },
  antighost: {
    label: '👻 Anti Ghost',
    key  : 'ANTI_GHOST',
    desc : 'Detect ghost members',
    category: '👥 GROUP MENU'
  },

  // ══════════════════════════════════════════
  // 💰 ECONOMY MENU (6)
  // ══════════════════════════════════════════
  balance: {
    label: '💰 Balance',
    key  : 'BALANCE',
    desc : 'Check your balance',
    category: '💰 ECONOMY MENU'
  },
  daily: {
    label: '📅 Daily',
    key  : 'DAILY',
    desc : 'Daily reward',
    category: '💰 ECONOMY MENU'
  },
  work: {
    label: '💼 Work',
    key  : 'WORK',
    desc : 'Work for coins',
    category: '💰 ECONOMY MENU'
  },
  shop: {
    label: '🛒 Shop',
    key  : 'SHOP',
    desc : 'View shop items',
    category: '💰 ECONOMY MENU'
  },
  buy: {
    label: '🛍️ Buy',
    key  : 'BUY',
    desc : 'Buy from shop',
    category: '💰 ECONOMY MENU'
  },
  leaderboard: {
    label: '🏆 Leaderboard',
    key  : 'LEADERBOARD',
    desc : 'Top rich users',
    category: '💰 ECONOMY MENU'
  },

  // ══════════════════════════════════════════
  // 🎮 GAMES MENU (5)
  // ══════════════════════════════════════════
  tictactoe: {
    label: '⭕ Tic Tac Toe',
    key  : 'TICTACTOE',
    desc : 'Play Tic Tac Toe',
    category: '🎮 GAMES MENU'
  },
  quiz: {
    label: '❓ Quiz',
    key  : 'QUIZ',
    desc : 'Play quiz game',
    category: '🎮 GAMES MENU'
  },
  dice: {
    label: '🎲 Dice',
    key  : 'DICE',
    desc : 'Roll dice',
    category: '🎮 GAMES MENU'
  },
  coin: {
    label: '🪙 Coin Flip',
    key  : 'COIN',
    desc : 'Flip a coin',
    category: '🎮 GAMES MENU'
  },
  math: {
    label: '🔢 Math Game',
    key  : 'MATH',
    desc : 'Solve math problems',
    category: '🎮 GAMES MENU'
  },

  // ══════════════════════════════════════════
  // 😄 FUN MENU (7)
  // ══════════════════════════════════════════
  joke: {
    label: '😂 Joke',
    key  : 'JOKE',
    desc : 'Random joke',
    category: '😄 FUN MENU'
  },
  quote: {
    label: '💬 Quote',
    key  : 'QUOTE',
    desc : 'Motivational quote',
    category: '😄 FUN MENU'
  },
  fact: {
    label: '🔍 Fact',
    key  : 'FACT',
    desc : 'Random fact',
    category: '😄 FUN MENU'
  },
  truth: {
    label: '🤔 Truth',
    key  : 'TRUTH',
    desc : 'Truth question',
    category: '😄 FUN MENU'
  },
  dare: {
    label: '😈 Dare',
    key  : 'DARE',
    desc : 'Dare challenge',
    category: '😄 FUN MENU'
  },
  meme: {
    label: '😂 Meme',
    key  : 'MEME_FUN',
    desc : 'Random meme',
    category: '😄 FUN MENU'
  },
  ship: {
    label: '❤️ Love Meter',
    key  : 'SHIP',
    desc : 'Check love compatibility',
    category: '😄 FUN MENU'
  },

  // ══════════════════════════════════════════
  // 👑 OWNER MENU (13)
  // ══════════════════════════════════════════
  broadcast: {
    label: '📢 Broadcast',
    key  : 'BROADCAST',
    desc : 'Broadcast message',
    category: '👑 OWNER MENU'
  },
  ban: {
    label: '🚫 Ban User',
    key  : 'BAN',
    desc : 'Ban a user',
    category: '👑 OWNER MENU'
  },
  unban: {
    label: '✅ Unban User',
    key  : 'UNBAN',
    desc : 'Unban a user',
    category: '👑 OWNER MENU'
  },
  block: {
    label: '⛔ Block',
    key  : 'BLOCK',
    desc : 'Block a user',
    category: '👑 OWNER MENU'
  },
  unblock: {
    label: '🔓 Unblock',
    key  : 'UNBLOCK',
    desc : 'Unblock a user',
    category: '👑 OWNER MENU'
  },
  restart: {
    label: '🔄 Restart',
    key  : 'RESTART',
    desc : 'Restart bot',
    category: '👑 OWNER MENU'
  },
  shutdown: {
    label: '⏻ Shutdown',
    key  : 'SHUTDOWN',
    desc : 'Shutdown bot',
    category: '👑 OWNER MENU'
  },
  eval: {
    label: '💻 Eval',
    key  : 'EVAL',
    desc : 'Execute code',
    category: '👑 OWNER MENU'
  },
  join: {
    label: '🔗 Join Group',
    key  : 'JOIN',
    desc : 'Join group via link',
    category: '👑 OWNER MENU'
  },
  leavegc: {
    label: '🚪 Leave Group',
    key  : 'LEAVE_GC',
    desc : 'Leave current group',
    category: '👑 OWNER MENU'
  },
  backup: {
    label: '💾 Backup',
    key  : 'BACKUP',
    desc : 'Backup database',
    category: '👑 OWNER MENU'
  },
  update: {
    label: '🔄 Update',
    key  : 'UPDATE',
    desc : 'Update bot',
    category: '👑 OWNER MENU'
  },
  setpp: {
    label: '🖼️ Set Profile Pic',
    key  : 'SETPP',
    desc : 'Change bot profile',
    category: '👑 OWNER MENU'
  },
  contact: {
    label: '📞 Contact Owner',
    key  : 'CONTACT',
    desc : 'Contact bot owner',
    category: '👑 OWNER MENU'
  }
};

// ── Helper function to create button text ─────────────────────
function createButton(settingName, info) {
  const status = CONFIG[info.key] ? '✅ ON' : '❌ OFF';
  return `┃ [ ${status} ] *${info.label}*\n┃    ↳ _${info.desc}_\n┃    ${global.usedPrefix || '.'}settings ${settingName} ${CONFIG[info.key] ? 'off' : 'on'}`;
}

// ═══════════════════════════════════════════════════════════════
// Main Handler
// ═══════════════════════════════════════════════════════════════
let handler = async (m, { conn, usedPrefix, args }) => {

  const pfx = usedPrefix || '.';
  const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
  const name   = conn.contacts?.[sender]?.name ||
                 conn.contacts?.[sender]?.notify ||
                 (sender ? sender.split('@')[0] : 'Friend') ||
                 'Friend';

  // ── No args → show ALL settings grouped by category ──────────
  if (!args[0]) {
    let msg = `╔══════════════════════════════════════════════════════════════╗\n`;
    msg += `║     ⚙️  *${OWNER.BOT_NAME} — COMPLETE SETTINGS PANEL* ⚙️       ║\n`;
    msg += `║              *${Object.keys(SETTINGS).length} Commands Available*               ║\n`;
    msg += `╚══════════════════════════════════════════════════════════════╝\n\n`;
    msg += `👤 *User:* ${name}\n`;
    msg += `👑 *Owner:* ${OWNER.FULL_NAME}\n\n`;
    msg += `📌 *Usage:* ${pfx}settings <command> on/off\n`;
    msg += `┃ *Example:* ${pfx}settings antilink on\n\n`;

    // Group settings by category
    const categories = {};
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (!categories[info.category]) categories[info.category] = [];
      categories[info.category].push({ cmd, ...info });
    }

    // Display each category
    for (const [category, items] of Object.entries(categories)) {
      msg += `╭━『 ${category} 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n`;
      
      // Show first 5 items with buttons
      const displayItems = items.slice(0, 5);
      for (const item of displayItems) {
        msg += createButton(item.cmd, item) + '\n';
        if (item !== displayItems[displayItems.length - 1]) msg += '┃\n';
      }
      
      if (items.length > 5) {
        msg += `┃\n┃   *+ ${items.length - 5} more commands in this category*\n`;
        msg += `┃   *Use:* ${pfx}settings ${category.toLowerCase().replace(/[^a-z]/g, '')} to see all\n`;
      }
      msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    }

    msg += `╔══════════════════════════════════════════════════════════════╗\n`;
    msg += `║  📢 *JOIN OUR CHANNEL:* @${OWNER.BOT_NAME.replace(/ /g, '')}  ║\n`;
    msg += `║  👆 *Click the button below to join*                         ║\n`;
    msg += `╚══════════════════════════════════════════════════════════════╝\n\n`;
    msg += `_👑 Developed by ${OWNER.FULL_NAME}_`;

    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  // ── Check if it's a category view ────────────────────────────
  const categoryMap = {
    'main': '🏠 MAIN MENU',
    'auto': '⚙️ AUTO FEATURES',
    'ai': '🤖 AI FEATURES',
    'download': '📥 DOWNLOAD MENU',
    'image': '🖼️ IMAGE TOOLS',
    'sticker': '🎭 STICKER MENU',
    'design': '🎨 DESIGN TOOLS',
    'tools': '🔧 TOOLS MENU',
    'search': '🔍 SEARCH MENU',
    'islamic': '☪️ ISLAMIC MENU',
    'cricket': '🏏 CRICKET & MATCH',
    'group': '👥 GROUP MENU',
    'economy': '💰 ECONOMY MENU',
    'games': '🎮 GAMES MENU',
    'fun': '😄 FUN MENU',
    'owner': '👑 OWNER MENU'
  };

  const input = args[0].toLowerCase();
  
  if (categoryMap[input]) {
    const targetCategory = categoryMap[input];
    let msg = `╭━『 ${targetCategory} 』━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮\n\n`;
    
    for (const [cmd, info] of Object.entries(SETTINGS)) {
      if (info.category === targetCategory) {
        msg += createButton(cmd, info) + '\n┃\n';
      }
    }
    
    msg += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    msg += `_👑 ${OWNER.BOT_NAME}_`;
    
    return conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  }

  // ── Single setting toggle ────────────────────────────────────
  const settingName = input;
  const action = args[1]?.toLowerCase();

  const setting = SETTINGS[settingName];

  if (!setting) {
    return conn.sendMessage(m.chat, {
      text: `❌ *Unknown Setting:* \`${settingName}\`\n\n📌 *Available Categories:* ${Object.keys(categoryMap).join(', ')}\n\n📌 *Usage:* ${pfx}settings <command> on/off\n\n_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!action) {
    const current = CONFIG[setting.key] ? '✅ ON' : '❌ OFF';
    return conn.sendMessage(m.chat, {
      text: `╔══════════════════════════════════════╗\n`
          + `║        ⚙️  *SETTING INFO* ⚙️          ║\n`
          + `╚══════════════════════════════════════╝\n\n`
          + `📌 *Setting:* ${setting.label}\n`
          + `📊 *Status:*  ${current}\n`
          + `📝 *Info:*    ${setting.desc}\n`
          + `📂 *Category:* ${setting.category}\n\n`
          + `📌 *Toggle:*\n`
          + `┃ ${pfx}settings ${settingName} on\n`
          + `┃ ${pfx}settings ${settingName} off\n\n`
          + `_⚡ ${OWNER.BOT_NAME}_`,
    }, { quoted: m });
  }

  if (!['on', 'off'].includes(action)) {
    return conn.sendMessage(m.chat, {
      text: `❌ *Invalid Action!* Use \`on\` or \`off\`\n\n📌 *Example:* ${pfx}settings ${settingName} on`,
    }, { quoted: m });
  }

  const newValue = action === 'on';
  const oldValue = CONFIG[setting.key];

  if (oldValue === newValue) {
    return conn.sendMessage(m.chat, {
      text: `ℹ️ *${setting.label}* already *${action.toUpperCase()}* ہے!`,
    }, { quoted: m });
  }

  CONFIG[setting.key] = newValue;

  // ── Success message ──────────────────────────────────────────
  await conn.sendMessage(m.chat, {
    text: `╔══════════════════════════════════════╗\n`
        + `║     ⚙️  *SETTING UPDATED* ⚙️           ║\n`
        + `╚══════════════════════════════════════╝\n\n`
        + `📌 *Setting:* ${setting.label}\n`
        + `📊 *Status:*  ${newValue ? '✅ ON' : '❌ OFF'}\n`
        + `📝 *Info:*    ${setting.desc}\n`
        + `📂 *Category:* ${setting.category}\n\n`
        + `_⚡ ${OWNER.BOT_NAME} — Updated!_`,
  }, { quoted: m });

  // ── WhatsApp Channel Button ──────────────────────────────────
  try {
    const thumbPath = path.resolve('./assets/menu-thumb.png');
    const thumbBuf = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : Buffer.from('');

    await conn.sendMessage(m.chat, {
      text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃     📢 *${OWNER.BOT_NAME} OFFICIAL*     ┃\n┃         ✨ *CHANNEL* ✨         ┃\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n👆 *Click the button below to join* 👆`,
      contextInfo: {
        externalAdReply: {
          title: `📢 Join ${OWNER.BOT_NAME} Channel`,
          body: 'Click here to join WhatsApp Channel',
          thumbnail: thumbBuf,
          mediaType: 1,
          mediaUrl: OWNER.CHANNEL,
          sourceUrl: OWNER.CHANNEL,
        },
      },
    }, { quoted: m });
  } catch (e) {
    console.error('[CHANNEL BUTTON ERROR]:', e.message);
  }
};

handler.help = ['settings'];
handler.tags = ['info'];
handler.command = /^(settings|setting|config)$/i;
handler.owner = false;

export default handler;
```
