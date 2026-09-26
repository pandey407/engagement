# Cuts one seamless repeat from the lotus border strip (design/border.jpeg, our generated art).
# Finds the band rows (cream band vs grey backdrop), measures the repeat period by self-matching,
# and saves a single tile that the page repeats horizontally. Output: src/assets/border/tile.webp.
from PIL import Image
import numpy as np

SRC, OUT = 'design/border.jpeg', 'src/assets/border/tile.webp'
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
# Band rows: warm cream (R clearly above B) across most of the width; backdrop is neutral grey.
warm = (a[..., 0] - a[..., 2]) > 10
rows = np.where(warm.mean(1) > 0.9)[0]
y0, y1 = rows.min() + 4, rows.max() - 3  # trim the soft paper edge/shadow
band = a[y0:y1]
H, W = band.shape[:2]

# Repeat period: shift that best matches the band's middle to itself.
L, R = W // 4, W // 2
mid = band[:, L:R]
best = min(range(150, W // 3), key=lambda p: np.abs(band[:, L + p: R + p] - mid).mean())
err = np.abs(band[:, L + best: R + best] - mid).mean()
x0 = W // 2 - best // 2
tile = Image.fromarray(band[:, x0: x0 + best].astype(np.uint8))
tile.save(OUT, 'WEBP', quality=92, method=6)
print(f'band rows {y0}-{y1} ({H}px), period {best}px (match error {err:.1f}), tile {tile.size}')
