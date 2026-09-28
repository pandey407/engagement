# Cuts one seamless repeat of the pink lotus damask (design/envelope-pink.jpeg, our generated art) from its
# clean top area (the bottom of the image has stray artwork), for the envelope page to tile.
# Output: src/assets/envelope/pink-tile.webp
from PIL import Image
import numpy as np

SRC, OUT, CLEAN = 'design/envelope-pink.jpeg', 'src/assets/envelope/pink-tile.webp', 1450
a = np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)[:CLEAN]
g = a.mean(-1)

def period(axis, lo, hi):
    """Shift along `axis` at which the pattern best matches itself."""
    n = g.shape[axis]
    ref = g[100:700, 100:700] if axis == 1 else g[100:700, 100:700]
    best = None
    for p in range(lo, hi):
        other = g[100:700, 100 + p:700 + p] if axis == 1 else g[100 + p:700 + p, 100:700]
        err = np.abs(ref - other).mean()
        if best is None or err < best[1]:
            best = (p, err)
    return best

px, ex = period(1, 120, 700)
py, ey = period(0, 120, 700)
print('period x', px, 'err', round(ex, 2), '| period y', py, 'err', round(ey, 2))
x0, y0 = 200, 200
tile = Image.fromarray(a[y0:y0 + py, x0:x0 + px].astype(np.uint8))
tile.save(OUT, 'WEBP', quality=88, method=6)
print(OUT, tile.size)
