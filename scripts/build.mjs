import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pages } from '../src/pages.mjs';
import { legalPages } from '../src/legal.mjs';
import { layout, updated } from '../src/layout.mjs';
import { site } from '../assets/config.js';

const root = path.resolve(import.meta.dirname, '..');
const allPages = { ...pages, ...legalPages };
for (const [file, page] of Object.entries(allPages)) {
  if (!/^[a-z0-9-]+\.html$/.test(file)) throw new Error(`Invalid page path: ${file}`);
  await writeFile(path.join(root, file), layout(file, page));
}
const urls = Object.entries(allPages).filter(([, p]) => !p.noindex).map(([file]) => new URL(file === 'index.html' ? '' : file, site.url).href);
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);
console.log(`Built ${Object.keys(allPages).length} static pages, sitemap.xml and robots.txt.`);
