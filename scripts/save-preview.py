# Receives the canvas JPEG from http://localhost:5173/preview/ and writes public/thumbnail.jpg.
# Usage: python3 scripts/save-preview.py   (then open the preview page; stops after one save)
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'public' / 'thumbnail.jpg'

class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:5173')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        data = self.rfile.read(int(self.headers['Content-Length']))
        OUT.write_bytes(data)
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')
        print(f'wrote {OUT} ({len(data) // 1024} KB)')
        self.server.done = True

server = HTTPServer(('127.0.0.1', 8765), Handler)
server.done = False
print('waiting for http://localhost:5173/preview/ …')
while not server.done:
    server.handle_request()
