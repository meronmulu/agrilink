'use client'

import { useEffect, useState } from "react"
import { getProducts } from "@/services/productService"
import { Product } from "@/types/product"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Metrics
  // const totalProducts = products.length
  // const totalSold = products.reduce((acc, p) => acc + (p.amountSold || 0), 0)
  // const totalInStore = products.reduce((acc, p) => acc + (p.amount - (p.amountSold || 0)), 0)
  // const totalRevenue = products.reduce((acc, p) => acc + ((p.amountSold || 0) * p.price), 0)

  return (
    <div className="p-6 space-y-6">

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* {totalProducts} */}
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Total Sold Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* {totalSold} */}
              </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Total In-Store Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* {totalInStore} */}
              </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Total Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <p className="text-2xl font-bold">ETB {totalRevenue}</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SubCategory</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Farmer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.image && (
                        <img src={product.image} className="w-12 h-12 object-cover rounded" />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.subCategory?.category?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.subCategory?.name}</TableCell>
                    <TableCell>{product.amount}</TableCell>
                    <TableCell>{product.amountSold || 0}</TableCell>
                    <TableCell>ETB {product.price}</TableCell>
                    <TableCell>
                      {product.farmer?.email || product.farmer?.phone}
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}