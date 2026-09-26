import type { CSSProperties, ReactNode } from 'react'
import archBottom from '../assets/frame/arch-bottom.webp'
import archMid from '../assets/frame/arch-mid.webp'
import archTop from '../assets/frame/arch-top.webp'
import maroonBottom from '../assets/frame/maroon-bottom.webp'
import maroonMid from '../assets/frame/maroon-mid.webp'
import maroonTop from '../assets/frame/maroon-top.webp'
import { invite } from '../content'
import { useLang, type Pair } from '../lib/lang'
import { Band, Cloud, Divider } from './Ornaments'

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center ${className}`}>
      {children}
    </section>
  )
}

function Heading({ text }: { text: Pair }) {
  const { t } = useLang()
  return (
    <div data-reveal className="mb-10 flex flex-col items-center">
      <h2 className="font-display text-3xl text-maroon sm:text-4xl">{t(text)}</h2>
      <Divider className="mt-4" />
    </div>
  )
}

export function Hero() {
  const { lang, t } = useLang()
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
        <p data-reveal className="mt-2 font-display text-2xl text-lotus">{t(invite.occasion)}</p>

        <h1
          data-reveal
          className={`mt-6 font-names leading-tight text-maroon ${lang === 'en' ? 'text-5xl sm:text-6xl' : 'text-4xl font-bold sm:text-5xl'}`}
        >
          {t(invite.partnerOne)}
          <span className={`block text-gold ${lang === 'en' ? 'text-3xl' : 'text-2xl'}`}>{t(invite.and)}</span>
          {t(invite.partnerTwo)}
        </h1>

        <Divider className="my-5" />
        <p data-reveal className="text-sm leading-relaxed text-ink/80">{t(invite.blessing)}</p>
        <p data-reveal className="mt-5 text-lg font-semibold text-maroon">{t(invite.dateLabel)}</p>
      </div>
    </header>
  )
}

function Label({ text }: { text: Pair }) {
  const { lang, t } = useLang()
  // Letter-spacing only for Latin: it breaks up Devanagari conjuncts.
  return <p className={`mb-3 text-gold ${lang === 'en' ? 'text-xs tracking-[0.25em] uppercase' : 'text-sm'}`}>{t(text)}</p>
}

// Date & time and venue side by side under one heading, map below.
export function Details() {
  const { t } = useLang()
  const { venue } = invite
  return (
    <Section className="max-w-none overflow-hidden bg-paper/40">
      <Cloud n={3} className="absolute top-10 -right-[12%] hidden w-[22vw] max-w-[18rem] opacity-70 lg:block" />
      <Cloud n={2} className="absolute bottom-16 -left-[10%] hidden w-[24vw] max-w-[20rem] opacity-70 [animation-delay:-6s] lg:block" />
      <div className="relative flex w-full max-w-2xl flex-col items-center">
        <Heading text={invite.details.heading} />

        <div data-reveal className="grid w-full grid-cols-2 divide-x divide-gold/40 text-center">
          <div className="px-3 sm:px-6">
            <Label text={invite.details.dateTimeLabel} />
            <p className="text-base font-semibold text-maroon sm:text-lg">{t(invite.dateLabel)}</p>
            <p className="mt-1 text-sm text-ink/75">{t(invite.time)}</p>
          </div>
          <div className="px-3 sm:px-6">
            <Label text={invite.details.venueLabel} />
            <a href={venue.mapLink} target="_blank" rel="noreferrer" className="text-base font-semibold text-maroon sm:text-lg">
              {t(venue.name)}
            </a>
            <p className="mt-1 text-sm text-ink/75">{t(venue.address)}</p>
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
  const { t } = useLang()
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
        <p data-reveal className="font-display text-lg leading-snug sm:text-2xl">{t(invite.closing)}</p>
        <p data-reveal className="mt-5 font-display text-base text-gold-light sm:text-xl">{t(invite.familyLine)}</p>
      </div>
      <Band />
    </footer>
  )
}
