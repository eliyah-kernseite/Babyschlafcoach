import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pages } from '../src/pages.mjs';
import { legalPages } from '../src/legal.mjs';
import { layout } from '../src/layout.mjs';
import { site } from '../assets/config.js';

const root = path.resolve(import.meta.dirname, '..');
const all = {...pages, ...legalPages};
for (const [filename, page] of Object.entries(all)) {
  test(`${filename}: generated HTML is current; metadata and local links valid`, async () => {
    const html = await readFile(path.join(root, filename), 'utf8');
    assert.equal(html, layout(filename, page), 'Run npm run build after changing templates');
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, /<html lang="de">/);
    assert.ok(html.includes(site.email));
    assert.ok(html.includes('<a href="https://kernseite.com" title="Webdesign Agentur Würzburg" target="_blank" rel="noopener">KERNSEITE</a>'), 'agency credit missing');
    assert.ok(html.includes(`href="${site.url}`));
    assert.doesNotMatch(html, /annalenakorb@googlemail|anna-lena-babyschlafcoach\.de|action="api\/|449\s*(?:€|Euro)|zweifache/);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema['@graph'].find(o=>o['@type']==='ProfessionalService').email, site.email);
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:)/.test(raw)) continue;
      const url = new URL(raw, new URL(filename, site.url));
      const target = decodeURIComponent(url.pathname.slice(new URL(site.url).pathname.length)) || 'index.html';
      await access(path.join(root, target));
      if (url.hash && target.endsWith('.html')) {
        const other = await readFile(path.join(root, target), 'utf8');
        assert.ok(other.includes(`id="${url.hash.slice(1)}"`), `${raw} references a missing anchor`);
      }
    }
  });
}
test('Sitemap contains indexable pages only and current base URL', async () => {
  const xml = await readFile(path.join(root,'sitemap.xml'), 'utf8');
  assert.equal([...xml.matchAll(/<loc>/g)].length, 14);
  assert.doesNotMatch(xml, /impressum|404|datenschutz/);
  assert.ok(xml.includes(site.url));
});
test('No active trackers, external image/font requests or data persistence', async () => {
  const js = await readFile(path.join(root,'assets/site.js'), 'utf8');
  const css = await readFile(path.join(root,'assets/site.css'), 'utf8');
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie|\.innerHTML/);
  assert.doesNotMatch(css, /@import|url\(['"]?https:/);
  assert.match(css, /prefers-reduced-motion/);
});
