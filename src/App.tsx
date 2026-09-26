import { useEffect, useRef, useState } from 'react'
import { Intro } from './components/Intro'
import { Petals } from './components/Petals'
import { Closing, Countdown, Events, Hero, Rsvp, Venue } from './components/Sections'
import { revealOnScroll, startSmoothScroll } from './lib/motion'

export default function App() {
  const [opened, setOpened] = useState(false)
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
    <>
      {!opened && <Intro onOpen={() => setOpened(true)} />}
      {opened && <Petals />}
      <main ref={main} className={opened ? '' : 'h-svh overflow-hidden'}>
        <Hero />
        <Countdown />
        <Events />
        <Venue />
        <Rsvp />
        <Closing />
      </main>
    </>
  )
}
