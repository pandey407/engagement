import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// Text that assembles itself from drifting gold dust (a "Thanos snap" in reverse), sweeping left to right.
// A canvas flies dust particles (sampled from the text's own pixels) into place; right behind them the crisp
// text is revealed by a sweeping mask, so each part turns sharp as its dust lands and the dust melts away.
type Props = {
  lines: string[]
  className?: string
  lineClassName?: string
  start?: number // seconds before the dust starts moving
  duration?: number // seconds for the sweep across all lines
  onDone?: () => void
}

type P = { x: number; y: number; sx: number; sy: number; t0: number; crisp: number; size: number }

const SPREAD = 90 // CSS px of margin around the text the dust can start from

export function DustText({ lines, className = '', lineClassName = '', start = 0.3, duration = 2.8, onDone }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [sweep, setSweep] = useState<{ delay: number; length: number } | 'done' | null>(null)

  useEffect(() => {
    const box = wrap.current, cv = canvas.current
    if (!box || !cv) return
    if (prefersReducedMotion()) {
      setSweep('done')
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
      cv.width = W * dpr; cv.height = H * dpr
      cv.style.width = `${W}px`; cv.style.height = `${H}px`
      const g = cv.getContext('2d')!
      g.scale(dpr, dpr)

      // 1. Draw the real text (same font, size, colour, position) to sample its pixels.
      const spans = [...box.querySelectorAll<HTMLElement>('[data-line]')]
      const style = getComputedStyle(spans[0])
      const colour = style.color
      g.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      g.fillStyle = '#000'
      g.textBaseline = 'alphabetic'
      const lineBoxes: { top: number; bottom: number; left: number; width: number }[] = []
      for (const s of spans) {
        const r = s.getBoundingClientRect()
        lineBoxes.push({ top: r.top - rect.top + SPREAD, bottom: r.bottom - rect.top + SPREAD, left: r.left - rect.left + SPREAD, width: r.width })
        const m = g.measureText(s.textContent ?? '')
        const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent
        const lh = parseFloat(getComputedStyle(s).lineHeight) || r.height
        const baseline = r.top - rect.top + SPREAD + (lh - asc - desc) / 2 + asc
        g.fillText(s.textContent ?? '', r.left - rect.left + SPREAD, baseline)
      }
      const img = g.getImageData(0, 0, cv.width, cv.height).data
      g.clearRect(0, 0, W, H)

      // 2. One particle per filled cell; each starts scattered up/right (dust blown back in) and lands in a
      //    left-to-right sweep. Each line's crisp text is revealed by a hard-edged mask whose edge reaches a
      //    particle exactly when it has landed; the particle vanishes at that moment, so the moment the dust
      //    settles, that part of the text is final (no dust over crisp text, no soft half-revealed text).
      const across = duration * 0.7 // seconds for the landing front to cross a line
      const JIT = 0.12 // random spread in departure, keeps the dust organic
      const FLY = duration * 0.35 // seconds each particle takes to land
      const reveal = start + FLY + JIT // time the crisp edge passes x = 0 of a line
      const step = 1.6, parts: P[] = []
      for (let y = 0; y < H; y += step) {
        const line = lineBoxes.find((l) => y >= l.top - 4 && y <= l.bottom + 4) ?? lineBoxes[0]
        for (let x = 0; x < W; x += step) {
          if (img[(Math.floor(y * dpr) * cv.width + Math.floor(x * dpr)) * 4 + 3] > 110) {
            const a = Math.random() * Math.PI * 2, d = 25 + Math.random() * SPREAD
            const xf = Math.min(Math.max((x - line.left) / line.width, 0), 1)
            parts.push({
              x, y,
              sx: x + Math.cos(a) * d + 30 + Math.random() * 40,
              sy: y + Math.sin(a) * d * 0.6 - 10,
              t0: xf * across + Math.random() * JIT,
              crisp: reveal + xf * across - start, // same clock as t0
              size: 1.1 + Math.random() * 1.2,
            })
          }
        }
      }
      const end = reveal + across - start + 0.05
      const t0 = performance.now() + start * 1000
      // Mask edge travels 0 → 100% of each line over `across` seconds (see .dust-reveal-run).
      setSweep({ delay: reveal, length: across })
      const ease = (t: number) => 1 - Math.pow(1 - t, 3)

      const frame = (now: number) => {
        const t = (now - t0) / 1000
        g.clearRect(0, 0, W, H)
        g.fillStyle = colour
        for (const p of parts) {
          const k = Math.min(Math.max((t - p.t0) / FLY, 0), 1)
          if (k <= 0) continue
          const e = ease(k)
          if (t >= p.crisp) continue // the crisp text has taken over here
          g.globalAlpha = Math.min(1, k * 1.6)
          const s = p.size * (1 - e) + 1.6 * e
          g.fillRect(p.sx + (p.x - p.sx) * e - s / 2, p.sy + (p.y - p.sy) * e - s / 2, s, s)
        }
        if (t < end) raf = requestAnimationFrame(frame)
        else {
          setSweep('done')
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

  const lineStyle =
    sweep && sweep !== 'done' ? ({ animationDelay: `${sweep.delay}s`, animationDuration: `${sweep.length}s` } as const) : undefined
  const lineClass = sweep === 'done' ? '' : sweep ? 'dust-reveal dust-reveal-run' : 'dust-reveal'

  return (
    <div ref={wrap} className={`relative ${className}`}>
      {lines.map((l) => (
        <span key={l} data-line className={`mx-auto block w-fit ${lineClass} ${lineClassName}`} style={lineStyle}>
          {l}
        </span>
      ))}
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute" style={{ left: -SPREAD, top: -SPREAD }} />
    </div>
  )
}
