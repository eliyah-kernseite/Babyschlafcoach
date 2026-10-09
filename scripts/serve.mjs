import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.startsWith('/Babyschlafcoach/')) pathname = pathname.slice('/Babyschlafcoach'.length);
    if (pathname.split('/').some(p => p.startsWith('.') || ['private', 'vendor', 'scripts', 'tests', 'src', 'api'].includes(p))) throw new Error('Unavailable');
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}/`) && file !== root) throw new Error('Unavailable');
    if (/\/[a-z0-9-]+$/.test(pathname)) file += '.html';
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(await readFile(path.join(root, '404.html')));
  }
}).listen(4173, '0.0.0.0', () => console.log('Preview: http://localhost:4173/Babyschlafcoach/'));
