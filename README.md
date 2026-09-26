# Engagement e-invite

Live at **https://invite.ashleshpandey.com.np**, hosted on GitHub Pages from `pandey407/engagement`.

## Edit the invite

All text (names, date, events, venue, RSVP links) is in `src/config.ts`.
Add a 1200×630 `public/thumbnail.png` for WhatsApp/Messenger link previews.

```bash
npm install
npm run dev
```

## Deploy

Every push to `main` builds and deploys via `.github/workflows/deploy.yml`.

## One-time setup

1. **Cloudflare**: add `ashleshpandey.com.np` as a site (Free plan). Its nameservers must match
   the ones set at register.com.np (currently `nadia` / `roan`.ns.cloudflare.com).
2. **Cloudflare DNS**: `CNAME` · name `invite` · target `pandey407.github.io` · **DNS only (grey cloud)**.
3. **GitHub repo → Settings → Pages**: Source = *GitHub Actions*. Custom domain = `invite.ashleshpandey.com.np`
   (also stored in `public/CNAME`). Tick *Enforce HTTPS* once the certificate is issued.
4. **GitHub account → Settings → Pages → Add a domain**: verify `ashleshpandey.com.np` with the TXT record it gives you.

## Theme art

- `src/assets/ganesh.svg`: our Ganesh line art traced to vector (`scripts/trace-ganesh.py`, source `design/ganesh.jpg`).
  It uses `currentColor`, so it takes the surrounding text colour.
- `src/assets/frame/arch-{top,mid,bottom}.webp`: our generated arched lotus card (`design/frame-arch-hires.jpeg`), cut out and sliced (top / stretchable middle / bottom) by `scripts/cut-frame.py`.
- Dividers, border pattern: hand-drawn SVG in `src/components/Ornaments.tsx`.
- `src/assets/seal/seal.webp`: our generated lotus wax seal (`design/seal.jpg`), cut out by `scripts/cut-seal.py`.
- `src/assets/divider/divider.webp`: our generated lotus-and-gold-vine divider (`design/divider.jpeg`), cut out by `scripts/cut-divider.py`.
- `src/assets/frame/maroon-{top,mid,bottom}.webp`: our generated maroon arched card (`design/frame-maroon.jpeg`), cut out and sliced by `scripts/cut-maroon.py`.
- `src/assets/envelope/paper.webp`: our generated maroon damask envelope paper (`design/envelope.jpeg`), resized to 1600 px.
