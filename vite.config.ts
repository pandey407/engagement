import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { fromPath, resolve, routes } from './src/events/index.ts'

// Each event/side (/engagement/, /engagement/aarusha/, …) gets its own HTML page with its own title and
// WhatsApp/Messenger preview (filled into the %NAME% placeholders of index.html). The bare domain and
// unknown paths get a blank page with no invite details.
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function fill(html: string, path: string) {
  const m = fromPath(path.split('?')[0])
  if (!m) return html.replace(/<link href="%FONTS%"[^>]*>/, '').replace(/%[A-Z_]+%/g, '')
  const { meta, fonts } = resolve(m.event, m.side)
  const values: Record<string, string> = {
    TITLE: meta.title,
    PREVIEW_TITLE: meta.previewTitle,
    DESCRIPTION: meta.description,
    URL: meta.url,
    IMAGE: meta.image,
    FONTS: fonts,
  }
  return html.replace(/%([A-Z_]+)%/g, (all, key: string) => (key in values ? escape(values[key]) : all))
}

const BLANK = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" /><title>&#8203;</title><style>html,body{margin:0;height:100%;background:#faf4ea}</style></head><body></body></html>
`

function eventPages(): Plugin {
  return {
    name: 'event-pages',
    enforce: 'post',
    // Dev server: fill the page for whatever path is being visited.
    transformIndexHtml: { order: 'post', handler: (html, ctx) => (ctx.server ? fill(html, ctx.originalUrl ?? ctx.path) : html) },
    // Build: one filled copy per event/side, then blank the root and 404 pages.
    generateBundle: {
      order: 'post', // after Vite has emitted index.html
      handler(_, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset') return
        const html = String(index.source)
        for (const r of routes()) {
          this.emitFile({ type: 'asset', fileName: `${r.path.slice(1)}index.html`, source: fill(html, r.path) })
        }
        index.source = BLANK
        this.emitFile({ type: 'asset', fileName: '404.html', source: BLANK })
      },
    },
  }
}

// Served from the root of invite.ashleshpandey.com.np, so base stays '/' (assets resolve from any path).
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), eventPages()],
})
