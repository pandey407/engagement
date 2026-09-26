// Every piece of invite text lives here. Edit this file; the components read from it.

export const invite = {
  partnerOne: 'Ashlesh',
  partnerTwo: 'Partner Name',
  headline: 'are getting engaged',
  blessing:
    'With the blessings of our families, we invite you to celebrate the beginning of our forever.',

  // Countdown target. Use Nepal time (+05:45).
  date: '2026-12-12T11:00:00+05:45',
  dateLabel: 'Saturday, 12 December 2026',

  events: [
    {
      name: 'Engagement Ceremony',
      time: '11:00 AM',
      description: 'Ring exchange and blessings',
    },
    {
      name: 'Lunch',
      time: '1:00 PM',
      description: 'Join us for a meal together',
    },
  ],

  venue: {
    name: 'Venue Name',
    address: 'Street, Kathmandu, Nepal',
    // Google Maps → Share → Embed a map → copy the src="..." URL
    mapEmbedUrl: 'https://www.google.com/maps?q=Kathmandu&output=embed',
    // Google Maps → Share → Copy link
    mapLink: 'https://maps.google.com/?q=Kathmandu',
  },

  rsvp: {
    // Leave either empty to hide that button.
    formUrl: '', // e.g. a Google Form link
    whatsapp: '', // international format, digits only, e.g. '9779800000000'
    deadline: 'Please let us know by 1 December 2026',
  },

  closing: 'Your presence is the greatest gift.',
  familyLine: 'With love, the Pandey family',
}
