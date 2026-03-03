import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const transactions = [
    { id: '#ORD-9924', buyer: 'Addis Wholesalers', product: 'Premium Teff (500kg)', amount: 'ETB 77,500', status: 'Paid', date: 'Oct 24, 2023' },
    { id: '#ORD-9923', buyer: 'Hilton Addis', product: 'Avocados (200kg)', amount: 'ETB 15,000', status: 'Shipped', date: 'Oct 23, 2023' },
    { id: '#ORD-9922', buyer: 'FreshCorner', product: 'Red Onions (100kg)', amount: 'ETB 8,500', status: 'Pending', date: 'Oct 22, 2023' },
    { id: '#ORD-9921', buyer: 'Juice Co. Factory', product: 'Mangoes (1000kg)', amount: 'ETB 45,000', status: 'Paid', date: 'Oct 20, 2023' },
    { id: '#ORD-9920', buyer: 'Local Market', product: 'Mixed Veg (50kg)', amount: 'ETB 2,500', status: 'Paid', date: 'Oct 18, 2023' },
    { id: '#ORD-9919', buyer: 'Addis Wholesalers', product: 'Coffee Beans (200kg)', amount: 'ETB 62,000', status: 'Paid', date: 'Oct 15, 2023' },
]

export default function SalesTransactionsTable({ t }: { t: any }) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid':
                return <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-xs">{t('sales_status_paid')}</span>
            case 'Shipped':
                return <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-md text-xs">{t('sales_status_shipped')}</span>
            case 'Pending':
                return <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-md text-xs">{t('sales_status_pending')}</span>
            default:
                return <span>{status}</span>
        }
    }

    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border overflow-hidden">

            {/* Header and Filters */}
            <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-emerald-500">🧾</span> {t('sales_transactions_title')}
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none border-gray-200 text-gray-600 h-9">
                        <Filter size={16} className="mr-2 text-gray-400" />
                        {t('sales_all_status')}
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none border-gray-200 text-gray-600 h-9">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {t('sales_this_month')}
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 font-semibold uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">{t('sales_col_order_id')}</th>
                            <th className="px-6 py-4">{t('sales_col_buyer')}</th>
                            <th className="px-6 py-4">{t('sales_col_amount')}</th>
                            <th className="px-6 py-4">{t('sales_col_status')}</th>
                            <th className="px-6 py-4">{t('sales_col_date')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((tx, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-emerald-600 whitespace-nowrap">{tx.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="font-semibold text-gray-900">{tx.buyer}</p>
                                    <p className="text-xs text-gray-500">{tx.product}</p>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{tx.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(tx.status)}</td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{tx.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                <p className="text-sm text-gray-500 font-medium">
                    {t('sales_showing_results').replace('{start}', '1').replace('{end}', '6').replace('{total}', '42')}
                </p>
                <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 text-gray-400" disabled>
                        <ChevronLeft size={16} />
                    </Button>
                    <Button variant="outline" className="h-9 w-9 border-emerald-500 bg-emerald-50 text-emerald-700 font-bold pointer-events-none p-0">
                        1
                    </Button>
                    <Button variant="outline" className="h-9 w-9 border-gray-200 text-gray-600 hover:bg-gray-50 p-0">
                        2
                    </Button>
                    <Button variant="outline" className="h-9 w-9 border-gray-200 text-gray-600 hover:bg-gray-50 p-0">
                        3
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 text-gray-600 hover:bg-gray-50">
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

        </Card>
    )
}
