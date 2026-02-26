// components/ClientProviders.tsx
'use client'

import React, { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import i18n from '@/lib/i18n';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ensure i18n language matches persisted preference
    const lang = (typeof window !== 'undefined' && (localStorage.getItem('lang') || 'en')) as 'en' | 'am' | 'om';
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(lang).catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}