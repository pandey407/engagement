import cloud1 from '../assets/clouds/cloud-1.webp'
import cloud2 from '../assets/clouds/cloud-2.webp'
import cloud3 from '../assets/clouds/cloud-3.webp'
import borderTile from '../assets/border/tile.webp'
import dividerUrl from '../assets/divider/divider.webp'

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

// Watercolour auspicious clouds with gold curls (our generated art, cut out by scripts/cut-clouds.py).
const clouds = [cloud1, cloud2, cloud3]
export function Cloud({ n, className = '' }: { n: 1 | 2 | 3; className?: string }) {
  return <img src={clouds[n - 1]} alt="" aria-hidden draggable={false} className={`drift pointer-events-none select-none ${className}`} />
}
