// This event's text for the side being viewed (/engagement, /engagement/aarusha, /engagement/ashlesh).
import { route } from '../../route'
import { resolve } from '../index'

export const invite = resolve('engagement', route?.side ?? 'both')
