// Every piece of invite text lives here. Edit this file; the components read from it.
// `np` is shown large, `en` is the small English line underneath (leave '' to hide).

export const invite = {
  invocation: 'श्री गणेशाय नमः',
  // Shown under the seal on the opening envelope.
  shloka: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],

  // Aarusha is named first everywhere (names, WhatsApp message, page title).
  partnerOne: { np: 'आरुषा', en: 'Aarusha' },
  partnerTwo: { np: 'आश्लेष', en: 'Ashlesh' },
  occasion: { np: 'शुभ सगाई', en: 'Engagement Ceremony' },
  blessing: {
    np: 'परिवारजनको आशीर्वादसहित हाम्रो नयाँ जीवनको सुरुवातको यस शुभ अवसरमा यहाँहरूको गरिमामय उपस्थितिको हार्दिक अनुरोध गर्दछौं।',
    en: 'With the blessings of our families, we request the honour of your presence.',
  },

  // Placeholder BS date — confirm against a patro before sharing.
  dateLabel: { np: 'मङ्सिर २६, २०८३ शनिबार', en: 'Saturday, 12 December 2026' },

  time: { np: 'बिहान ११:०० बजे', en: '11:00 AM' },

  venue: {
    name: 'स्थानको नाम',
    address: 'ठेगाना, काठमाडौं',
    en: 'Venue Name, Kathmandu',
    // Google Maps → Share → Embed a map → copy the src="..." URL
    mapEmbedUrl: 'https://www.google.com/maps?q=Kathmandu&output=embed',
    // Google Maps → Share → Copy link (tapping the venue name opens this)
    mapLink: 'https://maps.google.com/?q=Kathmandu',
  },

  rsvp: {
    // Leave either empty to hide that button.
    formUrl: '', // e.g. a Google Form link
    whatsapp: '', // international format, digits only, e.g. '9779800000000'
    deadline: 'कृपया मङ्सिर १५ भित्र जानकारी दिनुहोला।',
  },

  closing: { np: 'यहाँहरूको उपस्थिति नै हाम्रो लागि सबैभन्दा ठूलो उपहार हो।', en: 'Your presence is the greatest gift.' },
  familyLine: { np: 'विनीत: पाण्डे परिवार', en: 'With love, the Pandey family' },
}
