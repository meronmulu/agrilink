'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Search, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories, getSubCategories } from '@/services/categoryService'
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
import Image, { StaticImageData } from 'next/image'
import img from '../public/agriGirl.jpg'

interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  subcategoryId: string
  image: StaticImageData
}

export default function MarketPlace() {
  const { t } = useLanguage()

  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories()
        const subs = await getSubCategories()

        setCategories(cats)
        setSubcategories(subs)

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()

    // Dummy products
    setProducts([
      {
        id: "1",
        name: "Fresh Carrots",
        price: 2.5,
        categoryId: "1",
        subcategoryId: "1",
        image: img
      },
      {
        id: "2",
        name: "Organic Tomatoes",
        price: 3.2,
        categoryId: "1",
        subcategoryId: "2",
        image: img
      },
      {
        id: "3",
        name: "Red Apples",
        price: 4.0,
        categoryId: "2",
        subcategoryId: "3",
        image: img
      },
      {
        id: "4",
        name: "Bananas",
        price: 1.8,
        categoryId: "2",
        subcategoryId: "4",
        image: img
      }
    ])
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-20 flex flex-col bg-[#fcfdfd] min-h-screen">

      {/* Header */}
      <div className="mx-4 md:mx-10 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
          {t('market_title')}
        </h1>
        <p className="text-gray-600">{t('market_subtitle')}</p>
      </div>

      {/* Search & Dropdown */}
      <div className="flex flex-col md:flex-row items-center gap-4 mx-4 md:mx-10 mb-10">

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
              <ChevronDown size={16} className="text-gray-400" />
              Categories
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="start">
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
                          <DropdownMenuItem key={sub.id}>
                            {sub.name}
                          </DropdownMenuItem>
                        ))}

                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>

                </DropdownMenuSub>
              ))}

            </DropdownMenuGroup>

            <DropdownMenuSeparator />

          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mx-6 md:mx-10">

        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition ">

            <CardContent className="">
               <div className="relative h-50 w-full mb-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              <div className='p-4'>
               

                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-emerald-600 font-bold mt-1">
                  ${product.price}
                </p>

                <div className='flex items-center justify-between'>
                  <Button className="mt-3  bg-emerald-500 hover:bg-emerald-600">
                    {t('market_add_cart')}
                  </Button>
                  <Button className="mt-3 bg-[#F9FAFB] text-black hover:bg-[#F9FAFB] ">
                    Veiw Detail
                  </Button>

                </div>
              </div>




            </CardContent>

          </Card>
        ))}

      </div>

    </div>
  )
}