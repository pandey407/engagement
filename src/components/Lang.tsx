import { useEffect, useState, type ReactNode } from 'react'
import { LANG_KEY, LangContext, initialLang, useLang, type Lang } from '../lib/lang'

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      // not persisted; fine
    }
  }
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ne'
  }, [lang])
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

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
