'use client'

import { useEffect, useState } from "react"
import { getProducts, addAllProducts } from "@/services/productService"
import { getUsers } from "@/services/authService"
import { Product } from "@/types/product"
import { User } from "@/types/auth"
import { useLanguage } from "@/context/LanguageContext"

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
import { toast } from "sonner"

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

  // dialog state
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ONLY NAME (Swagger compliant)
  const [form, setForm] = useState({
    name: "",
  })

  function groupDataByMonth(products: Product[], users: User[]): ChartData[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const monthlyData: ChartData[] = months.map((m) => ({
      month: m,
      users: 0,
      products: 0,
    }))

    users.forEach((user) => {
      if (!user.createdAt) return
      monthlyData[new Date(user.createdAt).getMonth()].users += 1
    })

    products.forEach((product) => {
      if (!product.createdAt) return
      monthlyData[new Date(product.createdAt).getMonth()].products += 1
    })

    return monthlyData
  }

  const loadData = async () => {
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

    setTotalOrders(
      safeProducts.reduce((acc, p) => acc + (p.amount || 0), 0)
    )

    setTotalRevenue(
      safeProducts.reduce(
        (acc, p) =>
          acc + (p.amountSold && p.price ? p.amount * Number(p.price) : 0),
        0
      )
    )

    setChartData(groupDataByMonth(safeProducts, safeUsers))
  }

  useEffect(() => {
    loadData().finally(() => setLoading(false))
  }, [])

  const handleCreateProduct = async () => {
    try {
      setSubmitting(true)

      await addAllProducts({
        name: form.name.trim(),
      })

      setOpen(false)
      setForm({ name: "" })

      await loadData()
      toast.success("Product created successfully")
    } catch (err) {
      console.error("Create product failed:", err)
    } finally {
      setSubmitting(false)
    }
  }

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

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
          <p className="text-gray-500">
            {t('overview_of_products_and_users')}
          </p>
        </div>

        {/* ADD PRODUCT */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className='bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white '>
              Add Product</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                placeholder="Product name"
                value={form.name}
                onChange={(e) =>
                  setForm({ name: e.target.value })
                }
              />

              <Button className='bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white '

                onClick={handleCreateProduct}
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_products')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">
            {totalProducts}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_users')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {totalUsers}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_orders')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-purple-600">
            {totalOrders}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_revenue')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-orange-600">
            ${totalRevenue.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* CHART */}
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
              <Line type="monotone" dataKey="users" stroke="#4F46E5" />
              <Line type="monotone" dataKey="products" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TABLES (UNCHANGED) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* recent products */}
        <Card className="py-4">
          <CardHeader><CardTitle>{t('recent_products')}</CardTitle></CardHeader>
          <CardContent>
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
                    <TableCell className='flex items-center gap-3'>
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                        <Image
                          src={p.image || "/placeholder.png"}
                          alt={p.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      {p.name}
                    </TableCell>
                    <TableCell>
                      {typeof p.subCategory === 'string'
                        ? p.subCategory
                        : p.subCategory?.name || "N/A"}
                    </TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.amountSold || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* recent users */}
        <Card className="py-4">
          <CardHeader><CardTitle>{t('recent_users')}</CardTitle></CardHeader>
          <CardContent>
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
                    <TableCell className='flex items-center gap-3'>
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={u.profile?.imageUrl || "/placeholder.png"}
                          alt="User"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      {u.profile?.fullName || t('unknown_farmer')}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
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