'use client'
import { Loader2 } from 'lucide-react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'am' | 'om';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  loading: boolean;
};

export const LanguageContext = createContext<Ctx | undefined>(undefined);

//  Memory cache
const localeCache: Record<string, Record<string, string> | null> = {
  en: null,
  am: null,
  om: null,
};

//  Load with cache + localStorage fallback
async function loadLocaleFile(lang: Lang) {
  // Try to fetch fresh data from public folder first (with cache busting for dev)
  try {
    const res = await fetch(`/locales/${lang}.json?t=${new Date().getTime()}`);
    const data = await res.json();

    // Update caches
    localeCache[lang] = data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(`locale-${lang}`, JSON.stringify(data));
    }

    return data;
  } catch (e) {
    console.error('Failed to load fresh locale, falling back to cache:', e);
    
    // 1. Memory cache
    if (localeCache[lang]) return localeCache[lang]!;

    // 2. localStorage cache
    const stored = typeof window !== 'undefined' && localStorage.getItem(`locale-${lang}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      localeCache[lang] = parsed;
      return parsed;
    }

    return {};
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('lang') as Lang) || 'en';
  });

  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTranslations = async () => {
      setLoading(true);

      const data = await loadLocaleFile(lang);

      if (!mounted) return;

      setTranslations(data);
      setLoading(false);
    };

    fetchTranslations();

    return () => {
      mounted = false;
    };
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      window.dispatchEvent(new Event('languageChange'));
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(
    () => (key: string) => {
      return translations[key] || key;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, loading }}>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
        </div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}