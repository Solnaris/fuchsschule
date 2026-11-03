// Fuchsschule – lokaler Testserver (ohne externe Pakete, nur Node.js)
// Start: node server.js   →   dann im Browser http://localhost:3000 öffnen

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 3000;
const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));

// Welche Dateitypen der Server ausliefern darf
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  try {
    // URL → Dateipfad (Query-Teil wie ?x=1 wird entfernt)
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    let urlPath = decodeURIComponent(pathname);
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    // Sicherheit: nur Dateien innerhalb des Projektordners erlauben
    const filePath = normalize(join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Zugriff verweigert');
      return;
    }

    const type = MIME_TYPES[extname(filePath).toLowerCase()];
    if (!type) {
      res.writeHead(404).end('Nicht gefunden');
      return;
    }

    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Nicht gefunden');
  }
});

server.listen(PORT, () => {
  console.log(`Fuchsschule läuft auf http://localhost:${PORT}`);
  console.log('192.168.0.85:3000');
});