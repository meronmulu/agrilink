'use client'

import { useEffect, useState, useMemo } from 'react'
import { getProducts } from '@/services/productService'
import { Product } from '@/types/product'
import { useLanguage } from '@/context/LanguageContext'

import {
  Card,
  CardContent
} from '@/components/ui/card'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Loader2, Search, ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { getCategories, getSubCategories } from '@/services/categoryService'
import { Category, SubCategory } from '@/types/category'

export default function AdminProductsPage() {
  const { t } = useLanguage()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // 🔍 SEARCH + FILTER
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  // 📄 PAGINATION
  const [page, setPage] = useState(1)
  const pageSize = 7

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [cats, subs, prods] = await Promise.all([
        getCategories(),
        getSubCategories(),
        getProducts()
      ])

      setCategories(cats)
      setSubcategories(subs)
      setProducts(prods)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ================= FILTER =================
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesName =
          product.name?.toLowerCase().includes(search.toLowerCase())

        const matchesSubCategory =
          !selectedSubCategory ||
          product.subCategoryId === selectedSubCategory

        return matchesName && matchesSubCategory
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [products, search, selectedSubCategory])

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, page])

  // Metrics
  const totalProducts = products.length
  const totalInStore = products.reduce(
    (acc, p) => acc + (p.amount - (p.amountSold || 0)),
    0
  )
  const totalFarmers = new Set(products.map(p => p.farmer?.id)).size

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('products') || 'Products'}
        </h1>
        <p className="text-sm text-gray-500">
          {t('manage_all_marketplace_products') || 'Manage all marketplace products'}
        </p>
      </div>

      {/* METRICS (UNCHANGED UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-3xl font-bold">{totalInStore}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Farmers</p>
            <p className="text-3xl font-bold">{totalFarmers}</p>
          </CardContent>
        </Card>

      </div>

      {/* 🔍 SEARCH + CATEGORY FILTER (ADDED, UI CLEAN) */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">

          {/* SEARCH */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ChevronDown size={16} />
                {selectedSubCategory
                  ? subcategories.find(s => s.id === selectedSubCategory)?.name
                  : 'Categories'}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">

              <DropdownMenuItem onClick={() => {
                setSelectedSubCategory(null)
                setPage(1)
              }}>
                All Categories
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                {categories.map((cat) => (
                  <DropdownMenuSub key={cat.id}>
                    <DropdownMenuSubTrigger>
                      {cat.name}
                    </DropdownMenuSubTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {subcategories
                          .filter(sub => sub.categoryId === cat.id)
                          .map(sub => (
                            <DropdownMenuItem
                              key={sub.id}
                              onClick={() => {
                                setSelectedSubCategory(sub.id)
                                setPage(1)
                              }}
                            >
                              {sub.name}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuGroup>

            </DropdownMenuContent>
          </DropdownMenu>

        </CardContent>
      </Card>

      {/* PRODUCTS TABLE (UNCHANGED UI) */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">

            <Table>

              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SubCategory</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Farmer</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition">

                    {/* PRODUCT */}
                    <TableCell className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                        <Image
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>{product.name}</div>
                    </TableCell>

                    {/* CATEGORY */}
                    <TableCell>
                      <Badge variant="secondary">
                        {product.subCategory?.category?.name}
                      </Badge>
                    </TableCell>

                    {/* SUBCATEGORY */}
                    <TableCell>
                      {product.subCategory?.name || '—'}
                    </TableCell>

                    {/* STOCK */}
                    <TableCell>
                      {product.amount > 0 ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          {product.amount}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Out</Badge>
                      )}
                    </TableCell>

                    {/* PRICE */}
                    <TableCell>ETB {product.price}</TableCell>

                    {/* FARMER */}
                    <TableCell className='flex items-center gap-3'>
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={product.farmer?.profile?.imageUrl || "/placeholder.png"}
                          alt="Farmer"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                         {/* Info */}
                        <div className="flex flex-col leading-tight">

                          {/* Name */}
                          <span className="font-semibold text-gray-900 capitalize">
                            {product.farmer?.profile?.fullName || "Unknown Farmer"}
                          </span>

                          {/* Email */}
                          <span className="text-xs text-gray-500">
                            {product.farmer?.email}
                          </span>

                          {/* Phone */}
                          {product.farmer?.phone && (
                            <span className="text-xs text-gray-400">
                              {product.farmer.phone}
                            </span>
                          )}

                        </div>
                      


                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>

          </div>
        </CardContent>
      </Card>

      {/* PAGINATION (7 PER PAGE) */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(p => Math.max(p - 1, 1))}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      )}

    </div>
  )
}