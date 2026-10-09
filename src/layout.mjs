import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { site } from '../assets/config.js';

// Content hash appended to CSS/JS URLs so browsers load a new version right after each deploy.
const version = file => createHash('sha256').update(readFileSync(new URL(`../assets/${file}`, import.meta.url))).digest('hex').slice(0, 10);
const assetVersion = { css: version('site.css'), js: version('site.js') };

export const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Last content review. Used for sitemap lastmod and article metadata.
export const updated = '2026-10-09';

// All photos are stored locally (no requests to Unsplash at runtime).
// To add or swap a photo: place name-640/960/1440.webp in assets/, add an entry here.
// The credits page is generated from this list.
export const photos = {
  hero: { w: 960, h: 1440, alt: 'Ein Vater küsst sein neugeborenes Baby zärtlich auf den Kopf.', author: 'Ana Curcan', source: 'https://unsplash.com/photos/a-loving-father-kisses-his-newborn-babys-head-wYYjCdLENyQ', subject: 'Vater küsst sein Neugeborenes' },
  nacht: { w: 960, h: 1440, alt: 'Eine Mutter hält ihr Baby in einem dunklen Zimmer nah bei sich.', author: 'Jenna Norman', source: 'https://unsplash.com/photos/woman-carrying-baby-8ybZT29CaoA', subject: 'Mutter mit Baby im abgedunkelten Zimmer' },
  online: { w: 960, h: 720, alt: 'Eine Mutter sitzt mit ihrem Baby auf dem Schoß lächelnd vor einem Laptop.', author: 'Brian Wangenheim', source: 'https://unsplash.com/photos/girl-in-gray-hoodie-sitting-on-chair-2pRimVfww38', subject: 'Mutter mit Baby am Laptop' },
  troesten: { w: 960, h: 699, alt: 'Ein Vater hält sein weinendes Baby im Strickpullover an der Schulter und tröstet es.', author: 'Toa Heftiba', source: 'https://unsplash.com/photos/a-man-holding-a-baby-in-his-arms-BgfxafkXjds', subject: 'Vater tröstet sein weinendes Baby' },
  einschlafen: { w: 960, h: 640, alt: 'Ein Neugeborenes schläft ruhig auf dem Unterarm eines Erwachsenen, der seinen Kopf stützt.', author: 'Steph Quernemoen', source: 'https://unsplash.com/photos/a-newborn-baby-sleeping-peacefully-in-a-persons-arms-wwJnK-ItaKI', subject: 'Neugeborenes schläft im Arm' },
  babybett: { w: 960, h: 1440, alt: 'Ein Neugeborenes schläft in Rückenlage im eigenen Bett, ohne Kissen und Decke, darüber hängt ein Mobile.', author: 'Ana Curcan', source: 'https://unsplash.com/photos/newborn-baby-sleeping-peacefully-in-a-crib-9_5P8JjSxIk', subject: 'Neugeborenes schläft in Rückenlage im Babybett' },
};

