# Traces the silhouette of the painted seal (src/envelope/assets/seal.webp) into an SVG path, so the ripple
# rings on the envelope follow the seal's wavy wax edge. Output: src/envelope/assets/seal-outline.svg (same pixel
# coordinates as seal.webp, so it overlays it exactly).
from PIL import Image, ImageFilter
import numpy as np
import potrace

SRC, OUT = 'src/envelope/assets/seal.webp', 'src/envelope/assets/seal-outline.svg'
im = Image.open(SRC)
a = np.asarray(im.getchannel('A').filter(ImageFilter.GaussianBlur(3))) > 128
# potracer traces the False pixels, so pass the inverted mask; keep only the outer contour.
path = potrace.Bitmap(~a).trace(turdsize=200, alphamax=1.2, opticurve=True, opttolerance=0.6)
curve = max(path, key=lambda c: len(c.segments))
f = lambda p: f'{p.x:.1f} {p.y:.1f}'
d = [f'M{f(curve.start_point)}']
for seg in curve.segments:
    d.append(f'L{f(seg.c)}L{f(seg.end_point)}' if seg.is_corner else f'C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}')
d.append('Z')
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {im.width} {im.height}"><path d="{"".join(d)}"/></svg>\n'
open(OUT, 'w').write(svg)
print(OUT, len(svg), 'bytes,', len(curve.segments), 'segments')
