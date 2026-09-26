# Traces design/ganesh.jpg (black line art) into src/assets/ganesh.svg using potracer.
# The SVG uses fill="currentColor" so CSS text colour sets it (maroon, gold...).
from PIL import Image, ImageFilter
import numpy as np
import potrace

SRC, OUT, SCALE = 'design/ganesh.jpg', 'src/assets/ganesh.svg', 4

g = Image.open(SRC).convert('L')
bbox = g.point(lambda v: 255 if v < 128 else 0).getbbox()
pad = 6
g = g.crop((bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad))
# Upscale + soften before thresholding so the traced curves are smooth, not pixel-stepped.
g = g.resize((g.width * SCALE, g.height * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SCALE * 0.6))
bits = np.asarray(g) < 128  # True = ink

# potracer traces the False pixels, so pass the inverted mask.
path = potrace.Bitmap(~bits).trace(turdsize=20, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                                    alphamax=1.0, opticurve=True, opttolerance=0.2)
f = lambda p: f'{p.x / SCALE:.2f} {p.y / SCALE:.2f}'
d = []
for curve in path:
    d.append(f'M{f(curve.start_point)}')
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f'L{f(seg.c)}L{f(seg.end_point)}')
        else:
            d.append(f'C{f(seg.c1)} {f(seg.c2)} {f(seg.end_point)}')
    d.append('Z')
w, h = g.width / SCALE, g.height / SCALE
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" fill="currentColor">'
       f'<path fill-rule="evenodd" d="{"".join(d)}"/></svg>\n')
open(OUT, 'w').write(svg)
print(OUT, f'{len(svg)/1024:.1f} KB', len(path), 'curves', f'{w:.0f}x{h:.0f}')
