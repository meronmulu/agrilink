'use client'

import { useEffect, useState } from "react"
import { getMyOrders } from "@/services/orderService"
import { Order } from "@/types/order"
import { useLanguage } from "@/context/LanguageContext"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

import { Loader2, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

import { Input } from "@/components/ui/input"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

export default function BuyerOrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ FILTER STATES
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // ✅ PAGINATION
  const [page, setPage] = useState(1)
  const pageSize = 7

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data || [])
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // STATUS STYLE
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  //  FILTER LOGIC (NO DATE FILTER)
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items.some(item =>
      item.product?.name?.toLowerCase().includes(search.toLowerCase())
    )

    const matchesStatus =
      statusFilter === 'ALL' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
  }, [search, statusFilter])

  // PAGINATION
  const totalPages = Math.ceil(allRows.length / pageSize)

  const paginatedRows = allRows.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  // LOADING
  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  // EMPT

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4">

      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        {t('my_orders') || 'My Orders'}
      </h1>

      {/* FILTER CARD */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between flex-wrap">

          {/* SEARCH */}
          <Input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96"
          />

          {/* STATUS */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

         

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-4">
          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedRows.map(({ order, item }) => (
                <TableRow key={item.id}>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                        <Image
                          src={item.product?.image || "/placeholder.png"}
                          alt={item.product?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {item.product?.name}
                    </div>
                  </TableCell>

                  <TableCell>{item.amount}</TableCell>

                  <TableCell>{item.priceAtOrder} ETB</TableCell>

                  <TableCell>
                    {item.amount * item.priceAtOrder} ETB
                  </TableCell>

                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>

                </TableRow>
              ))}
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