'use client'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'am' | 'om';
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  loading: boolean;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

// Simple in-memory cache for loaded locales
const localeCache: Record<string, Record<string, string> | null> = {
  en: null,
  am: null,
  om: null,
};

async function loadLocaleFile(lang: Lang) {
  if (localeCache[lang]) return localeCache[lang]!;
  // dynamic import ensures lazy loading of JSON per language
  const mod = await import(`@/locales/${lang}.json`);
  const data = mod.default ?? mod;
  localeCache[lang] = data;
  return data;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('lang') as Lang) || 'en';
  });
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadLocaleFile(lang)
      .then((data) => {
        if (!mounted) return;
        setTranslations(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setTranslations(null);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new Event('languageChange'));
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(
    () => (key: string) => {
      if (!translations) return key;
      return translations[key] ?? key;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}