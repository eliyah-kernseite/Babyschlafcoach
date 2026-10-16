// Creates the responsive versions (640/768/960/1440 px wide, WebP) of every photo in assets/bilder/.
// Photos uploaded in Pages CMS land in assets/bilder/; the website only uses the generated versions.
// content/.bildversionen.json remembers which original each set was made from, so unchanged photos are skipped.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { photoName } from '../src/content.mjs';

const root = path.resolve(import.meta.dirname, '..');
const folder = path.join(root, 'assets/bilder');
const stateFile = path.join(root, 'content/.bildversionen.json');
const widths = [640, 768, 960, 1440];

export async function buildImages() {
  const state = JSON.parse(await readFile(stateFile, 'utf8').catch(() => '{}'));
  let sharp;
  const made = [];
  for (const file of (await readdir(folder)).sort()) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
    const name = photoName(file);
    const original = await readFile(path.join(folder, file));
    const hash = createHash('sha256').update(original).digest('hex');
    if (state[name] === hash) continue;
    sharp ??= (await import('sharp')).default;
    for (const width of widths) {
      await sharp(original).rotate().resize({ width, withoutEnlargement: false }).webp({ quality: 78 }).toFile(path.join(root, 'assets', `${name}-${width}.webp`));
    }
    state[name] = hash;
    made.push(name);
  }
  await writeFile(stateFile, `${JSON.stringify(state, null, 2)}\n`);
  return made;
}
