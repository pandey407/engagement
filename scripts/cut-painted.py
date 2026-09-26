# Cuts a painted element (our generated art) off its plain watercolour-paper background.
# Paper is near-neutral; the art is pink, gold, green, maroon or pencil-dark, so alpha comes from colour + darkness.
# Usage: python3 scripts/cut-painted.py SRC OUT MAX_SIDE
#   divider:  python3 scripts/cut-painted.py design/divider.jpeg src/assets/divider/divider.webp 1400
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
import sys

SRC, OUT, MAX_SIDE = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
# Paper colour: median of the plain border (a local blur would pick up colour from large painted areas).
border = np.concatenate([a[:60].reshape(-1, 3), a[-60:].reshape(-1, 3), a[:, :60].reshape(-1, 3), a[:, -60:].reshape(-1, 3)])
paper = np.broadcast_to(np.median(border, axis=0), a.shape).astype(np.float32)
chroma = a.max(-1) - a.min(-1)
pchroma = paper.max(-1) - paper.min(-1)
lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
plum = 0.299 * paper[..., 0] + 0.587 * paper[..., 1] + 0.114 * paper[..., 2]
alpha = np.maximum(np.clip((chroma - pchroma - 6) / 22, 0, 1), np.clip((plum - lum - 12) / 40, 0, 1))
# Solidify the flower/leaf interiors (their pale highlights are close to paper colour).
solid = Image.fromarray((alpha > 0.5).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
fill = np.asarray(solid.filter(ImageFilter.MinFilter(5))) > 0
alpha = np.where(fill, 1.0, alpha)
# Drop paper-grain specks.
op = (alpha > 0.3).astype(np.int32); K = 9
c = np.pad(op, K // 2).cumsum(0).cumsum(1); c = np.pad(c, ((1, 0), (1, 0)))
cnt = c[K:, K:] - c[:-K, K:] - c[K:, :-K] + c[:-K, :-K]
alpha = np.where(cnt < 6, 0, alpha)
# Work on the band only (fast), then fill pale petal areas: small see-through pockets fully enclosed
# by outlines become opaque; the thin crescents between the gold vines, and anything larger than POCKET px,
# stay transparent.
POCKET = 6000
ys, xs = np.where(alpha > 0.15)
y0, y1, x0, x1 = ys.min() - 6, ys.max() + 7, xs.min() - 6, xs.max() + 7
a, paper, alpha = a[y0:y1, x0:x1], paper[y0:y1, x0:x1], alpha[y0:y1, x0:x1]
low = (alpha < 0.5).tolist(); H, W = len(low), len(low[0])
seen = [[False] * W for _ in range(H)]
for sy in range(H):
    for sx in range(W):
        if low[sy][sx] and not seen[sy][sx]:
            seen[sy][sx] = True; q = deque([(sy, sx)]); pts = []; edge = False
            while q:
                y, x = q.popleft(); pts.append((y, x))
                if y in (0, H - 1) or x in (0, W - 1): edge = True
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= ny < H and 0 <= nx < W and low[ny][nx] and not seen[ny][nx]:
                        seen[ny][nx] = True; q.append((ny, nx))
            if not edge and len(pts) < POCKET:
                py, px = zip(*pts)
                h, w = max(py) - min(py) + 1, max(px) - min(px) + 1
                if h >= 0.3 * w:  # compact pocket = petal; long thin crescent = gap between vine and line
                    alpha[list(py), list(px)] = 1.0
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * paper) / al, 0, 255)
out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))
k = min(1, MAX_SIDE / max(out.size))
out = out.resize((round(out.width * k), round(out.height * k)), Image.LANCZOS)
out.save(OUT, 'WEBP', quality=92, method=6)
print(OUT, im.size, '->', out.size)
