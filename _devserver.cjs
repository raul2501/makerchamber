'use strict';
// Local dev server (no Vercel CLI needed): serves the static repo AND runs the
// /api/generate-shell function with .env.local loaded, so the LIVE GPT-5.5
// pipeline works at http://localhost:8790/generator/index.html
//   node _devserver.cjs
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8790;

// load .env.local
try {
  for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (_) {}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/generate-shell') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      const handler = require('./api/generate-shell.js');
      const mockRes = {
        _code: 200,
        status(c) { this._code = c; return this; },
        json(o) { res.writeHead(this._code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); },
      };
      try { await handler({ method: req.method, body }, mockRes); }
      catch (e) { res.writeHead(502); res.end(JSON.stringify({ error: String(e.message || e) })); }
    });
    return;
  }
  // static
  let p = path.join(ROOT, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith('/')) p = path.join(p, 'index.html');
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log('dev server: http://localhost:' + PORT + '/generator/index.html'));
