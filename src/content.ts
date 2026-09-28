// The invite for the page being viewed, chosen by the URL path (see src/events/index.ts).
// Edit the text in src/events/<event>.ts, not here.
import { fromPath, resolve } from './events'

export const route = fromPath(location.pathname) // null on the bare domain or an unknown path
export const invite = resolve(route?.event ?? '', route?.side ?? 'both')
