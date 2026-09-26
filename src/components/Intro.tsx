import { useRef, type CSSProperties } from 'react'
import paperUrl from '../assets/envelope/paper.webp'
import { invite } from '../content'
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
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden" style={{ '--paper': `url(${paperUrl})` } as CSSProperties}>
      {/* Two envelope halves; the gold edges meet at the seam where the seal sits. */}
      <div ref={top} className="envelope-flap absolute inset-x-0 top-0 h-1/2 border-b border-gold-light/60 shadow-[0_2px_10px_rgb(0_0_0/0.25)]" />
      <div ref={bottom} className="envelope-flap-lower absolute inset-x-0 bottom-0 h-1/2 border-t border-gold-light/30" />

      <div ref={content} className="text-cream">
        {/* Top flap: Ganesh. Bottom flap: shloka and invocation, below the seal. */}
        <div className="absolute inset-x-0 top-0 flex h-1/2 items-center justify-center pb-[min(19vw,5rem)]">
          <Ganesh className="w-[min(40vw,11rem,22svh)] text-gold-light drop-shadow-[0_6px_18px_rgb(0_0_0/0.35)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col items-center justify-center gap-4 px-6 pt-[min(19vw,5rem)] text-center">
          <p className="font-display text-lg leading-relaxed text-gold-light/90 sm:text-xl">
            {invite.shloka.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="font-display text-2xl text-gold-light">{invite.invocation}</p>
        </div>
      </div>

      <button
        ref={seal}
        onClick={open}
        aria-label={invite.openLabel}
        className="absolute top-1/2 left-1/2 cursor-pointer w-[min(38vw,10rem)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_16px_rgb(0_0_0/0.5)] transition-[scale] duration-300 hover:scale-105 active:scale-95"
      >
        {/* Gold ripples + a slow pulse invite a tap (no text needed). */}
        <span aria-hidden className="seal-ripple absolute inset-[8%] rounded-full" />
        <span aria-hidden className="seal-ripple absolute inset-[8%] rounded-full [animation-delay:1.2s]" />
        <Seal className="seal-pulse relative w-full" />
      </button>
    </div>
  )
}
