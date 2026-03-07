'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, CartSummary } from '@/types/cart'

interface CartContextType {
  items: CartItem[]
  summary: CartSummary
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'agriLink_cart'
const DELIVERY_FEE = 50 // ETB

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items])

  // Calculate cart summary
  const summary: CartSummary = {
    subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    delivery: items.length > 0 ? DELIVERY_FEE : 0,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (items.length > 0 ? DELIVERY_FEE : 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id)

      if (existingItem) {
        // Increase quantity if item already exists
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.maxQuantity || Infinity) }
            : item
        )
      } else {
        // Add new item with quantity 1
        return [...currentItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          const maxQty = item.maxQuantity || Infinity
          return { ...item, quantity: Math.min(quantity, maxQty) }
        }
        return item
      })
    )
  }

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (id: string) => {
    return items.some(item => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    return item?.quantity || 0
  }

  const value: CartContextType = {
    items,
    summary,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}