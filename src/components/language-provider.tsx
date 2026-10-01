'use client'

import * as React from 'react'
import type { Lang, TranslationKey } from '@/lib/i18n'
import { t as translate } from '@/lib/i18n'

type LanguageContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = React.createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'biralbond-lang'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Bengali ('bn') — matches the project requirement
  const [lang, setLangState] = React.useState<Lang>('bn')

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved === 'bn' || saved === 'en') {
        setLangState(saved)
      }
    } catch { /* ignore */ }
  }, [])

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch { /* ignore */ }
    // Update <html lang> attribute
    document.documentElement.lang = l === 'bn' ? 'bn' : 'en'
  }, [])

  const toggle = React.useCallback(() => {
    setLang(lang === 'bn' ? 'en' : 'bn')
  }, [lang, setLang])

  const t = React.useCallback((key: TranslationKey) => translate(key, lang), [lang])

  const value = React.useMemo(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    // Fallback — shouldn't happen but keeps SSR safe
    return {
      lang: 'bn' as Lang,
      setLang: () => {},
      toggle: () => {},
      t: (key: TranslationKey) => translate(key, 'bn'),
    }
  }
  return ctx
}
