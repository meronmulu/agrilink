'use client'

import { Search, Plus, Sprout, Pencil, Trash2, Layers, XCircle, ChevronDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useContext } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { getMyProducts, deleteProducts } from '@/services/productService'
import { Product } from '@/types/product'
import Image from 'next/image'
import { Category, SubCategory } from '@/types/category'
import { getCategories, getSubCategories } from '@/services/categoryService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export default function MyCropsPage() {
  const { t } = useLanguage()

  const [crops, setCrops] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Fetch crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await getMyProducts()
        setCrops(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCrops()
  }, [])

  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories()
        const subs = await getSubCategories()
        setCategories(cats)
        setSubcategories(subs)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => sub.categoryId === selectedCategory)
    : []

  //  DELETE FUNCTION
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteProducts(deleteId)

      // remove from UI
      setCrops((prev) => prev.filter((crop) => crop.id !== deleteId))

      toast.success(t('crop_deleted_successfully')) // TODO: Add to locales



      setDeleteId(null)
    } catch (error) {
      console.error("Delete failed:", error)

      toast.error(
        // error?.response?.data?.message ||
        // error?.message ||
        t('something_went_wrong') // TODO: Add to locales
      )
    }
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }

  const filteredCrops = crops
    .filter((crop) => {
      const sub = subcategories.find((s) => s.id === crop.subCategoryId)

      const matchSearch = crop.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = selectedCategory ? sub?.categoryId === selectedCategory : true
      const matchSubCategory = selectedSubCategory ? crop.subCategoryId === selectedSubCategory : true

      return matchSearch && matchCategory && matchSubCategory
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <span className="ml-4 text-emerald-600 font-medium">{t('loading')}</span> {/* TODO: Add to locales */}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-8 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('my_crops')}</h1> {/* TODO: Add to locales */}
          <p className="text-gray-500">{t('manage_your_listings')}</p> {/* TODO: Add to locales */}
        </div>

        <Link href="/farmer/crops/add-crop">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-5">
            <Plus className="mr-2" size={18} />
            {t('post_new_crop')}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border flex gap-4 flex-wrap">

        <div className="relative flex-1 min-w-62.5 py-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder={t('search_placeholder')}
            className="pl-10 "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="border-2 h-10 bg-white hover:bg-gray-50 text-black border-gray-200 gap-2">
              <ChevronDown size={16} />
              {selectedSubCategory
                ? subcategories.find(s => s.id === selectedSubCategory)?.name
                : t('categories')}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">

            {/* Reset Filter */}
            <DropdownMenuItem onClick={() => setSelectedSubCategory(null)}>
              {t('all_categories')}
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

      {/* Crops */}
      {
        filteredCrops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-gray-600">
              {t('no_products_in_category')}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {t('try_selecting_another_category')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredCrops.map((crop) => {
              const sub = subcategories.find((s) => s.id === crop.subCategoryId)

              return (
                <div
                  key={crop.id}
                  className="bg-white rounded-2xl border overflow-hidden shadow-sm"
                >

                  {/* Image */}
                  <div className="relative aspect-4/3 bg-gray-100">
                    {crop.image ? (
                      <Image
                        src={crop.image}
                        alt={crop.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <Sprout size={40} />
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">

            <Link href={`/farmer/crops/${crop.id}`}>
            <button className="p-2 bg-white rounded-full shadow" title={t('edit_crop')}>
              <Pencil size={16} />
            </button>
            </Link>

            <button
            onClick={() => setDeleteId(crop.id)}
            className="p-2 bg-white rounded-full text-red-600 shadow"
            title={t('delete_crop')}
            >
            <Trash2 size={16} />
            </button>

                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="font-semibold">{crop.name}</h3>

                    <p className="text-xs text-gray-500">
                      {sub?.name}
                    </p>

                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-emerald-600 font-bold">
                        {crop.price} ETB
                      </span>

                      <span className="flex items-center gap-1">
                        <Layers size={14} />
                        {crop.amount}
                      </span>
                    </div>
                  </div>

                </div>
              )
            })}

          </div>
        )
      }

      {/*  DELETE DIALOG */}
      <Dialog open={!!deleteId} onOpenChange={(open) => {
        if (!open) setDeleteId(null)
      }}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('delete_crop')}</DialogTitle>
            <DialogDescription>
              {t('delete_crop_confirm')}
              <br />
              {t('action_cannot_be_undone')}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t('cancel')}
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}