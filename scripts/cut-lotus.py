# Cuts the CC0 NGA lotus watercolour (design/lotus-nga-52325.jpg) off its paper and tints the petals blush.
# Output: src/assets/lotus/lotus.webp (transparent). Usage: python3 scripts/cut-lotus.py
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

SRC = 'design/lotus-nga-52325.jpg'
OUT = 'src/assets/lotus/lotus.webp'
HEIGHT = 1800

full = Image.open(SRC).convert('RGB')
full = full.crop((150, 250, 3050, 3950))  # trim the plate margin

def paper_score(a):
    """1 = looks like the beige paper, 0 = painted subject."""
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    rb, gb = r - b, g - b
    s = np.ones_like(r)
    s *= np.clip((r - 185) / 20, 0, 1) * np.clip((g - 165) / 20, 0, 1)
    s *= np.clip((rb - 40) / 12, 0, 1) * np.clip((105 - rb) / 12, 0, 1)
    s *= np.clip((gb - 12) / 10, 0, 1)
    return s

# Mask at half resolution. Paper = border-connected paper, plus any enclosed paper pocket
# larger than POCKET px (gaps between stems); small paper-coloured specks inside the subject stay.
POCKET = 1500
half = full.resize((full.width // 2, full.height // 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1))
ah = np.asarray(half).astype(np.float32)
paper = (paper_score(ah) > 0.5).tolist()
H, W = len(paper), len(paper[0])

def components(grid):
    seen = [[False] * W for _ in range(H)]
    for sy in range(H):
        for sx in range(W):
            if grid[sy][sx] and not seen[sy][sx]:
                seen[sy][sx] = True; q = deque([(sy, sx)]); pts = []; edge = False
                while q:
                    y, x = q.popleft(); pts.append((y, x))
                    if y in (0, H - 1) or x in (0, W - 1): edge = True
                    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                        if 0 <= ny < H and 0 <= nx < W and grid[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True; q.append((ny, nx))
                yield pts, edge

bgarr = np.zeros((H, W), bool)
for pts, edge in components(paper):
    if edge or len(pts) > POCKET:
        ys, xs = zip(*pts); bgarr[list(ys), list(xs)] = True
# Drop small isolated specks of "subject" floating in the paper (blemishes).
fgl = (~bgarr).tolist()
for pts, edge in components(fgl):
    if len(pts) < 400:
        ys, xs = zip(*pts); bgarr[list(ys), list(xs)] = True
bg = bgarr
mask = Image.fromarray((~bg).astype(np.uint8) * 255)
# Close pinholes, then feather the edge slightly.
mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
mask = mask.resize(full.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))

a = np.asarray(full).astype(np.float32)
alpha = np.asarray(mask).astype(np.float32) / 255

# Blush tint on the white petals (low warmth, bright); leaves and stems untouched.
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
w = np.clip((lum - 140) / 60, 0, 1) * np.clip((48 - (r - b)) / 22, 0, 1) * np.clip((r - g + 12) / 12, 0, 1)
shade = np.clip((235 - lum) / 90, 0, 1)[..., None]  # deeper rose in the petal shadows
blush = a * np.array([1.0, 0.80, 0.84]) * (1 - 0.25 * shade) + np.array([6, 0, 4]) * (1 - shade)
blush += shade * (np.array([200, 95, 120]) - blush) * 0.35
a = a + (blush - a) * w[..., None]

out = Image.fromarray(np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8))
bbox = out.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
out = out.crop(bbox)
out = out.resize((round(out.width * HEIGHT / out.height), HEIGHT), Image.LANCZOS)
out.save(OUT, 'WEBP', quality=90, method=6)
print(OUT, out.size)
