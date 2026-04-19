'use client'

import { useEffect, useState } from 'react'
import { getFarmerOrders } from '@/services/orderService'
import { useLanguage } from '@/context/LanguageContext'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Loader2 } from 'lucide-react'
import { Order } from '@/types/order'
import Image from 'next/image'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export default function FarmerOrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // FILTER STATES
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateSort, setDateSort] = useState('NEWEST')

  // PAGINATION
  const [page, setPage] = useState(1)
  const pageSize = 7

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getFarmerOrders()
        setOrders(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // FILTER + SORT
  const filteredOrders = orders
    .filter(order => {
      const name = order.buyer?.profile?.fullName?.toLowerCase() || ''
      const matchesSearch = name.includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'ALL' || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()

      return dateSort === 'NEWEST' ? bTime - aTime : aTime - bTime
    })

  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  )

  const paidOrders = filteredOrders.filter(o => o.status === 'PAID').length

  // FLATTEN
  const allRows = filteredOrders.flatMap(order =>
    order.items.map(item => ({
      order,
      item
    }))
  )

  // RESET PAGE ON FILTER CHANGE
  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, dateSort])

  // PAGINATION LOGIC
  const totalPages = Math.ceil(allRows.length / pageSize)

  const paginatedRows = allRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="md:p-6 space-y-6">

      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-bold">
          {t('farmer_orders') || 'Farmer Orders'}
        </h1>
        <p className="text-gray-500 text-sm">
          Track all your orders and revenue
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className='py-4'>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {filteredOrders.length}
            </p>
          </CardContent>
        </Card>

        <Card className='py-4'>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Paid Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {paidOrders}
            </p>
          </CardContent>
        </Card>

        <Card className='py-4'>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {totalRevenue.toLocaleString()} ETB
            </p>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS (WHITE CARD) */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

          {/* SEARCH */}
          <Input
            placeholder="Search buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96"
          />

          <div className="flex gap-3">

            {/* STATUS */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* SORT */}
            

          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="overflow-x-auto">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (

                paginatedRows.map(({ order, item }) => (
                  <TableRow key={item.id}>

                    {/* BUYER */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={order.buyer?.profile?.imageUrl || "/default-avatar.png"}
                            alt="buyer"
                            fill
                            className="object-cover"
                          />
                        </div>
                        {order.buyer?.profile?.fullName || "Unknown"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>{order.buyer?.phone || "No phone"}</div>
                      <div className="text-xs text-gray-500">
                        {order.buyer?.email || "No email"}
                      </div>
                    </TableCell>

                    {/* PRODUCT */}
                    <TableCell>{item.product?.name}</TableCell>

                    <TableCell>{item.amount}</TableCell>

                    <TableCell>
                      {item.priceAtOrder} ETB
                    </TableCell>

                    <TableCell className="font-semibold">
                      {order.totalAmount} ETB
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs
                        ${order.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {order.status}
                      </span>
                    </TableCell>

                    {/* DATE */}
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                  </TableRow>
                ))

              )}

            </TableBody>
          </Table>

          {/* PAGINATION */}
          <Pagination className="mt-4">
            <PaginationContent>

              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

            </PaginationContent>
          </Pagination>

        </CardContent>
      </Card>

    </div>
  )
}