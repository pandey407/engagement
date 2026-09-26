import { useEffect, useRef, useState } from 'react'
import { Intro } from './components/Intro'
import { Petals } from './components/Petals'
import { Closing, Details, Hero } from './components/Sections'
import { LangProvider, LangToggle } from './components/Lang'
import { revealOnScroll, startSmoothScroll } from './lib/motion'

export default function App() {
  // ?open skips the envelope (handy for testing or a direct link to the details).
  const [opened, setOpened] = useState(() => new URLSearchParams(location.search).has('open'))
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!opened || !main.current) return
    window.scrollTo(0, 0)
    const stopScroll = startSmoothScroll()
    const stopReveal = revealOnScroll(main.current)
    return () => {
      stopReveal()
      stopScroll()
    }
  }, [opened])

  return (
    <LangProvider>
      {!opened && <Intro onOpen={() => setOpened(true)} />}
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
