'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { BarChart3, Bot, Store } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function MarketPlacePreview() {
  const { t } = useLanguage()
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-16 mt-5 ">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {t('market_preview_title')}
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl ">
            {t('market_preview_subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-4">

          {/* Card 1 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 mb-6">
                <BarChart3 className="text-green-600" size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                {t('coreFeature_title1')}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t('coreFeature_desc1')}
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 mb-6">
                <Store className="text-green-600" size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                {t('coreFeature_title2')}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t('coreFeature_desc2')}
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 mb-6">
                <Bot className="text-green-600" size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                {t('coreFeature_title3')}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t('coreFeature_desc3')}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 mb-6">
                <Bot className="text-green-600" size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                {t('coreFeature_title3')}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                {t('coreFeature_desc3')}
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
