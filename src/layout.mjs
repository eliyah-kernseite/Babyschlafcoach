import { site } from '../assets/config.js';

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
export const contact = (label = 'Kostenloses Kennenlernen', cls = 'button', query = '') => `<a class="${cls}" href="kontakt.html${query}">${label}${arrow}</a>`;
export const link = (href, label) => `<a class="text-link" href="${href}">${label}${arrow}</a>`;
export const childcare = `<a href="${site.childcareUrl}" class="text-link" rel="noopener noreferrer">Das Kinderkörbchen kennenlernen${arrow}</a>`;

// No stock person is ever shown as Anna-Lena. Replace this with a real, approved portrait:
// put portrait-640/960/1440.webp in assets/, add `portrait` to photos and return photo('portrait', …) here.
export const portrait = () => `<figure class="monogram" data-reveal><img src="assets/logo.png" alt="" width="160" height="160" loading="lazy"><blockquote><p>„Ich höre zuerst zu. Dann machen wir einen Plan, der zu eurem Kind und eurem Alltag passt.“</p></blockquote><figcaption><strong>Anna-Lena Korb</strong><span>Babyschlafberaterin · Eisingen bei Würzburg</span></figcaption></figure>`;

export const closing = (title = 'Ihr müsst nicht schon <em>alle Antworten</em> haben.') => `<section class="night" aria-labelledby="closing-title"><div class="night-sky" aria-hidden="true"></div><div class="wrap night-inner" data-reveal><svg class="moon" aria-hidden="true" viewBox="0 0 64 64" width="56" height="56"><path d="M42 8a24 24 0 1 0 14 38A20 20 0 0 1 42 8Z" fill="currentColor"/></svg><h2 id="closing-title">${title}</h2><p>Erzählt mir, was eure Nächte gerade schwer macht. In 20 kostenlosen Minuten schauen wir gemeinsam, ob und wie ich euch begleiten kann. Per Zoom oder Telefon, wo immer ihr in Deutschland wohnt.</p><div class="night-actions">${contact('Kennenlernen anfragen', 'button light')}<a class="text-link light" href="tel:${site.telephone}">${site.telephoneDisplay}</a></div><p class="night-note">20 Minuten · kostenlos · unverbindlich</p></div></section>`;

export const pageHead = (kicker, title, text, aside = '') => `<header class="page-head wrap${aside ? ' has-aside' : ''}"><div><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lead">${text}</p></div>${aside}</header>`;
export const questions = items => `<div class="questions">${items.map(([q, a]) => `<details><summary><span>${q}</span><span class="plus" aria-hidden="true"></span></summary><div class="answer"><p>${a}</p></div></details>`).join('\n')}</div>`;
const strip = html => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const navItems = [['schlafberatung.html', 'Beratung'], ['online-schlafberatung.html', 'Online-Beratung'], ['ueber-mich.html', 'Über mich'], ['preise.html', 'Preise'], ['schlafwissen.html', 'Ratgeber']];
const guideItems = [['baby-einschlafen.html', 'Baby einschlafen'], ['baby-durchschlafen.html', 'Baby schläft nicht durch'], ['schlafwissen.html', 'Sicherer Babyschlaf']];
const legalItems = [['impressum.html', 'Impressum'], ['datenschutz.html', 'Datenschutz'], ['agb.html', 'AGB'], ['widerruf.html', 'Widerruf'], ['barrierefreiheit.html', 'Barrierefreiheit'], ['bildnachweise.html', 'Bildnachweise']];
const brand = `<a class="brand" href="index.html" aria-label="Babyschlafberatung Anna-Lena Korb – Startseite"><img src="assets/logo.png" alt="" width="56" height="56"><span><strong>Anna-Lena Korb</strong><span class="brand-description">Babyschlafberatung</span></span></a>`;

