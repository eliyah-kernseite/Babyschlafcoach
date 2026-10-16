import { site, page } from './content.mjs';
import { md } from './text.mjs';
import { pageHead, photos } from './layout.mjs';

const address = `<address>Anna-Lena Korb<br>Babyschlafberatung<br>Müllersweg 15<br>97249 Eisingen<br>Deutschland<br><a href="mailto:${site.email}">${site.email}</a><br><a href="tel:${site.telephone}">${site.telephoneDisplay}</a></address>`;
function legal(label, title, body) {
  return { label, title: `${title} | Anna-Lena Korb`, description: `${title} der Babyschlafberatung Anna-Lena Korb in Eisingen bei Würzburg.`, noindex: true,
    content: `${pageHead(title, '')}<article class="wrap prose legal-section">${body}<p class="small">Stand: 13. September 2026</p></article>` };
}

const P_impressum = page('impressum');
const P_datenschutz = page('datenschutz');
const P_agb = page('agb');
const P_widerruf = page('widerruf');
const P_barrierefreiheit = page('barrierefreiheit');
const P_bildnachweise = page('bildnachweise');

export const legalPages = {
  'impressum.html': legal(P_impressum.seo.menuename, P_impressum.seo.titel, `${md(P_impressum.text_1)}${address}${md(P_impressum.text_2)}`),
  'datenschutz.html': legal(P_datenschutz.seo.menuename, P_datenschutz.seo.titel, `${md(P_datenschutz.text_1)}${address}
    ${md(P_datenschutz.text_2)}`),
  'agb.html': legal(P_agb.seo.menuename, P_agb.seo.titel, `${md(P_agb.text_1)}${address}${md(P_agb.text_2)}`),
  'widerruf.html': legal(P_widerruf.seo.menuename, P_widerruf.seo.titel, `${md(P_widerruf.text_1)}<div class="note">${md(P_widerruf.text_2)}</div>${md(P_widerruf.text_3)}`),
  'barrierefreiheit.html': legal(P_barrierefreiheit.seo.menuename, P_barrierefreiheit.seo.titel, `${md(P_barrierefreiheit.text_1)}`),
  'bildnachweise.html': legal(P_bildnachweise.seo.menuename, P_bildnachweise.seo.titel, `${md(P_bildnachweise.text_1)}<ul>${photos.filter(p => p.fotograf).map(p => `<li>${p.motiv}: Foto von ${p.fotograf}, Unsplash.</li>`).join('')}</ul>${md(P_bildnachweise.text_2)}`),
};
