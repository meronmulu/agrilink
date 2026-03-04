'use client'

import React from 'react'
import { Card, CardContent } from './ui/card'
import { Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function CustomerSays() {
  const { t } = useLanguage()

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">{t('testi_title')}</h2>
        <p className="text-gray-500 mt-3">
          {t('testi_subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">

        {/* Testimonial 1 */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-8">

            {/* Stars */}
            <div className="flex mb-4 text-green-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('testi_1_desc')}
            </p>

            <div>
              <p className="font-semibold">{t('testi_1_name')}</p>
              <p className="text-xs text-gray-500">{t('testi_1_role')}</p>
            </div>

          </CardContent>
        </Card>

        {/* Testimonial 2 */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-8">

            <div className="flex mb-4 text-green-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('testi_2_desc')}
            </p>

            <div>
              <p className="font-semibold">{t('testi_2_name')}</p>
              <p className="text-xs text-gray-500">{t('testi_2_role')}</p>
            </div>

          </CardContent>
        </Card>

        {/* Testimonial 3 */}
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-8">

            <div className="flex mb-4 text-green-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t('testi_3_desc')}
            </p>

            <div>
              <p className="font-semibold">{t('testi_3_name')}</p>
              <p className="text-xs text-gray-500">{t('testi_3_role')}</p>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}