// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { getMyOrders, checkoutOrder } from '@/services/orderService'
// import { getProductById } from '@/services/productService'

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Skeleton } from '@/components/ui/skeleton'

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<any[]>([])
//   const [products, setProducts] = useState<any>({})
//   const [loading, setLoading] = useState(true)

//   const [page, setPage] = useState(1)
//   const perPage = 5

//   // Fetch orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await getMyOrders()
//         setOrders(data)
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [])

//   // Fetch product names
//   useEffect(() => {
//     const fetchProducts = async () => {
//       let map: any = {}

//       for (const order of orders) {
//         for (const item of order.items) {
//           if (!map[item.productId]) {
//             try {
//               const p = await getProductById(item.productId)
//               map[item.productId] = p.name
//             } catch {
//               map[item.productId] = 'Unknown'
//             }
//           }
//         }
//       }

//       setProducts(map)
//     }

//     if (orders.length) fetchProducts()
//   }, [orders])

//   // Pagination
//   const paginated = orders.slice(
//     (page - 1) * perPage,
//     page * perPage
//   )

//   // Skeleton loading
//   if (loading) {
//     return (
//       <div className="p-6 space-y-3">
//         <Skeleton className="h-6 w-40" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">My Orders</h1>

//       <div className="bg-white rounded-xl border shadow-sm">
//         <Table>

//           <TableHeader>
//             <TableRow>
//               <TableHead>Order ID</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead>Items</TableHead>
//               <TableHead>Total</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {paginated.map((order) => (
//               <TableRow key={order.id}>

//                 {/* ID */}
//                 <TableCell className="text-xs">
//                   <Link href={`/orders/${order.id}`}>
//                     {order.id.slice(0, 8)}...
//                   </Link>
//                 </TableCell>

//                 {/* DATE */}
//                 <TableCell>
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </TableCell>

//                 {/* ITEMS */}
//                 <TableCell>
//                   {order.items.map((item: any) => (
//                     <div key={item.id} className="text-xs">
//                       • {products[item.productId] || 'Loading...'} (x{item.amount})
//                     </div>
//                   ))}
//                 </TableCell>

//                 {/* TOTAL */}
//                 <TableCell className="font-semibold">
//                   ETB {order.totalAmount.toLocaleString()}
//                 </TableCell>

//                 {/* STATUS */}
//                 <TableCell>
//                   <Badge
//                     variant={
//                       order.status === 'PAID'
//                         ? 'default'
//                         : order.status === 'PENDING'
//                         ? 'secondary'
//                         : 'destructive'
//                     }
//                   >
//                     {order.status}
//                   </Badge>
//                 </TableCell>

//                 {/* ACTION */}
//                 <TableCell>
//                   {order.status === 'PENDING' && (
//                     <Button
//                       size="sm"
//                       onClick={async () => {
//                         try {
//                           const res = await checkoutOrder()
//                           if (res?.checkout_url) {
//                             window.location.href = res.checkout_url
//                           }
//                         } catch (err) {
//                           console.error(err)
//                         }
//                       }}
//                     >
//                       Pay Now
//                     </Button>
//                   )}
//                 </TableCell>

//               </TableRow>
//             ))}
//           </TableBody>

//         </Table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex gap-2 mt-4">
//         <Button
//           variant="outline"
//           onClick={() => setPage(p => p - 1)}
//           disabled={page === 1}
//         >
//           Prev
//         </Button>

//         <Button
//           variant="outline"
//           onClick={() => setPage(p => p + 1)}
//           disabled={page * perPage >= orders.length}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   )
// }