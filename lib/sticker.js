/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Sticker System    ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
 📱 WhatsApp : +923710636110
 📺 YouTube  : https://www.youtube.com/@Yousaf_Baloch_Tech
 🎵 TikTok   : https://tiktok.com/@loser_boy.110
 💻 GitHub   : https://github.com/musakhanbaloch03-sad
 🤖 Bot Repo : https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
 📢 Channel  : https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

import { spawn }          from 'child_process';
import { dirname }        from 'path';
import { fileURLToPath }  from 'url';
import { fileTypeFromBuffer } from 'file-type';
import fs                 from 'fs';
import axios              from 'axios';
import ffmpegPath         from 'ffmpeg-static';
import { OWNER }          from '../config.js';
import { sanitizeUrl, createTemp } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// FIX: ffmpeg-static path use — system ffmpeg ki zaroorat nahi
const FFMPEG = ffmpegPath || 'ffmpeg';

export async function createSticker(buffer, packname = OWNER.BOT_NAME, author = OWNER.FULL_NAME) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer provided');
  }

  const type = await fileTypeFromBuffer(buffer);
  if (!type) throw new Error('Could not detect file type');

  const isVideo = type.mime.startsWith('video/');
  const isImage = type.mime.startsWith('image/');

  if (!isVideo && !isImage && type.mime !== 'image/webp') {
    throw new Error(`Unsupported file type: ${type.mime}`);
  }

  if (type.mime === 'image/webp') {
    return await addStickerMetadata(buffer, packname, author);
  }

  const inputPath = createTemp(buffer, `.${type.ext}`);

  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(`.${type.ext}`, '_sticker.webp');

    const args = isVideo
      ? [
          '-i', inputPath,
          '-vcodec', 'libwebp',
          '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0',
          '-loop', '0',
          '-ss', '00:00:00',
          '-t', '00:00:05',
          '-preset', 'default',
          '-an',
          '-vsync', '0',
          '-s', '512:512',
          outputPath,
        ]
      : [
          '-i', inputPath,
          '-vcodec', 'libwebp',
          '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0.0',
          '-preset', 'default',
          '-loop', '0',
          '-an',
          outputPath,
        ];

    // FIX: FFMPEG variable use — ffmpeg-static ka path
    const ffmpeg = spawn(FFMPEG, args);

    let errorOutput = '';
    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ffmpeg.on('close', async (code) => {
      try { fs.unlinkSync(inputPath); } catch (_) {}

      if (code !== 0) {
        try { fs.unlinkSync(outputPath); } catch (_) {}
        return reject(new Error(`ffmpeg failed (code ${code}): ${errorOutput.slice(-200)}`));
      }

      try {
        const webpBuffer = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        const finalBuffer = await addStickerMetadata(webpBuffer, packname, author);
        resolve(finalBuffer);
      } catch (err) {
        reject(new Error('Failed to read output sticker: ' + err.message));
      }
    });

    ffmpeg.on('error', (err) => {
      try { fs.unlinkSync(inputPath); } catch (_) {}
      // FIX: better error message with actual path
      reject(new Error(`ffmpeg spawn error: ${err.message} | Path: ${FFMPEG}`));
    });
  });
}

async function addStickerMetadata(buffer, packname, author) {
  try {
    const json = JSON.stringify({
      'sticker-pack-name'     : packname,
      'sticker-pack-publisher': author,
      'emojis'                : ['🤖'],
    });

    const exifAttr  = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
    const jsonBuffer = Buffer.from(json, 'utf8');
    const exifSize  = Buffer.alloc(4);
    exifSize.writeUInt32LE(jsonBuffer.length, 0);
    const exif = Buffer.concat([exifAttr, exifSize, jsonBuffer]);

    const riffHeader = buffer.slice(0, 12);
    const webpData   = buffer.slice(12);

    const exifChunk = Buffer.concat([
      Buffer.from('EXIF'),
      Buffer.from([
        exif.length & 0xff,
        (exif.length >> 8)  & 0xff,
        (exif.length >> 16) & 0xff,
        (exif.length >> 24) & 0xff,
      ]),
      exif,
    ]);

    const newSize = buffer.length + exifChunk.length - 8;
    const newRiff = Buffer.concat([riffHeader.slice(0, 4), Buffer.alloc(4), riffHeader.slice(8)]);
    newRiff.writeUInt32LE(newSize, 4);

    return Buffer.concat([newRiff, webpData, exifChunk]);
  } catch {
    return buffer;
  }
}

export async function createStickerFromUrl(url, packname = OWNER.BOT_NAME, author = OWNER.FULL_NAME) {
  const safeUrl = sanitizeUrl(url);
  if (!safeUrl) throw new Error('Invalid or unsafe URL');
  try {
    const res = await axios.get(safeUrl, {
      responseType: 'arraybuffer',
      timeout     : 30000,
      headers     : { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    });
    return await createSticker(Buffer.from(res.data), packname, author);
  } catch (err) {
    throw new Error('Failed to fetch sticker from URL: ' + err.message);
  }
}

export default { createSticker, createStickerFromUrl };
