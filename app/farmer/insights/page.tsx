'use client'

import React, { useState, useEffect } from "react";
import CropAdvisorChat from "@/components/CropAdvisorChat";
import { useLanguage } from "@/context/LanguageContext";

function InsightsSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="mb-4 shrink-0">
        <div className="h-7 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gray-200" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-48" />
          </div>
        </div>

        <div className="p-4 space-y-4 bg-gray-50/60">
          <div className="flex flex-col items-center py-8">
            <div className="h-16 w-16 rounded-2xl bg-gray-200 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-56 mb-6" />
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded-xl" style={{ width: `${100 + i * 30}px` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="h-10 w-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function FarmerInsightsPage() {
  const { t } = useLanguage()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return <InsightsSkeleton />
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 140px)' }}>
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold">{t('ai_insights') || 'AI Insights'}</h1>
        <p className="text-sm text-gray-500">{t('ai_insights_desc') || 'Get AI-powered crop and market advice'}</p>
      </div>
      <div className="flex-1 min-h-0">
        <CropAdvisorChat defaultLocation="Central Ethiopia" />
      </div>
    </div>
  );
}
