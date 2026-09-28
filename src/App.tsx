import { lazy, Suspense, useState, type ComponentType } from 'react'
import { LangProvider } from './components/LangProvider'
import { Envelope } from './envelope/Envelope'
import { resolve, type Side } from './events'
import { route } from './route'

// The shell: every event opens with the same envelope (src/envelope); the invite inside is each event's own
// design (src/events/<event>/Invite.tsx), loaded only on that event's pages.
type InvitePage = ComponentType<{ opened: boolean; revealing: boolean }>
const pages = import.meta.glob<{ default: InvitePage }>('./events/*/Invite.tsx')
const lazyPages: Record<string, InvitePage> = Object.fromEntries(
  Object.entries(pages).map(([path, load]) => [path.split('/')[2], lazy(load)]),
)

export default function App() {
  // Only event paths (/engagement, /engagement/aarusha, …) show an invite; the bare domain shows nothing.
  if (!route || !lazyPages[route.event]) return <main className="min-h-svh" />
  return <Shell event={route.event} side={route.side} />
}

function Shell({ event, side }: { event: string; side: Side }) {
  const text = resolve(event, side)
  const Page = lazyPages[event]
  // ?open skips the envelope (handy for testing or a direct link to the details).
  const [opened, setOpened] = useState(() => new URLSearchParams(location.search).has('open'))
  // The invite's fade-ups start as the envelope *begins* to open, so it rises into view between the flaps.
  const [revealing, setRevealing] = useState(opened)

  return (
    <LangProvider>
      {!opened && (
        <Envelope
          shloka={text.shloka}
          invocation={text.invocation}
          openLabel={text.openLabel}
          onOpenStart={() => setRevealing(true)}
          onOpen={() => setOpened(true)}
        />
      )}
      <Suspense fallback={null}>
        <Page opened={opened} revealing={revealing} />
      </Suspense>
    </LangProvider>
  )
}
