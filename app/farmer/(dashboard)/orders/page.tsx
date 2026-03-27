'use client'

import { useEffect, useState } from 'react'
import { getFarmerOrders } from '@/services/orderService'
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

export default function FarmerOrdersPage() {
const [orders, setOrders] = useState<Order[]>([])
const [loading, setLoading] = useState(true)

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

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  )

  const paidOrders = orders.filter(o => o.status === 'PAID').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    )
  }

  return (
    <div className="md:p-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Farmer Orders</h1>
        <p className="text-gray-500 text-sm">
          Track all your orders and revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border rounded-2xl p-5">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border rounded-2xl p-5">
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

        <Card className="shadow-sm border rounded-2xl p-5">
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

      {/* Table */}
      <Card className="shadow-sm border rounded-2xl">
       

        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className='py-5'>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map(order =>
                  order.items?.map(item => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="font-medium">
                        {order.buyer?.email || 'N/A'}
                      </TableCell>

                      <TableCell>
                        {item.product?.name || 'N/A'}
                      </TableCell>

                      <TableCell>{item.amount}</TableCell>

                      <TableCell>
                        {item.priceAtOrder?.toLocaleString()} {order.currency}
                      </TableCell>

                      <TableCell className="font-semibold">
                        {order.totalAmount?.toLocaleString()} {order.currency}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
                            order.status === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}