'use client'

import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Image from 'next/image'
import { Search, Filter } from 'lucide-react'
import img from '../public/agriGirl.jpg'
import Link from 'next/link'
export default function MarketPlace() {

  // Dummy products
  const productsData = [
    {
      id: '1',
      farmerId: 'f1',
      name: 'Fresh Tomatoes',
      amount: 50,
      price: 2.5,
      description: 'Organic, juicy tomatoes directly from local farms.',
      image: img,
      createdAt: new Date(),
    },
    {
      id: '2',
      farmerId: 'f2',
      name: 'Organic Potatoes',
      amount: 100,
      price: 1.8,
      description: 'Naturally grown, pesticide-free potatoes.',
      image: img,
      createdAt: new Date(),
    },
    {
      id: '3',
      farmerId: 'f1',
      name: 'Sweet Corn',
      amount: 80,
      price: 0.75,
      description: 'Fresh sweet corn, perfect for grilling or boiling.',
      image: img,
      createdAt: new Date(),
    },
    {
      id: '4',
      farmerId: 'f3',
      name: 'Green Beans',
      amount: 60,
      price: 1.2,
      description: 'Crisp and fresh green beans, full of flavor.',
      image: img,
      createdAt: new Date(),
    },
    {
      id: '5',
      farmerId: 'f2',
      name: 'Carrots',
      amount: 70,
      price: 1.0,
      description: 'Bright orange, crunchy carrots, rich in vitamins.',
      image: img,
      createdAt: new Date(),
    },
  ]




  return (
    <div className="pt-20 flex flex-col bg-[#fcfdfd] min-h-screen">
      {/* Header */}
      <div className="mx-4 md:mx-10 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Marketplace</h1>
        <p className="text-gray-600">
          Uncover trends, high-quality products directly from local farmers.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mx-4 md:mx-10 mb-10">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 h-10 bg-white w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">

          <Button className=' border-2 h-10 bg-white hover:bg-white  text-black'>
            <Filter className="mr-2" size={16} />
            Catagories
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2 mx-4 md:mx-10 mb-10">
        {productsData.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col px-4">

              {/* Product Image */}
              <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
              {product.description && (
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
              )}
              <p className="text-gray-800 font-bold mt-2">${product.price.toFixed(2)}</p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <Link href="/cart">
                  <Button className=" bg-emerald-500 hover:bg-emerald-600 text-white">
                    Add to Cart
                  </Button>
                </Link>


                <Link href="/productDetail">
                  <Button className=" bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
                    View Details
                  </Button>
                </Link>


              </div>

            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}