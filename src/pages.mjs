import { site, offers, offerDetails, page, read, variant, variantSize } from './content.mjs';
import { md, inline, checks } from './text.mjs';
import { contact, link, arrow, closing, pageHead, portrait, photo, questions, childcare, updated } from './layout.mjs';

// Texts live in content/ (editable in Pages CMS). This file only holds the markup.
const blocks = read('bausteine.yml');
const faqItems = list => (list ?? []).map(f => [inline(f.frage), inline(f.antwort)]);
const dl = items => items.map(i => `<div><dt>${i.begriff}</dt><dd>${inline(i.text)}</dd></div>`).join('');

const intro = (h, p = '', cls = '') => `<div class="intro${cls ? ` ${cls}` : ''}" data-reveal><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}</div>`;
// Full-bleed photo/text halves.
const split = ({ img, pos = '50% 50%', body, reverse = false, tone = '' }) => `<section class="split${reverse ? ' reverse' : ''}${tone ? ` ${tone}` : ''}"><figure class="split-media" style="--pos:${pos}">${photo(img, { sizes: '(max-width: 900px) 100vw, 50vw' })}</figure><div class="split-body" data-reveal>${body}</div></section>`;
// Start page: portrait photo on phones, landscape photo on larger screens.
const heroPicture = hero => { const { w, h } = variantSize(hero.bild_handy); return `<picture><source media="(max-width: 760px)" srcset="${[640, 768, 960, 1440].map(n => `${variant(hero.bild_handy, n)} ${n}w`).join(', ')}" sizes="100vw" width="${w}" height="${h}">${photo(hero.bild, { priority: true, sizes: '100vw' })}</picture>`; };

const serviceTeasers = (exclude = '') => `<div class="teasers">${blocks.schwerpunkte.filter(s => s.seite !== exclude).map((s, i) => `<a class="teaser" href="${s.seite}" data-reveal style="--i:${i};--pos:${s.ausschnitt}">${photo(s.bild, { sizes: '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 25vw' })}<span class="teaser-body"><span class="teaser-title">${s.titel}</span><span class="teaser-text">${s.text}</span><span class="teaser-more">Mehr erfahren${arrow}</span></span></a>`).join('')}</div>`;

const guideCards = (exclude = '') => `<div class="articles">${blocks.ratgeber.filter(g => g.seite !== exclude).map((g, i) => `<a class="article-teaser" href="${g.seite}" data-reveal style="--i:${i}"><span class="article-img">${photo(g.bild, { sizes: '(max-width: 760px) 100vw, 33vw' })}</span><h3>${g.titel}</h3><span class="teaser-more">Weiterlesen${arrow}</span></a>`).join('')}</div>`;

const price = id => offers.find(o => o.id.toLowerCase() === id.toLowerCase()).price;
const priceCards = (list, flag) => `<div class="price-cards">${list.map(p => `<article class="price-card${p.id === 'intensiv' ? ' featured' : ''}" id="${p.id}" data-reveal>${p.id === 'intensiv' ? `<p class="price-flag">${flag}</p>` : ''}<h2>${p.name}</h2><p class="price-duration">${p.dauer}</p><p class="price-value">${price(p.id)} €</p><p class="package-description">${inline(p.text)}</p>${checks(p.leistungen.map(inline))}${contact(`${p.name} anfragen`, `button${p.id === 'intensiv' ? '' : ' secondary'}`, `?paket=${p.name}#anfrage`)}<p class="tiny">Gesamtpreis, kein Abo</p></article>`).join('')}</div>`;

const priceTable = () => `<table class="price-table"><caption class="visually-hidden">Angebote und Gesamtpreise</caption><thead><tr><th scope="col">Angebot</th><th scope="col">Leistung</th><th scope="col">Preis</th></tr></thead><tbody><tr><th scope="row">${offers[0].id}</th><td>${offerDetails[offers[0].id]}</td><td>kostenlos</td></tr>${offers.slice(1).map(o => `<tr><th scope="row"><a href="preise.html#${o.id.toLowerCase()}">${o.name}</a></th><td>${offerDetails[o.id]}</td><td>${o.price} €</td></tr>`).join('')}</tbody></table>`;

