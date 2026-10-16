// Turns the simple text format used in the content files (content/) into HTML.
// The format is written in Pages CMS, so it stays deliberately small:
//
//   ## Überschrift            -> <h2>   (optional anchor: ## Überschrift {#anker})
//   ### Zwischenüberschrift   -> <h3>
//   - Punkt                   -> plain list
//   ✓ Punkt / ✗ Punkt         -> list with check marks / crosses
//   {.lead} Absatz            -> paragraph with a CSS class (lead, small, signature)
//   **fett**, [Linktext](ziel.html), line break inside a paragraph -> <br>
//   {{email}}, {{telefon}}, {{telefon_nummer}}, {{kinderkoerbchen_url}} -> contact data from Einstellungen
//
// Blocks are separated by an empty line. Anything else, including HTML, is passed through unchanged.
import { site } from './content.mjs';

const svg = (cls, d, extra) => `<svg class="${cls}" aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.7"${extra}/></svg>`;
export const check = svg('icon-check', 'M4.5 10.5l3.5 3.5 7.5-8', ' stroke-linecap="round" stroke-linejoin="round"');
export const cross = svg('icon-cross', 'M6 6l8 8M14 6l-8 8', ' stroke-linecap="round"');
export const checks = items => `<ul class="checks">${items.map(i => `<li>${check}<span>${i}</span></li>`).join('')}</ul>`;
export const crosses = items => `<ul class="checks no">${items.map(i => `<li>${cross}<span>${i}</span></li>`).join('')}</ul>`;

const placeholders = () => ({
  email: site.email,
  telefon: site.telephoneDisplay,
  telefon_nummer: site.telephone,
  kinderkoerbchen_url: site.childcareUrl,
});

// Inline formatting only: bold, links, line breaks, placeholders.
export function inline(text) {
  const values = placeholders();
  return String(text ?? '')
    .replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (all, key) => key in values ? values[key] : all)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\r?\n/g, '<br>');
}

function block(raw) {
  const text = raw.trim();
  if (!text) return '';
  const heading = text.match(/^(#{2,4}) (.+?)(?: \{#([\w-]+)\})?$/);
  if (heading && !text.includes('\n')) {
    const level = heading[1].length;
    return `<h${level}${heading[3] ? ` id="${heading[3]}"` : ''}>${inline(heading[2])}</h${level}>`;
  }
  const lines = text.split(/\r?\n/);
  for (const [marker, render] of [['- ', items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`], ['✓ ', checks], ['✗ ', crosses]]) {
    if (lines.every(line => line.startsWith(marker))) return render(lines.map(line => inline(line.slice(marker.length))));
  }
  if (text.startsWith('<')) return inline(text).replaceAll('<br>', '\n');
  const cls = text.match(/^\{\.([\w -]+)\} /);
  return `<p${cls ? ` class="${cls[1]}"` : ''}>${inline(cls ? text.slice(cls[0].length) : text)}</p>`;
}

// Full text field: several blocks.
export const md = text => String(text ?? '').split(/\r?\n\s*\r?\n/).map(block).join('');
