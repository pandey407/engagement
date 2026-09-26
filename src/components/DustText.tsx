import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// Text that assembles itself from drifting gold dust (a "Thanos snap" in reverse), sweeping left to right.
// The text is rendered once to an offscreen canvas and cut into tiny fragments; each fragment flies in from a
// scattered cloud to its exact spot. When the last one lands the fragments form the finished text pixel for
// pixel, and the real (selectable, screen-reader) text takes over invisibly. No reveal edge, no swap flash.
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

export function DustText({ lines, className = '', lineClassName = '', start = 0.3, duration = 2.8, onDone }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const box = wrap.current, cv = canvas.current
    if (!box || !cv) return
    if (prefersReducedMotion()) {
      setDone(true)
      onDone?.()
      return
    }
    let raf = 0
    let cancelled = false

    ;(async () => {
      await document.fonts.ready
      if (cancelled) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = box.getBoundingClientRect()
      const W = rect.width + SPREAD * 2, H = rect.height + SPREAD * 2
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`; cv.style.height = `${H}px`
      const g = cv.getContext('2d')!
      g.scale(dpr, dpr)

      // 1. Render the finished text (same font, size, colour, position as the real text) offscreen.
      const src = document.createElement('canvas')
      src.width = cv.width; src.height = cv.height
      const s = src.getContext('2d')!
      s.scale(dpr, dpr)
      const spans = [...box.querySelectorAll<HTMLElement>('[data-line]')]
      const style = getComputedStyle(spans[0])
      s.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      s.fillStyle = style.color
      s.textBaseline = 'alphabetic'
      const lineBoxes = spans.map((span) => {
        const r = span.getBoundingClientRect()
        const m = s.measureText(span.textContent ?? '')
        const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent
        const lh = parseFloat(getComputedStyle(span).lineHeight) || r.height
        const left = r.left - rect.left + SPREAD, top = r.top - rect.top + SPREAD
        s.fillText(span.textContent ?? '', left, top + (lh - asc - desc) / 2 + asc)
        return { top, bottom: top + r.height, left, width: r.width }
      })
      const px = s.getImageData(0, 0, src.width, src.height).data

      // 2. Cut it into fragments (only ones with ink), each starting scattered up/right and departing in a
      //    left-to-right sweep so the text writes itself.
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
          const line = lineBoxes.find((l) => y + TILE >= l.top && y <= l.bottom) ?? lineBoxes[0]
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
        for (const f of frags) {
          const k = Math.min(Math.max((t - f.t0) / FLY, 0), 1)
          if (k <= 0) continue
          const e = ease(k)
          g.globalAlpha = Math.min(1, k * 2)
          if (k >= 1) {
            // Landed: exact pixels, no rotation, so the finished fragments are the finished text.
            g.drawImage(src, f.x * dpr, f.y * dpr, T, T, f.x, f.y, TILE, TILE)
            continue
          }
          const cx = f.sx + (f.x - f.sx) * e, cy = f.sy + (f.y - f.sy) * e
          g.save()
          g.translate(cx + TILE / 2, cy + TILE / 2)
          g.rotate(f.rot * (1 - e))
          g.drawImage(src, f.x * dpr, f.y * dpr, T, T, -TILE / 2, -TILE / 2, TILE, TILE)
          g.restore()
        }
        if (t < end) raf = requestAnimationFrame(frame)
        else {
          setDone(true) // identical pixels are already on screen; the real text takes over
          onDone?.()
        }
      }
      raf = requestAnimationFrame(frame)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
    // Runs once on mount: the dust sequence plays a single time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {lines.map((l) => (
        <span key={l} data-line className={`mx-auto block w-fit whitespace-nowrap ${done ? '' : 'opacity-0'} ${lineClassName}`}>
          {l}
        </span>
      ))}
      {!done && <canvas ref={canvas} aria-hidden className="pointer-events-none absolute" style={{ left: -SPREAD, top: -SPREAD }} />}
    </div>
  )
}
