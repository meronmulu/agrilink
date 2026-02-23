import React from 'react'
import { Card, CardContent } from './ui/card'
import { BarChart3, Bot, Store } from 'lucide-react'

export default function MarketPlacePreview() {
  return (
     <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-16 mt-5 ">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Market Place Preview
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl ">
             Today featured products and services in the marketplace.
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
                Real-time Market Intelligence
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                Showcasing price transparency and data-driven insights. 
                Get accurate daily prices for crops across all major Ethiopian regions.
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
                Unified Marketplace
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                Connecting farmers and buyers directly to reduce post-harvest loss.
                Eliminate middlemen layers and maximize your profit margins.
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
                AI-Powered Support
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                Integrated AI Chatbot for expert guidance and agricultural questions
                available 24/7. Get advice on crop health and trading strategies.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 mb-6">
                <Bot className="text-green-600" size={24} />
              </div>

              <h3 className="text-lg font-semibold mb-3">
                AI-Powered Support
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed">
                Integrated AI Chatbot for expert guidance and agricultural questions
                available 24/7. Get advice on crop health and trading strategies.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
