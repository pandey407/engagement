# Cuts the couple illustration (design/couple.jpeg, our generated art) off its plain grey background.
# Figures are dark (suit, hair), warm gold (sari) or white (shirt). Anything reachable from the border
# through background-coloured pixels is removed; enclosed areas are kept unless they are background too
# (e.g. the gap between the two figures above their joined hands).
# Output: src/assets/couple/couple.webp (transparent).
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

SRC, OUT, MAX_SIDE = 'design/couple.jpeg', 'src/assets/couple/couple.webp', 1400
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
border = np.concatenate([a[:40].reshape(-1, 3), a[-40:].reshape(-1, 3), a[:, :40].reshape(-1, 3), a[:, -40:].reshape(-1, 3)])
bg = np.median(border, axis=0)
dist = np.sqrt(((np.asarray(im.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) - bg) ** 2).sum(-1))
alpha = np.clip((dist - 10) / 22, 0, 1)

# Background regions: low-alpha components. Remove those touching the border, or enclosed but bg-coloured.
low = (alpha < 0.5); H, W = low.shape; lo = low.tolist(); seen = np.zeros_like(low); sn = seen.tolist()
for sy in range(H):
    for sx in range(W):
        if lo[sy][sx] and not sn[sy][sx]:
            sn[sy][sx] = True; q = deque([(sy, sx)]); pts = []; edge = False
            while q:
                y, x = q.popleft(); pts.append((y, x))
                if y in (0, H - 1) or x in (0, W - 1): edge = True
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= ny < H and 0 <= nx < W and lo[ny][nx] and not sn[ny][nx]:
                        sn[ny][nx] = True; q.append((ny, nx))
            ys, xs = zip(*pts)
            if not edge and dist[list(ys), list(xs)].mean() > 12:  # enclosed and not background: keep (shirt)
                alpha[list(ys), list(xs)] = 1.0
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * bg) / al, 0, 255)
out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))
out = out.crop(out.getchannel('A').point(lambda v: 255 if v > 30 else 0).getbbox())
k = min(1, MAX_SIDE / max(out.size)); out = out.resize((round(out.width * k), round(out.height * k)), Image.LANCZOS)
out.save(OUT, 'WEBP', quality=90, method=6)
print(OUT, out.size)
