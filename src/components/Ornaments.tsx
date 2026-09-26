import type { CSSProperties } from 'react'
import ganeshUrl from '../assets/ganesh.svg'
import dividerUrl from '../assets/divider/divider.webp'
import lotusUrl from '../assets/lotus/lotus.webp'
import sealUrl from '../assets/seal/seal.webp'

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

// Painted lotus divider with gold vines (our generated art, cut out by scripts/cut-divider.py).
export function Divider({ className = '' }: { className?: string }) {
  return (
    <img
      src={dividerUrl}
      alt=""
      aria-hidden
      draggable={false}
      className={`pointer-events-none mx-auto w-[min(80vw,20rem)] select-none ${className}`}
    />
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

// Painted lotus wax seal (our generated art, cut out by scripts/cut-seal.py).
export function Seal({ className = '' }: { className?: string }) {
  return <img src={sealUrl} alt="" draggable={false} className={`select-none ${className}`} />
}
