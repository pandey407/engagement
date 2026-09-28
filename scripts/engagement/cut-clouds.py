# Cuts the three watercolour clouds (design/engagement/clouds.jpeg, our generated art) off their white paper and splits
# them into separate files. The clouds are almost paper-coloured, so we use their gold outlines: everything
# enclosed by an outline is cloud. Output: src/events/engagement/assets/clouds/cloud-{1,2,3}.webp (largest first).
from PIL import Image, ImageFilter
import numpy as np
from collections import deque

SRC, MAX_SIDE = 'design/engagement/clouds.jpeg', 900
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
border = np.concatenate([a[:60].reshape(-1, 3), a[-60:].reshape(-1, 3), a[:, :60].reshape(-1, 3), a[:, -60:].reshape(-1, 3)])
paper = np.median(border, axis=0)
chroma = a.max(-1) - a.min(-1)
lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
plum = float(0.299 * paper[0] + 0.587 * paper[1] + 0.114 * paper[2])
ink = np.maximum(np.clip((chroma - (paper.max() - paper.min()) - 5) / 18, 0, 1), np.clip((plum - lum - 8) / 30, 0, 1))

def flood(grid, seeds_on_border=True):
    H, W = grid.shape; g = grid.tolist(); seen = np.zeros_like(grid); s = seen.tolist(); q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if g[y][x] and not s[y][x]: s[y][x] = True; q.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if g[y][x] and not s[y][x]: s[y][x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < H and 0 <= nx < W and g[ny][nx] and not s[ny][nx]:
                s[ny][nx] = True; q.append((ny, nx))
    return np.array(s)

# Close tiny gaps in the gold outline, then everything the outside paper can't reach is cloud.
outline = np.asarray(Image.fromarray((ink > 0.35).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0
outside = flood(~outline)
inside = ~outside
alpha = np.where(np.asarray(Image.fromarray(inside.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(5))) > 0, 1.0,
                 np.where(inside, np.maximum(ink, 0.6), 0.0))
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1))).astype(np.float32) / 255
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * paper) / al, 0, 255)
full = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))

# Split into separate clouds: connected components of the (downscaled) mask.
S = 8
small = np.asarray(Image.fromarray((alpha > 0.3).astype(np.uint8) * 255).resize((im.width // S, im.height // S))) > 0
H, W = small.shape; lab = np.zeros((H, W), int); boxes = []
for y in range(H):
    for x in range(W):
        if small[y, x] and not lab[y, x]:
            n = len(boxes) + 1; q = deque([(y, x)]); lab[y, x] = n; ys = [y]; xs = [x]
            while q:
                cy, cx = q.popleft()
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < H and 0 <= nx < W and small[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx)); ys.append(ny); xs.append(nx)
            boxes.append((len(ys), min(xs) * S - 8, min(ys) * S - 8, (max(xs) + 1) * S + 8, (max(ys) + 1) * S + 8, n))
boxes = sorted([b for b in boxes if b[0] > 200], reverse=True)[:3]
# Full-res label map (dilated a little so each cloud keeps its soft edge), used to blank out neighbours.
labfull = np.repeat(np.repeat(lab, S, 0), S, 1)
for i, (_, x0, y0, x1, y1, n) in enumerate(boxes, 1):
    own = np.asarray(Image.fromarray((labfull == n).astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(2 * S + 1))) > 0
    px = np.array(full); px[..., 3] = np.where(own[: px.shape[0], : px.shape[1]], px[..., 3], 0)
    c = Image.fromarray(px).crop((x0, y0, x1, y1))
    k = min(1, MAX_SIDE / max(c.size)); c = c.resize((round(c.width * k), round(c.height * k)), Image.LANCZOS)
    c.save(f'src/events/engagement/assets/clouds/cloud-{i}.webp', 'WEBP', quality=90, method=6)
    print(f'cloud-{i}', c.size)
