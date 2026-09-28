import { useEffect, useRef } from 'react'
import { revealOnScroll, ScrollTrigger, startSmoothScroll } from '../../lib/motion'
import { LangToggle } from './components/LangToggle'
import { Petals } from './components/Petals'
import { Closing, Details, Hero } from './components/Sections'
import { preloadFonts } from './fonts'

// The engagement invite's own page (everything below the shared envelope). The shell (src/App.tsx) tells it
// when the envelope starts opening (`revealing`: start the fade-ups) and when it has opened (`opened`).
export default function Invite({ opened, revealing }: { opened: boolean; revealing: boolean }) {
  const main = useRef<HTMLElement>(null)

  // Fetch every font face (both languages) while the envelope plays, so the language toggle never flashes.
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
    <>
      {opened && <Petals />}
      {opened && <LangToggle />}
      <main ref={main} className={opened ? '' : 'h-svh overflow-hidden'}>
        <Hero />
        <Details />
        <Closing />
      </main>
    </>
  )
}
