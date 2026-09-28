// Makes the WhatsApp / Messenger link-preview images, one per event/side link (public/previews/<event>-<side>.jpg,
// 1200x630 JPEG: WhatsApp skips large images), from src/events, drawn on a canvas with our art and fonts
// (the browser shapes the Devanagari correctly).
//   1. node scripts/engagement/make-preview.mjs           -> writes preview/index.html (dev-only page, git-ignored)
//   2. python3 scripts/save-preview.py &      -> tiny receiver on :8765 that writes public/previews/*.jpg
//   3. npm run dev, open http://localhost:5173/preview/  (the page draws every image and sends them)
// Re-run after changing names, occasion or date in src/events/<event>.ts.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve as resolvePath } from 'node:path'
import { resolve, routes } from '../../src/events/index.ts'

const root = resolvePath(import.meta.dirname, '../..')
const variants = routes().filter((r) => r.event === 'engagement').map((r) => {
  const invite = resolve(r.event, r.side)
  return {
    name: `${r.event}-${r.side}`,
    T: {
      occasion: invite.occasion.np, occasionEn: invite.occasion.en.toUpperCase(),
      one: invite.partnerOne.np, two: invite.partnerTwo.np, and: invite.and.np,
      namesEn: `${invite.partnerOne.en} ${invite.and.en} ${invite.partnerTwo.en}`.toUpperCase(),
      date: invite.dateLabel.np, dateEn: invite.dateLabel.en.toUpperCase(),
    },
  }
})

const html = `<!doctype html><html lang="ne"><head><meta charset="utf-8"><title>preview</title>
<link href="https://fonts.googleapis.com/css2?family=Parisienne&family=Laila:wght@400;600&family=Cormorant+Garamond:wght@500;600&family=Tiro+Devanagari+Sanskrit&family=Noto+Serif+Devanagari:wght@600&display=block" rel="stylesheet">
<style>body{margin:0;background:#222;color:#eee;font:14px system-ui}canvas{display:block}</style></head><body>
<canvas id="c" width="1200" height="630"></canvas><p id="status">drawing…</p>
<script type="module">
const VARIANTS = ${JSON.stringify(variants)}
const ALL = VARIANTS.map((v) => Object.values(v.T).join(' ')).join(' ')
const A = (p) => '/src/events/engagement/assets/' + p
const load = (src) => new Promise((ok, err) => { const i = new Image(); i.onload = () => ok(i); i.onerror = err; i.src = src })
const NAMES = "'Parisienne', 'Laila'"
const DISPLAY = "'Cormorant Garamond', 'Tiro Devanagari Sanskrit'", BODY = "'Cormorant Garamond', 'Noto Serif Devanagari'"
await Promise.all([
  document.fonts.load("48px 'Tiro Devanagari Sanskrit'", ALL),
  document.fonts.load("600 48px 'Laila'", ALL),
  document.fonts.load("48px 'Parisienne'", ALL),
  document.fonts.load("600 30px 'Noto Serif Devanagari'", ALL),
  document.fonts.load("500 14px 'Cormorant Garamond'", 'A'),
])
const [tile, top, mid, bot, c1, c2, c3] = await Promise.all(
  ['border/tile.webp', 'frame/arch-top.webp', 'frame/arch-mid.webp', 'frame/arch-bottom.webp',
   'clouds/cloud-1.webp', 'clouds/cloud-2.webp', 'clouds/cloud-3.webp'].map((p) => load(A(p))))
const cv = document.getElementById('c'), g = cv.getContext('2d')
const sent = []
for (const { name, T } of VARIANTS) {
g.reset(); g.fillStyle = '#faf4ea'; g.fillRect(0, 0, 1200, 630)

// Border strips (tile scaled to 46px tall), top and bottom.
const bh = 46, bw = tile.width * bh / tile.height
for (const y of [0, 630 - bh]) for (let x = 0; x < 1200; x += bw) g.drawImage(tile, x, y, bw, bh)

// Clouds.
const cloud = (img, x, y, w, a = 1, flip = false) => {
  const h = img.height * w / img.width; g.save(); g.globalAlpha = a
  if (flip) { g.translate(x + w, y); g.scale(-1, 1); g.drawImage(img, 0, 0, w, h) } else g.drawImage(img, x, y, w, h)
  g.restore()
}
cloud(c1, -40, 70, 330); cloud(c3, 60, 440, 230, 0.8); cloud(c2, 900, 90, 300); cloud(c3, 940, 440, 220, 0.8, true)

// Arch card: same 3-slice layout as the site (.arch-card in src/index.css, units of an 890-wide card).
const W = 300, s = W / 890, x0 = 600 - W / 2, y0 = 58, H = 630 - 2 * 58
g.save(); g.shadowColor = 'rgba(119,20,42,.18)'; g.shadowBlur = 26; g.shadowOffsetY = 12
g.drawImage(mid, x0, y0 + 484 * s, W, H - 1001 * s)
g.restore()
g.drawImage(top, x0, y0, W, top.height * W / top.width)
const bhh = bot.height * W / bot.width; g.drawImage(bot, x0, y0 + H - bhh, W, bhh)

// Text.
const say = (t, x, y, font, color, spacing = 0) => { g.font = font; g.fillStyle = color; g.letterSpacing = spacing + 'px'; g.textAlign = 'center'; g.fillText(t, x, y) }
say(T.one, 600, 250, '600 46px ' + NAMES, '#77142a')
say(T.and, 600, 288, '26px ' + NAMES, '#a87a3a')
say(T.two, 600, 340, '600 46px ' + NAMES, '#77142a')
say(T.namesEn, 600, 365, '500 13px ' + BODY, 'rgba(59,36,24,.65)', 3)
say(T.occasion, 195, 300, '40px ' + DISPLAY, '#77142a')
say(T.occasionEn, 195, 330, '500 14px ' + BODY, '#a87a3a', 4)
say(T.date, 1005, 300, '600 27px ' + BODY, '#77142a')
say(T.dateEn, 1005, 330, '500 14px ' + BODY, '#a87a3a', 2)

// Send the exact pixels to scripts/save-preview.py.
const blob = await new Promise((r) => cv.toBlob(r, 'image/jpeg', 0.88))
const res = await fetch('http://localhost:8765/' + name, { method: 'POST', body: blob }).catch(() => null)
sent.push(name + (res?.ok ? ' ✓' : ' ✗'))
}
await fetch('http://localhost:8765/done', { method: 'POST', body: '' }).catch(() => null)
document.getElementById('status').textContent = 'previews: ' + sent.join(', ')
</script></body></html>`

mkdirSync(join(root, 'preview'), { recursive: true })
writeFileSync(join(root, 'preview/index.html'), html)
console.log('wrote preview/index.html -> open http://localhost:5173/preview/')