export function photo(name, { sizes = '(max-width: 760px) 100vw, 50vw', priority = false, cls = '', alt = photos[name].alt } = {}) {
  const p = photos[name];
  return `<img${cls ? ` class="${cls}"` : ''} src="assets/${name}-960.webp" srcset="assets/${name}-640.webp 640w, assets/${name}-960.webp 960w, assets/${name}-1440.webp 1440w" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(alt)}" ${priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}

export const arrow = `<svg class="icon-arrow" aria-hidden="true" viewBox="0 0 20 20" width="20" height="20"><path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icon = d => `<svg class="icon" aria-hidden="true" viewBox="0 0 20 20" width="16" height="16"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icons = {
  phone: icon('M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3.3 11 9 16.7 15.4 17a1.5 1.5 0 0 0 1.6-1.5v-2l-3.4-1.4-1.6 1.6a9 9 0 0 1-4.7-4.7l1.6-1.6Z'),
  mail: icon('M3 5h14v10H3zM3 5l7 6 7-6'),
  clock: icon('M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 3.5V10l2.5 1.8'),
  pin: icon('M10 17s5.5-5 5.5-9a5.5 5.5 0 0 0-11 0c0 4 5.5 9 5.5 9Zm0-7.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z'),
};
export const contact = (label = 'Kostenloses Kennenlernen', cls = 'button', query = '') => `<a class="${cls}" href="kontakt.html${query}">${label}${arrow}</a>`;
export const link = (href, label) => `<a class="button ghost" href="${href}">${label}${arrow}</a>`;
export const childcare = `<a href="${site.childcareUrl}" class="button ghost" rel="noopener noreferrer">Das Kinderkörbchen kennenlernen${arrow}</a>`;

// No stock person is ever shown as Anna-Lena. Replace this with a real, approved portrait:
// put portrait-640/960/1440.webp in assets/, add `portrait` to photos and return photo('portrait', …) here.
export const portrait = () => `<figure class="monogram" data-reveal><img src="assets/logo.png" alt="" width="160" height="160" loading="lazy"><blockquote><p>„Ich höre zuerst zu. Dann machen wir einen Plan, der zu eurem Kind und eurem Alltag passt.“</p></blockquote><figcaption><strong>Anna-Lena Korb</strong> Babyschlafberaterin in Eisingen bei Würzburg</figcaption></figure>`;

// Closing contact block on every content page, the way a practice or studio site ends: one clear invitation, all contact details.
export const closing = (title = 'Kostenloses Kennenlernen vereinbaren') => `<section class="contact-band" aria-labelledby="closing-title"><div class="wrap contact-band-inner"><div data-reveal><h2 id="closing-title">${title}</h2><p>Erzählt mir, was eure Nächte gerade schwer macht. In 20 kostenlosen Minuten schauen wir gemeinsam, ob und wie ich euch begleiten kann, per Zoom oder Telefon, wo immer ihr in Deutschland wohnt.</p><div class="actions">${contact('Termin anfragen', 'button light')}<a class="button outline-light" href="tel:${site.telephone}">${site.telephoneDisplay}</a></div></div><ul class="contact-facts" data-reveal style="--i:1"><li>${icons.phone}<span><strong>Telefon</strong><a href="tel:${site.telephone}">${site.telephoneDisplay}</a></span></li><li>${icons.mail}<span><strong>E-Mail</strong><a href="mailto:${site.email}">${site.email}</a></span></li><li>${icons.clock}<span><strong>Gesprächszeiten</strong>Mo–Fr 17–19 Uhr, Sa 9–13 Uhr</span></li><li>${icons.pin}<span><strong>Standort</strong>Eisingen bei Würzburg, online in ganz Deutschland</span></li></ul></div></section>`;

// Subpage head: a photo banner with the page title, or a calm colour band when no photo fits.
export const pageHead = (title, text, image = '', pos = '50% 50%') => `<header class="page-head${image ? ' has-image' : ''}">${image ? `<div class="page-head-media" style="--pos:${pos}">${photo(image, { priority: true, sizes: '100vw', alt: '' })}</div>` : ''}<div class="wrap page-head-inner"><h1>${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}</div></header>`;
export const questions = items => `<div class="questions">${items.map(([q, a]) => `<details><summary><span>${q}</span><span class="plus" aria-hidden="true"></span></summary><div class="answer"><p>${a}</p></div></details>`).join('\n')}</div>`;
const strip = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const navItems = [
  ['schlafberatung.html', 'Schlafberatung', [['schlafberatung.html', 'Überblick'], ['schlafberatung-baby.html', 'Für Babys (0–12 Monate)'], ['schlafberatung-kleinkind.html', 'Für Kleinkinder (1–6 Jahre)'], ['online-schlafberatung.html', 'Online in ganz Deutschland'], ['schlafberatung-wuerzburg.html', 'Vor Ort in Würzburg']]],
  ['ablauf.html', 'Ablauf'],
  ['preise.html', 'Kosten'],
  ['ueber-mich.html', 'Über mich'],
  ['schlafwissen.html', 'Ratgeber', [['schlafwissen.html', 'Überblick'], ['baby-einschlafen.html', 'Baby einschlafen'], ['baby-durchschlafen.html', 'Baby schläft nicht durch'], ['schlafwissen.html#sicher', 'Sicherer Babyschlaf']]],
  ['fragen.html', 'Häufige Fragen'],
];
// Agency credit, shown once at the very bottom of every page via the global footer.
export const credit = `<p class="credit">Mit <span aria-label="Liebe">♥</span> erstellt von <a href="https://kernseite.com" title="Webdesign Agentur Würzburg" target="_blank" rel="noopener">KERNSEITE</a> aus Würzburg</p>`;
const legalItems = [['impressum.html', 'Impressum'], ['datenschutz.html', 'Datenschutz'], ['agb.html', 'AGB'], ['widerruf.html', 'Widerruf'], ['barrierefreiheit.html', 'Barrierefreiheit'], ['bildnachweise.html', 'Bildnachweise']];
const brand = `<a class="brand" href="index.html" aria-label="Babyschlafberatung Anna-Lena Korb – Startseite"><img src="assets/logo.png" alt="" width="56" height="56"><span><strong>Anna-Lena Korb</strong><span class="brand-description">Babyschlafberatung</span></span></a>`;

function navigation(file) {
  const here = href => href === file ? ' aria-current="page"' : '';
  return navItems.map(([href, text, sub]) => {
    const active = href === file || sub?.some(([h]) => h === file);
    if (!sub) return `<a class="nav-item" href="${href}"${here(href)}>${text}</a>`;
    return `<div class="nav-group${active ? ' is-active' : ''}"><a class="nav-item" href="${href}"${here(href)}>${text}<svg class="chevron" aria-hidden="true" viewBox="0 0 12 12" width="12" height="12"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a><div class="subnav">${sub.slice(1).map(([h, t]) => `<a href="${h}"${here(h)}>${t}</a>`).join('')}</div></div>`;
  }).join('');
}

const pageUrl = file => new URL(file === 'index.html' ? '' : file, site.url).href;

const trail = (file, page) => [['index.html', 'Startseite'], ...(page.parent ? [page.parent] : []), [file, page.label]];

function schema(file, page) {
  const url = pageUrl(file);
  const person = {
    '@type': 'Person', '@id': `${site.url}#anna-lena`, name: 'Anna-Lena Korb', jobTitle: 'Zertifizierte Babyschlafberaterin', url: `${site.url}ueber-mich.html`,
    worksFor: { '@id': `${site.url}#beratung` },
    knowsAbout: ['Babyschlaf', 'Kleinkindschlaf', 'Einschlafbegleitung', 'Durchschlafen', 'Kindertagespflege'],
    hasCredential: [{ '@type': 'EducationalOccupationalCredential', name: 'Ausbildung zur Babyschlafberaterin', credentialCategory: 'Zertifikat', dateCreated: '2026-03-11' }],
  };
  const business = {
    '@type': 'ProfessionalService', '@id': `${site.url}#beratung`, name: site.name, url: site.url,
    telephone: site.telephone, email: site.email, logo: `${site.url}assets/logo.png`, image: `${site.url}assets/social.jpg`,
    founder: { '@id': person['@id'] }, priceRange: '0 € – 479 €', currenciesAccepted: 'EUR',
    description: 'Babyschlafberatung online per Zoom und Telefon für Familien in ganz Deutschland. Persönliche Termine im Raum Würzburg nach Absprache. Ohne Schreienlassen.',
    address: { '@type': 'PostalAddress', streetAddress: 'Müllersweg 15', postalCode: '97249', addressLocality: 'Eisingen', addressRegion: 'Bayern', addressCountry: 'DE' },
    areaServed: [{ '@type': 'Country', name: 'Deutschland' }, { '@type': 'City', name: 'Würzburg' }],
    availableLanguage: 'de',
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '17:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
  };
  const graph = [
    { '@type': 'WebSite', '@id': `${site.url}#website`, url: site.url, name: site.name, inLanguage: 'de-DE', publisher: { '@id': `${site.url}#beratung` } }, person, business,
    { '@type': 'WebPage', '@id': `${url}#page`, url, name: page.title, description: page.description, inLanguage: 'de-DE', isPartOf: { '@id': `${site.url}#website` }, dateModified: updated, ...(file !== 'index.html' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}) },
  ];
  if (file !== 'index.html') graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: trail(file, page).map(([href, name], i) => ({ '@type': 'ListItem', position: i + 1, name, item: pageUrl(href) })) });
  if (page.faq) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) });
  if (page.article) graph.push({ '@type': 'Article', '@id': `${url}#article`, headline: page.article.headline, description: page.description, inLanguage: 'de-DE', mainEntityOfPage: { '@id': `${url}#page` }, author: { '@id': person['@id'] }, publisher: { '@id': `${site.url}#beratung` }, datePublished: page.article.published, dateModified: updated, image: `${site.url}assets/${page.article.image}-1440.webp` });
  if (page.service) graph.push({ '@type': 'Service', '@id': `${url}#service`, name: page.service.name, serviceType: 'Babyschlafberatung', provider: { '@id': `${site.url}#beratung` }, areaServed: { '@type': 'Country', name: 'Deutschland' }, availableChannel: { '@type': 'ServiceChannel', name: 'Zoom und Telefon' },
    ...(page.service.offers ? { offers: page.service.offers.map(o => ({ '@type': 'Offer', name: o.name, price: String(o.price), priceCurrency: 'EUR', url: `${site.url}preise.html` })) } : {}) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}

function withBreadcrumb(file, page, content) {
  if (file === 'index.html' || file === '404.html') return content;
  const items = trail(file, page);
  const crumbs = `<nav class="wrap breadcrumb" aria-label="Brotkrümelnavigation">${items.map(([href, name], i) => i === items.length - 1 ? `<span aria-current="page">${name}</span>` : `<a href="${href}">${name}</a><span aria-hidden="true">›</span>`).join('')}</nav>`;
  const end = content.startsWith('<header class="page-head') ? content.indexOf('</header>') + 9 : 0;
  return content.slice(0, end) + crumbs + content.slice(end);
}

export function layout(file, page) {
  const { title, description, label, content, noindex = false, ogImage = 'social.jpg' } = page;
  const url = pageUrl(file);
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
  <meta name="author" content="Anna-Lena Korb">
  <meta name="theme-color" content="#ffffff">
${file === '404.html' ? `  <base href="${site.url}">\n` : ''}  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="de-DE" href="${url}">
  <link rel="icon" href="assets/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="preload" href="assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/site.css?v=${assetVersion.css}">
  <meta property="og:type" content="${page.article ? 'article' : 'website'}">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.url}assets/${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Babyschlafberatung Anna-Lena Korb: ruhigere Nächte mit Nähe und einem klaren Plan.">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${schema(file, page)}</script>
  <script type="module" src="assets/site.js?v=${assetVersion.js}"></script>
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<div class="topbar"><div class="wrap topbar-inner"><p>Babyschlafberatung online in ganz Deutschland · persönlich im Raum Würzburg</p><ul><li><a href="tel:${site.telephone}">${icons.phone}${site.telephoneDisplay}</a></li><li><a href="mailto:${site.email}">${icons.mail}${site.email}</a></li><li>${icons.clock}Mo–Fr 17–19 · Sa 9–13 Uhr</li></ul></div></div>
<header class="header"><div class="wrap nav">${brand}<button class="menu" aria-controls="navigation" aria-expanded="false" type="button" hidden><span class="menu-label">Menü</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button><nav class="nav-links" id="navigation" aria-label="Hauptnavigation">${navigation(file)}<a href="kontakt.html" class="button small nav-cta"${file === 'kontakt.html' ? ' aria-current="page"' : ''}>Termin anfragen</a></nav></div></header>
<main id="inhalt">${withBreadcrumb(file, page, content)}</main>
<footer class="footer"><div class="wrap footer-main"><div class="footer-brand">${brand}<p>Persönliche Babyschlafberatung ohne Schreienlassen. Online per Zoom und Telefon für Familien in ganz Deutschland, persönliche Termine in Würzburg und Umgebung nach Absprache.</p></div><div><h2>Schlafberatung</h2>${navItems[0][2].map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}<a href="ablauf.html">Ablauf</a><a href="preise.html">Kosten</a></div><div><h2>Ratgeber</h2>${navItems[4][2].slice(1).map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}<a href="fragen.html">Häufige Fragen</a><a href="ueber-mich.html">Über mich</a></div><div><h2>Kontakt</h2><address>Anna-Lena Korb<br>Müllersweg 15<br>97249 Eisingen</address><a href="tel:${site.telephone}">${site.telephoneDisplay}</a><a href="mailto:${site.email}">${site.email}</a><p>Mo–Fr 17–19 Uhr, Sa 9–13 Uhr</p></div></div><div class="footer-bottom"><div class="wrap footer-bottom-inner"><span>© 2026 Anna-Lena Korb · Babyschlafberatung</span><nav class="legal-links" aria-label="Rechtliches">${legalItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav></div>${credit}</div></footer>
</body></html>\n`;
}
