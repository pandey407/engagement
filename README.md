# Invites

Event invites on **invite.ashleshpandey.com.np**, hosted on GitHub Pages from `pandey407/engagement`.
The bare domain is intentionally blank; each event lives on its own path, with one link per side:

| Link | Who sends it | Names | Closing |
|---|---|---|---|
| `/engagement` | both families | Aarusha first | both families |
| `/engagement/aarusha` | bride's side | Aarusha first | bride's family |
| `/engagement/ashlesh` | groom's side | Ashlesh first | Pandey family |

Add `?lang=en` to open in English, `?open` to skip the envelope.

## How it's organised

Every event opens with the **same envelope** (maroon damask, Ganesh drawing himself, the shloka forming from
gold dust, the lotus wax seal). What's inside is each event's **own design**.

```
src/App.tsx               shell: route → shared envelope + that event's page (loaded only on its pages)
src/envelope/             the shared opening envelope, its art and styles (envelope.css)
src/events/index.ts       registry + routing: /<event>[/<side>], name order per side, page titles/previews
src/events/engagement/    everything for this event:
  content.ts              ALL of its text, its sides (name order + closing), and its Google Fonts
  Invite.tsx              its page below the envelope (receives `opened` / `revealing` from the shell)
  components/ assets/     its sections and art
  theme.css               its styles (imported from src/index.css)
scripts/                  shared tools (envelope art, preview receiver); scripts/<event>/ for event art
design/envelope/, design/<event>/   source artwork
```

**Edit the engagement text:** `src/events/engagement/content.ts`.

**A new event (e.g. a wedding) with a new design:**
1. Create `src/events/wedding/` with a `content.ts` (same basic fields as the engagement's: `slug`,
   `couple`, `sides`, `and`, `occasion`, `shloka`, `invocation`, `openLabel`, `fonts`, …) and an `Invite.tsx`
   default-exporting the page (props `{ opened, revealing }`). Components, assets and a `theme.css` as needed.
2. Add it to the list in `src/events/index.ts`, and `@import` its `theme.css` in `src/index.css`.
3. It's live at `/wedding`, `/wedding/aarusha`, `/wedding/ashlesh` with the shared envelope in front.

**WhatsApp previews** (`public/previews/<event>-<side>.jpg`): after changing names, occasion or date,
`python3 scripts/save-preview.py &`, `node scripts/engagement/make-preview.mjs`, then open
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

- `src/envelope/assets/ganesh.svg`: our Ganesh line art traced to vector (`scripts/trace-ganesh.py`, source `design/envelope/ganesh.jpg`).
  It uses `currentColor`, so it takes the surrounding text colour.
- `src/events/engagement/assets/frame/arch-{top,mid,bottom}.webp`: our generated arched lotus card (`design/engagement/frame-arch-hires.jpeg`), cut out and sliced (top / stretchable middle / bottom) by `scripts/engagement/cut-frame.py`.
- `src/events/engagement/assets/divider/divider.webp`: our generated lotus-and-gold-vine divider (`design/engagement/divider.jpeg`), cut out by `scripts/engagement/cut-painted.py`.
- `src/events/engagement/assets/clouds/cloud-{1,2,3}.webp`: our generated watercolour clouds (`design/engagement/clouds.jpeg`), cut out and split by `scripts/engagement/cut-clouds.py`.
- `src/events/engagement/assets/border/tile.webp`: one seamless repeat of our generated lotus border strip (`design/engagement/border.jpeg`), cut by `scripts/engagement/cut-border.py`.
- `src/envelope/assets/seal-outline.svg`: the seal's wavy edge traced to vector (`scripts/trace-seal-outline.py`), used for the ripple rings.
- `src/events/engagement/assets/frame/closing.webp`: our generated wide pink closing card (`design/engagement/frame-closing.jpeg`), cut out by `scripts/engagement/cut-seal.py design/engagement/frame-closing.jpeg src/events/engagement/assets/frame/closing.webp 5`.
- `src/envelope/assets/seal.webp`, `paper.webp`: the shared envelope's lotus wax seal and maroon damask paper (`design/envelope/`).
