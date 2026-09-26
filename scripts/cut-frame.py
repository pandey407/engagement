# Cuts the arched lotus frame (design/frame-arch.jpg, our generated art) off its grey backdrop.
# The card is a clean shape (straight sides, flat bottom, scalloped arch), so we measure that outline
# and draw a smooth anti-aliased mask instead of following noisy shadow pixels.
# Output: src/assets/frame/arch-{top,mid,bottom}.webp (transparent, native resolution, 890 px wide).
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC, SS = 'design/frame-arch.jpg', 4
im = Image.open(SRC).convert('RGB')
b = np.asarray(im.filter(ImageFilter.GaussianBlur(2))).astype(float)
r, g, bl = b[..., 0], b[..., 1], b[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * bl
card = ((r - g) > 9) & (lum > 236)  # pink paper, brighter than the grey backdrop

rows = range(700, 1150)
left = int(np.median([np.where(card[y])[0].min() for y in rows]))
right = int(np.median([np.where(card[y])[0].max() for y in rows]))
# Bottom edge: last pink row in the clear centre strip (looser brightness; the card darkens near its foot).
foot = ((r - g) > 9) & (lum > 222)
bottom = int(np.median([np.where(foot[:, x])[0].max() for x in range(500, 620)])) + 1

# Top outline: first card pixel per column, median-smoothed.
tops = []
for x in range(left, right + 1):
    ys = np.where(card[:, x])[0]
    tops.append(ys.min() if len(ys) else bottom)
tops = np.array(tops, float)
k = 7
tops = np.array([np.median(tops[max(0, i - k):i + k + 1]) for i in range(len(tops))])
# The arch is symmetric and its left half traces cleanly, so mirror it onto the right half.
half = len(tops) // 2
tops[len(tops) - half:] = tops[:half][::-1]

poly = [(left, bottom)] + [(left + i, t) for i, t in enumerate(tops)] + [(right, bottom)]
m = Image.new('L', (im.width * SS, im.height * SS), 0)
ImageDraw.Draw(m).polygon([(x * SS, y * SS) for x, y in poly], fill=255)
mask = m.resize(im.size, Image.LANCZOS)

out = im.convert('RGBA'); out.putalpha(mask)
out = out.crop((left - 1, int(tops.min()) - 1, right + 2, bottom + 1))
# (full card kept in memory only; the page uses the three slices below)
print('card', out.size, dict(left=left, right=right, top=int(tops.min()), bottom=bottom))

# Split into three layers for a seamless stretchable card (see .arch-card in src/index.css):
#   top    = arch + drops, bottom edge feathered
#   bottom = lotus corners, top edge feathered
#   mid    = plain paper band, stretched to fill between them
TOP, BOT, MID, FEATHER = 520, 1030, (484, 1080), 36  # MID spans both feathers, so nothing shows through
w, h = out.size
def feather(img, edge):
    a = np.asarray(img.getchannel('A')).astype(float)
    ramp = np.linspace(0, 1, FEATHER)[:, None]
    if edge == 'bottom': a[-FEATHER:] *= ramp[::-1]
    else: a[:FEATHER] *= ramp
    img = img.copy(); img.putalpha(Image.fromarray(a.astype(np.uint8))); return img
feather(out.crop((0, 0, w, TOP)), 'bottom').save('src/assets/frame/arch-top.webp', 'WEBP', quality=92, method=6)
feather(out.crop((0, BOT, w, h)), 'top').save('src/assets/frame/arch-bottom.webp', 'WEBP', quality=92, method=6)
out.crop((0, MID[0], w, MID[1])).save('src/assets/frame/arch-mid.webp', 'WEBP', quality=92, method=6)
print('slices', (w, TOP), (w, h - BOT), (w, MID[1] - MID[0]))
