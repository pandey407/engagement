// ALL TEXT ON THE INVITE LIVES IN THIS FILE. Edit here; nothing else needs to change.
// Pairs like { np, en }: `np` is the main Nepali line, `en` the small English line under it ('' hides it).
// Save the file and the page updates (npm run dev), or push to publish.

export const invite = {
  // ── Page title & link preview (browser tab, WhatsApp/Messenger preview) ──────────────
  meta: {
    title: 'आरुषा र आश्लेष · शुभ सगाई',
    previewTitle: "आरुषा र आश्लेष · Aarusha & Ashlesh's Engagement",
    description: 'Join us as we celebrate the engagement of Aarusha & Ashlesh.',
    siteUrl: 'https://invite.ashleshpandey.com.np/',
  },

  // ── Opening envelope ───────────────────────────────────────────────────────────────
  // Shown under the seal, followed by the invocation below.
  shloka: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
  invocation: 'श्री गणेशाय नमः', // also shown at the top of the name card
  openLabel: 'Open invitation', // read out by screen readers for the seal button

  // ── Name card ──────────────────────────────────────────────────────────────────────
  // Aarusha is named first everywhere (names, page title, link preview).
  partnerOne: { np: 'आरुषा', en: 'Aarusha' },
  partnerTwo: { np: 'आश्लेष', en: 'Ashlesh' },
  and: { np: 'र', en: '&' }, // between the two names
  occasion: { np: 'फूलमाला', en: 'Engagement Ceremony' },
  blessing: {
    np: 'परिवारजनको आशीर्वादसहित हाम्रो नयाँ जीवनको सुरुवातको यस शुभ अवसरमा यहाँहरूको गरिमामय उपस्थितिको हार्दिक अनुरोध गर्दछौं।',
    en: 'With the blessings of our families, we request the honour of your presence.',
  },

  // ── When & where ───────────────────────────────────────────────────────────────────
  details: {
    heading: { np: 'शुभ साइत', en: 'When & where' },
    dateTimeLabel: { np: 'मिति र समय', en: 'Date & time' },
    venueLabel: { np: 'स्थान', en: 'Venue' },
  },
  // Placeholder BS date: confirm against a patro before sharing. Also shown on the name card.
  dateLabel: { np: 'असोज २६, २०८३ शनिबार', en: 'Saturday, 12 December 2026' },
  time: { np: 'बिहान ११:०० बजे', en: '11:00 AM' },
  venue: {
    name: 'स्थानको नाम',
    address: 'ठेगाना, काठमाडौं',
    en: 'Venue Name, Kathmandu',
    // Google Maps → Share → Embed a map → copy the src="..." URL
    mapEmbedUrl: 'https://www.google.com/maps?q=Kathmandu&output=embed',
    // Google Maps → Share → Copy link (tapping the venue name opens this)
    mapLink: 'https://maps.google.com/?q=Kathmandu',
    mapTitle: 'Map to the venue', // read out by screen readers
  },

  // ── Closing card ───────────────────────────────────────────────────────────────────
  closing: { np: 'यहाँहरूको उपस्थिति नै हाम्रो लागि सबैभन्दा ठूलो उपहार हो।', en: 'Your presence is the greatest gift.' },
  familyLine: { np: 'विनीत: पाण्डे परिवार', en: 'With love, the Pandey family' },
}