const process = list => `<ol class="steps">${list.map((s, i) => `<li data-reveal style="--i:${i}"><span class="step-no" aria-hidden="true">${i + 1}</span><div><h3>${s.titel}</h3><p>${inline(s.text)}</p></div></li>`).join('')}</ol>`;

const certificate = (cls = '', full = true) => `<figure class="certificate ${cls}" data-reveal><a href="assets/zertifikat-anna-lena-korb.png" aria-label="Abschlusszertifikat in voller Größe öffnen"><img src="assets/zertifikat-anna-lena-korb-1200.webp" srcset="assets/zertifikat-anna-lena-korb-640.webp 640w, assets/zertifikat-anna-lena-korb-960.webp 960w, assets/zertifikat-anna-lena-korb-1200.webp 1200w" sizes="(max-width: 760px) calc(100vw - 40px), 600px" alt="Abschlusszertifikat: Anna-Lena Korb hat die Ausbildung zur Babyschlafberaterin am 11.03.2026 erfolgreich absolviert. Ausbildungsleitung Melanie Heift-Budde." width="1200" height="849" loading="lazy" decoding="async"></a><figcaption>${full ? blocks.zertifikat.text_lang : blocks.zertifikat.text_kurz} <a href="assets/zertifikat-anna-lena-korb.png">${blocks.zertifikat.link}</a></figcaption></figure>`;

function article({ minutes, toc, body, related, image, note }) {
  return `<div class="wrap article-layout"><aside class="article-aside"><div class="byline"><img src="assets/logo.png" alt="Logo der Babyschlafberatung Anna-Lena Korb" width="44" height="44" loading="lazy"><div><span class="byline-name">Anna-Lena Korb</span><span>Zertifizierte Babyschlafberaterin</span></div></div><p class="meta">Aktualisiert am <time datetime="${updated}">15. Oktober 2026</time><br>Lesezeit etwa ${minutes} Minuten</p><nav class="toc" aria-label="Inhalt dieses Artikels"><p>Inhalt</p><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ol></nav></aside><article class="prose article-body">${image ? `<figure class="article-figure">${photo(image, { sizes: '(max-width: 760px) 100vw, 720px' })}</figure>` : ''}${body}<aside class="callout"><p>${note}</p></aside></article></div><section class="section soft"><div class="wrap">${intro(blocks.ratgeber_titel)}${guideCards(related)}</div></section>`;
}

const P_index = page('index');
const P_schlafberatung = page('schlafberatung');
const P_schlafberatung_baby = page('schlafberatung-baby');
const P_schlafberatung_kleinkind = page('schlafberatung-kleinkind');
const P_online_schlafberatung = page('online-schlafberatung');
const P_schlafberatung_wuerzburg = page('schlafberatung-wuerzburg');
const P_ablauf = page('ablauf');
const P_preise = page('preise');
const P_ueber_mich = page('ueber-mich');
const P_fragen = page('fragen');
const P_kontakt = page('kontakt');
const P_baby_einschlafen = page('baby-einschlafen');
const P_baby_durchschlafen = page('baby-durchschlafen');
const P_schlafwissen = page('schlafwissen');
const P_404 = page('404');

