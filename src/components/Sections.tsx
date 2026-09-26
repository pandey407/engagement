import type { CSSProperties, ReactNode } from 'react'
import archBottom from '../assets/frame/arch-bottom.webp'
import archMid from '../assets/frame/arch-mid.webp'
import archTop from '../assets/frame/arch-top.webp'
import maroonBottom from '../assets/frame/maroon-bottom.webp'
import maroonMid from '../assets/frame/maroon-mid.webp'
import maroonTop from '../assets/frame/maroon-top.webp'
import { invite } from '../config'
import { Band, Divider } from './Ornaments'

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
      <h2 className="font-display text-4xl text-maroon sm:text-5xl">{np}</h2>
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
        <p data-reveal className="font-display text-lg text-maroon">{invite.invocation}</p>
        <p data-reveal className="mt-2 font-display text-3xl text-lotus">{invite.occasion.np}</p>
        <p data-reveal className="text-[10px] tracking-[0.3em] text-gold uppercase">{invite.occasion.en}</p>

        <h1 data-reveal className="mt-6 font-display text-5xl leading-tight text-maroon sm:text-6xl">
          {invite.partnerOne.np}
          <span className="block text-3xl text-gold">र</span>
          {invite.partnerTwo.np}
        </h1>
        <p data-reveal className="mt-2 text-xs tracking-widest text-ink/60 uppercase">
          {invite.partnerOne.en} &amp; {invite.partnerTwo.en}
        </p>

        <Divider className="my-5" />
        <p data-reveal className="text-base leading-relaxed text-ink/80">{invite.blessing.np}</p>
        <div data-reveal className="mt-1">
          <Sub>{invite.blessing.en}</Sub>
        </div>

        <p data-reveal className="mt-5 text-xl font-semibold text-maroon">{invite.dateLabel.np}</p>
        <div data-reveal>
          <Sub>{invite.dateLabel.en}</Sub>
        </div>
      </div>
    </header>
  )
}

// Date, time and venue in one section.
export function Details() {
  const { venue } = invite
  return (
    <Section className="max-w-none bg-paper/40">
      <div className="flex w-full max-w-2xl flex-col items-center">
        <Heading np="शुभ साइत" en="When & where" />

        <p data-reveal className="font-display text-3xl text-maroon sm:text-4xl">{invite.dateLabel.np}</p>
        <div data-reveal>
          <Sub>{invite.dateLabel.en}</Sub>
        </div>

        <p data-reveal className="mt-6 text-2xl font-semibold text-maroon">{invite.time.np}</p>
        <div data-reveal>
          <Sub>{invite.time.en}</Sub>
        </div>

        <Divider className="my-8" />

        <a data-reveal href={venue.mapLink} target="_blank" rel="noreferrer" className="font-display text-3xl text-maroon">
          {venue.name}
        </a>
        <p data-reveal className="mt-1 text-lg text-ink/70">{venue.address}</p>
        <div data-reveal className="mb-8">
          <Sub>{venue.en}</Sub>
        </div>
        <iframe
          data-reveal
          title={`Map to ${venue.en}`}
          src={venue.mapEmbedUrl}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl border-4 border-white/80 shadow-lg shadow-maroon/10"
        />
      </div>
    </Section>
  )
}

export function Rsvp() {
  const { formUrl, whatsapp, deadline } = invite.rsvp
  if (!formUrl && !whatsapp) return null
  const message = encodeURIComponent(
    `नमस्ते! ${invite.partnerOne.np} र ${invite.partnerTwo.np}को ${invite.occasion.np}मा म आउँदैछु।`,
  )
  const button = 'rounded-full px-8 py-3 text-lg transition-colors'
  return (
    <Section>
      <Heading np="तपाईं आउनुहुन्छ?" en="Will you join us?" />
      <p data-reveal className="mb-8 text-lg text-ink/70">{deadline}</p>
      <div data-reveal className="flex flex-wrap justify-center gap-4">
        {formUrl && (
          <a href={formUrl} target="_blank" rel="noreferrer" className={`${button} bg-maroon text-cream hover:bg-maroon-deep`}>
            जानकारी दिनुहोस् · RSVP
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className={`${button} border border-maroon text-maroon hover:bg-maroon hover:text-cream`}
          >
            WhatsApp
          </a>
        )}
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
        <p data-reveal className="font-display text-xl leading-snug sm:text-3xl">{invite.closing.np}</p>
        <p data-reveal className="mt-2 text-sm text-cream/65">{invite.closing.en}</p>
        <p data-reveal className="mt-5 font-display text-lg text-gold-light sm:text-2xl">{invite.familyLine.np}</p>
        <p data-reveal className="mt-1 text-sm text-cream/65">{invite.familyLine.en}</p>
      </div>
      <Band />
    </footer>
  )
}
