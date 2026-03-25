'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type CartContextType = {
  cartCount: number
  setCartCount: (count: number) => void
  incrementCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0)

  const incrementCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, incrementCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}