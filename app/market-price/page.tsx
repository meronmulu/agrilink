'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  MapPin,
  Calendar,
  BadgeCheck,
  Loader2,
  TrendingUp,
  PackageSearch,
  TrendingDown,
  Minus,
  Sparkles,
  ChevronRight,
  Store,
  DollarSign,
  BarChart3
} from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getApprovedMarketPrices } from '@/services/marketPrice'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarketPrice } from '@/types/market-place'

export default function MarketPriceCheckPage() {
  const [data, setData] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  const [productQuery, setProductQuery] = useState('')
  const [weeklyResults, setWeeklyResults] = useState<MarketPrice[]>([])
  const [notFound, setNotFound] = useState(false)

  const popularProducts = [
    { name: 'Banana',  },
    { name: 'Tomato',  },
    { name: 'Onion', },
    { name: 'Coffee', },
    { name: 'Maize',  },
    { name: 'Avocado',}
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await getApprovedMarketPrices()
      const sorted = res.sort(
        (a: MarketPrice, b: MarketPrice) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setData(sorted)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const latestApproved = useMemo(() => data.slice(0, 4), [data])

  const handleCheck = () => {
    if (!productQuery.trim()) return

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const filtered = data.filter(item => {
      const productMatch = item.product?.name
        ?.toLowerCase()
        .includes(productQuery.toLowerCase())
      const weeklyMatch = new Date(item.date) >= sevenDaysAgo
      return productMatch && weeklyMatch
    })

    if (filtered.length > 0) {
      setWeeklyResults(filtered)
      setNotFound(false)
    } else {
      setWeeklyResults([])
      setNotFound(true)
    }
  }

  const handleQuickSelect = (name: string) => {
    setProductQuery(name)
    setTimeout(() => handleCheck(), 0)
  }

  const isSearching = productQuery.trim().length > 0

  const weeklyStats = useMemo(() => {
    if (weeklyResults.length === 0) return null
    const prices = weeklyResults.map(i => i.price)
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const max = Math.max(...prices)
    const min = Math.min(...prices)
    const trend = prices[0] > prices[prices.length - 1] ? 'down' : prices[0] < prices[prices.length - 1] ? 'up' : 'stable'
    return { avg, max, min, trend, count: prices.length }
  }, [weeklyResults])

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-br from-emerald-50/40 via-white to-teal-50/30 px-4 py-24">
        <div className="max-w-6xl mx-auto">

          {/* Enhanced Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Real-time Market Data
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-br from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Market Price Checker
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Search approved agricultural prices across Ethiopian markets — 
              transparent, verified, and up-to-date.
            </p>
          </div>

          {/* Enhanced Quick Selection */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {popularProducts.map(({ name, icon }) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => handleQuickSelect(name)}
                className={`rounded-full px-5 py-2 h-auto transition-all duration-200 ${
                  productQuery === name 
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                    : 'hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <span className="mr-2 text-lg">{icon}</span>
                {name}
              </Button>
            ))}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative mb-12">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search any agricultural product... e.g., Banana, Teff, Potato"
                  value={productQuery}
                  onChange={e => {
                    setProductQuery(e.target.value)
                    if (!e.target.value) {
                      setWeeklyResults([])
                      setNotFound(false)
                    }
                  }}
                  onKeyDown={e => e.key === 'Enter' && handleCheck()}
                  className="h-14 pl-12 rounded-2xl bg-white shadow-sm border-gray-200 focus:border-emerald-300 focus:ring-emerald-200 text-base"
                />
              </div>
              <Button
                onClick={handleCheck}
                className="h-14 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Check Price
              </Button>
            </div>
          </div>

          {/* Loading State with Skeleton */}
          {loading && (
            <div className="space-y-4">
              <div className="flex justify-center py-12">
                <div className="relative">
                  <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-30 w-10 h-10" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="rounded-2xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="animate-pulse space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Not Found */}
          {!loading && notFound && (
            <Card className="rounded-3xl shadow-sm bg-white border-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-br from-amber-400 to-orange-400" />
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-5">
                  <PackageSearch className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                  No weekly data found
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  No approved market records found for "{productQuery}" in the last 7 days. 
                  Try searching for a different product or check back later.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Weekly Summary Dashboard */}
          {!loading && weeklyResults.length > 0 && weeklyStats && (
            <>
              <Card className="rounded-3xl shadow-xl border-0 bg-white mb-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-br from-emerald-500 to-teal-500" />
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm font-medium">7-Day Analysis</span>
                      </div>
                      <h2 className="text-4xl font-bold capitalize text-gray-800">
                        {productQuery}
                      </h2>
                      <p className="text-gray-500 mt-1">Weekly market summary</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Badge className={`px-4 py-2 rounded-full text-sm font-medium ${
                        weeklyStats.trend === 'up' ? 'bg-red-100 text-red-700' :
                        weeklyStats.trend === 'down' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {weeklyStats.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                        {weeklyStats.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                        {weeklyStats.trend === 'stable' && <Minus className="w-4 h-4 mr-1" />}
                        {weeklyStats.trend === 'up' ? 'Price Rising' : 
                         weeklyStats.trend === 'down' ? 'Price Falling' : 'Stable'}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 text-center">
                      <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Average Price</p>
                      <h3 className="text-3xl font-bold text-emerald-700">
                        {weeklyStats.avg} ETB
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 text-center">
                      <TrendingUp className="w-6 h-6 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Highest</p>
                      <h3 className="text-3xl font-bold text-red-600">
                        {weeklyStats.max} ETB
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 text-center">
                      <TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Lowest</p>
                      <h3 className="text-3xl font-bold text-green-600">
                        {weeklyStats.min} ETB
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 text-center">
                      <Store className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Market Reports</p>
                      <h3 className="text-3xl font-bold text-blue-600">
                        {weeklyStats.count}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Results List */}
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    Weekly Approved Records
                  </h3>
                  <p className="text-sm text-gray-400">
                    Last 7 days
                  </p>
                </div>

                <div className="grid gap-4">
                  {weeklyResults.map((item, idx) => (
                    <Card 
                      key={item.id} 
                      className="rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <CardContent className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xl text-gray-800 capitalize">
                              {item.product?.name}
                            </h4>
                            <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs">
                              {item.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="text-sm text-gray-500 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.woreda?.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(item.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="text-right sm:text-left">
                          <div className="flex items-center gap-2 sm:justify-end">
                            <BadgeCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-gray-400">Verified</span>
                          </div>
                          <h2 className="text-2xl font-bold text-emerald-700 mt-1">
                            {item.price} <span className="text-sm font-normal text-gray-400">ETB</span>
                          </h2>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Enhanced Latest Prices Section */}
          {!loading && !isSearching && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Latest Approved Prices
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Most recent market reports from across Ethiopia
                  </p>
                </div>
                <Button variant="ghost" className="text-emerald-600 group">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {latestApproved.map((item, idx) => (
                  <Card
                    key={item.id}
                    className="rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 group cursor-pointer overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-br from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition" />
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg capitalize text-gray-800">
                          {item.product?.name}
                        </h3>
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.woreda?.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <div className="border-t border-gray-100 pt-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-gray-400">Price</span>
                          <span className="text-xl font-bold text-emerald-700">
                            {item.price} ETB
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State with CTA */}
          {!loading && data.length === 0 && !isSearching && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No market data available
              </h3>
              <p className="text-gray-400">
                Check back later for updated price information.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}