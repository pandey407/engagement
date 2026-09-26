import type { CSSProperties, ReactNode } from 'react'
import archBottom from '../assets/frame/arch-bottom.webp'
import archMid from '../assets/frame/arch-mid.webp'
import archTop from '../assets/frame/arch-top.webp'
import maroonBottom from '../assets/frame/maroon-bottom.webp'
import maroonMid from '../assets/frame/maroon-mid.webp'
import maroonTop from '../assets/frame/maroon-top.webp'
import { invite } from '../content'
import { Band, Cloud, Divider } from './Ornaments'

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center ${className}`}>
      {children}
    </section>
  )
}

function Heading({ np, en }: { np: string; en: string }) {
  return (
    <div data-reveal className="mb-10 flex flex-col items-center">
      <h2 className="font-display text-3xl text-maroon sm:text-4xl">{np}</h2>
      <p className="mt-1 text-xs tracking-[0.3em] text-gold uppercase">{en}</p>
      <Divider className="mt-4" />
    </div>
  )
}

function Sub({ children }: { children: ReactNode }) {
  return children ? <p className="text-sm text-ink/55">{children}</p> : null
}

export function Hero() {
  return (
    <header className="relative min-h-svh overflow-hidden pb-16">
      <Band />
      {/* Drifting clouds fill the sides (large on desktop, peeking in from the edges on phones). */}
      <Cloud n={1} className="absolute top-[8%] -left-[18%] w-[45vw] max-w-[26rem] opacity-90 sm:left-[2%] sm:w-[30vw]" />
      <Cloud n={2} className="absolute top-[34%] -right-[20%] w-[42vw] max-w-[22rem] opacity-90 [animation-delay:-5s] sm:right-[3%] sm:w-[26vw]" />
      <Cloud n={3} className="absolute top-[64%] -left-[16%] w-[36vw] max-w-[18rem] opacity-80 [animation-delay:-9s] sm:left-[6%] sm:w-[20vw]" />
      <div
        className="relative mx-auto mt-10 flex flex-col items-center px-[calc(var(--w)*0.13)] pt-[calc(var(--w)*0.5)] pb-[calc(var(--w)*0.4)] text-center"
        style={
          {
            '--w': 'min(90vw, 30rem)',
            width: 'var(--w)',
            '--top': `url(${archTop})`,
            '--mid': `url(${archMid})`,
            '--bottom': `url(${archBottom})`,
          } as CSSProperties
        }
      >
        <div className="arch-card absolute inset-0 -z-10" />
        <p data-reveal className="font-display text-base text-maroon">{invite.invocation}</p>
        <p data-reveal className="mt-2 font-display text-2xl text-lotus">{invite.occasion.np}</p>
        <p data-reveal className="text-[10px] tracking-[0.3em] text-gold uppercase">{invite.occasion.en}</p>

        <h1 data-reveal className="mt-6 font-display text-4xl leading-tight text-maroon sm:text-5xl">
          {invite.partnerOne.np}
          <span className="block text-2xl text-gold">{invite.and.np}</span>
          {invite.partnerTwo.np}
        </h1>
        <p data-reveal className="mt-2 text-xs tracking-widest text-ink/60 uppercase">
          {invite.partnerOne.en} {invite.and.en} {invite.partnerTwo.en}
        </p>

        <Divider className="my-5" />
        <p data-reveal className="text-sm leading-relaxed text-ink/80">{invite.blessing.np}</p>
        <div data-reveal className="mt-1">
          <Sub>{invite.blessing.en}</Sub>
        </div>

        <p data-reveal className="mt-5 text-lg font-semibold text-maroon">{invite.dateLabel.np}</p>
        <div data-reveal>
          <Sub>{invite.dateLabel.en}</Sub>
        </div>
      </div>
    </header>
  )
}

function Label({ np, en }: { np: string; en: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm text-gold">{np}</p>
      {/* Letter-spacing only on the Latin line: it breaks up Devanagari conjuncts. */}
      <p className="text-[10px] tracking-[0.25em] text-gold/80 uppercase">{en}</p>
    </div>
  )
}

// Date & time and venue side by side under one heading, map below.
export function Details() {
  const { venue } = invite
  return (
    <Section className="max-w-none overflow-hidden bg-paper/40">
      <Cloud n={3} className="absolute top-10 -right-[12%] hidden w-[22vw] max-w-[18rem] opacity-70 lg:block" />
      <Cloud n={2} className="absolute bottom-16 -left-[10%] hidden w-[24vw] max-w-[20rem] opacity-70 [animation-delay:-6s] lg:block" />
      <div className="relative flex w-full max-w-2xl flex-col items-center">
        <Heading {...invite.details.heading} />

        <div data-reveal className="grid w-full grid-cols-2 divide-x divide-gold/40 text-center">
          <div className="px-3 sm:px-6">
            <Label {...invite.details.dateTimeLabel} />
            <p className="text-base font-semibold text-maroon sm:text-lg">{invite.dateLabel.np}</p>
            <p className="mt-1 text-sm text-ink/75">{invite.time.np}</p>
            <div className="mt-2">
              <Sub>
                {invite.dateLabel.en}
                <br />
                {invite.time.en}
              </Sub>
            </div>
          </div>
          <div className="px-3 sm:px-6">
            <Label {...invite.details.venueLabel} />
            <a href={venue.mapLink} target="_blank" rel="noreferrer" className="text-base font-semibold text-maroon sm:text-lg">
              {venue.name}
            </a>
            <p className="mt-1 text-sm text-ink/75">{venue.address}</p>
            <div className="mt-2">
              <Sub>{venue.en}</Sub>
            </div>
          </div>
        </div>

        <iframe
          data-reveal
          title={venue.mapTitle}
          src={venue.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="mt-10 aspect-[4/3] w-full rounded-2xl border-4 border-white/80 shadow-lg shadow-maroon/10"
        />
      </div>
    </Section>
  )
}

export function Closing() {
  return (
    <footer className="relative overflow-hidden pt-16 text-center">
      <div
        className="relative mx-auto mb-16 flex flex-col items-center px-[calc(var(--w)*0.12)] pt-[calc(var(--w)*0.5)] pb-[calc(var(--w)*0.72)] text-cream"
        style={
          {
            '--w': 'min(88vw, 26rem)',
            width: 'var(--w)',
            '--top': `url(${maroonTop})`,
            '--mid': `url(${maroonMid})`,
            '--bottom': `url(${maroonBottom})`,
          } as CSSProperties
        }
      >
        <div className="maroon-card absolute inset-0 -z-10" />
        <p data-reveal className="font-display text-lg leading-snug sm:text-2xl">{invite.closing.np}</p>
        <p data-reveal className="mt-2 text-sm text-cream/65">{invite.closing.en}</p>
        <p data-reveal className="mt-5 font-display text-base text-gold-light sm:text-xl">{invite.familyLine.np}</p>
        <p data-reveal className="mt-1 text-sm text-cream/65">{invite.familyLine.en}</p>
      </div>
      <Band />
    </footer>
  )
}
