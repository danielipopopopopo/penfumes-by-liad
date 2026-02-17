import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Translations = Record<string, Record<string, string>>;

interface I18nContextType {
    lang: 'en' | 'he';
    t: (key: string) => string;
    toggleLang: () => void;
    isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<'en' | 'he'>('he');
    const [translations, setTranslations] = useState<Translations>({});

    useEffect(() => {
        fetch('/translations.json')
            .then(res => res.json())
            .then(data => setTranslations(data))
            .catch(err => console.error('Failed to load translations:', err));
    }, []);

    const t = useCallback(
        (key: string) => translations[lang]?.[key] ?? key,
        [translations, lang]
    );

    const toggleLang = useCallback(() => {
        setLang(prev => (prev === 'en' ? 'he' : 'en'));
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    }, [lang]);

    return (
        <I18nContext.Provider value={{ lang, t, toggleLang, isRtl: lang === 'he' }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslations() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useTranslations must be used within I18nProvider');
    return ctx;
}
