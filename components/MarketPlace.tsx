'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Search, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories, getSubCategories } from '@/services/categoryService'
import { getProducts } from '@/services/productService'
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
} from './ui/dropdown-menu'
import { Category, SubCategory } from '@/types/category'
import Image from 'next/image'
import { Product } from '@/types/product'

export default function MarketPlace() {

  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, subs, prods] = await Promise.all([
          getCategories(),
          getSubCategories(),
          getProducts()
        ])

        setCategories(cats)
        setSubcategories(subs)
        setProducts(prods)

      } catch (error) {
        console.error("Error fetching marketplace data:", error)
      }
    }

    fetchData()
  }, [])

  // ✅ Search + SubCategory Filter
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesSubCategory =
      !selectedSubCategory ||
      product.subCategoryId === selectedSubCategory

    return matchesName && matchesSubCategory
  })

  return (
    <div className="pt-20 flex flex-col bg-[#fcfdfd] min-h-screen">

      {/* Header */}
      <div className='flex items-center justify-between mx-4 md:mx-10 mb-6'>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            {t('market_title')}
          </h1>
          <p className="text-gray-600">
            {t('market_subtitle')}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-row items-center gap-4 mx-4 md:mx-10 mb-10">

        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('market_search_placeholder')}
            className="pl-10 pr-4 h-10 bg-white w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="border-2 h-10 bg-white hover:bg-gray-50 text-black border-gray-200 gap-2">
              <ChevronDown size={16} />
              {selectedSubCategory
                ? subcategories.find(s => s.id === selectedSubCategory)?.name
                : "Categories"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">

            {/* Reset Filter */}
            <DropdownMenuItem onClick={() => setSelectedSubCategory(null)}>
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
                        .filter((sub) => sub.categoryId === cat.id)
                        .map((sub) => (
                          <DropdownMenuItem
                            key={sub.id}
                            onClick={() => setSelectedSubCategory(sub.id)}
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

      </div>

      {/* Products Section */}

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-600">
            No products in this category
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try selecting another category or search again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mx-6 md:mx-10">

          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition">

              <CardContent className="p-0">

                <div className="relative h-52 w-full">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>

                <div className="p-4">

                  <h3 className="font-semibold text-lg">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {product.subCategory?.name}
                  </p>

                  <p className="text-emerald-600 font-bold mt-1">
                    ETB {product.price}
                  </p>

                  <p className="text-sm text-gray-600">
                    Available: {product.amount}
                  </p>

                  <div className='flex items-center justify-between mt-4'>

                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      {t('market_add_cart')}
                    </Button>

                    <Button variant="outline">
                      View Detail
                    </Button>

                  </div>

                </div>

              </CardContent>

            </Card>
          ))}

        </div>
      )}

    </div>
  )
}