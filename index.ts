import http from 'http';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';

const PORT = 8000;
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url ?? '/');
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { ...corsHeaders, 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { ...corsHeaders, 'Content-Type': contentType });
    res.end(data);
  });
});

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('Client verbunden:', socket.id);

  socket.on('pipeline:value', (value: string, ack?: (data: object) => void) => {
    const receivedAt = Date.now();
    console.log(`[${new Date().toISOString()}] Empfangen via Socket: "${value}"`);
    if (ack) ack({ serverReceivedAt: receivedAt });
  });

  socket.on('disconnect', () => {
    console.log('Client getrennt:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
