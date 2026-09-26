# Cuts the maroon arched card (design/frame-maroon.jpeg, our generated art) off its grey backdrop and
# slices it like the pink card: arch top + lotus foot keep their shape, the plain band between stretches.
# Output: src/assets/frame/maroon-{top,mid,bottom}.webp. Prints the numbers .maroon-card in index.css uses.
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

SRC = 'design/frame-maroon.jpeg'
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
bg = np.median(np.concatenate([a[:20].reshape(-1, 3), a[-20:].reshape(-1, 3)]), axis=0)

# Maroon card is strongly red; the backdrop and its faint shadow are neutral grey.
warm = a[..., 0] - a[..., 1]
alpha = np.clip((warm - 12) / 25, 0, 1)
m = np.asarray(Image.fromarray((alpha > 0.5).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))) > 0
H, W = m.shape; out_ = np.zeros_like(m); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if not m[y, x]: out_[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if not m[y, x] and not out_[y, x]: out_[y, x] = True; q.append((y, x))
mm, oo = m.tolist(), out_.tolist()
while q:
    y, x = q.popleft()
    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
        if 0 <= ny < H and 0 <= nx < W and not mm[ny][nx] and not oo[ny][nx]:
            oo[ny][nx] = True; q.append((ny, nx))
inside = ~np.array(oo)
core = np.asarray(Image.fromarray(inside.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))) > 0
alpha = np.where(core, 1.0, np.where(inside, alpha, 0))
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * bg) / al, 0, 255)
card = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))
card = card.crop(card.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox())
w, h = card.size

# Slice rows (fractions of card height, measured on this artwork).
TOP, BOT, FEATHER = round(0.43 * h), round(0.53 * h), round(0.025 * h)
MID = (TOP - FEATHER - 4, BOT + FEATHER + 4)
def feather(img, edge):
    a = np.asarray(img.getchannel('A')).astype(float); ramp = np.linspace(0, 1, FEATHER)[:, None]
    if edge == 'bottom': a[-FEATHER:] *= ramp[::-1]
    else: a[:FEATHER] *= ramp
    img = img.copy(); img.putalpha(Image.fromarray(a.astype(np.uint8))); return img
feather(card.crop((0, 0, w, TOP)), 'bottom').save('src/assets/frame/maroon-top.webp', 'WEBP', quality=92, method=6)
feather(card.crop((0, BOT, w, h)), 'top').save('src/assets/frame/maroon-bottom.webp', 'WEBP', quality=92, method=6)
card.crop((0, MID[0], w, MID[1])).save('src/assets/frame/maroon-mid.webp', 'WEBP', quality=92, method=6)
print(f'card {w}x{h}; CSS: --s: calc(var(--w) / {w}); mid at {MID[0]} * s, height 100% - {MID[0] + h - MID[1]} * s')
