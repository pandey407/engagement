import { useEffect, useRef, useState, type CSSProperties } from 'react'
import paperUrl from '../assets/envelope/pink-tile.webp'
import sealOutline from '../assets/seal/outline.svg?raw'
import { invite } from '../content'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { DustText } from './DustText'
import { GaneshDraw } from './GaneshDraw'
import { Seal } from './Ornaments'

const outlinePath = sealOutline.match(/ d="([^"]+)"/)?.[1] ?? ''
const outlineView = sealOutline.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 100 100'

// Opening sequence (after Ganesh is drawn and the shloka has formed from dust):
// invocation fades in → a gold line scratches across the seam → the seal appears → it bounces and becomes tappable.
type Phase = 'writing' | 'invocation' | 'scratch' | 'seal' | 'ready'
const NEXT: Record<Phase, [Phase, number] | null> = {
  writing: null, // advanced by the shloka's onDone
  invocation: ['scratch', 900],
  scratch: ['seal', 900],
  seal: ['ready', 700],
  ready: null,
}
const at = (phase: Phase, from: Phase) => {
  const order: Phase[] = ['writing', 'invocation', 'scratch', 'seal', 'ready']
  return order.indexOf(phase) >= order.indexOf(from)
}

// Full-screen "envelope" the guest taps to open the invite.
export function Intro({ onOpen, onOpenStart }: { onOpen: () => void; onOpenStart?: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const seal = useRef<HTMLButtonElement>(null)
  const [phase, setPhase] = useState<Phase>(() => (prefersReducedMotion() ? 'ready' : 'writing'))

  useEffect(() => {
    const next = NEXT[phase]
    if (!next) return
    const id = setTimeout(() => setPhase(next[0]), next[1])
    return () => clearTimeout(id)
  }, [phase])

  const open = () => {
    if (phase !== 'ready') return
    onOpenStart?.()
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
      <div ref={top} className="envelope-flap absolute inset-x-0 top-0 h-1/2" />
      <div ref={bottom} className="envelope-flap-lower absolute inset-x-0 bottom-0 h-1/2" />

      <div ref={content} className="text-maroon">
        {/* Top flap: Ganesh draws himself. */}
        <div className="absolute inset-x-0 top-0 flex h-1/2 items-center justify-center pb-[min(19vw,5rem)]">
          <GaneshDraw className="w-[min(40vw,11rem,22svh)] text-maroon drop-shadow-[0_4px_12px_rgb(119_20_42/0.18)]" />
        </div>

        {/* Bottom flap: the shloka forms from gold dust, then the invocation. */}
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col items-center justify-center gap-5 px-5 pt-[min(19vw,5rem)] text-center">
          <DustText
            lines={invite.shloka}
            className="font-display text-[min(5.3vw,1.25rem)] leading-relaxed text-maroon sm:text-3xl"
            onDone={() => setPhase((p) => (p === 'writing' ? 'invocation' : p))}
          />
          <p className={`font-display text-xl text-gold transition-all duration-1000 sm:text-2xl ${at(phase, 'invocation') ? 'opacity-100 blur-0' : 'translate-y-2 opacity-0 blur-sm'}`}>
            {invite.invocation}
          </p>
        </div>

        {/* The seam: a gold line scratches across the envelope before the seal is placed. */}
        <div
          aria-hidden
          className={`seam-line absolute inset-x-0 top-1/2 h-px origin-left bg-gold ${at(phase, 'scratch') ? 'seam-line-drawn' : ''}`}
        />
      </div>

      <button
        ref={seal}
        onClick={open}
        disabled={phase !== 'ready'}
        aria-label={invite.openLabel}
        className={`absolute top-1/2 left-1/2 w-[min(38vw,10rem)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_16px_rgb(119_20_42/0.3)] ${
          phase === 'ready' ? 'cursor-pointer' : 'pointer-events-none'
        } ${at(phase, 'seal') ? 'seal-enter' : 'opacity-0'}`}
      >
        {/* Once ready: rings shaped like the seal's wavy edge ripple out, and the seal bounces. */}
        {phase === 'ready' && (
          <svg aria-hidden viewBox={outlineView} className="seal-ripple-layer absolute inset-0 h-full w-full overflow-visible">
            <path className="seal-ripple" d={outlinePath} />
          </svg>
        )}
        <Seal className={`relative w-full ${phase === 'ready' ? 'seal-bounce' : ''}`} />
      </button>
    </div>
  )
}
