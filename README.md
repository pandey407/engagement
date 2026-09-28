# Invites

Event invites on **invite.ashleshpandey.com.np**, hosted on GitHub Pages from `pandey407/engagement`.
The bare domain is intentionally blank; each event lives on its own path, with one link per side:

| Link | Who sends it | Names | Closing |
|---|---|---|---|
| `/engagement` | both families | Aarusha first | both families |
| `/engagement/aarusha` | bride's side | Aarusha first | bride's family |
| `/engagement/ashlesh` | groom's side | Ashlesh first | Pandey family |

Add `?lang=en` to open in English, `?open` to skip the envelope.

## Edit an event

All text for an event is in **`src/events/<event>.ts`** (e.g. `src/events/engagement.ts`): names, sides
(name order + closing per link), blessing, date, time, venue and map links, envelope shloka, headings.
Page titles and link previews are generated from it at build time.

A new event (e.g. a wedding): copy `src/events/engagement.ts` to `src/events/wedding.ts`, change `slug` and
the text, and add it to the list in `src/events/index.ts`. It then appears at `/wedding`, `/wedding/aarusha`, …

After changing names, occasion or date, regenerate the WhatsApp previews (`public/previews/*.jpg`):
`python3 scripts/save-preview.py &`, `node scripts/make-preview.mjs`, then open
http://localhost:5173/preview/ with `npm run dev` running.

```bash
npm install
npm run dev   # then open http://localhost:5173/engagement
```

## Deploy

Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.

## One-time setup

1. **Cloudflare**: add `ashleshpandey.com.np` as a site (Free plan). Its nameservers must match
   the ones set at register.com.np (`hayes` / `sunny`.ns.cloudflare.com).
2. **Cloudflare DNS**: `CNAME` · name `invite` · target `pandey407.github.io` · **DNS only (grey cloud)**.
3. **GitHub repo → Settings → Pages**: Source = *GitHub Actions*. Custom domain = `invite.ashleshpandey.com.np`
   (also stored in `public/CNAME`). Tick *Enforce HTTPS* once the certificate is issued.
4. **GitHub account → Settings → Pages → Add a domain**: verify `ashleshpandey.com.np` with the TXT record it gives you.

## Theme art

- `src/assets/ganesh.svg`: our Ganesh line art traced to vector (`scripts/trace-ganesh.py`, source `design/ganesh.jpg`).
  It uses `currentColor`, so it takes the surrounding text colour.
- `src/assets/frame/arch-{top,mid,bottom}.webp`: our generated arched lotus card (`design/frame-arch-hires.jpeg`), cut out and sliced (top / stretchable middle / bottom) by `scripts/cut-frame.py`.
- `src/assets/divider/divider.webp`: our generated lotus-and-gold-vine divider (`design/divider.jpeg`), cut out by `scripts/cut-painted.py`.
- `src/assets/clouds/cloud-{1,2,3}.webp`: our generated watercolour clouds (`design/clouds.jpeg`), cut out and split by `scripts/cut-clouds.py`.
- `src/assets/border/tile.webp`: one seamless repeat of our generated lotus border strip (`design/border.jpeg`), cut by `scripts/cut-border.py`.
- `src/assets/seal/outline.svg`: the seal's wavy edge traced to vector (`scripts/trace-seal-outline.py`), used for the ripple rings.
- `src/assets/envelope/pink-tile.webp`: one seamless repeat of our generated pink lotus damask (`design/envelope-pink.jpeg`), cut by `scripts/cut-envelope-tile.py`.
- `src/assets/frame/closing.webp`: our generated wide pink closing card (`design/frame-closing.jpeg`), cut out by `scripts/cut-seal.py design/frame-closing.jpeg src/assets/frame/closing.webp 5`.
