'use client'

import { redirect } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function MessageRootPage() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center justify-center h-full text-gray-500">
      {t('select_conversation') || 'Select a conversation from the sidebar to start chatting.'}
    </div>
  );
}
