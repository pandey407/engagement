import type { CSSProperties } from 'react'
import ganeshUrl from '../assets/ganesh.svg'
import lotusUrl from '../assets/lotus/lotus.webp'

// Our Ganesh line art, drawn as a CSS mask so it takes the current text colour.
export function Ganesh({ className = '' }: { className?: string }) {
  const mask = `url(${ganeshUrl}) center / contain no-repeat`
  return (
    <span
      role="img"
      aria-label="श्री गणेश"
      className={`block aspect-[361/437] bg-current ${className}`}
      style={{ mask, WebkitMask: mask } as CSSProperties}
    />
  )
}

// Blush-tinted 19th-century lotus watercolour (NGA, CC0).
export function Lotus({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <img
      src={lotusUrl}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
    />
  )
}

// Small stylised lotus used in dividers and the border pattern.
export function LotusGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden>
      <g strokeWidth="0.8" strokeLinejoin="round" className="stroke-gold">
        <path d="M20 22C12 22 6 18 3 12 9 12 15 15 20 22Z" className="fill-lotus-light" />
        <path d="M20 22C28 22 34 18 37 12 31 12 25 15 20 22Z" className="fill-lotus-light" />
        <path d="M20 22C13 18 11 11 13 5 17 9 20 15 20 22Z" className="fill-lotus" />
        <path d="M20 22C27 18 29 11 27 5 23 9 20 15 20 22Z" className="fill-lotus" />
        <path d="M20 22C16 16 16 8 20 1 24 8 24 16 20 22Z" className="fill-maroon" />
      </g>
    </svg>
  )
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold" />
      <span className="size-1 rotate-45 bg-gold" />
      <LotusGlyph className="w-9" />
      <span className="size-1 rotate-45 bg-gold" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold" />
    </div>
  )
}

// Cusped arch cap that sits on top of a bordered panel; its ends meet the panel's side borders.
export function ArchCap({ className = '' }: { className?: string }) {
  const outer = 'M1 159V120C1 92 24 80 44 76 52 52 74 40 96 42 108 20 128 8 150 1 172 8 192 20 204 42 226 40 248 52 256 76 276 80 299 92 299 120V159'
  const inner = 'M9 159V121C9 98 29 88 50 84 58 62 78 50 100 51 112 31 130 19 150 12 170 19 188 31 200 51 222 50 242 62 250 84 271 88 291 98 291 121V159'
  return (
    <svg viewBox="0 0 300 160" preserveAspectRatio="none" className={className} aria-hidden>
      <path d={`${outer}Z`} className="fill-cream/80" />
      <path d={outer} className="fill-none stroke-gold" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={inner} className="fill-none stroke-gold/60" strokeWidth="1" strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// Repeating lotus border band (vector tile).
const bandTile = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="28" viewBox="0 0 56 28">
    <rect width="56" height="28" fill="#faf4ea"/>
    <path d="M0 2.5H56M0 25.5H56" stroke="#a87a3a" stroke-width="1"/>
    <path d="M0 5H56M0 23H56" stroke="#77142a" stroke-width="0.6"/>
    <g transform="translate(18 6) scale(0.5)" stroke="#a87a3a" stroke-width="1.2">
      <path d="M20 22C12 22 6 18 3 12 9 12 15 15 20 22Z" fill="#f5b7b7"/>
      <path d="M20 22C28 22 34 18 37 12 31 12 25 15 20 22Z" fill="#f5b7b7"/>
      <path d="M20 22C13 18 11 11 13 5 17 9 20 15 20 22Z" fill="#dc7d87"/>
      <path d="M20 22C27 18 29 11 27 5 23 9 20 15 20 22Z" fill="#dc7d87"/>
      <path d="M20 22C16 16 16 8 20 1 24 8 24 16 20 22Z" fill="#77142a"/>
    </g>
    <circle cx="4" cy="14" r="1.4" fill="#a87a3a"/><circle cx="52" cy="14" r="1.4" fill="#a87a3a"/>
  </svg>`,
)
export function Band() {
  return <div className="h-7" style={{ background: `url("data:image/svg+xml,${bandTile}") repeat-x left center` }} />
}
