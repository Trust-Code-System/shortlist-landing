// Customer UI preview. Run: node scripts/preview.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !['.html','.css','.js','.png','.svg','.woff2'].includes(path.extname(file))) {
    res.writeHead(404).end(); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.writeHead(200, {'Content-Type':mime[path.extname(file)],'Cache-Control':'no-store'}).end(data);
  });
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log('Shortlist customer preview: http://127.0.0.1:' + server.address().port + '/tracker.html');
});
