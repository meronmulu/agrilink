'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Search, ChevronDown, Loader2, Package } from 'lucide-react'
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
import Link from 'next/link'
import { toast } from 'sonner'
import { addToCart } from '@/services/cartService'
import { useCart } from '@/context/CartContext'

export default function MarketPlace() {

  const { t } = useLanguage()
  const { incrementCart } = useCart()
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)


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
      } finally {
        setLoading(false)
      }

    }

    fetchData()

  }, [])

  const handleAddToCart = async (productId: string) => {
    try {

      const res = await addToCart({
        productId,
        amount: 1
      })
     
      incrementCart()
      console.log(res)
      toast.success("Added to cart")

    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart")
    }
  }


  // Search + SubCategory Filter
  const filteredProducts = products
    .filter((product) => {
      const matchesName =
        product.name?.toLowerCase().includes(search.toLowerCase())

      const matchesSubCategory =
        !selectedSubCategory ||
        product.subCategoryId === selectedSubCategory

      return matchesName && matchesSubCategory
    })
    .sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (

    <div className="pt-20 flex flex-col bg-[#fcfdfd] min-h-screen pb-5">

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

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

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
                : (t('categories') || "Categories")}

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">

            <DropdownMenuItem onClick={() => setSelectedSubCategory(null)}>
              {t('all_categories') || 'All Categories'}
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

      {/* Products */}

      {filteredProducts.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-20 text-center">

          <p className="text-lg font-medium text-gray-600">
            {t('no_products_category') || 'No products in this category'}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {t('try_selecting_another') || 'Try selecting another category or search again.'}
          </p>

        </div>

      ) : (
          
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mx-6 md:mx-10">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-full"
            >
             <Link href={`/product/${product.id}`} className="flex-1">

              {/* Product Image */}
              <div className="relative h-52 w-full overflow-hidden">

                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                {/* Subcategory badge */}
                {product.subCategory?.name && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {product.subCategory.name}
                  </div>
                )}

              </div>

              <CardContent className="px-3  pt-1">

                {/* Product Info */}
                <div className="p-4 space-y-2">

                  {/* Product name */}
                  <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Availability */}
                  <div className='flex gap-2'>
                    {t('available_colon') || 'Available:'}
                    <span className={`font-medium ${product.amount > 10
                      ? 'text-green-600'
                      : product.amount > 0
                        ? 'text-orange-500'
                        : 'text-red-500'
                      }`}>
                      {product.amount}
                    </span>
                  </div>


                  {/* Price */}
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium mb-0.5 uppercase tracking-wider">
                      {t('price') || 'Price'}
                    </p>
                    <p className="text-emerald-600 font-black text-xl">
                      ETB {product.price}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2">

                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    >
                      {t("market_add_cart")}
                    </Button>

                    <Link href={`/product/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        {t('market_view_details') || 'View Detail'}
                      </Button>
                    </Link>

                  </div>

                </div>

              </CardContent>


               </Link>
            </Card>
            
          ))}

        </div>
      
      )}

    </div>

  )
}                   
