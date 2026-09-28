import ganeshRaw from './assets/ganesh.svg?raw'

// Our traced Ganesh, drawn on stroke by stroke, then filled; the diya flame at the top flickers.
// The SVG is one path of sub-shapes; the topmost one is the flame.
const d = ganeshRaw.match(/ d="([^"]+)"/)?.[1] ?? ''
const view = ganeshRaw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 361 437'
const shapes = d.split(/(?=M)/).filter(Boolean)
const minY = (s: string) => Math.min(...(s.match(/-?\d+\.?\d*/g) ?? []).map(Number).filter((_, i) => i % 2 === 1))
const flameIndex = shapes.reduce((best, s, i) => (minY(s) < minY(shapes[best]) ? i : best), 0)
const flame = shapes[flameIndex]
const body = shapes.filter((_, i) => i !== flameIndex)

const DRAW = 0.9 // seconds per stroke
const STAGGER = 0.18 // seconds between strokes starting
const FILL_AT = STAGGER * (shapes.length - 1) + DRAW * 0.8

export function GaneshDraw({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={view} className={`ganesh-draw overflow-visible ${className}`} role="img" aria-label="श्री गणेश">
      <defs>
        <linearGradient id="flame-fill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f3c35c" />
          <stop offset="0.45" stopColor="#f59a3b" />
          <stop offset="0.8" stopColor="#ffd98a" />
          <stop offset="1" stopColor="#fff4d6" />
        </linearGradient>
      </defs>

      {/* Body fills in once the strokes are drawn (one path keeps the drawing's even-odd holes). */}
      <path className="ganesh-fill" d={body.join('')} fillRule="evenodd" style={{ animationDelay: `${FILL_AT}s` }} />

      {/* Outline of each stroke draws on in turn. */}
      {shapes.map((s, i) =>
        i === flameIndex ? null : (
          <path key={i} className="ganesh-stroke" d={s} pathLength={1} style={{ animationDelay: `${i * STAGGER}s` }} />
        ),
      )}

      {/* The diya flame: drawn last, then glows and flickers. */}
      <g className="ganesh-flame" style={{ animationDelay: `${FILL_AT + 0.3}s` }}>
        <path className="ganesh-stroke" d={flame} pathLength={1} style={{ animationDelay: `${FILL_AT - 0.4}s` }} />
        <path className="ganesh-flame-fill" d={flame} fill="url(#flame-fill)" style={{ animationDelay: `${FILL_AT}s` }} />
      </g>
    </svg>
  )
}
