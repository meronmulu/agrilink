'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getProducts } from '@/services/productService'
import { Product } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

export default function MarketPlacePreview() {
  const { t } = useLanguage()
  const [latestProducts, setLatestProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getProducts()

        // Sort by newest first
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )

        setLatestProducts(sorted.slice(0, 4))
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchLatest()
  },[])

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 mt-5 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {t('market_preview_title')}
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl text-lg">
              {t('market_preview_subtitle')}
            </p>
          </div>
          
          <Link 
            href="/market" 
            className="group flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View all products
            <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product) => (
            <div key={product.id}  className="block h-full">
              <Card className="group flex flex-col rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-full">
                
                {/* Image Container with Zoom */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-50">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* New Badge */}
                  <span className="absolute top-3 left-3 bg-emerald-500/95 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    New Arrival
                  </span>
                </div>

                <CardContent className="p-5 flex flex-col grow">
                  
                  {/* Subcategory (Moved to Top) */}
                  <span className="text-[11px] font-bold text-emerald-500 mb-2 uppercase tracking-wider">
                    {product.subCategory?.name || 'Uncategorized'}
                  </span>

                  {/* Product Name */}
                  <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h4>

                  {/* Stock Amount Indicator */}
                  <div className="flex items-center gap-1.5 mb-4">
                    {product.amount > 0 ? (
                      <span className="text-xs font-medium text-gray-600">
                        Avalable :
                        <strong className="text-gray-900">{product.amount}</strong> 
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-red-500">
                       
                      </span>
                    )}
                  </div>

                  {/* Price & Action (Pushed to bottom using mt-auto) */}
                    <div>
                      <p className="text-[11px] text-gray-400 font-medium mb-0.5 uppercase tracking-wider">
                        Price
                      </p>
                      <p className="text-emerald-600 font-black text-xl">
                        ETB {product.price}
                      </p>
                    </div>
                    
                    {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2">

                    <Button
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      {t("market_add_cart")}
                    </Button>

                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View
                      </Button>
                    </Link>

                  </div>

                </CardContent>
              </Card>

              
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}