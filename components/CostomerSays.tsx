import React from 'react'
import { Card, CardContent } from './ui/card'
import { Star } from 'lucide-react'

export default function CustomerSays() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <p className="text-gray-500 mt-3">
          Real stories from farmers and buyers using AgriLink.
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
              "Before AgriLink, I had no idea what the real market price was.
              Now I sell my tomatoes with confidence and earn better profit.
              This platform changed my farming business."
            </p>

            <div>
              <p className="font-semibold">Abebe Tadesse</p>
              <p className="text-xs text-gray-500">Tomato Farmer, Jimma</p>
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
              "As a buyer, I can now connect directly with farmers without
              middlemen. The communication is smooth and transactions are
              secure. AgriLink saves me time and money."
            </p>

            <div>
              <p className="font-semibold">Mekdes Alemu</p>
              <p className="text-xs text-gray-500">Wholesale Buyer, Addis Ababa</p>
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
              "The real-time price updates help me plan my harvest better.
              I feel empowered because I finally have market information
              in my hands."
            </p>

            <div>
              <p className="font-semibold">Hassan Mohammed</p>
              <p className="text-xs text-gray-500">Coffee Farmer, Sidama</p>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  )
}