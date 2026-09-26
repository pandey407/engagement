import { useRef } from 'react'
import { invite } from '../config'
import { gsap, prefersReducedMotion } from '../lib/motion'

// Full-screen "envelope" the guest taps to open the invite.
export function Intro({ onOpen }: { onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const seal = useRef<HTMLButtonElement>(null)

  const open = () => {
    if (prefersReducedMotion()) return onOpen()
    gsap
      .timeline({ onComplete: onOpen })
      .to(seal.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(2)' })
      .to(top.current, { yPercent: -100, duration: 1, ease: 'power3.inOut' }, '-=0.1')
      .to(bottom.current, { yPercent: 100, duration: 1, ease: 'power3.inOut' }, '<')
      .to(root.current, { autoAlpha: 0, duration: 0.2 })
  }

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden">
      <div ref={top} className="absolute inset-x-0 top-0 h-1/2 bg-maroon" />
      <div ref={bottom} className="absolute inset-x-0 bottom-0 h-1/2 bg-maroon-deep" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center text-cream">
        <p className="font-display text-lg italic opacity-80">You are invited</p>
        <button
          ref={seal}
          onClick={open}
          aria-label="Open invitation"
          className="flex size-28 items-center justify-center rounded-full border-2 border-gold bg-gold/90 font-display text-3xl text-maroon-deep shadow-2xl transition-transform hover:scale-105"
        >
          {invite.partnerOne[0]}&amp;{invite.partnerTwo[0]}
        </button>
        <p className="text-xs tracking-[0.3em] uppercase opacity-70">Tap to open</p>
      </div>
    </div>
  )
}
