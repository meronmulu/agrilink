'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import {
  Loader2,
  Trash2,
  ShoppingBag,
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

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [checkingOut, setCheckingOut] = useState(false)

 
  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  
  const handleUpdate = async (productId: string, amount: number) => {
    if (amount < 1) return

    setUpdatingItems(prev => new Set(prev).add(productId))

    try {
      await updateCart({ productId, amount })
      await fetchCart()
      toast.success("Quantity updated successfully")
    } catch (err) {
      console.error(err)
      toast.error("Update failed")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  
  const handleRemove = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId))

    try {
      await removeCartItem(productId)

      setCart(prev =>
        prev.filter(item => item.product.id !== productId)
      )

      toast.success("Product removed from cart")
    } catch (err) {
      console.error(err)
      fetchCart()
      toast.error("Remove failed")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

 
  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    try {
      await clearCart()
      setCart([])
      toast.success("Cart cleared")
    } catch (err) {
      console.error(err)
      toast.error("Failed to clear cart")
    }
  }


  const handleCheckout = async () => {
    try {
      setCheckingOut(true)

      const checkoutData = { cart, total }

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
      setCheckingOut(false)
    }
  }

 
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.amount,
    0
  )

  const total = subtotal


  const orderedCart = [...cart].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
    }
    return b.id.localeCompare(a.id)
  })

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

 
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={50} />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow overflow-hidden">
              {orderedCart.map(item => (
                <div
                  key={item.id}
                  className="p-6 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex gap-6">

                    {/* IMAGE */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="text-emerald-600" />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        ETB {item.product.price.toLocaleString()}
                      </p>

                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleUpdate(item.product.id, item.amount - 1)
                          }
                          disabled={item.amount <= 1}
                        >
                          <Minus size={14} />
                        </Button>

                        <span>{item.amount}</span>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleUpdate(item.product.id, item.amount + 1)
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        ETB {(item.product.price * item.amount).toLocaleString()}
                      </p>

                      <Button
                        variant="ghost"
                        className="text-red-500 mt-2"
                        onClick={() => handleRemove(item.product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow p-6 h-fit">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              
               <div className="flex justify-between text-sm text-gray-600">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>ETB {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span>Total</span>
                <span className="text-emerald-600">
                  ETB {total.toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={handleClear}
              >
                Clear Cart
              </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}