import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import archBottom from '../assets/frame/arch-bottom.webp'
import archMid from '../assets/frame/arch-mid.webp'
import archTop from '../assets/frame/arch-top.webp'
import maroonBottom from '../assets/frame/maroon-bottom.webp'
import maroonMid from '../assets/frame/maroon-mid.webp'
import maroonTop from '../assets/frame/maroon-top.webp'
import { invite } from '../config'
import { Band, Divider } from './Ornaments'

const NP_DIGITS = '०१२३४५६७८९'
const toNepaliDigits = (s: string) => s.replace(/\d/g, (d) => NP_DIGITS[Number(d)])

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
    <Section className="max-w-none bg-paper/40">
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
    <Section className="overflow-hidden">
      <Heading np="कार्यक्रम" en="The day" />
      <p data-reveal className="mb-10 text-lg text-ink/70">{invite.dateLabel.np}</p>
      <ol className="w-full space-y-6">
        {invite.events.map((e) => (
          <li
            key={e.name}
            data-reveal
            className="rounded-2xl border border-gold/40 bg-white/60 px-6 py-6 text-left shadow-sm shadow-maroon/5 sm:flex sm:items-baseline sm:gap-6"
          >
            <span className="text-2xl font-semibold whitespace-nowrap text-lotus">{e.time}</span>
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
    <Section className="max-w-none overflow-hidden bg-paper/40">
      <div className="relative flex w-full max-w-2xl flex-col items-center">
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
          className="aspect-[4/3] w-full rounded-2xl border-4 border-white/80 shadow-lg shadow-maroon/10"
        />
        <a
          data-reveal
          href={venue.mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-8 text-lg text-maroon underline decoration-lotus underline-offset-4"
        >
          नक्सामा हेर्नुहोस् · Open in Maps
        </a>
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
