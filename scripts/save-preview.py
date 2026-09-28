# Receives the canvas JPEGs from http://localhost:5173/preview/ and writes public/previews/<event>-<side>.jpg.
# Usage: python3 scripts/save-preview.py   (then open the preview page; stops once the page says it's done)
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'public' / 'previews'

class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', 'http://localhost:5173')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        data = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        name = self.path.strip('/')
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b'ok')
        if name == 'done':
            self.server.done = True
            return
        if not name.replace('-', '').isalnum():
            return
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / f'{name}.jpg').write_bytes(data)
        print(f'wrote previews/{name}.jpg ({len(data) // 1024} KB)')

server = HTTPServer(('127.0.0.1', 8765), Handler)
server.done = False
print('waiting for http://localhost:5173/preview/ …')
while not server.done:
    server.handle_request()
