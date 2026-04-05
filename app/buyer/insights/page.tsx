'use client'

import React from "react";
import CropAdvisorChat from "@/components/CropAdvisorChat";
import { useLanguage } from "@/context/LanguageContext";

export default function BuyerInsightsPage() {
  const { t } = useLanguage()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('ai_insights') || 'AI Insights'}</h1>
      <CropAdvisorChat defaultLocation="Central Ethiopia" />
    </div>
  );
}
