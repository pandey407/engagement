# Cuts the lotus wax seal (design/seal.jpg, our generated art) off its plain grey background.
# Output: src/assets/seal/seal.webp (transparent, native resolution).
from PIL import Image, ImageFilter
import numpy as np

SRC, OUT = 'design/seal.jpg', 'src/assets/seal/seal.webp'
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
bg = np.median(np.concatenate([a[:40].reshape(-1, 3), a[-40:].reshape(-1, 3)]), axis=0)

# Wax is strongly red (R well above G); the backdrop is neutral grey. Soft ramp gives anti-aliased edges.
warm = a[..., 0] - a[..., 1]
alpha = np.clip((warm - 10) / 22, 0, 1)
# Fill the inside solid (gold/pink/green details are not "red" but are fully inside the seal).
solid = Image.fromarray((alpha > 0.5).astype(np.uint8) * 255)
solid = solid.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))  # close small gaps
m = np.asarray(solid) > 0
# Hole-fill: anything not reachable from the border through non-seal pixels is inside.
from collections import deque
H, W = m.shape; outside = np.zeros_like(m); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if not m[y, x] and not outside[y, x]: outside[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if not m[y, x] and not outside[y, x]: outside[y, x] = True; q.append((y, x))
mm = m.tolist(); oo = outside.tolist()
while q:
    y, x = q.popleft()
    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
        if 0 <= ny < H and 0 <= nx < W and not mm[ny][nx] and not oo[ny][nx]:
            oo[ny][nx] = True; q.append((ny, nx))
inside = ~np.array(oo)
# Everything well inside the outline is opaque (leaves, petals, gold); only the rim uses the soft ramp.
core = np.asarray(Image.fromarray(inside.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(9))) > 0
alpha = np.where(core, 1.0, np.where(inside, alpha, 0))
# Remove the grey from semi-transparent edge pixels.
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * bg) / al, 0, 255)
out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))
out = out.crop(out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
out.save(OUT, 'WEBP', quality=92, method=6)
print(OUT, out.size)
