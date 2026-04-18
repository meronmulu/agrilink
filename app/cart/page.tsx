'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'

import {
  Loader2,
  Trash2,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react'

import {
  getCart,
  updateCart,
  removeCartItem,
  clearCart
} from '@/services/cartService'

import { CartItem } from '@/types/cart'
import { checkoutOrder } from '@/services/orderService'
import { toast } from 'sonner'
import Image from 'next/image'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

export default function CartPage() {
  const { t } = useLanguage()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch {
      toast.error(t('failed_to_load_cart') || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleUpdate = async (productId: string, amount: number) => {
    if (amount < 1) return
    try {
      await updateCart({ productId, amount })
      await fetchCart()
    } catch {
      toast.error(t('update_failed') || 'Update failed')
    }
  }

  const handleRemove = async () => {
    if (!selectedId) return

    try {
      await removeCartItem(selectedId)
      setCart(prev => prev.filter(i => i.product.id !== selectedId))
      toast.success(t('product_removed_from_cart') || 'Removed')
    } catch {
      toast.error(t('remove_failed') || 'Remove failed')
    } finally {
      setSelectedId(null)
      setIsDialogOpen(false)
    }
  }

  const handleClear = async () => {
    try {
      await clearCart()
      setCart([])
      toast.success(t('cart_cleared') || 'Cart cleared')
    } catch {
      toast.error(t('failed_to_clear_cart') || 'Failed')
    }
  }

  const handleCheckout = async () => {
    try {
      setCheckingOut(true)

      const res = await checkoutOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          amount: item.amount
        }))
      })

      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl
      }
    } catch {
      toast.error(t('checkout_error') || 'Checkout error')
    } finally {
      setCheckingOut(false)
    }
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.amount,
    0
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-2xl font-bold mb-6">
          {t('shopping_cart') || 'Shopping Cart'}
        </h1>

        {/* DELETE DIALOG (GLOBAL) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove item</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this item from your cart?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {cart.length === 0 ? (
          <Card className="text-center p-10">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={50} />
            <p>{t('your_cart_is_empty') || 'Your cart is empty'}</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">

            {/* ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-5 flex gap-5 items-center">

                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <Image
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        ETB {item.product.price}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleUpdate(item.product.id, item.amount - 1)
                          }
                        >
                          <Minus size={14} />
                        </Button>

                        <span>{item.amount}</span>

                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleUpdate(item.product.id, item.amount + 1)
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="font-bold text-emerald-600">
                        ETB {item.product.price * item.amount}
                      </p>

                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => {
                          setSelectedId(item.product.id)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-4">
              <Card className='py-2'>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>ETB {subtotal}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-600">
                      ETB {subtotal}
                    </span>
                  </div>

                  <Button
                    className="w-full mt-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    onClick={handleCheckout}
                  >
                    {checkingOut ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      'Checkout'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClear}
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}