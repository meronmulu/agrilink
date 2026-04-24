'use client'

import { useEffect, useState } from "react"
import { getProducts } from "@/services/productService"
import { getUsers } from "@/services/authService"
import { Product } from "@/types/product"
import { User } from "@/types/auth"
import { useLanguage } from "@/context/LanguageContext"

// Shadcn UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface ChartData {
  month: string
  users: number
  products: number
}

export default function AdminDashboardPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  function groupDataByMonth(products: Product[], users: User[]): ChartData[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const monthlyData: ChartData[] = months.map((m) => ({
      month: m,
      users: 0,
      products: 0,
    }))

    // Users per month
    users.forEach((user) => {
      if (!user.createdAt) return
      const date = new Date(user.createdAt)
      const monthIndex = date.getMonth()
      monthlyData[monthIndex].users += 1
    })

    // Products added per month
    products.forEach((product) => {
      if (!product.createdAt) return
      const date = new Date(product.createdAt)
      const monthIndex = date.getMonth()
      monthlyData[monthIndex].products += 1
    })

    return monthlyData
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, usersData] = await Promise.all([
          getProducts(),
          getUsers()
        ])

        const safeProducts = productsData || []
        const safeUsers = usersData || []

        setProducts(safeProducts)
        setUsers(safeUsers)

        setTotalProducts(safeProducts.length)
        setTotalUsers(safeUsers.length)

        const orders = safeProducts.reduce(
          (acc: number, p: Product) => acc + (p.amount || 0),
          0
        )

        const revenue = safeProducts.reduce(
          (acc: number, p: Product) =>
            acc + (p.amountSold && p.price ? p.amount * Number(p.price) : 0),
          0
        )

        setTotalOrders(orders)
        setTotalRevenue(revenue)

        const realChartData = groupDataByMonth(safeProducts, safeUsers)
        setChartData(realChartData)

      } catch (error) {
        console.error("Dashboard load error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const recentProducts = products.slice(0, 5)
  const recentUsers = users.slice(0, 5)

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }
  return (
    <div className="p-4 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
        <p className="text-gray-500">{t('overview_of_products_and_users')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_products')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">{totalProducts}</CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_users')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">{totalUsers}</CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_orders')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-purple-600">{totalOrders}</CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_revenue')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-orange-600">
            ${totalRevenue.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="py-4">
        <CardHeader>
          <CardTitle>{t('monthly_overview')}</CardTitle>
        </CardHeader>
        <CardContent className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="products" stroke="#10B981" strokeWidth={2} />
              </LineChart>

          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="py-4">
          <CardHeader><CardTitle>{t('recent_products')}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('product')}</TableHead>
                  <TableHead>{t('category')}</TableHead>
                  <TableHead>{t('price')}</TableHead>
                  <TableHead>{t('sold')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border">

                        <Image
                          src={p.image || "/placeholder.png"}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />

                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {p.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{typeof p.subCategory === 'string' ? p.subCategory : p.subCategory?.name || "N/A"}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.amountSold || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('recent_users')}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('email')}</TableHead>
                  <TableHead>{t('role')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={u.profile?.imageUrl || "/placeholder.png"}
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
                          {u.profile?.fullName || t('unknown_farmer')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {u.email}
                      {u.phone && (
                        <div className="text-xs text-gray-400">
                          {u.phone}
                        </div>
                      )}

                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{u.role}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}