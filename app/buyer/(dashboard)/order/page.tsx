'use client'

import { useEffect, useState } from "react"
import { getMyOrders } from "@/services/orderService"
import { Order } from "@/types/order"

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

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

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

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Package className="w-10 h-10 mb-3" />
        <p>No orders yet</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <Card className=" ">
        <CardContent className="p-4">
          <div className="overflow-x-auto">        <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                {/* <TableHead>Payment</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.flatMap((order) =>
                order.items.map((item) => (
                  <TableRow key={item.id}>

                    <TableCell>
                      <div className="flex items-center gap-3">

                        <Image
                          src={item.product?.image }
                          alt={item.product?.name }
                          width={40}
                          height={40}
                          className="rounded-md object-cover border"
                        />

                        <span className="font-medium text-gray-800">
                          {item.product?.name}
                        </span>

                      </div>
                    </TableCell>

                    {/* QUANTITY */}
                    <TableCell>{item.amount}</TableCell>

                    {/* PRICE */}
                    <TableCell>{item.priceAtOrder} ETB</TableCell>

                    {/* TOTAL PRICE */}
                    <TableCell className="font-medium">
                      {item.amount * item.priceAtOrder} ETB
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>

                    {/* DATE */}
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* PAYMENT */}
                    {/* <TableCell>
                      {order.status === "PENDING" && order.paymentUrl ? (
                        <a
                          href={order.paymentUrl}
                          target="_blank"
                          className="text-blue-600 underline text-sm"
                        >
                          Pay Now
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </TableCell> */}

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}