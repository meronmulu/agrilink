'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
  Star,
  MessageCircle,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Calendar,
  Package,
  MapPin
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'

import { getProductById } from '@/services/productService'
import { getConversations } from '@/services/chatService'
import { Product } from '@/types/product'
import { toast } from 'sonner'
import { addToCart } from '@/services/cartService'
import { checkoutOrder } from '@/services/orderService'
import { useLanguage } from '@/context/LanguageContext'

export default function ProductDetailPage() {
  const { t } = useLanguage()

  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPhone, setShowPhone] = useState(false)

  const [cartLoading, setCartLoading] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)


  useEffect(() => {

    if (!id) return

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
        setSelectedImage(data.image)

      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()

  }, [id])

  const handleSend = async () => {
    try {
      const conversations = await getConversations()

      const farmerId = product?.farmer?.id

      const userData = localStorage.getItem("user")
      const currentUserId = userData ? JSON.parse(userData).id : null

      if (!farmerId || !currentUserId) {
        if (!currentUserId) router.push('/login')
        return
      }

      const existing = conversations.find((conv) =>
        (conv.userOneId === currentUserId && conv.userTwoId === farmerId) ||
        (conv.userTwoId === currentUserId && conv.userOneId === farmerId)
      )

      if (existing) {
        router.push(`/message/${existing.id}`)
      } else {
        router.push(`/message/${farmerId}`)
      }

    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setCartLoading(true)

      const res = await addToCart({
        productId: product.id,
        amount: 1
      })

      console.log(res)
      toast.success("Added to cart")

    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart")
    } finally {
      setCartLoading(false)
    }
  }

  const handleCheckout = async () => {
    if (!product) return

    try {
      setBuyLoading(true)

      const checkoutData = {
        items: [
          {
            productId: product.id,
            amount: 1
          }
        ]
      }

      const res = await checkoutOrder(checkoutData)

      toast.success("Order created. Redirecting to payment...")

      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl
      } else {
        toast.error("Checkout failed")
      }

    } catch (error) {
      console.log(error)
      toast.error("Checkout error")
    } finally {
      setBuyLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-bold">{t('product_not_found') || 'Product Not Found'}</h1>
          <Button onClick={() => router.push('/marketplace')}>
            {t('back_to_marketplace') || 'Back to Marketplace'}
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const images = [
    product.image,
    product.image,
    product.image,
    product.image
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <Header />

      <main className="flex-1 pt-20 pb-16 px-4 max-w-7xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* PRODUCT IMAGES */}

          <div className="flex flex-col gap-4">

            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border bg-gray-50">

              <div className="absolute top-4 left-4 z-10 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                <CheckCircle2 size={14} />
                {'Available:'} {product.amount}kg
              </div>

              <Image
                src={selectedImage || "/placeholder.png"}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />

            </div>

            {/* THUMBNAILS */}

            <div className="flex gap-2 mt-2">

              {images.map((img, index) => (

                <div
                  key={index}
                  onClick={() => setSelectedImage(img || "/placeholder.png")}
                  className={`relative h-16 w-16 rounded-md overflow-hidden border cursor-pointer transition
                   ${selectedImage === img ? "border-emerald-500" : "border-gray-200 hover:border-emerald-400"}`}
                >

                  <Image
                    src={img || "/placeholder.png"}
                    alt={`preview-${index}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                </div>

              ))}

            </div>

          </div>


          {/* PRODUCT INFO */}

          <div className="flex flex-col">

            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2">
              {product.subCategory?.name || (t('general_product') || "General Product")}
            </span>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
              {product.name}
            </h1>


            {/* REVIEWS */}

            <div className="flex items-center gap-2 mb-6">

              <div className="flex text-yellow-400">

                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} className="text-gray-300" />

              </div>

              <span className="text-sm font-semibold">4.8</span>

              <span className="text-sm text-gray-500 underline cursor-pointer">
                124 {t('reviews') || 'reviews'}
              </span>

            </div>


            {/* PRICE */}

            <div className="mb-3">

              <span className="text-3xl font-bold text-emerald-600">
                ETB {product.price}
              </span>

            </div>


            {/* STOCK STATUS */}

            <div className="flex items-center gap-2 text-sm text-emerald-600 mb-8">

              <div className={`h-2 w-2 rounded-full ${product.amount > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />

              {product.amount > 0
                ? (t('in_stock_ready') || 'In Stock & Ready to Ship')
                : (t('out_of_stock') || 'Out of Stock')
              }

            </div>


            {/* FARMER CARD */}
            {product.farmer && (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border mb-8">

                <div className="flex items-center gap-3">

                  {/* IMAGE */}
                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={product.farmer?.profile?.imageUrl || "/placeholder.png"}
                      alt="Farmer"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div>

                    {/* NAME */}
                    <h3 className="font-semibold text-sm text-gray-900">
                      {product.farmer?.profile?.fullName || (t('unknown_farmer') || "Unknown Farmer")}
                    </h3>

                    {/* EMAIL */}
                    <p className="text-xs text-gray-500">
                      {product.farmer?.email}
                    </p>

                    {/* PHONE */}
                    {product.farmer?.phone && (
                      <div className="text-xs text-gray-500 mt-1">
                        {!showPhone ? (
                          <button
                            onClick={() => setShowPhone(true)}
                            className="text-emerald-600 font-medium hover:underline"
                          >
                            {t('show_phone_number') || 'Show Phone Number'}
                          </button>
                        ) : (
                          <span>📞 {product.farmer.phone}</span>
                        )}
                      </div>
                    )}

                  </div>

                </div>

                <Button
                  onClick={handleSend}
                  variant="outline"
                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-lg text-sm h-9"
                >
                  <MessageCircle size={16} className="mr-2" />
                  {t('message') || 'Message'}
                </Button>

              </div>
            )}


            {/* ACTION BUTTONS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              <Button
                onClick={handleAddToCart}
                disabled={product.amount <= 0 || cartLoading}
                className="h-12 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium"
              >
                <ShoppingCart size={18} className="mr-2" />
                {cartLoading ? (t('adding') || "Adding...") : (product.amount > 0 ? (t('add_to_cart') || 'Add to Cart') : (t('out_of_stock') || 'Out of Stock'))}
              </Button>

              <Button
                onClick={handleCheckout}
                disabled={product.amount <= 0 || buyLoading}
                variant="outline"
                className="h-12 rounded-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-sm font-medium"
              >
                {buyLoading ? (t('processing') || "Processing...") : (t('buy_now') || "Buy Now")}
              </Button>

            </div>


            {/* PRODUCT INFO */}

            <div className="bg-gray-50  rounded-2xl  p-5">


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
                    <div className="col-span-2 mt-4">
                      <iframe
                        width="100%"
                        height="280"
                        className="rounded-xl border"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          product.city ||
                          product.farmer?.profile?.kebele?.name ||
                          'Ethiopia'
                        )}&output=embed`}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>


        {/* DESCRIPTION */}

        {product.description && (

          <div className="mt-12 max-w-4xl">

            <h3 className="text-xl font-bold mb-3">
              {t('about_this_product') || 'About this product'}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>

          </div>

        )}

      </main>

      <Footer />

    </div>
  )
}