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
import { Product } from '@/types/product'
import { getConversations } from '@/services/chatService'
import { toast } from 'sonner'
import { checkoutOrder } from '@/services/orderService'
import { addToCart } from '@/services/cartService'

export default function ProductDetailPage() {

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

      if (!farmerId || !currentUserId) return

      const existing = conversations.find((conv: any) =>
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

      await addToCart({
        productId: product.id,
        amount: 1
      })

      toast.success("Added to cart")

    } catch (error: any) {
      console.error(error)
      toast.error("Failed to add to cart")
    } finally {
      setCartLoading(false)
    }
  }

  const handleBuyNow = async () => {
    try {
      setBuyLoading(true)

      const user = JSON.parse(localStorage.getItem("user") || "{}")

      const res = await checkoutOrder(user.id)

      if (res?.checkout_url) {
        window.location.href = res.checkout_url
      } else {
        toast.error("Payment failed")
      }

    } catch (error) {
      console.error(error)
      toast.error("Checkout failed")
    } finally {
      setBuyLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl font-bold">Product Not Found</h1>
          <Button onClick={() => router.push('/marketplace')}>
            Back to Marketplace
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
                Available: {product.amount}
              </div>

              <Image
                src={selectedImage || "/placeholder.png"}
                alt={product.name}
                fill
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
                    className="object-cover"
                  />

                </div>

              ))}

            </div>

          </div>


          {/* PRODUCT INFO */}

          <div className="flex flex-col">

            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase mb-2">
              {product.subCategory?.name || "General Product"}
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
                124 reviews
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
                ? 'In Stock & Ready to Ship'
                : 'Out of Stock'}

            </div>


            {/* FARMER CARD */}

            {product.farmer && (

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border mb-8">

                <div className="flex items-center gap-3">

                  <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200">

                    <Image
                      src="/placeholder.png"
                      alt="Farmer"
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div>

                    <h3 className="font-semibold text-sm text-gray-900">
                      {product.farmer.email}
                    </h3>

                    {product.farmer.phone && (

                      <div className="text-xs text-gray-500 mt-1">

                        {!showPhone ? (

                          <button
                            onClick={() => setShowPhone(true)}
                            className="text-emerald-600 font-medium hover:underline"
                          >
                            Show Phone Number
                          </button>

                        ) : (

                          <span>
                            Farmer • {product.farmer.phone}
                          </span>

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
                  Message
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
                {cartLoading ? "Adding..." : (product.amount > 0 ? 'Add to Cart' : 'Out of Stock')}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.amount <= 0 || buyLoading}
                variant="outline"
                className="h-12 rounded-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-sm font-medium"
              >
                {buyLoading ? "Processing..." : "Buy Now"}
              </Button>

            </div>


            {/* PRODUCT INFO */}

            <div className="grid grid-cols-2 gap-5 bg-gray-50 p-5 rounded-xl border">

              {/* SUB CATEGORY */}

              <div>
                <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                  <Package size={12} />
                  Sub Category
                </p>

                <p className="text-sm font-semibold">
                  {product.subCategory?.name || "General"}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                  <Package size={12} />
                  Stock
                </p>

                <p className="text-sm font-semibold">
                  {product.amount} Units
                </p>
              </div>





              {/* LOCATION */}

              <div>
                <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                  <MapPin size={12} />
                  Location
                </p>

                <p className="text-sm font-semibold">
                  {product.farmer?.profile?.kebele?.name},
                  {product.farmer?.profile?.kebele?.woreda?.name}
                </p>
              </div>


              {/* POSTED DATE */}

              <div>
                <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                  <Calendar size={12} />
                  Posted Date
                </p>

                <p className="text-sm font-semibold">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>


              {/* STOCK */}

              {/* <div>
                <p className="flex items-center gap-1 text-xs text-gray-500 uppercase mb-1">
                  <Package size={12} />
                  Stock
                </p>

                <p className="text-sm font-semibold">
                  {product.amount} Units
                </p>
              </div> */}

            </div>

          </div>

        </div>


        {/* DESCRIPTION */}

        {product.description && (

          <div className="mt-12 max-w-4xl">

            <h3 className="text-xl font-bold mb-3">
              About this product
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