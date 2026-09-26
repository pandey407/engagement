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

type Frag = { x: number; y: number; sx: number; sy: number; t0: number; rot: number }

const SPREAD = 90 // CSS px of margin around the text the dust can start from
const TILE = 3 // CSS px per fragment

// Sizes the canvas around `box` and renders the finished text offscreen at the same place as the real text.
function prepare(box: HTMLElement, cv: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
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
  return { g, src, dpr, W, H, lines }
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
      const { g, src, W, H } = prepare(box, cv)
      g.clearRect(0, 0, W, H)
      g.drawImage(src, 0, 0, W, H)
    }
    window.addEventListener('resize', redraw)

    ;(async () => {
      await document.fonts.ready
      if (cancelled) return
      const { g, src, dpr, W, H, lines: boxes } = prepare(box, cv)
      const px = src.getContext('2d')!.getImageData(0, 0, src.width, src.height).data

      // Cut into fragments (only ones with ink), each starting scattered up/right and departing in a
      // left-to-right sweep so the text writes itself.
      const across = duration * 0.62 // seconds for the departures to sweep across a line
      const FLY = duration * 0.38 // seconds each fragment takes to land
      const frags: Frag[] = []
      const T = TILE * dpr
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
            x, y,
            sx: x + Math.cos(a) * d + 30 + Math.random() * 50,
            sy: y + Math.sin(a) * d * 0.6 - 12,
            t0: xf * across + Math.random() * 0.15,
            rot: (Math.random() - 0.5) * 2.4,
          })
        }
      }
      const end = Math.max(...frags.map((f) => f.t0)) + FLY
      const t0 = performance.now() + start * 1000
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)

      const frame = (now: number) => {
        const t = (now - t0) / 1000
        g.clearRect(0, 0, W, H)
        if (t >= end) {
          // Settled: the whole finished text, drawn once, stays as the display.
          g.globalAlpha = 1
          g.drawImage(src, 0, 0, W, H)
          settled = true
          onDone?.()
          return
        }
        for (const f of frags) {
          const k = Math.min(Math.max((t - f.t0) / FLY, 0), 1)
          if (k <= 0) continue
          g.globalAlpha = Math.min(1, k * 2)
          if (k >= 1) {
            g.drawImage(src, f.x * dpr, f.y * dpr, T, T, f.x, f.y, TILE, TILE)
            continue
          }
          const e = ease(k)
          g.save()
          g.translate(f.sx + (f.x - f.sx) * e + TILE / 2, f.sy + (f.y - f.sy) * e + TILE / 2)
          g.rotate(f.rot * (1 - e))
          g.drawImage(src, f.x * dpr, f.y * dpr, T, T, -TILE / 2, -TILE / 2, TILE, TILE)
          g.restore()
        }
        raf = requestAnimationFrame(frame)
      }
      raf = requestAnimationFrame(frame)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', redraw)
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
