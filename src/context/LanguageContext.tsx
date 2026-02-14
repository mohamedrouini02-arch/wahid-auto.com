import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations } from '../i18n'

type Language = 'ar' | 'fr'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('wahid-auto-lang')
        return (saved === 'ar' || saved === 'fr') ? saved : 'ar'
    })

    useEffect(() => {
        localStorage.setItem('wahid-auto-lang', language)
        document.documentElement.lang = language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }, [language])

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: unknown = translations[language]
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = (value as Record<string, unknown>)[k]
            } else {
                return key
            }
        }
        return typeof value === 'string' ? value : key
    }

    const isRTL = language === 'ar'

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) throw new Error('useLanguage must be used within LanguageProvider')
    return context
}
