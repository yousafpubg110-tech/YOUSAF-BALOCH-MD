import { spawn } from 'child_process';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';

async function sticker(img, url, packname, author) {
  url = url ? url : await uploadImage(img);
  let res = await fetch(`https://api.lolhuman.xyz/api/convert/towebpauthor?apikey=GataDios&img=${url}&package=${encodeURIComponent(packname)}&author=${encodeURIComponent(author)}`);
  if (!res.ok) throw await res.text();
  return await res.buffer();
}

export { sticker };
