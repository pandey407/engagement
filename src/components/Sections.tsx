import { useEffect, useState, type ReactNode } from 'react'
import { invite } from '../config'

const NP_DIGITS = '०१२३४५६७८९'
const toNepaliDigits = (s: string) => s.replace(/\d/g, (d) => NP_DIGITS[Number(d)])

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center ${className}`}>
      {children}
    </section>
  )
}

function Heading({ np, en }: { np: string; en: string }) {
  return (
    <div data-reveal className="mb-10 flex flex-col items-center">
      <h2 className="ornament font-display text-4xl text-maroon sm:text-5xl">{np}</h2>
      <p className="mt-2 text-xs tracking-[0.3em] text-gold uppercase">{en}</p>
    </div>
  )
}

function Sub({ children }: { children: ReactNode }) {
  return children ? <p className="text-sm text-ink/55">{children}</p> : null
}

export function Hero() {
  return (
    <header className="relative flex min-h-svh flex-col">
      <div className="dhaka" />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p data-reveal className="font-display text-xl text-sindoor">{invite.invocation}</p>
        <p data-reveal className="mt-4 font-display text-3xl text-marigold">{invite.occasion.np}</p>
        <p data-reveal className="mb-8 text-xs tracking-[0.3em] text-gold uppercase">{invite.occasion.en}</p>

        <h1 data-reveal className="font-display text-6xl leading-tight text-maroon sm:text-8xl">
          {invite.partnerOne.np}
          <span className="block text-4xl text-marigold sm:text-5xl">र</span>
          {invite.partnerTwo.np}
        </h1>
        <p data-reveal className="mt-3 text-sm tracking-widest text-ink/60 uppercase">
          {invite.partnerOne.en} &amp; {invite.partnerTwo.en}
        </p>

        <p data-reveal className="mt-10 max-w-md text-lg leading-relaxed text-ink/80">{invite.blessing.np}</p>
        <div data-reveal className="mt-2 max-w-md">
          <Sub>{invite.blessing.en}</Sub>
        </div>

        <p data-reveal className="mt-10 text-2xl font-semibold text-sindoor">{invite.dateLabel.np}</p>
        <div data-reveal>
          <Sub>{invite.dateLabel.en}</Sub>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gold" aria-hidden>
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
  return [
    ['दिन', Math.floor(diff / 86_400_000)],
    ['घण्टा', Math.floor(diff / 3_600_000) % 24],
    ['मिनेट', Math.floor(diff / 60_000) % 60],
    ['सेकेन्ड', Math.floor(diff / 1000) % 60],
  ] as const
}

export function Countdown() {
  const parts = useCountdown(invite.date)
  return (
    <Section className="max-w-none bg-paper">
      <Heading np="शुभ साइत" en="Counting down" />
      <div data-reveal className="grid grid-cols-4 gap-3 sm:gap-6">
        {parts.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-4xl font-semibold text-sindoor tabular-nums sm:text-6xl">
              {toNepaliDigits(String(value).padStart(2, '0'))}
            </span>
            <span className="mt-1 text-sm text-ink/60">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

export function Events() {
  return (
    <Section>
      <Heading np="कार्यक्रम" en="The day" />
      <p data-reveal className="mb-10 text-lg text-ink/70">{invite.dateLabel.np}</p>
      <ol className="w-full space-y-6">
        {invite.events.map((e) => (
          <li
            key={e.name}
            data-reveal
            className="rounded-2xl border border-marigold/40 bg-white/50 px-6 py-5 text-left sm:flex sm:items-baseline sm:gap-6"
          >
            <span className="text-2xl font-semibold whitespace-nowrap text-marigold">{e.time}</span>
            <div>
              <h3 className="font-display text-2xl text-maroon">{e.name}</h3>
              <Sub>{e.en}</Sub>
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
    <Section className="max-w-none bg-paper">
      <Heading np="स्थान" en="Where" />
      <h3 data-reveal className="font-display text-3xl text-maroon">{venue.name}</h3>
      <p data-reveal className="mt-1 text-lg text-ink/70">{venue.address}</p>
      <div data-reveal className="mb-8">
        <Sub>{venue.en}</Sub>
      </div>
      <iframe
        data-reveal
        title={`Map to ${venue.en}`}
        src={venue.mapEmbedUrl}
        loading="lazy"
        className="aspect-[4/3] w-full max-w-2xl rounded-2xl border border-marigold/40"
      />
      <a
        data-reveal
        href={venue.mapLink}
        target="_blank"
        rel="noreferrer"
        className="mt-6 text-lg text-sindoor underline decoration-marigold underline-offset-4"
      >
        नक्सामा हेर्नुहोस् · Open in Maps
      </a>
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
          <a href={formUrl} target="_blank" rel="noreferrer" className={`${button} bg-sindoor text-cream hover:bg-maroon`}>
            जानकारी दिनुहोस् · RSVP
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${message}`}
            target="_blank"
            rel="noreferrer"
            className={`${button} border border-sindoor text-sindoor hover:bg-sindoor hover:text-cream`}
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
    <footer className="bg-maroon-deep text-center text-cream">
      <div className="px-6 py-24">
        <p data-reveal className="mx-auto max-w-xl font-display text-3xl leading-snug">{invite.closing.np}</p>
        <p data-reveal className="mt-3 text-sm text-cream/60">{invite.closing.en}</p>
        <p data-reveal className="mt-10 font-display text-2xl text-marigold">{invite.familyLine.np}</p>
        <p data-reveal className="mt-1 text-sm text-cream/60">{invite.familyLine.en}</p>
      </div>
      <div className="dhaka" />
    </footer>
  )
}
