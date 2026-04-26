'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useCart } from '@/context/CartContext'
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
  const { setCartCount } = useCart()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)

  // ✅ cart item selection (IMPORTANT)
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)
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
    const init = async () => {
      await fetchCart()
      setCartCount(0)
    }
    init()
  }, [])

  const handleUpdate = async (productId: string, amount: number) => {
    if (amount < 1) return

    try {
      await updateCart({ productId, amount })

      setCart(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, amount }
            : item
        )
      )
    } catch {
      toast.error(t('update_failed') || 'Update failed')
    }
  }

  // ✅ DELETE FIXED (backend expects productId)
  const handleRemove = async () => {
    if (!deleteId) return

    const item = cart.find(i => i.id === deleteId)
    if (!item) return

    try {
      await removeCartItem(item.product.id)

      setCart(prev => prev.filter(i => i.id !== deleteId))

      if (selectedCartItemId === deleteId) {
        setSelectedCartItemId(null)
      }

      toast.success(t('toast_removed') || 'Removed')
    } catch {
      toast.error(t('toast_remove_failed') || 'Remove failed')
    } finally {
      setDeleteId(null)
      setIsDialogOpen(false)
    }
  }

  const handleClear = async () => {
    try {
      await clearCart()
      setCart([])
      setSelectedCartItemId(null)
      toast.success(t('toast_cart_cleared') || 'Cart cleared')
    } catch {
      toast.error(t('toast_failed') || 'Failed')
    }
  }

  const handleCheckout = async () => {
    try {
      if (!selectedCartItemId) {
        toast.error(t('toast_select_one_product') || 'Please select one product')
        return
      }

      const item = cart.find(i => i.id === selectedCartItemId)
      if (!item) return

      setCheckingOut(true)

      const res = await checkoutOrder({
        items: [
          {
            productId: item.product.id,
            amount: item.amount
          }
        ]
      })

      if (res?.paymentUrl) {
        window.location.href =
          `${res.paymentUrl}?return_url=${window.location.origin}/payment`
      }
    } catch {
      toast.error(t('toast_checkout_error') || 'Checkout error')
    } finally {
      setCheckingOut(false)
    }
  }

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-2xl font-bold mb-6">
          {t('shopping_cart') || 'Shopping Cart'}
        </h1>

        {/* DELETE DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('remove_item') || 'Remove item'}</DialogTitle>
              <DialogDescription>
                {t('remove_item_desc') || 'Are you sure you want to remove this item?'}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('cancel') || 'Cancel'}
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleRemove}
              >
                {t('remove_item') || 'Remove'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {cart.length === 0 ? (
          <Card className="text-center p-10">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={50} />
            <p>{t('cart_empty') || 'Your cart is empty'}</p>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6">

            {/* ITEMS */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-5 flex gap-5 items-center">

                    <input
                      type="radio"
                      name="selected"
                      checked={selectedCartItemId === item.id}
                      onChange={() => setSelectedCartItemId(item.id)}
                    />

                    <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p>ETB {item.product.price}</p>

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
                          setDeleteId(item.id)
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
                  <CardTitle>{t('order_summary') || 'Order Summary'}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">

                  {!selectedCartItemId ? (
                    <p className="text-sm text-gray-500">
                      {t('toast_select_one_product') || 'Select one product'}
                    </p>
                  ) : (
                    <>
                      {/* Selected product details */}
                      {cart
                        .filter(item => item.id === selectedCartItemId)
                        .map(item => (
                          <div key={item.id} className="space-y-2">

                           

                            <div className="flex justify-between">
                              <span>{t('price') || 'Price'}</span>
                              <span>
                                ETB {item.product.price}
                              </span>
                            </div>

                            

                            <div className="flex justify-between font-bold text-lg">
                              <span>{t('total') || 'Total'}</span>
                              <span className="text-emerald-600">
                                ETB {item.product.price * item.amount}
                              </span>
                            </div>

                          </div>
                        ))
                      }
                    </>
                  )}

                  <Button
                    disabled={!selectedCartItemId}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleCheckout}
                  >
                    {checkingOut ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      t('checkout') || 'Checkout'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClear}
                  >
                    {t('clear_cart') || 'Clear Cart'}
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