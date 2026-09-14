import { site } from '../assets/config.js';

export const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const contact = (label = 'Kostenlos kennenlernen', cls = 'button', query = '') => `<a class="${cls}" href="kontakt.html${query}">${label}<span aria-hidden="true">↗</span></a>`;
export const childcare = `<a href="${site.childcareUrl}" class="text-link" rel="noopener noreferrer">Das Kinderkörbchen kennenlernen <span aria-hidden="true">↗</span></a>`;
export const portrait = () => `<figure class="portrait-placeholder"><div class="portrait-inner"><span class="portrait-mark" aria-hidden="true">AK</span><span class="eyebrow">Ein Gesicht zu einem guten Gefühl.</span><p>Hier folgt Anna-Lenas<br>persönliches Porträt.</p><span class="placeholder-label">Fotoplatzhalter · wird ersetzt</span></div><figcaption>Geplant: ein natürliches Porträt in heller, vertrauter Umgebung.</figcaption></figure>`;
export const hands = (priority = false) => `<img class="hands-photo" src="assets/hands-960.webp" srcset="assets/hands-640.webp 640w, assets/hands-960.webp 960w, assets/hands-1440.webp 1440w" sizes="(max-width: 760px) calc(100vw - 40px), 46vw" width="960" height="640" alt="Eine Babyhand umfasst den Finger eines Erwachsenen." ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
export const closing = () => `<section class="closing"><div class="wrap closing-layout"><div><p class="eyebrow">Ein kleiner Anfang</p><h2>Ihr müsst nicht schon<br>alle Antworten haben.</h2><p>Erzähl mir, was eure Nächte gerade schwer macht. In 20 kostenlosen Minuten schauen wir, ob und wie ich euch unterstützen kann.</p></div><div class="closing-action">${contact()}<p>20 Minuten · unverbindlich · ohne Paketpflicht</p></div></div></section>`;
export const pageHead = (eyebrow, title, text) => `<header class="page-head wrap"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${text}</p></header>`;
export const questions = items => `<div class="questions">${items.map(([q, a]) => `<details><summary>${q}</summary><div class="answer"><p>${a}</p></div></details>`).join('\n')}</div>`;

const navItems = [['schlafberatung.html', 'So helfe ich'], ['ueber-mich.html', 'Über mich'], ['preise.html', 'Angebote & Preise'], ['schlafwissen.html', 'Schlafwissen']];
const legalItems = [['impressum.html', 'Impressum'], ['datenschutz.html', 'Datenschutz'], ['agb.html', 'AGB'], ['widerruf.html', 'Widerruf'], ['barrierefreiheit.html', 'Barrierefreiheit'], ['bildnachweise.html', 'Bildnachweise']];
const brand = `<a class="brand" href="index.html" aria-label="Babyschlafberatung Anna-Lena Korb – Startseite"><img src="assets/logo.png" alt="" width="56" height="56"><span><strong>Anna-Lena Korb</strong><span class="brand-description">Babyschlafberatung</span></span></a>`;

function schema(file, title, description) {
  const url = new URL(file === 'index.html' ? '' : file, site.url).href;
  const person = { '@type': 'Person', '@id': `${site.url}#anna-lena`, name: 'Anna-Lena Korb', jobTitle: 'Zertifizierte Babyschlafberaterin', url: `${site.url}ueber-mich.html` };
  const business = {
    '@type': 'ProfessionalService', '@id': `${site.url}#beratung`, name: site.name, url: site.url,
    telephone: site.telephone, email: site.email, logo: `${site.url}assets/logo.png`,
    founder: { '@id': person['@id'] }, description: 'Individuelle Babyschlafberatung per Zoom und Telefon. Persönliche Termine im Raum Würzburg nach Absprache.',
    address: { '@type': 'PostalAddress', streetAddress: 'Müllersweg 15', postalCode: '97249', addressLocality: 'Eisingen', addressCountry: 'DE' },
    areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'City', name: 'Würzburg' }],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '17:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
  };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${site.url}#website`, url: site.url, name: site.name, inLanguage: 'de-DE' }, person, business,
    { '@type': 'WebPage', '@id': `${url}#page`, url, name: title, description, inLanguage: 'de-DE', isPartOf: { '@id': `${site.url}#website` } },
  ] }).replaceAll('<', '\\u003c');
}

export function layout(file, { title, description, label, content, noindex = false }) {
  const url = new URL(file === 'index.html' ? '' : file, site.url).href;
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">
  <meta name="theme-color" content="#f8f4ee">
${file === '404.html' ? `  <base href="${site.url}">` : ''}
  <link rel="canonical" href="${url}">
  <link rel="icon" href="assets/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="preload" href="assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/site.css">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.url}assets/hands-1440.webp">
  <meta property="og:image:alt" content="Eine Babyhand hält einen Finger. Symbolbild für Nähe und Begleitung.">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${schema(file, title, description)}</script>
  <script type="module" src="assets/site.js"></script>
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header class="header"><div class="wrap nav">${brand}<button class="menu" aria-controls="navigation" aria-expanded="false" type="button" hidden>Menü <span aria-hidden="true">☰</span></button><nav class="nav-links" id="navigation" aria-label="Hauptnavigation">${navItems.map(([href, text]) => `<a href="${href}"${href === file ? ' aria-current="page"' : ''}>${text}</a>`).join('')}<a href="kontakt.html" class="button nav-cta"${file === 'kontakt.html' ? ' aria-current="page"' : ''}>Kennenlernen <span aria-hidden="true">↗</span></a></nav></div></header>
<main id="inhalt">${file !== 'index.html' && file !== '404.html' ? `<nav class="wrap breadcrumb" aria-label="Brotkrümelnavigation"><a href="index.html">Startseite</a><span aria-hidden="true">/</span><span aria-current="page">${label}</span></nav>` : ''}${content}</main>
<footer><div class="wrap"><div class="footer-main"><div>${brand}<p>Ehrlich beraten.<br>Mit einem Plan begleiten.<br>Nähe bewahren.</p></div><div><h2>Entdecken</h2>${navItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}<a href="${site.childcareUrl}" rel="noopener noreferrer">Kindertagespflege Kinderkörbchen ↗</a></div><div><h2>Wir sprechen miteinander</h2><a href="mailto:${site.email}">${site.email}</a><a href="tel:${site.telephone}">${site.telephoneDisplay}</a><p>Mo–Fr 17–19 Uhr · Sa 9–13 Uhr<br>Sonntag geschlossen<br>Eisingen bei Würzburg · online deutschlandweit</p></div></div><div class="footer-bottom"><span>© 2026 Anna-Lena Korb</span><nav class="legal-links" aria-label="Rechtliches">${legalItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav></div></div></footer>
</body></html>\n`;
}
