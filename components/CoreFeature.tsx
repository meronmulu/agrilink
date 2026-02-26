'use client'

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Store, Bot } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Real-time Market Intelligence",
    description:
      "Showcasing price transparency and data-driven insights. Get accurate daily prices for crops across all major Ethiopian regions.",
  },
  {
    icon: Store,
    title: "Unified Marketplace",
    description:
      "Connecting farmers and buyers directly to reduce post-harvest loss. Eliminate middlemen layers and maximize your profit margins.",
  },
  {
    icon: Bot,
    title: "AI-Powered Support",
    description:
      "Integrated AI Chatbot for expert guidance and agricultural questions available 24/7. Get advice on crop health and trading strategies.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 mt-5">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Our Core Features
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Designed to address information gaps and unfair pricing in the agricultural sector 
            through modern technology.
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
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
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