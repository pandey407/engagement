import { useEffect, useState, type ReactNode } from 'react'
import { LANG_KEY, LangContext, initialLang, type Lang } from '../lib/lang'

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
