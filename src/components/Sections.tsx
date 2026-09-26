import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { invite } from '../config'
import { art, type ArtName } from '../lib/art'
import { PatanSkyline } from './Art'

const NP_DIGITS = '०१२३४५६७८९'
const toNepaliDigits = (s: string) => s.replace(/\d/g, (d) => NP_DIGITS[Number(d)])

function Ornament({ name, className = '' }: { name: ArtName; className?: string }) {
  return <img src={art(name)} alt="" aria-hidden draggable={false} className={`pointer-events-none select-none ${className}`} />
}

function Band() {
  return <div className="band" style={{ '--band': `url(${art('border-tile')})` } as CSSProperties} />
}

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
      <Ornament name="divider-lotus" className="mt-3 w-48" />
    </div>
  )
}

function Sub({ children }: { children: ReactNode }) {
  return children ? <p className="text-sm text-ink/55">{children}</p> : null
}

export function Hero() {
  return (
    <header className="relative overflow-hidden pb-16">
      <Band />
      {/* Hanging garlands and lanterns across the top. */}
      <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-between px-[2%]">
        <Ornament name="garland-lotus" className="sway w-14 sm:w-20" />
        <Ornament name="lantern-1" className="sway mt-[-10px] hidden w-10 sm:block" />
        <Ornament name="lantern-2" className="sway mt-[-10px] hidden w-10 sm:block" />
        <Ornament name="garland-blossom" className="sway w-14 sm:w-20" />
      </div>

      <div
        className="relative mx-auto mt-10 flex flex-col items-center px-[11%] pt-[calc(var(--w)*0.2)] pb-[calc(var(--w)*0.52)] text-center"
        style={{ '--w': 'min(88vw, 30rem)', width: 'var(--w)', '--frame': `url(${art('frame-pink')})` } as CSSProperties}
      >
        <div className="arch-frame absolute inset-0 -z-10" />
        <Ornament name="ganesh-maroon" className="w-[24%]" />
        <p data-reveal className="mt-2 font-display text-lg text-maroon">{invite.invocation}</p>
        <p data-reveal className="mt-2 font-display text-3xl text-lotus">{invite.occasion.np}</p>
        <p data-reveal className="text-[10px] tracking-[0.3em] text-gold uppercase">{invite.occasion.en}</p>

        <h1 data-reveal className="mt-8 font-display text-5xl leading-tight text-maroon sm:text-6xl">
          {invite.partnerOne.np}
          <span className="block text-3xl text-gold">र</span>
          {invite.partnerTwo.np}
        </h1>
        <p data-reveal className="mt-2 text-xs tracking-widest text-ink/60 uppercase">
          {invite.partnerOne.en} &amp; {invite.partnerTwo.en}
        </p>

        <Ornament name="divider-lotus" className="my-5 w-40" />
        <p data-reveal className="text-base leading-relaxed text-ink/80">{invite.blessing.np}</p>
        <div data-reveal className="mt-1">
          <Sub>{invite.blessing.en}</Sub>
        </div>

        <p data-reveal className="mt-6 text-xl font-semibold text-maroon">{invite.dateLabel.np}</p>
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
    <section className="relative overflow-hidden pt-20 text-center">
      <Ornament name="blossom-branch" className="absolute top-6 -left-8 w-32 opacity-80 sm:w-44" />
      <Ornament name="blossom-sprig" className="absolute top-6 -right-6 w-28 -scale-x-100 opacity-80 sm:w-40" />
      <div className="relative mx-auto max-w-2xl px-6">
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
      <div className="relative mx-auto mt-10 w-[160%] max-w-none -translate-x-[18.75%] sm:w-full sm:max-w-5xl sm:translate-x-0">
        <Ornament name="clouds" className="drift absolute top-0 left-[8%] w-[45%] opacity-80" />
        <Ornament name="clouds" className="drift absolute top-[12%] right-[4%] w-[35%] -scale-x-100 opacity-60 [animation-delay:-7s]" />
        <PatanSkyline className="relative block w-full pt-[8%]" />
      </div>
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
    <Section>
      <Heading np="कार्यक्रम" en="The day" />
      <Ornament name="diya" className="-mt-4 mb-4 w-16" />
      <p data-reveal className="mb-10 text-lg text-ink/70">{invite.dateLabel.np}</p>
      <ol className="w-full space-y-6">
        {invite.events.map((e) => (
          <li
            key={e.name}
            data-reveal
            className="relative overflow-hidden rounded-2xl border border-gold-light/60 bg-white/50 px-6 py-6 text-left sm:flex sm:items-baseline sm:gap-6"
          >
            <Ornament name="corner-right" className="absolute -right-2 -bottom-2 w-28 opacity-70" />
            <span className="relative text-2xl font-semibold whitespace-nowrap text-lotus">{e.time}</span>
            <div className="relative">
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
      <Ornament name="mandala" className="absolute top-10 left-1/2 w-[28rem] -translate-x-1/2 opacity-10" />
      <div className="relative flex w-full max-w-2xl flex-col items-center">
        <Heading np="स्थान" en="Where" />
        <h3 data-reveal className="font-display text-3xl text-maroon">{venue.name}</h3>
        <p data-reveal className="mt-1 text-lg text-ink/70">{venue.address}</p>
        <div data-reveal className="mb-8">
          <Sub>{venue.en}</Sub>
        </div>
        <div data-reveal className="relative w-full">
          <iframe
            title={`Map to ${venue.en}`}
            src={venue.mapEmbedUrl}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl border-4 border-white/70 shadow-lg shadow-maroon/10"
          />
          <Ornament name="lotus-bouquet" className="absolute -bottom-8 -left-8 w-32 sm:w-40" />
        </div>
        <a
          data-reveal
          href={venue.mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-12 text-lg text-maroon underline decoration-lotus underline-offset-4"
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
    <footer className="velvet relative overflow-hidden text-center text-cream">
      <Ornament name="garland-swag" className="mx-auto w-[min(90%,32rem)] pt-2" />
      <div className="relative px-6 pt-10 pb-40">
        <Ornament name="ganesh-gold" className="mx-auto mb-6 w-20" />
        <p data-reveal className="mx-auto max-w-xl font-display text-3xl leading-snug">{invite.closing.np}</p>
        <p data-reveal className="mt-3 text-sm text-cream/60">{invite.closing.en}</p>
        <p data-reveal className="mt-10 font-display text-2xl text-gold-light">{invite.familyLine.np}</p>
        <p data-reveal className="mt-1 text-sm text-cream/60">{invite.familyLine.en}</p>
      </div>
      <Ornament name="lotus-pond" className="absolute -bottom-2 -left-6 w-44 sm:w-56" />
      <Ornament name="lotus-pond" className="absolute -right-6 -bottom-2 w-40 -scale-x-100 sm:w-52" />
      <Band />
    </footer>
  )
}
