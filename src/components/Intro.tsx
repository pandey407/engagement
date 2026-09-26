import { useRef } from 'react'
import { invite } from '../config'
import { Ganesh, Seal } from './Ornaments'
import { gsap, prefersReducedMotion } from '../lib/motion'

// Full-screen "envelope" the guest taps to open the invite.
export function Intro({ onOpen }: { onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const seal = useRef<HTMLButtonElement>(null)

  const open = () => {
    if (prefersReducedMotion()) return onOpen()
    gsap
      .timeline({ onComplete: onOpen })
      .to(seal.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(2)' })
      .to(content.current, { autoAlpha: 0, duration: 0.3 }, '<0.1')
      .to(top.current, { yPercent: -100, duration: 1, ease: 'power3.inOut' }, '-=0.1')
      .to(bottom.current, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, '<')
      .to(root.current, { autoAlpha: 0, duration: 0.2 })
  }

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden">
      {/* Two envelope halves; the gold edges meet at the seam where the seal sits. */}
      <div ref={top} className="velvet absolute inset-x-0 top-0 h-1/2 border-b border-gold-light/60 shadow-[0_2px_10px_rgb(0_0_0/0.25)]" />
      <div ref={bottom} className="velvet velvet-deep absolute inset-x-0 bottom-0 h-1/2 border-t border-gold-light/30" />

      <div ref={content} className="text-cream">
        <div className="absolute inset-x-0 top-0 flex h-1/2 flex-col items-center justify-center gap-3 px-6 pb-[min(19vw,5rem)] text-center">
          <Ganesh className="w-[min(34vw,9rem)] text-gold-light drop-shadow-[0_6px_18px_rgb(0_0_0/0.35)]" />
          <p className="mt-2 font-display text-2xl text-gold-light">{invite.invocation}</p>
          <p className="text-lg opacity-80">तपाईंलाई हार्दिक निमन्त्रणा</p>
        </div>
        <p className="absolute inset-x-0 top-[calc(50%+min(19vw,5rem)+1.25rem)] text-center text-sm opacity-70">
          खोल्न थिच्नुहोस् · Tap to open
        </p>
      </div>

      <button
        ref={seal}
        onClick={open}
        aria-label="Open invitation"
        className="absolute top-1/2 left-1/2 w-[min(38vw,10rem)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_16px_rgb(0_0_0/0.5)] transition-[scale] duration-300 hover:scale-105 active:scale-95"
      >
        <Seal className="w-full" />
      </button>
    </div>
  )
}
