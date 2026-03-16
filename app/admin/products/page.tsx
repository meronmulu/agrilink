'use client'

import { useEffect, useState } from "react"
import { getProducts } from "@/services/productService"
import { Product } from "@/types/product"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function AdminProductsPage() {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
      console.log(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Metrics
  const totalProducts = products.length
  const totalSold = products.reduce((acc, p) => acc + (p.amountSold || 0), 0)
  const totalInStore = products.reduce((acc, p) => acc + (p.amount - (p.amountSold || 0)), 0)

  const totalFarmers = new Set(products.map(p => p.farmer?.id)).size


  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }
  return (

    <div className="p-6 space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Products Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage all marketplace products
        </p>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Sold Products</p>
            <p className="text-3xl font-bold text-emerald-600">{totalSold}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-3xl font-bold">{totalInStore}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Farmers</p>
            <p className="text-3xl font-bold">{totalFarmers}</p>
          </CardContent>
        </Card>

      </div>


      {/* PRODUCTS TABLE */}

      <Card className="shadow-sm border p-5">

        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>

        <CardContent>

          

            <div className="rounded-lg border overflow-hidden">

              <Table>

                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SubCategory</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Farmer</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {products.map((product) => (

                    <TableRow
                      key={product.id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* PRODUCT */}

                      <TableCell className="flex items-center gap-3">

                        <div className="relative w-12 h-12 rounded-md overflow-hidden border">

                          <Image
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />

                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                        </div>

                      </TableCell>


                      {/* CATEGORY */}

                      <TableCell>
                        <Badge variant="secondary">
                          {product.subCategory?.category?.name}
                        </Badge>
                      </TableCell>


                      {/* SUBCATEGORY */}

                      <TableCell>
                        {product.subCategory?.name || "—"}
                      </TableCell>


                      {/* STOCK */}

                      <TableCell>

                        {product.amount > 0 ? (

                          <Badge className="bg-emerald-100 text-emerald-700">
                            {product.amount} Available
                          </Badge>

                        ) : (

                          <Badge variant="destructive">
                            Out of stock
                          </Badge>

                        )}

                      </TableCell>


                      {/* SOLD */}

                      <TableCell>
                        {product.amountSold || 0}
                      </TableCell>


                      {/* PRICE */}

                      <TableCell className="font-semibold">
                        ETB {product.price}
                      </TableCell>


                      {/* FARMER */}

                      <TableCell>

                        <div className="flex flex-col text-sm">
                          <span className="font-medium">
                            {product.farmer?.email || "Unknown"}
                          </span>
                          <span className="text-gray-500">
                            {product.farmer?.phone}
                          </span>
                        </div>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

        

        </CardContent>

      </Card>

    </div>
  )
}