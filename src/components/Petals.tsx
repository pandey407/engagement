import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

// Falling marigold (सयपत्री) petals. Swap the SVG for your own flower PNGs later.
export function Petals({ count = 14 }: { count?: number }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.petal').forEach((petal) => {
        const fall = () =>
          gsap.fromTo(
            petal,
            { x: gsap.utils.random(0, window.innerWidth), y: -40, rotation: gsap.utils.random(0, 360) },
            {
              y: window.innerHeight + 40,
              x: `+=${gsap.utils.random(-120, 120)}`,
              rotation: `+=${gsap.utils.random(180, 540)}`,
              duration: gsap.utils.random(8, 14),
              delay: gsap.utils.random(0, 8),
              ease: 'none',
              onComplete: fall,
            },
          )
        fall()
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className={`petal absolute top-0 left-0 size-4 ${i % 3 ? 'text-marigold/70' : 'text-sindoor/50'}`} viewBox="0 0 20 20">
          <path fill="currentColor" d="M10 0C14 5 16 10 10 20 4 10 6 5 10 0Z" />
        </svg>
      ))}
    </div>
  )
}
