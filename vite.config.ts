import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { invite } from './src/content.ts'

// Fills the %NAME% placeholders in index.html (title, link preview) from src/content.ts.
function contentMeta(): Plugin {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const values: Record<string, string> = {
    TITLE: invite.meta.title,
    PREVIEW_TITLE: invite.meta.previewTitle,
    DESCRIPTION: invite.meta.description,
    SITE_URL: invite.meta.siteUrl,
  }
  return {
    name: 'content-meta',
    transformIndexHtml: (html) => html.replace(/%([A-Z_]+)%/g, (m, key: string) => (key in values ? escape(values[key]) : m)),
  }
}

// Served from the root of invite.ashleshpandey.com.np, so base stays '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), contentMeta()],
})
