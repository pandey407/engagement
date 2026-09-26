import type { CSSProperties } from 'react'
import ganeshUrl from '../assets/ganesh.svg'
import ganeshRaw from '../assets/ganesh.svg?raw'
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

// Large decorated wax seal for the envelope: maroon wax, gold lotus-petal rim, beaded rings,
// and our Ganesh in gold foil at the centre. All vector, so it stays sharp at any size.
const ganeshPath = ganeshRaw.match(/ d="([^"]+)"/)?.[1] ?? ''
const WAX_EDGE = Array.from({ length: 72 }, (_, i) => {
  const t = (i / 72) * Math.PI * 2
  const r = 192 + 4 * Math.sin(t * 5) + 3 * Math.sin(t * 11 + 1) + 2 * Math.sin(t * 17 + 2)
  return `${(200 + r * Math.cos(t)).toFixed(1)},${(200 + r * Math.sin(t)).toFixed(1)}`
}).join(' ')

export function Seal({ className = '' }: { className?: string }) {
  const petals = Array.from({ length: 24 }, (_, i) => i * 15)
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#9e2a40" />
          <stop offset="0.55" stopColor="#77142a" />
          <stop offset="1" stopColor="#4a0a18" />
        </radialGradient>
        <radialGradient id="well" cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#6b1226" />
          <stop offset="1" stopColor="#3f0814" />
        </radialGradient>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e2b3" />
          <stop offset="0.35" stopColor="#d9ac68" />
          <stop offset="0.6" stopColor="#a87a3a" />
          <stop offset="1" stopColor="#ecd09a" />
        </linearGradient>
        <filter id="emboss" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#2a0409" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Wax disc with a slightly irregular poured edge. */}
      <polygon points={WAX_EDGE} fill="url(#wax)" />
      <circle cx="200" cy="200" r="182" fill="none" stroke="#2a0409" strokeOpacity="0.25" strokeWidth="6" />

      {/* Gold lotus-petal rim. */}
      <g filter="url(#emboss)">
        {petals.map((a) => (
          <path
            key={a}
            transform={`rotate(${a} 200 200)`}
            d="M200 18C191 30 189 44 200 58 211 44 209 30 200 18Z"
            fill="url(#foil)"
            stroke="#8a5f28"
            strokeWidth="0.8"
          />
        ))}
        {petals.map((a) => (
          <circle key={`d${a}`} transform={`rotate(${a + 7.5} 200 200)`} cx="200" cy="44" r="2.4" fill="url(#foil)" />
        ))}
        <circle cx="200" cy="200" r="138" fill="none" stroke="url(#foil)" strokeWidth="4" />
        <circle cx="200" cy="200" r="129" fill="none" stroke="url(#foil)" strokeWidth="2.2" strokeDasharray="0.1 7.2" strokeLinecap="round" />
      </g>

      {/* Recessed centre with the Ganesh. */}
      <circle cx="200" cy="200" r="120" fill="url(#well)" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="url(#foil)" strokeWidth="1.5" />
      <g filter="url(#emboss)" transform="translate(200 204) scale(0.46) translate(-180.5 -218.5)">
        <path d={ganeshPath} fill="url(#foil)" fillRule="evenodd" />
      </g>

      {/* Soft highlight on the wax. */}
      <ellipse cx="150" cy="110" rx="90" ry="40" fill="#fff" opacity="0.06" transform="rotate(-30 150 110)" />
    </svg>
  )
}
