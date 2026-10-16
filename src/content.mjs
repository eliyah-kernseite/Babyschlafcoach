// Reads the editable content (content/*.yml), which Anna-Lena maintains in Pages CMS.
// Layout and markup stay in src/; only texts, prices, contact data and photos come from here.
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'yaml';

const root = new URL('../', import.meta.url);
export const read = file => parse(readFileSync(new URL(`content/${file}`, root), 'utf8')) ?? {};

const settings = read('einstellungen.yml');

// Fixed technical values; the booking logic depends on them, so they are not offered in the CMS.
export const site = Object.freeze({
  name: 'Babyschlafberatung Anna-Lena Korb',
  url: 'https://babyschlaf-coach.de/',
  email: settings.kontakt.email,
  // Web3Forms access key: public by design, only allows sending to the verified address above.
  formKey: 'efb568c9-54dd-4cce-b682-336d0d65016d',
  telephone: settings.kontakt.telefon_nummer,
  telephoneDisplay: settings.kontakt.telefon_anzeige,
  childcareUrl: settings.kontakt.kinderkoerbchen_url,
  timezone: 'Europe/Berlin',
  minimumNoticeDays: 7,
  bookingHorizonDays: 90,
  maxProposals: 3,
  slotStepMinutes: 30,
  hours: { 1: [17 * 60, 19 * 60], 2: [17 * 60, 19 * 60], 3: [17 * 60, 19 * 60], 4: [17 * 60, 19 * 60], 5: [17 * 60, 19 * 60], 6: [9 * 60, 13 * 60] },
});

// These are request lengths, not an assertion of live calendar availability.
export const offers = Object.freeze(settings.angebote.map(o => Object.freeze({ id: o.id, name: o.name, price: o.preis, minutes: o.minuten })));
export const offerDetails = Object.fromEntries(settings.angebote.map(o => [o.id, o.leistung]));
export const texts = settings;

// Photos: originals live in assets/bilder/, scripts/images.mjs creates name-640/768/960/1440.webp in assets/.
export const photoList = read('fotos.yml').fotos ?? [];
// File name without folder and extension, reduced to a-z, 0-9 and dashes (used for the generated versions).
export const photoName = src => String(src).replace(/^.*\//, '').replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const photoInfo = src => photoList.find(p => photoName(p.bild) === photoName(src)) ?? {};

// Width and height of a WebP file, read from its header (needed for width/height attributes).
export function webpSize(file) {
  const b = readFileSync(file);
  const chunk = b.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  if (chunk === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') { const bits = b.readUInt32LE(21); return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 }; }
  throw new Error(`Unbekanntes WebP-Format: ${file}`);
}
export const variant = (src, width) => `assets/${photoName(src)}-${width}.webp`;
export const variantExists = src => existsSync(new URL(variant(src, 960), root));
export const variantSize = src => webpSize(new URL(variant(src, 960), root));

const pages = {};
export const page = name => pages[name] ??= read(`seiten/${name}.yml`);
