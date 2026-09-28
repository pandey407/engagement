// Event registry and routing: /<event>[/<side>] → the invite text for that event and side.
// Pure data (no browser APIs), so the build (vite.config.ts) and scripts can use it too.
import { engagement } from './engagement.ts'

export const events = [engagement]
export type Event = (typeof events)[number]
export type Side = 'both' | 'bride' | 'groom'
const SIDES: Side[] = ['both', 'bride', 'groom']

/** Every page to publish: /engagement/, /engagement/aarusha/, … */
export function routes() {
  return events.flatMap((e) =>
    SIDES.map((side) => {
      const sub = e.sides[side].path
      return { event: e.slug, side, path: `/${e.slug}/${sub ? `${sub}/` : ''}` }
    }),
  )
}

/** Match a URL path to an event and side (null for anything else, e.g. the bare domain). */
export function fromPath(pathname: string) {
  const [slug, sub = ''] = pathname.split('/').filter(Boolean)
  const e = events.find((x) => x.slug === slug)
  if (!e) return null
  const side = SIDES.find((s) => e.sides[s].path === sub)
  return side ? { event: e.slug, side } : null
}

/** The invite for one event + side: names in that side's order, its sign-off, and page meta. */
export function resolve(slug: string, side: Side) {
  const e = events.find((x) => x.slug === slug) ?? events[0]
  const s = e.sides[side]
  const [first, second] = s.first === 'groom' ? [e.couple.groom, e.couple.bride] : [e.couple.bride, e.couple.groom]
  const path = `${e.slug}/${s.path ? `${s.path}/` : ''}`
  return {
    ...e,
    side,
    partnerOne: first,
    partnerTwo: second,
    familyLine: s.familyLine,
    meta: {
      title: `${first.np} ${e.and.np} ${second.np} · ${e.occasion.np}`,
      previewTitle: `${first.np} ${e.and.np} ${second.np} · ${first.en} & ${second.en}'s ${e.occasion.en}`,
      description: `Join us as we celebrate the ${e.occasion.en.toLowerCase()} of ${first.en} & ${second.en}.`,
      url: e.siteUrl + path,
      image: `${e.siteUrl}previews/${e.slug}-${side}.jpg`,
    },
  }
}
export type Invite = ReturnType<typeof resolve>
