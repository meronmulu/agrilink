// lib/i18n.ts
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'am', 'om'],
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json'
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: true }
    });
}

export default i18n;