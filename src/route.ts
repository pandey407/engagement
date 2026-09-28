// Which event and side this URL is (see src/events/index.ts); null on the bare domain or unknown paths.
import { fromPath } from './events'

export const route = fromPath(location.pathname)
