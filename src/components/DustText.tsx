import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// Text that assembles itself from drifting gold dust (a "Thanos snap" in reverse), sweeping left to right.
// The text is rendered to an offscreen canvas and cut into tiny fragments; each fragment flies in from a
// scattered cloud to its exact spot, and the assembled canvas text stays as the final display (no hand-over,
// so nothing shifts). The real text stays in the page, invisible, for layout and screen readers.
type Props = {
  lines: string[]
  className?: string
  lineClassName?: string
  start?: number // seconds before the dust starts moving
  duration?: number // seconds for the whole sweep
  onDone?: () => void
}

// Positions in device pixels: tx/ty are whole-pixel home positions (so landed fragments tile seamlessly).
type Frag = { tx: number; ty: number; sx: number; sy: number; t0: number }

const SPREAD = 90 // CSS px of margin around the text the dust can start from
const TILE = 3 // CSS px per fragment (fine enough to read as dust)

// Sizes the canvas around `box` and renders the finished text offscreen at the same place as the real text.
function prepare(box: HTMLElement, cv: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2) // 3x canvases are heavy on phones; 2x is still crisp
  const rect = box.getBoundingClientRect()
  const W = rect.width + SPREAD * 2, H = rect.height + SPREAD * 2
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
  cv.style.width = `${W}px`; cv.style.height = `${H}px`
  const g = cv.getContext('2d')!
  g.setTransform(dpr, 0, 0, dpr, 0, 0)

  const src = document.createElement('canvas')
  src.width = cv.width; src.height = cv.height
  const s = src.getContext('2d')!
  s.setTransform(dpr, 0, 0, dpr, 0, 0)
  const spans = [...box.querySelectorAll<HTMLElement>('[data-line]')]
  const style = getComputedStyle(spans[0])
  s.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  s.fillStyle = style.color
  s.textBaseline = 'alphabetic'
  const lines = spans.map((span) => {
    const r = span.getBoundingClientRect()
    const m = s.measureText(span.textContent ?? '')
    const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent
    const lh = parseFloat(getComputedStyle(span).lineHeight) || r.height
    const left = r.left - rect.left + SPREAD, top = r.top - rect.top + SPREAD
    s.fillText(span.textContent ?? '', left, top + (lh - asc - desc) / 2 + asc)
    return { top, bottom: top + r.height, left, width: r.width }
  })
  return { g, src, dpr, lines }
}

