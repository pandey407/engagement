import { useEffect, useRef, useState } from 'react'
import { Intro } from './components/Intro'
import { Petals } from './components/Petals'
import { Closing, Details, Hero } from './components/Sections'
import { LangProvider, LangToggle } from './components/Lang'
import { route } from './content'
import { preloadFonts } from './lib/fonts'
import { revealOnScroll, ScrollTrigger, startSmoothScroll } from './lib/motion'

export default function App() {
  // Only event paths (/engagement, /engagement/aarusha, …) show an invite; the bare domain shows nothing.
  if (!route) return <main className="min-h-svh" />
  return <Invite />
}

function Invite() {
  // ?open skips the envelope (handy for testing or a direct link to the details).
  const [opened, setOpened] = useState(() => new URLSearchParams(location.search).has('open'))
  // The page's fade-up animations start as the envelope *begins* to open, so the content rises into view
  // between the parting flaps instead of appearing first and animating afterwards.
  const [revealing, setRevealing] = useState(opened)
  const main = useRef<HTMLElement>(null)

  // Fetch every font face (both languages) during the envelope, so the language toggle never flashes.
  useEffect(() => {
    preloadFonts()
  }, [])

  useEffect(() => {
    if (!revealing || !main.current) return
    window.scrollTo(0, 0)
    return revealOnScroll(main.current)
  }, [revealing])

  useEffect(() => {
    if (!opened) return
    ScrollTrigger.refresh() // the page just became scrollable
    return startSmoothScroll()
  }, [opened])

  return (
    <LangProvider>
      {!opened && <Intro onOpenStart={() => setRevealing(true)} onOpen={() => setOpened(true)} />}
      {opened && <Petals />}
      {opened && <LangToggle />}
      <main ref={main} className={opened ? '' : 'h-svh overflow-hidden'}>
        <Hero />
        <Details />
        <Closing />
      </main>
    </LangProvider>
  )
}
