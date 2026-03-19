'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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

import { checkoutOrder } from '@/services/orderService'

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  //  Fetch cart
  const fetchCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  // Update quantity with loading state
  const handleUpdate = async (productId: string, amount: number) => {
    if (amount < 1) return
    
    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      await updateCart({ productId, amount })
      await fetchCart()
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  // Remove item with optimistic update
  const handleRemove = async (productId: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId))
    try {
      await removeCartItem(productId)
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
    } catch (err) {
      console.error(err)
      fetchCart() 
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  // Clear cart
  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return
    
    try {
      await clearCart()
      setCart([])
    } catch (err) {
      console.error(err)
    }
  }

  // Checkout
  const handleCheckout = async () => {
    try {
      const res = await checkoutOrder()
      if (res?.checkout_url) {
        window.location.href = res.checkout_url
      }
    } catch (err) {
      console.error(err)
    }
  }

  //  Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.amount,
    0
  )
  const tax = subtotal * 0.15 // 15% tax
  const total = subtotal + tax

  if (loading) {
      return (
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        </div>
      )
    }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-900">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.product.image || "/placeholder.png"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {item.product.name}
                              </h3>
                              <p>
                                  {item.product.subCategory?.name}
                              </p>
                              <p className="text-lg font-bold text-primary">
                                ETB {item.product.price.toLocaleString()}
                              </p>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(item.product.id)}
                              disabled={updatingItems.has(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {updatingItems.has(item.product.id) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-4">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdate(item.product.id, item.amount - 1)}
                                disabled={item.amount <= 1 || updatingItems.has(item.product.id)}
                                className="h-9 w-9 p-0 rounded-r-none"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="w-12 text-center font-medium">
                                {updatingItems.has(item.product.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                ) : (
                                  item.amount
                                )}
                              </span>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdate(item.product.id, item.amount + 1)}
                                disabled={updatingItems.has(item.product.id)}
                                className="h-9 w-9 p-0 rounded-l-none"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <span className="text-sm font-medium text-gray-900 ml-auto">
                              Subtotal: ETB {(item.product.price * item.amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>ETB {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {/* <div className="flex justify-between text-gray-600">
                    <span>Tax (15%)</span>
                    <span>ETB {tax.toLocaleString()}</span>
                  </div> */}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span className="text-xl text-primary">
                        ETB {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    className="w-full"
                    size="lg"
                  >
                    Clear Cart
                  </Button>
                </div>

               
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}