'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  getProducts,
  addAllProducts,
  getAllProducts,
  deleteAllProduct,
  updateAllProduct,
} from '@/services/productService'
import { getUsers } from '@/services/authService'
import { Product } from '@/types/product'
import { User } from '@/types/auth'
import { useLanguage } from '@/context/LanguageContext'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ChartData {
  month: string
  users: number
  products: number
}

type AllProductItem = {
  id: string
  name: string
}

export default function AdminDashboardPage() {
  const { t } = useLanguage()

  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [allProducts, setAllProducts] = useState<AllProductItem[]>([])

  const [pageLoading, setPageLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState<AllProductItem | null>(null)
  const [editName, setEditName] = useState('')

  const [form, setForm] = useState({
    id: '',
    name: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const recentUsers = users.slice(0, 5)

  const totalPages = Math.ceil(allProducts.length / pageSize)

  const paginatedProducts = allProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  function groupDataByMonth(products: Product[], users: User[]): ChartData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

  const loadAllproducts = async () => {
    try {
      const data = await getAllProducts()
      console.log('ALL PRODUCTS RESPONSE:', data)

      setAllProducts(data?.product || data?.products || data || [])
    } catch (err) {
      console.error('LOAD ALL PRODUCTS ERROR:', err)
      setAllProducts([])
    }
  }

  const loadData = async () => {
    try {
      const [productsData, usersData] = await Promise.all([
        getProducts(),
        getUsers(),
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

      setChartData(groupDataByMonth(safeProducts, safeUsers))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const init = async () => {
      setPageLoading(true)
      await Promise.all([loadData(), loadAllproducts()])
      setPageLoading(false)
    }

    init()
  }, [])

  const handleCreateProduct = async () => {
    if (!form.name.trim()) return toast.error('Enter product name')

    try {
      setSubmitting(true)

      await addAllProducts({
        name: form.name.trim(),
      })

      toast.success('Product created successfully')
      setForm({ id: '', name: '' })
      setAddOpen(false)
      await loadAllproducts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditClick = (product: AllProductItem) => {
    setSelectedProduct(product)
    setEditName(product.name)
    setEditOpen(true)
  }

  const handleDeleteClick = (product: AllProductItem) => {
    setSelectedProduct(product)
    setDeleteOpen(true)
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !editName.trim()) return

    try {
      setSubmitting(true)

      await updateAllProduct(selectedProduct.id, {
        name: editName.trim(),
      })

      toast.success('Product updated successfully')
      setEditOpen(false)
      await loadAllproducts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      setSubmitting(true)

      await deleteAllProduct(selectedProduct.id)

      toast.success('Product deleted successfully')
      setDeleteOpen(false)
      await loadAllproducts()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete product')
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
          <p className="text-gray-500">{t('overview_of_products_and_users')}</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-emerald-600 to-teal-600 text-white">
              Add Product
            </Button>
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
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Button
                className="bg-linear-to-r from-emerald-600 to-teal-600 text-white"
                onClick={handleCreateProduct}
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_products')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{totalProducts}</CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_users')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{totalUsers}</CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader><CardTitle>{t('total_orders')}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{totalOrders}</CardContent>
        </Card>
      </div>

      <Card className="py-2">
        <CardHeader><CardTitle>{t('monthly_overview')}</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4F46E5" />
              <Line type="monotone" dataKey="products" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="py-2">
          <CardHeader><CardTitle>All Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-3">
                        <button onClick={() => handleEditClick(p)}>
                          <Pencil className="w-4 h-4 text-emerald-600" />
                        </button>

                        <button onClick={() => handleDeleteClick(p)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Card className="py-2">
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
                    <TableCell className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={u.profile?.imageUrl || '/placeholder.png'}
                          alt="User"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      {u.profile?.fullName || 'Unknown'}
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

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <DialogFooter>
            <Button
              className="bg-linear-to-r from-emerald-600 to-teal-600 text-white"
              onClick={handleUpdateProduct}
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to delete this product?</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}