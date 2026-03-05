'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Search, Filter, MoreHorizontal, Download, Eye, FileText } from 'lucide-react'

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
            date: "2024-01-15",
            products: 3,
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
            date: "2024-01-14",
            products: 2,
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
            date: "2024-01-13",
            products: 5,
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
            date: "2024-01-12",
            products: 4,
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
            date: "2024-01-11",
            products: 6,
        },
        {
            invoice: "INV006",
            paymentStatus: "Pending",
            totalAmount: "$200.00",
            paymentMethod: "Bank Transfer",
            date: "2024-01-10",
            products: 2,
        },
        {
            invoice: "INV007",
            paymentStatus: "Unpaid",
            totalAmount: "$300.00",
            paymentMethod: "Credit Card",
            date: "2024-01-09",
            products: 3,
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'Unpaid':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || invoice.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const totalAmount = filteredInvoices.reduce((sum, invoice) => {
        return sum + parseFloat(invoice.totalAmount.replace('$', ''))
    }, 0)

    return (
        <div className="min-h-screen ">

            <main className="container mx-auto px-4 py-4 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                                My Orders
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage and track your agricultural trade transactions
                            </p>
                        </div>


                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className=" shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="">
                            <p className="text-sm font-medium text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                        </CardContent>
                    </Card>

                    <Card className=" shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="">
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                                {invoices.filter(i => i.paymentStatus === 'Paid').length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="">
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {invoices.filter(i => i.paymentStatus === 'Pending').length}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="">
                            <p className="text-sm font-medium text-gray-500">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${totalAmount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Across all orders</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search & Filters */}
                <Card className="mb-8  shadow-sm">
                    <CardContent className="">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by Order ID or payment method..."
                                    className="pl-10  "
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                    </SelectContent>
                                </Select>


                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card className="border-green-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-green-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-green-900">Invoice</TableHead>
                                    <TableHead className="font-semibold text-green-900">Date</TableHead>
                                    <TableHead className="font-semibold text-green-900">Status</TableHead>
                                    <TableHead className="font-semibold text-green-900">Method</TableHead>
                                    <TableHead className="font-semibold text-green-900">Products</TableHead>
                                    <TableHead className="font-semibold text-green-900 text-right">Amount</TableHead>
                                    <TableHead className="font-semibold text-green-900 text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((invoice) => (
                                        <TableRow
                                            key={invoice.invoice}
                                            className="hover:bg-green-50/50 transition-colors cursor-pointer group"
                                        >
                                            <TableCell className="font-medium text-gray-900">
                                                #{invoice.invoice}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {new Date(invoice.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`${getStatusColor(invoice.paymentStatus)} font-medium px-3 py-1`}
                                                >
                                                    {invoice.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{invoice.paymentMethod}</TableCell>
                                            <TableCell className="text-gray-600">{invoice.products} items</TableCell>
                                            <TableCell className="text-right font-semibold text-gray-900">
                                                {invoice.totalAmount}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0  group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4 text-black" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="h-12 w-12 text-gray-300" />
                                                <h3 className="text-lg font-semibold text-gray-700">No orders found</h3>
                                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>


                </Card>


            </main>

        </div>
    )
}