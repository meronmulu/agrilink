'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Image from 'next/image'
import { Search, ChevronDown, Loader2, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import api from '@/axios'

interface Product {
  id: string
  farmerId: string
  name: string
  amount: number
  price: number
  description?: string
  image?: string
  category?: string
  createdAt: string
}

export default function MarketPlace() {
  const { t } = useLanguage()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Search & filter state
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [showCatDrop, setShowCatDrop] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  // ─── Fetch ────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await api.get<Product[]>('/api/products')
      setProducts(res.data)
    } catch {
      setFetchError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  // ─── Close category dropdown on outside click ──────────────────
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setShowCatDrop(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // ─── Derived unique categories ─────────────────────────────────
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[]
    return ['All', ...cats]
  }, [products])

  // ─── Filtered products ─────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      const matchCat = activeCategory === 'All' || p.category === activeCategory
      return matchSearch && matchCat
    })
  }, [products, search, activeCategory])

  // ─── Skeleton cards ────────────────────────────────────────────
  const Skeleton = () => (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-8 bg-gray-100 rounded-lg mt-3" />
      </div>
    </div>
  )

  return (
    <div className="pt-20 flex flex-col bg-[#fcfdfd] min-h-screen">
      {/* Header */}
      <div className="mx-4 md:mx-10 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">{t('market_title')}</h1>
        <p className="text-gray-600">{t('market_subtitle')}</p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mx-4 md:mx-10 mb-10">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('market_search_placeholder')}
            className="pl-10 pr-4 h-10 bg-white w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div ref={catRef} className="relative">
          <Button
            className="border-2 h-10 bg-white hover:bg-gray-50 text-black border-gray-200 gap-2"
            onClick={() => setShowCatDrop((v) => !v)}
          >
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCatDrop ? 'rotate-180' : ''}`} />
            {activeCategory === 'All' ? t('market_categories_btn') : activeCategory}
          </Button>
          {showCatDrop && (
            <div className="absolute right-0 top-11 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${activeCategory === cat ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                  onClick={() => { setActiveCategory(cat); setShowCatDrop(false) }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="mx-4 md:mx-10 mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={fetchProducts} className="ml-4 font-semibold underline text-red-700 hover:text-red-900">
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2 mx-4 md:mx-10 mb-10">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 mx-4 md:mx-10 text-center">
          <ShoppingBag size={52} className="mb-4 text-gray-200" />
          <p className="font-semibold text-gray-600 text-lg">
            {products.length === 0 ? 'No products available yet' : 'No products match your search'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {products.length === 0
              ? 'Check back soon — farmers are adding their crops.'
              : 'Try a different search term or category.'}
          </p>
          {search || activeCategory !== 'All' ? (
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="mt-4 text-sm text-emerald-600 font-semibold underline hover:text-emerald-700"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4 sm:grid-cols-2 mx-4 md:mx-10 mb-10">
          {filtered.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col px-4">
                {/* Product Image */}
                <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      {t('market_no_image')}
                    </div>
                  )}
                  {product.category && (
                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                )}
                <p className="text-gray-800 font-bold mt-2">${product.price.toFixed(2)}</p>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <Link href="/cart">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      {t('market_add_cart')}
                    </Button>
                  </Link>
                  <Link href={`/buyer/marketplace/${product.id}`}>
                    <Button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700">
                      {t('market_view_details')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Result count */}
      {!loading && !fetchError && products.length > 0 && (
        <p className="text-center text-xs text-gray-400 pb-8">
          Showing {filtered.length} of {products.length} product{products.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}
    </div>
  )
}