# Cuts the lotus divider (design/divider.jpeg, our generated art) off its white watercolour paper.
# Paper is near-neutral; the art is pink, gold, green or pencil-dark, so alpha comes from colour + darkness.
# Output: src/assets/divider/divider.webp (transparent).
from PIL import Image, ImageFilter
import numpy as np

SRC, OUT, WIDTH = 'design/divider.png', 'src/assets/divider/divider.webp', 1400
im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
# Paper colour varies with the texture, so estimate it locally with a wide median-ish blur.
paper = np.asarray(im.filter(ImageFilter.GaussianBlur(40))).astype(np.float32)
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
al = np.maximum(alpha, 1e-3)[..., None]
rgb = np.clip((a - (1 - al) * paper) / al, 0, 255)
out = Image.fromarray(np.dstack([rgb, alpha * 255]).astype(np.uint8))
bbox = out.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
out = out.crop((bbox[0] - 4, bbox[1] - 4, bbox[2] + 4, bbox[3] + 4))
out = out.resize((WIDTH, round(out.height * WIDTH / out.width)), Image.LANCZOS)
out.save(OUT, 'WEBP', quality=92, method=6)
print(OUT, im.size, '->', out.size)
