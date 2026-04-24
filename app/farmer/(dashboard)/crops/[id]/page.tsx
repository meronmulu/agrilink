'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Calendar, Package, MapPin, CheckCircle2 } from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

import { getProductById } from '@/services/productService'
import { Product } from '@/types/product'
import { useLanguage } from '@/context/LanguageContext'

export default function CropDetailPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
        setSelectedImage(data.image)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">

        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>

      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">

        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-xl font-bold">
            {t('product_not_found') || 'Product Not Found'}
          </h1>
        </div>

      </div>
    )
  }

  const images = [product.image, product.image, product.image]

  return (
    <div className="">



      <main className="flex-1 pb-16 px-4 max-w-6xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* IMAGES */}
          <div className="flex flex-col gap-4">

            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border bg-gray-50">

              <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <CheckCircle2 size={14} />
                {t('available') || 'Available'}: {product.amount}kg
              </div>

              <Image
                src={selectedImage || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
              />

            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-2">

              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img || "/placeholder.png")}
                  className="relative h-16 w-16 border rounded-md overflow-hidden cursor-pointer hover:border-emerald-500"
                >
                  <Image
                    src={img || '/placeholder.png'}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}

            </div>

          </div>

          {/* INFO */}
          <div>

            <span className="text-xs text-emerald-600 uppercase font-bold">
              {product.subCategory?.name || 'Crop'}
            </span>

            <h1 className="text-3xl font-bold mt-2 capitalize">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-emerald-600 mt-4">
              ETB {product.price}
            </p>

            {/* STOCK */}
            <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600">
              <div className={`h-2 w-2 rounded-full ${product.amount > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {product.amount > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* DETAILS GRID */}
            <div className="bg-white  rounded-2xl  p-5">


              {/* GRID 2 */}
              <div className="grid grid-cols-2 gap-4">

                {/* SUB CATEGORY */}
                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                    <Package size={12} />
                    {t('sub_category') || 'Sub Category'}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {product.subCategory?.name || (t('general') || "General")}
                  </p>
                </div>

                {/* STOCK */}
                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                    <Package size={12} />
                    {t('stock') || 'Stock'}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {product.amount} kg
                  </p>
                </div>

                {/* DELIVERY */}
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {t('delivery') || 'Delivery'}
                  </p>
                  <p className={`text-sm font-semibold ${product.withDelivery ? 'text-green-600' : 'text-red-500'
                    }`}>
                    {product.withDelivery ? (t('yes') || 'Yes') : (t('no') || 'No')}
                  </p>
                </div>

                {/* POSTED DATE */}
                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                    <Calendar size={12} />
                    {t('posted_date') || 'Posted Date'}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* LOCATION (FULL WIDTH) */}
                <div className="col-span-2">
                  <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-2">
                    <MapPin size={12} />
                    {t('location') || 'Location'}
                  </p>

                  <div className="grid grid-cols-2 gap-y-1 text-sm font-semibold text-gray-800">
                    <span>Region: {product.farmer?.profile?.kebele?.woreda?.zone?.region?.name || '-'}</span>
                    <span>Zone: {product.farmer?.profile?.kebele?.woreda?.zone?.name || '-'}</span>
                    <span>Woreda: {product.farmer?.profile?.kebele?.woreda?.name || '-'}</span>
                    <span>Kebele: {product.farmer?.profile?.kebele?.name || '-'}</span>
                    <span className="col-span-2">City: {product.city || '-'}</span>
                  </div>
                </div>

              </div>
            </div>
            {/* DESCRIPTION */}
            {product.description && (
              <div className="mt-12 max-w-4xl">
                <h3 className="text-xl font-bold mb-3">
                  About this crop
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

          </div>

        </div>



      </main>



    </div>
  )
}