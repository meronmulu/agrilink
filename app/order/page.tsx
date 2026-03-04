'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

interface Order {
    id: string
    date: string
    products: string
    totalAmount: string
    status: 'COMPLETED' | 'PROCESSING' | 'CANCELLED'
}

export default function OrdersPage() {
    //   const [orders] = useState<Order[]>([
    //     { id: '#AL-8821', date: 'Oct 12, 2023', products: 'Harar Coffee, Wheat', totalAmount: '45,000 ETB', status: 'COMPLETED' },
    //     { id: '#AL-9045', date: 'Oct 10, 2023', products: 'Arsi Teff', totalAmount: '12,200 ETB', status: 'PROCESSING' },
    //     { id: '#AL-9102', date: 'Oct 08, 2023', products: 'Jimma Coffee, Barley, Maize', totalAmount: '88,450 ETB', status: 'COMPLETED' },
    //     { id: '#AL-9188', date: 'Oct 05, 2023', products: 'Sidamo Coffee Beans', totalAmount: '32,100 ETB', status: 'CANCELLED' },
    //     { id: '#AL-9201', date: 'Oct 02, 2023', products: 'White Teff Premium', totalAmount: '15,600 ETB', status: 'COMPLETED' },
    //   ])

    //   const statusColors = {
    //     COMPLETED: 'success',
    //     PROCESSING: 'warning',
    //     CANCELLED: 'secondary',
    //   }


    return (

        <div>
            <Header />
            <div className="min-h-screen py-20">
                
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6  mx-10">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                                <p className="text-gray-500 mt-1">Manage and track your agricultural trade transactions.</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Badge variant="outline" className="px-4 py-1 text-sm font-medium">
                                    Total Orders
                                </Badge>
                            </div>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex  md:w-2xl flex-col md:flex-row items-center gap-4 mb-6 md:ml-20">
                            <Input
                                type="text"
                                placeholder="Search by Order ID or product..."
                                className="flex-1"
                            />
                           
                        </div>




                   
            </div>

            < Footer />
        </div>


    )
}