export function DustText({ lines, className = '', lineClassName = '', start = 0.3, duration = 2.8, onDone }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [plain, setPlain] = useState(false) // reduced motion: just show the real text

  useEffect(() => {
    const box = wrap.current, cv = canvas.current
    if (!box || !cv) return
    if (prefersReducedMotion()) {
      setPlain(true)
      onDone?.()
      return
    }
    let raf = 0
    let cancelled = false
    let settled = false
    // After it settles, keep the final text aligned if the layout changes (rotation, resize).
    const redraw = () => {
      if (!settled) return
      const { g, src } = prepare(box, cv)
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, cv.width, cv.height)
      g.drawImage(src, 0, 0)
    }
    window.addEventListener('resize', redraw)
    document.fonts.addEventListener('loadingdone', redraw) // a late font: redraw the settled text in it

    ;(async () => {
      // Make sure the exact fonts for these characters are downloaded before cutting the dust from them
      // (document.fonts.ready alone can resolve before a Devanagari subset has even been requested).
      const first = box.querySelector<HTMLElement>('[data-line]')!
      const cs = getComputedStyle(first)
      const text = lines.join(' ')
      await Promise.all(
        cs.fontFamily.split(',').map((f) => document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${f.trim()}`, text).catch(() => [])),
      )
      await document.fonts.ready
      if (cancelled) return
      const { g, src, dpr, lines: boxes } = prepare(box, cv)
      const px = src.getContext('2d')!.getImageData(0, 0, src.width, src.height).data

      // Cut into fragments (only ones with ink), each starting scattered up/right and departing in a
      // left-to-right sweep so the text writes itself.
      const across = duration * 0.62 // seconds for the departures to sweep across a line
      const FLY = duration * 0.38 // seconds each fragment takes to land
      const frags: Frag[] = []
      // Whole device pixels per fragment: a fractional size (e.g. on 2.75x screens) leaves hairline seams.
      const T = Math.max(2, Math.round(TILE * dpr))
      for (let ty = 0; ty < src.height; ty += T) {
        for (let tx = 0; tx < src.width; tx += T) {
          let ink = false
          for (let y = ty; y < Math.min(ty + T, src.height) && !ink; y++)
            for (let x = tx; x < Math.min(tx + T, src.width); x++)
              if (px[(y * src.width + x) * 4 + 3] > 8) { ink = true; break }
          if (!ink) continue
          const x = tx / dpr, y = ty / dpr
          const line = boxes.find((l) => y + TILE >= l.top && y <= l.bottom) ?? boxes[0]
          const xf = Math.min(Math.max((x - line.left) / line.width, 0), 1)
          const a = Math.random() * Math.PI * 2, d = 20 + Math.random() * SPREAD
          frags.push({
            tx, ty,
            sx: tx + (Math.cos(a) * d + 30 + Math.random() * 50) * dpr,
            sy: ty + (Math.sin(a) * d * 0.6 - 12) * dpr,
            t0: xf * across + Math.random() * 0.15,
          })
        }
      }
      // Performance: fragments are sorted by departure and walked with two cursors. Landed fragments are
      // painted once onto a `settled` layer (exact pixels), so each frame draws that layer plus only the
      // fragments still in flight: no per-fragment save/rotate, and no redrawing of finished text.
      frags.sort((p, q) => p.t0 - q.t0)
      const settledLayer = document.createElement('canvas')
      settledLayer.width = src.width; settledLayer.height = src.height
      const sl = settledLayer.getContext('2d')!
      const end = frags[frags.length - 1].t0 + FLY
      const t0 = performance.now() + start * 1000
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)
      let landed = 0 // frags[0..landed) are on the settled layer
      let started = 0 // frags[landed..started) are in flight

      const frame = (now: number) => {
        const t = (now - t0) / 1000
        if (t >= end) {
          // Settled: the whole finished text, drawn once (pixel for pixel), stays as the display.
          g.setTransform(1, 0, 0, 1, 0, 0)
          g.clearRect(0, 0, cv.width, cv.height)
          g.globalAlpha = 1
          g.drawImage(src, 0, 0)
          settled = true
          onDone?.()
          return
        }
        while (started < frags.length && frags[started].t0 <= t) started++
        // Move newly landed fragments (in departure order) onto the settled layer.
        while (landed < started && t - frags[landed].t0 >= FLY) {
          const f = frags[landed++]
          sl.drawImage(src, f.tx, f.ty, T, T, f.tx, f.ty, T, T) // exact pixel copy
        }
        // Draw in device pixels (identity transform) so everything lines up with the pixel grid.
        g.setTransform(1, 0, 0, 1, 0, 0)
        g.clearRect(0, 0, cv.width, cv.height)
        g.globalAlpha = 1
        g.drawImage(settledLayer, 0, 0)
        for (let i = landed; i < started; i++) {
          const f = frags[i]
          const k = Math.min((t - f.t0) / FLY, 1)
          const e = ease(k)
          g.globalAlpha = k < 0.5 ? k * 2 : 1
          g.drawImage(src, f.tx, f.ty, T, T, f.sx + (f.tx - f.sx) * e, f.sy + (f.ty - f.sy) * e, T, T)
        }
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', redraw)
      document.fonts.removeEventListener('loadingdone', redraw)
    }
    // Runs once on mount: the dust sequence plays a single time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {lines.map((l) => (
        <span key={l} data-line className={`mx-auto block w-fit whitespace-nowrap ${plain ? '' : 'opacity-0'} ${lineClassName}`}>
          {l}
        </span>
      ))}
      {!plain && <canvas ref={canvas} aria-hidden className="pointer-events-none absolute" style={{ left: -SPREAD, top: -SPREAD }} />}
    </div>
  )
}
