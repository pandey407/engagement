import type { CSSProperties } from 'react'
import { invite } from '../content'
import ganeshUrl from '../assets/ganesh.svg'
import cloud1 from '../assets/clouds/cloud-1.webp'
import cloud2 from '../assets/clouds/cloud-2.webp'
import cloud3 from '../assets/clouds/cloud-3.webp'
import borderTile from '../assets/border/tile.webp'
import coupleUrl from '../assets/couple/couple.webp'
import dividerUrl from '../assets/divider/divider.webp'
import sealUrl from '../assets/seal/seal.webp'

// Our Ganesh line art, drawn as a CSS mask so it takes the current text colour.
export function Ganesh({ className = '' }: { className?: string }) {
  const mask = `url(${ganeshUrl}) center / contain no-repeat`
  return (
    <span
      role="img"
      aria-label={invite.invocation}
      className={`block aspect-[361/437] bg-current ${className}`}
      style={{ mask, WebkitMask: mask } as CSSProperties}
    />
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

// Painted lotus border strip (our generated art): one seamless repeat, tiled across the width.
export function Band() {
  return <div className="h-11 sm:h-14" style={{ background: `url(${borderTile}) repeat-x left center / auto 100%` }} />
}

// Painted lotus wax seal (our generated art, cut out by scripts/cut-seal.py).
export function Seal({ className = '' }: { className?: string }) {
  return <img src={sealUrl} alt="" draggable={false} className={`select-none ${className}`} />
}

// Watercolour auspicious clouds with gold curls (our generated art, cut out by scripts/cut-clouds.py).
const clouds = [cloud1, cloud2, cloud3]
export function Cloud({ n, className = '' }: { n: 1 | 2 | 3; className?: string }) {
  return <img src={clouds[n - 1]} alt="" aria-hidden draggable={false} className={`drift pointer-events-none select-none ${className}`} />
}

// The two of us: black suit and golden sari (our generated art, cut out by scripts/cut-couple.py).
export function Couple({ className = '' }: { className?: string }) {
  return <img src={coupleUrl} alt="" aria-hidden draggable={false} className={`pointer-events-none select-none ${className}`} />
}
