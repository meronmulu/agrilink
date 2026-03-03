'use client'

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Store, Bot } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    titleKey: "coreFeature_title1",
    descKey: "coreFeature_desc1",
  },
  {
    icon: Store,
    titleKey: "coreFeature_title2",
    descKey: "coreFeature_desc2",
  },
  {
    icon: Bot,
    titleKey: "coreFeature_title3",
    descKey: "coreFeature_desc3",
  },
]

import { useLanguage } from "@/context/LanguageContext"

export default function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section id="features" className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 mt-5">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {t('coreFeature_header')}
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            {t('coreFeature_subheader')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={index}
                className="rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <CardContent className="p-8">

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 mb-6">
                    <Icon className="text-green-600" size={24} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-3">
                    {t(feature.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t(feature.descKey)}
                  </p>

                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}