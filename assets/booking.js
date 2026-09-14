import { site, offers } from './config.js';

const berlin = new Intl.DateTimeFormat('en-CA', {
  timeZone: site.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

export function localParts(date = new Date()) {
  const parts = Object.fromEntries(berlin.formatToParts(date).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value ? d : null;
}

export function addDays(value, days) {
  const d = parseDate(value);
  if (!d) return '';
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function dateBounds(now = new Date()) {
  const today = localParts(now).date;
  return { min: addDays(today, site.minimumNoticeDays), max: addDays(today, site.bookingHorizonDays) };
}

export function offerById(id) {
  return offers.find(offer => offer.id === id) || offers[0];
}

export function availableTimes(value, minutes, now = new Date()) {
  const d = parseDate(value);
  const { min, max } = dateBounds(now);
  if (!d || value < min || value > max || !Number.isInteger(minutes) || minutes <= 0) return [];
  const hours = site.hours[d.getUTCDay()];
  if (!hours) return [];
  const times = [];
  const berlinNow = localParts(now);
  for (let time = hours[0]; time + minutes <= hours[1]; time += site.slotStepMinutes) {
    // Seven calendar days, with at least the same local time on the earliest day.
    if (value === min && time < berlinNow.minutes) continue;
    times.push(`${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`);
  }
  return times;
}

export function validateProposals(proposals, offerId, now = new Date()) {
  if (!Array.isArray(proposals) || proposals.length < 1 || proposals.length > site.maxProposals) return false;
  if (!offers.some(offer => offer.id === offerId)) return false;
  const seen = new Set();
  return proposals.every(proposal => {
    if (!proposal || typeof proposal !== 'object') return false;
    const { date, time } = proposal;
    const key = `${date} ${time}`;
    if (seen.has(key) || !availableTimes(date, offerById(offerId).minutes, now).includes(time)) return false;
    seen.add(key);
    return true;
  });
}

export function formatDate(value) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date) : '';
}

export function composeRequest({ name, email, interest, format, message, proposals }) {
  const offer = offerById(interest);
  const subject = `Terminanfrage: ${offer.name}`;
  const body = [
    'Hallo Anna-Lena,', '',
    `ich möchte ${offer.name === 'Kostenloses Kennenlernen' ? 'ein kostenloses Kennenlerngespräch' : `das Angebot ${offer.name} (${offer.price} Euro)`} anfragen.`, '',
    `Name: ${name.trim()}`, `E-Mail: ${email.trim()}`, `Gespräch: ${format}`, '',
    'Meine Wunschtermine (deutsche Ortszeit, Europe/Berlin):',
    ...proposals.map((p, i) => `${i + 1}. ${formatDate(p.date)}, ${p.time} Uhr`), '',
    ...(message.trim() ? ['Meine Nachricht:', message.trim(), ''] : []),
    'Bitte bestätige mir einen passenden Termin. Mir ist bewusst, dass dies noch keine feste Buchung und kein kostenpflichtiger Vertrag ist.',
  ].join('\n');
  return { subject, body, mailto: `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