export const pages = {
  'index.html': {
    title: P_index.seo.titel, label: P_index.seo.menuename,
    description: P_index.seo.beschreibung,
    faq: faqItems(P_index.fragen),
    content: `<section class="hero"><div class="hero-media">${heroPicture(P_index.startbild)}</div><div class="wrap hero-inner"><p class="hero-title">${inline(P_index.startbild.titel)}</p><p class="hero-text">${P_index.startbild.text}</p><div class="actions">${contact(P_index.button_1, 'button light')}<a class="button outline-light" href="schlafberatung.html">${P_index.button_10}${arrow}</a></div></div></section>
    <section class="section wrap welcome"><div class="welcome-text" data-reveal><h1>${P_index.hauptueberschrift}</h1>${md(P_index.text_1)}<div class="actions">${contact()}${link('ueber-mich.html', P_index.button_2)}</div></div>${certificate('', false)}</section>
    <section class="section soft"><div class="wrap">${intro(P_index.abschnitt_1.titel, inline(P_index.abschnitt_1.text))}${serviceTeasers()}</div></section>
    ${split({ img: P_index.foto_1.bild, pos: P_index.foto_1.ausschnitt, body: `${md(P_index.text_2)}${link('schlafberatung.html', P_index.button_3)}` })}
    <section class="section wrap">${intro(P_index.abschnitt_2.titel, inline(P_index.abschnitt_2.text), 'row')}${process(P_index.schritte)}<div class="actions center">${link('ablauf.html', P_index.button_4)}</div></section>
    ${split({ img: P_index.foto_2.bild, pos: P_index.foto_2.ausschnitt, reverse: true, tone: 'dark', body: `${md(P_index.text_3)}<div class="actions">${contact(P_index.button_5, 'button light')}<a class="button outline-light" href="online-schlafberatung.html">${P_index.button_11}${arrow}</a></div>` })}
    <section class="section wrap prices-home"><div data-reveal>${md(P_index.text_4)}${link('preise.html', P_index.button_6)}</div><div data-reveal style="--i:1">${priceTable()}</div></section>
    <section class="section soft about-home"><div class="wrap about-home-inner">${portrait(P_index.zitat.zitat, P_index.zitat.unterzeile)}<div data-reveal>${md(P_index.text_5)}<div class="actions">${link('ueber-mich.html', P_index.button_7)}${link('ueber-mich.html#qualifikationen', P_index.button_8)}</div></div></div></section>
    <section class="section wrap">${intro(P_index.abschnitt_3.titel, inline(P_index.abschnitt_3.text), 'row')}${guideCards()}</section>
    <section class="section wrap faq-layout"><div data-reveal>${md(P_index.text_6)}${link('fragen.html', P_index.button_9)}</div>${questions(faqItems(P_index.fragen))}</section>${closing()}`,
  },
  'schlafberatung.html': {
    title: P_schlafberatung.seo.titel, label: P_schlafberatung.seo.menuename,
    description: P_schlafberatung.seo.beschreibung,
    service: { name: 'Schlafberatung für Babys und Kleinkinder', offers: offers.slice(1) },
    content: `${pageHead(P_schlafberatung.kopf.titel, inline(P_schlafberatung.kopf.text), P_schlafberatung.kopf.bild, P_schlafberatung.kopf.ausschnitt)}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_schlafberatung.text_1)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_schlafberatung.text_2)}<dl>${dl(P_schlafberatung.liste_1)}</dl>${contact(P_schlafberatung.button_1, 'button full')}</aside></section>
    <section class="section soft"><div class="wrap">${intro(P_schlafberatung.abschnitt_1.titel, inline(P_schlafberatung.abschnitt_1.text))}${serviceTeasers()}</div></section>
    <section class="section wrap age-table"><div data-reveal>${md(P_schlafberatung.text_3)}</div><dl data-reveal style="--i:1">${dl(P_schlafberatung.liste_2)}</dl></section>
    ${split({ img: P_schlafberatung.foto_1.bild, pos: P_schlafberatung.foto_1.ausschnitt, body: `${md(P_schlafberatung.text_4)}${link('ablauf.html', P_schlafberatung.button_2)}` })}
    <section class="section wrap">${intro(P_schlafberatung.abschnitt_2.titel, inline(P_schlafberatung.abschnitt_2.text))}<div class="promise"><div>${md(P_schlafberatung.text_5)}</div><div>${md(P_schlafberatung.text_6)}</div></div></section>${closing()}`,
  },
  'schlafberatung-baby.html': {
    title: P_schlafberatung_baby.seo.titel, label: P_schlafberatung_baby.seo.menuename, parent: ['schlafberatung.html', 'Schlafberatung'],
    description: P_schlafberatung_baby.seo.beschreibung,
    faq: faqItems(P_schlafberatung_baby.fragen),
    service: { name: 'Schlafberatung für Babys', offers: offers.slice(1) },
    content: `${pageHead(P_schlafberatung_baby.kopf.titel, inline(P_schlafberatung_baby.kopf.text), P_schlafberatung_baby.kopf.bild, P_schlafberatung_baby.kopf.ausschnitt)}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_schlafberatung_baby.text_1)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_schlafberatung_baby.text_2)}${contact(P_schlafberatung_baby.button_1, 'button full')}${md(P_schlafberatung_baby.text_3)}</aside></section>
    <section class="section soft"><div class="wrap">${intro(P_schlafberatung_baby.abschnitt_1.titel)}${guideCards()}</div></section>
    <section class="section wrap faq-layout"><div data-reveal>${md(P_schlafberatung_baby.text_4)}${link('fragen.html', P_schlafberatung_baby.button_2)}</div>${questions(faqItems(P_schlafberatung_baby.fragen))}</section>${closing()}`,
  },
  'schlafberatung-kleinkind.html': {
    title: P_schlafberatung_kleinkind.seo.titel, label: P_schlafberatung_kleinkind.seo.menuename, parent: ['schlafberatung.html', 'Schlafberatung'],
    description: P_schlafberatung_kleinkind.seo.beschreibung,
    faq: faqItems(P_schlafberatung_kleinkind.fragen),
    service: { name: 'Schlafberatung für Kleinkinder', offers: offers.slice(1) },
    content: `${pageHead(P_schlafberatung_kleinkind.kopf.titel, inline(P_schlafberatung_kleinkind.kopf.text), P_schlafberatung_kleinkind.kopf.bild, P_schlafberatung_kleinkind.kopf.ausschnitt)}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_schlafberatung_kleinkind.text_1)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_schlafberatung_kleinkind.text_2)}${contact(P_schlafberatung_kleinkind.button_1, 'button full')}${md(P_schlafberatung_kleinkind.text_3)}</aside></section>
    ${split({ img: P_schlafberatung_kleinkind.foto_1.bild, pos: P_schlafberatung_kleinkind.foto_1.ausschnitt, tone: 'soft', body: `${md(P_schlafberatung_kleinkind.text_4)}${link('online-schlafberatung.html', P_schlafberatung_kleinkind.button_2)}` })}
    <section class="section wrap faq-layout"><div data-reveal>${md(P_schlafberatung_kleinkind.text_5)}${link('fragen.html', P_schlafberatung_kleinkind.button_3)}</div>${questions(faqItems(P_schlafberatung_kleinkind.fragen))}</section>${closing()}`,
  },
  'online-schlafberatung.html': {
    title: P_online_schlafberatung.seo.titel, label: P_online_schlafberatung.seo.menuename, parent: ['schlafberatung.html', 'Schlafberatung'],
    description: P_online_schlafberatung.seo.beschreibung,
    faq: faqItems(P_online_schlafberatung.fragen),
    service: { name: 'Babyschlafberatung online', offers: offers.slice(1) },
    content: `${pageHead(P_online_schlafberatung.kopf.titel, inline(P_online_schlafberatung.kopf.text), P_online_schlafberatung.kopf.bild, P_online_schlafberatung.kopf.ausschnitt)}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_online_schlafberatung.text_1)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_online_schlafberatung.text_2)}${contact(P_online_schlafberatung.button_1, 'button full')}</aside></section>
    <section class="section soft"><div class="wrap">${intro(P_online_schlafberatung.abschnitt_1.titel, inline(P_online_schlafberatung.abschnitt_1.text), 'row')}${process(P_online_schlafberatung.schritte)}</div></section>
    <section class="section wrap faq-layout" id="fragen"><div data-reveal>${md(P_online_schlafberatung.text_3)}${link('fragen.html', P_online_schlafberatung.button_2)}</div>${questions(faqItems(P_online_schlafberatung.fragen))}</section>${closing()}`,
  },
  'schlafberatung-wuerzburg.html': {
    title: P_schlafberatung_wuerzburg.seo.titel, label: P_schlafberatung_wuerzburg.seo.menuename, parent: ['schlafberatung.html', 'Schlafberatung'],
    description: P_schlafberatung_wuerzburg.seo.beschreibung,
    service: { name: 'Babyschlafberatung in Würzburg', offers: offers.slice(1) },
    content: `${pageHead(P_schlafberatung_wuerzburg.kopf.titel, inline(P_schlafberatung_wuerzburg.kopf.text), P_schlafberatung_wuerzburg.kopf.bild, P_schlafberatung_wuerzburg.kopf.ausschnitt)}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_schlafberatung_wuerzburg.text_1)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_schlafberatung_wuerzburg.text_2)}<address>${inline(P_schlafberatung_wuerzburg.adresse)}</address>${md(P_schlafberatung_wuerzburg.text_3)}${contact(P_schlafberatung_wuerzburg.button_1, 'button full')}</aside></section>
    <section class="section soft"><div class="wrap content-grid"><div class="prose" data-reveal>${md(P_schlafberatung_wuerzburg.text_4)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_schlafberatung_wuerzburg.text_5)}${link('online-schlafberatung.html', P_schlafberatung_wuerzburg.button_2)}</aside></div></section>
    <section class="section"><div class="wrap">${intro(P_schlafberatung_wuerzburg.abschnitt_1.titel)}${serviceTeasers('schlafberatung-wuerzburg.html')}</div></section>${closing()}`,
  },
  'ablauf.html': {
    title: P_ablauf.seo.titel, label: P_ablauf.seo.menuename,
    description: P_ablauf.seo.beschreibung,
    content: `${pageHead(P_ablauf.kopf.titel, inline(P_ablauf.kopf.text))}
    <section class="section wrap">${intro(P_ablauf.abschnitt_1.titel, inline(P_ablauf.abschnitt_1.text), 'row')}${process(P_ablauf.schritte)}</section>
    ${split({ img: P_ablauf.foto_1.bild, pos: P_ablauf.foto_1.ausschnitt, tone: 'soft', body: `${md(P_ablauf.text_1)}` })}
    <section class="section wrap content-grid"><div class="prose" data-reveal>${md(P_ablauf.text_2)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_ablauf.text_3)}${contact(P_ablauf.button_1, 'button full')}${link('preise.html', P_ablauf.button_2)}</aside></section>${closing()}`,
  },
  'preise.html': {
    title: P_preise.seo.titel, label: P_preise.seo.menuename,
    description: P_preise.seo.beschreibung,
    service: { name: 'Babyschlafberatung', offers: offers.slice(1) },
    content: `${pageHead(P_preise.kopf.titel, inline(P_preise.kopf.text))}
    <section class="section wrap"><div class="notice" data-reveal><div>${md(P_preise.text_1)}</div>${contact()}</div>${priceCards(P_preise.pakete, P_preise.hervorhebung)}<article class="single-offer" id="sprechstunde" data-reveal><div>${md(P_preise.text_2)}</div><div class="single-price"><p class="price-value">${offers.find(o => o.id === 'Sprechstunde').price} €</p>${contact(P_preise.button_1, 'button secondary', '?paket=Sprechstunde#anfrage')}</div></article></section>
    <section class="section soft"><div class="wrap content-grid"><div class="prose" data-reveal>${md(P_preise.text_3)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_preise.text_4)}${contact(P_preise.button_2, 'button full')}</aside></div></section>${closing()}`,
  },
  'ueber-mich.html': {
    title: P_ueber_mich.seo.titel, label: P_ueber_mich.seo.menuename,
    description: P_ueber_mich.seo.beschreibung,
    content: `${pageHead(P_ueber_mich.kopf.titel, inline(P_ueber_mich.kopf.text))}
    <section class="section wrap about-home-inner">${portrait()}<div class="prose" data-reveal>${md(P_ueber_mich.text_1)}</div></section>
    ${childcare()}
    ${split({ img: P_ueber_mich.foto_1.bild, pos: P_ueber_mich.foto_1.ausschnitt, body: `${md(P_ueber_mich.text_2)}` })}
    <section class="section wrap" id="qualifikationen">${intro(P_ueber_mich.abschnitt_1.titel, inline(P_ueber_mich.abschnitt_1.text), 'row')}<div class="credential-layout"><dl class="credentials" data-reveal>${dl(P_ueber_mich.liste_1)}</dl>${certificate()}</div></section>
    <section class="section soft"><div class="wrap narrow" data-reveal>${md(P_ueber_mich.text_3)}</div></section>${closing()}`,
  },
  'fragen.html': {
    title: P_fragen.seo.titel, label: P_fragen.seo.menuename,
    description: P_fragen.seo.beschreibung,
    faq: [...faqItems(P_fragen.fragen), ...faqItems(P_fragen.fragen_2)],
    content: `${pageHead(P_fragen.kopf.titel, inline(P_fragen.kopf.text))}
    <section class="section wrap faq-layout"><div data-reveal>${md(P_fragen.text_1)}</div>${questions(faqItems(P_fragen.fragen))}</section>
    <section class="section soft"><div class="wrap faq-layout"><div data-reveal>${md(P_fragen.text_2)}</div>${questions(faqItems(P_fragen.fragen_2))}</div></section>
    <section class="section wrap narrow" data-reveal>${md(P_fragen.text_3)}</section>${closing(P_fragen.kontaktbereich_titel)}`,
  },
  'kontakt.html': {
    title: P_kontakt.seo.titel, label: P_kontakt.seo.menuename,
    description: P_kontakt.seo.beschreibung,
    content: `${pageHead(P_kontakt.kopf.titel, inline(P_kontakt.kopf.text))}
    <section class="section wrap contact-grid"><aside class="contact-aside">${md(P_kontakt.text_1)}<dl class="contact-details">${dl(P_kontakt.liste_1)}</dl>${md(P_kontakt.text_2)}</aside>
    <div id="anfrage"><div data-booking hidden><form id="booking-form" class="booking-form"><div class="form-heading">${md(P_kontakt.text_3)}</div>
    <div class="field"><label for="interest">Worum geht es?</label><select id="interest" name="interest">${offers.map(o => `<option value="${o.id}">${o.name} · ${o.price ? `${o.price} €` : 'kostenlos'}</option>`).join('')}</select></div>
    <fieldset class="calendar-fieldset"><legend>1. Wunschtermine auswählen</legend><p id="calendar-help" class="form-help">Mindestens sieben Tage Vorlauf. Alle Zeiten sind deutsche Ortszeit. Die angezeigten Zeiten sind anfragbar, aber noch nicht reserviert.</p><div class="calendar"><div class="calendar-toolbar"><button type="button" class="icon-button" data-prev aria-label="Vorheriger Monat">←</button><h3 id="calendar-month" aria-live="polite"></h3><button type="button" class="icon-button" data-next aria-label="Nächster Monat">→</button></div><div class="weekdays" aria-hidden="true"><span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span></div><div class="calendar-days" id="calendar-days" role="group" aria-label="Tag auswählen"></div></div><details class="date-alternative"><summary>Datum direkt eingeben</summary><label for="request-date">Wunschdatum</label><input type="date" id="request-date" aria-describedby="calendar-help"></details><div id="time-options" class="time-options" role="group" aria-label="Uhrzeit auswählen"></div><p id="time-hint" class="form-help" aria-live="polite"></p><div class="proposals"><h3>Deine Wunschzeiten <span id="proposal-count">0 / 3</span></h3><ul id="proposal-list"></ul><p id="selection-status" role="status" aria-live="polite" class="small">Noch keine Zeit ausgewählt.</p></div></fieldset>
    <fieldset><legend>2. So erreiche ich dich</legend><div class="form-row"><div class="field"><label for="name">Dein Name</label><input id="name" name="name" autocomplete="name" required minlength="2" maxlength="100"></div><div class="field"><label for="email">Deine E-Mail-Adresse</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254"></div></div><div class="field"><label for="format">Gesprächsformat</label><select id="format" name="format"><option>Zoom</option><option>Telefon</option></select><p class="form-help">Bei einem Telefongespräch stimmen wir die Rufnummer per E-Mail ab.</p></div><div class="field"><label for="message">Was möchtest du mir vorab sagen? <span>(optional)</span></label><textarea id="message" name="message" rows="3" maxlength="1200" placeholder="Zum Beispiel: Das Einschlafen dauert gerade sehr lange."></textarea><p class="form-help">Bitte keine Diagnosen, Befunde oder Details zu Schwangerschaft und Geburt. Ausführliche Angaben besprechen wir vertraulich im Beratungsprozess.</p></div><div class="hp" aria-hidden="true"><label for="website">Bitte leer lassen</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div></fieldset>
    <p class="form-help">Mit „Anfrage senden“ geht deine Anfrage direkt per E-Mail an mich. Es entsteht noch keine Buchung und keine Zahlungspflicht. <a href="datenschutz.html">Datenschutzhinweise</a></p><button type="submit" class="button full">Anfrage senden${arrow}</button><p id="booking-status" class="form-status" role="status" tabindex="-1"></p></form>
    <section id="request-sent" class="request-result" aria-labelledby="sent-title" hidden><h2 id="sent-title" tabindex="-1">Danke, deine Anfrage ist angekommen.</h2>${md(P_kontakt.text_4)}</section>
    <section id="request-result" class="request-result" aria-labelledby="result-title" hidden><h2 id="result-title" tabindex="-1">Der direkte Versand hat gerade nicht geklappt.</h2>${md(P_kontakt.text_5)}<label for="request-preview">Dein E-Mail-Entwurf</label><textarea id="request-preview" readonly rows="12"></textarea><div class="actions"><a id="open-mail" class="button" href="mailto:${site.email}">Im E-Mail-Programm öffnen</a><a id="open-gmail" class="button secondary" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">In Gmail öffnen</a><button type="button" class="button secondary" id="copy-request">Text kopieren</button><button type="button" class="text-button" id="edit-request">Auswahl bearbeiten</button></div>${md(P_kontakt.text_6)}<p id="copy-status" role="status" class="small"></p></section></div>
    <noscript><div class="note">${md(P_kontakt.text_7)}<a href="mailto:${site.email}" class="button">E-Mail schreiben</a>${md(P_kontakt.text_8)}</div></noscript><p class="small fallback-contact">Wenn die Terminauswahl nicht angezeigt wird oder nicht funktioniert: <a href="mailto:${site.email}">Schreibe mir direkt eine E-Mail</a>.</p></div></section>
    <section class="section"><div class="wrap content-grid"><div class="prose" data-reveal>${md(P_kontakt.text_9)}</div><aside class="aside-box" data-reveal style="--i:1">${md(P_kontakt.text_10)}${link('ablauf.html', P_kontakt.button_1)}</aside></div></section>`,
  },
  'baby-einschlafen.html': {
    title: P_baby_einschlafen.seo.titel, label: P_baby_einschlafen.seo.menuename, parent: ['schlafwissen.html', 'Ratgeber'],
    description: P_baby_einschlafen.seo.beschreibung,
    faq: faqItems(P_baby_einschlafen.fragen),
    article: { headline: P_baby_einschlafen.kopf.titel, published: '2026-10-09', image: P_baby_einschlafen.artikel.bild },
    content: `${pageHead(P_baby_einschlafen.kopf.titel, inline(P_baby_einschlafen.kopf.text))}
    ${article({ minutes: P_baby_einschlafen.artikel.lesezeit, related: 'baby-einschlafen.html', image: P_baby_einschlafen.artikel.bild, note: inline(P_baby_einschlafen.artikel.hinweis),
      toc: P_baby_einschlafen.artikel.inhalt.map(t => [t.anker, t.titel]),
      body: `${md(P_baby_einschlafen.text_1)}${questions(faqItems(P_baby_einschlafen.fragen))}` })}${closing(P_baby_einschlafen.kontaktbereich_titel)}`,
  },
  'baby-durchschlafen.html': {
    title: P_baby_durchschlafen.seo.titel, label: P_baby_durchschlafen.seo.menuename, parent: ['schlafwissen.html', 'Ratgeber'],
    description: P_baby_durchschlafen.seo.beschreibung,
    faq: faqItems(P_baby_durchschlafen.fragen),
    article: { headline: P_baby_durchschlafen.kopf.titel, published: '2026-10-09', image: P_baby_durchschlafen.artikel.bild },
    content: `${pageHead(P_baby_durchschlafen.kopf.titel, inline(P_baby_durchschlafen.kopf.text))}
    ${article({ minutes: P_baby_durchschlafen.artikel.lesezeit, related: 'baby-durchschlafen.html', image: P_baby_durchschlafen.artikel.bild, note: inline(P_baby_durchschlafen.artikel.hinweis),
      toc: P_baby_durchschlafen.artikel.inhalt.map(t => [t.anker, t.titel]),
      body: `${md(P_baby_durchschlafen.text_1)}${questions(faqItems(P_baby_durchschlafen.fragen))}` })}${closing(P_baby_durchschlafen.kontaktbereich_titel)}`,
  },
  'schlafwissen.html': {
    title: P_schlafwissen.seo.titel, label: P_schlafwissen.seo.menuename,
    description: P_schlafwissen.seo.beschreibung,
    content: `${pageHead(P_schlafwissen.kopf.titel, inline(P_schlafwissen.kopf.text))}
    <section class="section wrap">${intro(P_schlafwissen.abschnitt_1.titel, inline(P_schlafwissen.abschnitt_1.text), 'row')}${guideCards('schlafwissen.html')}</section>
    <section class="section soft"><div class="wrap">${intro(P_schlafwissen.abschnitt_2.titel)}<div class="knowledge-list"><article data-reveal>${md(P_schlafwissen.text_1)}</article>
    <article data-reveal style="--i:1">${md(P_schlafwissen.text_2)}</article>
    <article data-reveal id="sicher">${md(P_schlafwissen.text_3)}</article>
    <article data-reveal style="--i:1">${md(P_schlafwissen.text_4)}</article></div></div></section>
    <section class="section wrap narrow" data-reveal>${md(P_schlafwissen.text_5)}</section>${closing()}`,
  },
  '404.html': {
    title: P_404.seo.titel, description: P_404.seo.beschreibung, label: P_404.seo.menuename, noindex: true,
    content: `${pageHead(P_404.kopf.titel, inline(P_404.kopf.text))}<div class="wrap section actions"><a href="index.html" class="button">Zur Startseite${arrow}</a>${contact(P_404.button_1, 'button secondary')}</div>`,
  },
};
