import ProductInfo from '@/components/ProductInfo'
import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

export default function page() {
  return (
    <ProtectedRoute roles={["ADMIN","AGENT" ,"BUYER", "FARMER"]}>
    <div>
        <ProductInfo/>
    </div>
    </ProtectedRoute>
  )
}
