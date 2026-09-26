import { useEffect, useState, type ReactNode } from 'react'
import { invite } from '../config'
import { ArchFrame, Bell, LotusSpray, PatanSkyline } from './Art'

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
    <header className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="dhaka" />
      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-[6%]">
        <Bell className="w-6 sm:w-8" drop={50} />
        <Bell className="w-5 sm:w-7" drop={90} />
        <Bell className="hidden w-6 sm:block sm:w-8" drop={30} />
        <Bell className="hidden w-5 sm:block sm:w-7" drop={80} />
        <Bell className="w-6 sm:w-8" drop={60} />
      </div>
      <LotusSpray className="absolute -bottom-4 -left-10 w-44 sm:w-64" />
      <LotusSpray className="absolute -right-10 -bottom-4 w-40 -scale-x-100 sm:w-60" />

      <div className="relative mx-auto mt-24 mb-20 flex w-[min(92%,34rem)] flex-1 flex-col items-center justify-center px-8 pt-24 pb-14 text-center">
        <ArchFrame className="absolute inset-0 -z-10 h-full w-full" />
        <p data-reveal className="font-display text-xl text-maroon">{invite.invocation}</p>
        <p data-reveal className="mt-3 font-display text-3xl text-lotus">{invite.occasion.np}</p>
        <p data-reveal className="mb-6 text-xs tracking-[0.3em] text-gold uppercase">{invite.occasion.en}</p>

        <h1 data-reveal className="font-display text-6xl leading-tight text-maroon sm:text-7xl">
          {invite.partnerOne.np}
          <span className="block text-3xl text-gold sm:text-4xl">र</span>
          {invite.partnerTwo.np}
        </h1>
        <p data-reveal className="mt-2 text-sm tracking-widest text-ink/60 uppercase">
          {invite.partnerOne.en} &amp; {invite.partnerTwo.en}
        </p>

        <p data-reveal className="mt-8 text-lg leading-relaxed text-ink/80">{invite.blessing.np}</p>
        <div data-reveal className="mt-2">
          <Sub>{invite.blessing.en}</Sub>
        </div>

        <p data-reveal className="mt-8 text-2xl font-semibold text-maroon">{invite.dateLabel.np}</p>
        <div data-reveal>
          <Sub>{invite.dateLabel.en}</Sub>
        </div>
      </div>
    </header>
  )
}

export function Story() {
  const { story } = invite
  return (
    <section className="relative overflow-hidden pt-24 text-center">
      <div className="mx-auto max-w-2xl px-6">
        <Heading np={story.heading.np} en={story.heading.en} />
        <p data-reveal className="font-display text-3xl text-lotus">{story.place.np}</p>
        <div data-reveal className="mb-6">
          <Sub>{story.place.en}</Sub>
        </div>
        <p data-reveal className="text-lg leading-relaxed text-ink/80">{story.np}</p>
        <div data-reveal className="mt-2">
          <Sub>{story.en}</Sub>
        </div>
      </div>
      <PatanSkyline className="mx-auto mt-12 block w-[160%] max-w-none -translate-x-[18.75%] sm:w-full sm:max-w-5xl sm:translate-x-0" />
    </section>
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
    <Section className="max-w-none bg-paper/70">
      <Heading np="शुभ साइत" en="Counting down" />
      <div data-reveal className="grid grid-cols-4 gap-3 sm:gap-6">
        {parts.map(([label, value]) => (
          <div key={label} className="flex flex-col items-center">
            <span className="text-4xl font-semibold text-maroon tabular-nums sm:text-6xl">
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
            className="rounded-2xl border border-gold/40 bg-white/50 px-6 py-5 text-left sm:flex sm:items-baseline sm:gap-6"
          >
            <span className="text-2xl font-semibold whitespace-nowrap text-gold">{e.time}</span>
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
    <Section className="max-w-none bg-paper/70">
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
        className="aspect-[4/3] w-full max-w-2xl rounded-2xl border border-gold/40"
      />
      <a
        data-reveal
        href={venue.mapLink}
        target="_blank"
        rel="noreferrer"
        className="mt-6 text-lg text-maroon underline decoration-lotus underline-offset-4"
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
    <footer className="velvet text-center text-cream">
      <div className="px-6 py-24">
        <p data-reveal className="mx-auto max-w-xl font-display text-3xl leading-snug">{invite.closing.np}</p>
        <p data-reveal className="mt-3 text-sm text-cream/60">{invite.closing.en}</p>
        <p data-reveal className="mt-10 font-display text-2xl text-lotus-light">{invite.familyLine.np}</p>
        <p data-reveal className="mt-1 text-sm text-cream/60">{invite.familyLine.en}</p>
      </div>
      <div className="dhaka" />
    </footer>
  )
}
