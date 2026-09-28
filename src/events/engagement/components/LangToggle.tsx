import { useLang, type Lang } from '../../../lib/lang'

// Nepali / English switch for this event's invite (styled to its theme).
export function LangToggle() {
  const { lang, setLang } = useLang()
  const option = (l: Lang, label: string) => (
    <button
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`rounded-full px-3 py-1 transition-colors ${lang === l ? 'bg-maroon text-cream' : 'text-maroon hover:bg-maroon/10'}`}
    >
      {label}
    </button>
  )
  return (
    <div className="fixed top-14 right-3 z-40 flex gap-1 rounded-full border border-gold/50 bg-cream/90 p-1 text-sm shadow-md shadow-maroon/10 backdrop-blur sm:top-[4.5rem] sm:right-5">
      {option('np', 'नेपाली')}
      {option('en', 'English')}
    </div>
  )
}
