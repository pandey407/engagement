import { useEffect, useState, type ReactNode } from 'react'
import { invite } from '../config'

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center ${className}`}>
      {children}
    </section>
  )
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 data-reveal className="ornament mb-10 font-display text-3xl text-maroon sm:text-4xl">
      {children}
    </h2>
  )
}

export function Hero() {
  return (
    <header className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p data-reveal className="mb-6 max-w-md text-sm leading-relaxed text-ink/70">
        {invite.blessing}
      </p>
      <h1 data-reveal className="font-display text-6xl leading-none text-maroon sm:text-8xl">
        {invite.partnerOne}
        <span className="my-2 block text-4xl text-gold italic sm:text-5xl">&amp;</span>
        {invite.partnerTwo}
      </h1>
      <p data-reveal className="mt-6 font-display text-xl text-ink/80 italic">
        {invite.headline}
      </p>
      <p data-reveal className="mt-10 text-xs tracking-[0.3em] text-gold uppercase">
        {invite.dateLabel}
      </p>
      <div className="absolute bottom-8 animate-bounce text-gold" aria-hidden>
        ↓
      </div>
    </header>
  )
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, new Date(target).getTime() - now)
  return {
    Days: Math.floor(diff / 86_400_000),
    Hours: Math.floor(diff / 3_600_000) % 24,
    Minutes: Math.floor(diff / 60_000) % 60,
    Seconds: Math.floor(diff / 1000) % 60,
  }
}

export function Countdown() {
  const parts = useCountdown(invite.date)
  return (
    <Section className="bg-paper max-w-none">
      <Heading>Counting down</Heading>
      <div data-reveal className="grid grid-cols-4 gap-3 sm:gap-6">
        {Object.entries(parts).map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-display text-4xl text-maroon tabular-nums sm:text-6xl">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[10px] tracking-widest text-ink/60 uppercase sm:text-xs">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function Events() {
  return (
    <Section>
      <Heading>The day</Heading>
      <p data-reveal className="mb-10 text-ink/70">{invite.dateLabel}</p>
      <ol className="w-full space-y-6">
        {invite.events.map((e) => (
          <li
            key={e.name}
            data-reveal
            className="rounded-2xl border border-gold/30 bg-white/40 px-6 py-5 text-left sm:flex sm:items-baseline sm:gap-6"
          >
            <span className="font-display text-2xl text-gold">{e.time}</span>
            <div>
              <h3 className="font-display text-xl text-maroon">{e.name}</h3>
              <p className="text-sm text-ink/70">{e.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Venue() {
  const { venue } = invite
  return (
    <Section className="bg-paper max-w-none">
      <Heading>Where</Heading>
      <h3 data-reveal className="font-display text-2xl text-maroon">{venue.name}</h3>
      <p data-reveal className="mt-2 mb-8 text-ink/70">{venue.address}</p>
      <iframe
        data-reveal
        title={`Map to ${venue.name}`}
        src={venue.mapEmbedUrl}
        loading="lazy"
        className="aspect-[4/3] w-full max-w-2xl rounded-2xl border border-gold/30"
      />
      <a
        data-reveal
        href={venue.mapLink}
        target="_blank"
        rel="noreferrer"
        className="mt-6 text-sm tracking-widest text-maroon uppercase underline decoration-gold underline-offset-4"
      >
        Open in Maps
      </a>
    </Section>
  )
}

export function Rsvp() {
  const { formUrl, whatsapp, deadline } = invite.rsvp
  if (!formUrl && !whatsapp) return null
  const message = encodeURIComponent(`Hi! I'll be there for ${invite.partnerOne} & ${invite.partnerTwo}'s engagement.`)
  const button =
    'rounded-full px-8 py-3 text-sm tracking-widest uppercase transition-colors'
  return (
    <Section>
      <Heading>Will you join us?</Heading>
      <p data-reveal className="mb-8 text-ink/70">{deadline}</p>
      <div data-reveal className="flex flex-wrap justify-center gap-4">
        {formUrl && (
          <a href={formUrl} target="_blank" rel="noreferrer" className={`${button} bg-maroon text-cream hover:bg-maroon-deep`}>
            RSVP
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
    <footer className="bg-maroon-deep px-6 py-24 text-center text-cream">
      <p data-reveal className="font-display text-3xl italic">{invite.closing}</p>
      <p data-reveal className="mt-6 text-sm tracking-widest text-gold uppercase">{invite.familyLine}</p>
    </footer>
  )
}
