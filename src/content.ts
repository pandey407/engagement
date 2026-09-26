// ALL TEXT ON THE INVITE LIVES IN THIS FILE. Edit here; nothing else needs to change.
// Pairs like { np, en }: guests see ONE language at a time (toggle at the top right; Nepali by default,
// `?lang=en` in the link opens it in English). Write both versions of every pair.
// Save the file and the page updates (npm run dev), or push to publish.

export const invite = {
  // ── Page title & link preview (browser tab, WhatsApp/Messenger preview) ──────────────
  meta: {
    title: 'आरुषा र अश्लेष · फूलमाला',
    previewTitle: "आरुषा र अश्लेष · Aarusha & Ashlesh's Engagement",
    description: 'Join us as we celebrate the engagement of Aarusha & Ashlesh.',
    siteUrl: 'https://invite.ashleshpandey.com.np/',
  },

  // ── Opening envelope ───────────────────────────────────────────────────────────────
  // Sanskrit prayers: shown as written in both languages. Under the seal, then the invocation.
  shloka: ['वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥'],
  invocation: 'श्री गणेशाय नमः', // also shown at the top of the name card
  openLabel: 'Open invitation', // read out by screen readers for the seal button

  // ── Name card ──────────────────────────────────────────────────────────────────────
  // Aarusha is named first everywhere (names, page title, link preview).
  partnerOne: { np: 'आरुषा', en: 'Aarusha' },
  partnerTwo: { np: 'अश्लेष', en: 'Ashlesh' },
  and: { np: 'र', en: '&' }, // between the two names
  occasion: { np: 'फूलमाला', en: 'Engagement Ceremony' },
  blessing: {
    np: 'यहाँहरूको उपस्थिति र आशीर्वादले यो दिन अझ विशेष बनोस्।',
    en: 'May your presence and blessings make this day even more special.',
  },

  // ── When & where ───────────────────────────────────────────────────────────────────
  details: {
    heading: { np: 'शुभ साइत', en: 'When & where' },
    dateTimeLabel: { np: 'मिति र समय', en: 'Date & time' },
    venueLabel: { np: 'स्थान', en: 'Venue' },
  },
  // Placeholder BS date: confirm against a patro before sharing. Also shown on the name card.
  dateLabel: { np: 'असोज २६, २०८३ सोमवार', en: 'Monday, 12 October 2026' },
  time: { np: 'दिउँसो २:०० बजे', en: '2:00 PM' },
  venue: {
    name: { np: 'अक्वाकुनो', en: 'AquaKuno' },
    address: { np: 'हात्तीगौंडा (खत्री गाउँ), काठमाडौं', en: 'Hattigauda (Khatri Gaun), Kathmandu, Nepal' },
    // Google Maps → Share → Embed a map → copy the src="..." URL
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3530.6050939221896!2d85.3416597!3d27.760323999999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1f3d03bd1a5d%3A0xbc19213e48bac64!2sAquaKuno!5e0!3m2!1sen!2snp!4v1790441284980!5m2!1sen!2snp',
    // Google Maps → Share → Copy link (tapping the venue name opens this)
    mapLink: 'https://maps.google.com/?cid=847118819058756708', // AquaKuno's Google Maps place
    mapTitle: 'Map to AquaKuno', // read out by screen readers
  },

  // ── Closing card ───────────────────────────────────────────────────────────────────
  closing: { np: 'यहाँहरूको उपस्थिति नै हाम्रो लागि सबैभन्दा ठूलो उपहार हो।', en: 'Your presence is the greatest gift.' },
  familyLine: { np: 'विनीत: दुवै परिवार', en: 'With love, from both our families' }, // works for both sides
}