const pageUrl = file => new URL(file === 'index.html' ? '' : file, site.url).href;

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
  if (file !== 'index.html') graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Startseite', item: site.url },
    { '@type': 'ListItem', position: 2, name: page.label, item: url },
  ] });
  if (page.faq) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })) });
  if (page.article) graph.push({ '@type': 'Article', '@id': `${url}#article`, headline: page.article.headline, description: page.description, inLanguage: 'de-DE', mainEntityOfPage: { '@id': `${url}#page` }, author: { '@id': person['@id'] }, publisher: { '@id': `${site.url}#beratung` }, datePublished: page.article.published, dateModified: updated, image: `${site.url}assets/${page.article.image}-1440.webp` });
  if (page.service) graph.push({ '@type': 'Service', '@id': `${url}#service`, name: page.service.name, serviceType: 'Babyschlafberatung', provider: { '@id': `${site.url}#beratung` }, areaServed: { '@type': 'Country', name: 'Deutschland' }, availableChannel: { '@type': 'ServiceChannel', name: 'Zoom und Telefon' },
    ...(page.service.offers ? { offers: page.service.offers.map(o => ({ '@type': 'Offer', name: o.name, price: String(o.price), priceCurrency: 'EUR', url: `${site.url}preise.html` })) } : {}) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c');
}

export function layout(file, page) {
  const { title, description, label, content, noindex = false, ogImage = 'social.jpg' } = page;
  const url = pageUrl(file);
  const current = href => href === file || (file.startsWith('baby-') && href === 'schlafwissen.html') ? ' aria-current="page"' : '';
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
  <meta name="author" content="Anna-Lena Korb">
  <meta name="theme-color" content="#f6f1e9">
${file === '404.html' ? `  <base href="${site.url}">\n` : ''}  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="de-DE" href="${url}">
  <link rel="icon" href="assets/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <link rel="preload" href="assets/manrope.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/newsreader.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/site.css">
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
  <script type="module" src="assets/site.js"></script>
</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header class="header"><div class="wrap nav">${brand}<button class="menu" aria-controls="navigation" aria-expanded="false" type="button" hidden><span class="menu-label">Menü</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button><nav class="nav-links" id="navigation" aria-label="Hauptnavigation">${navItems.map(([href, text]) => `<a href="${href}"${current(href)}>${text}</a>`).join('')}<a href="kontakt.html" class="button small nav-cta"${file === 'kontakt.html' ? ' aria-current="page"' : ''}>Kennenlernen${arrow}</a></nav></div></header>
<main id="inhalt">${file !== 'index.html' && file !== '404.html' ? `<nav class="wrap breadcrumb" aria-label="Brotkrümelnavigation"><a href="index.html">Startseite</a><span aria-hidden="true">/</span><span aria-current="page">${label}</span></nav>` : ''}${content}</main>
<footer class="footer"><div class="wrap"><div class="footer-lead"><p class="footer-statement">Ehrlich beraten. Mit einem Plan begleiten. <em>Nähe bewahren.</em></p></div><div class="footer-main"><div class="footer-brand">${brand}<p>Babyschlafberatung online für Familien in ganz Deutschland. Persönliche Termine in Würzburg und Umgebung nach Absprache.</p></div><div><h2>Beratung</h2>${navItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}<a href="kontakt.html">Termin anfragen</a></div><div><h2>Ratgeber</h2>${guideItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}<a href="${site.childcareUrl}" rel="noopener noreferrer">Kindertagespflege Kinderkörbchen</a></div><div><h2>Kontakt</h2><a href="mailto:${site.email}">${site.email}</a><a href="tel:${site.telephone}">${site.telephoneDisplay}</a><p>Mo–Fr 17–19 Uhr · Sa 9–13 Uhr<br>Eisingen bei Würzburg</p></div></div><div class="footer-bottom"><span>© 2026 Anna-Lena Korb</span><nav class="legal-links" aria-label="Rechtliches">${legalItems.map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</nav></div></div></footer>
</body></html>\n`;
}
