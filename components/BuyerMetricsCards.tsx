import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Handshake, Bookmark, Wallet } from 'lucide-react'

// Mock Data
const metrics = {
    totalOrders: 12,
    activeNegotiations: 5,
    savedFarms: 8,
    walletBalance: '45,200',
}

export default function BuyerMetricsCards() {
    return (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">

            {/* Total Orders */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Total Orders</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{metrics.totalOrders}</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Active Negotiations */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Handshake size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 leading-tight">Active<br className="hidden xl:block" /> Negotiations</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{metrics.activeNegotiations}</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Saved Farms */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                        <Bookmark size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Saved Farms</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{metrics.savedFarms}</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Wallet Balance */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Wallet size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">Wallet Balance</p>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-none flex items-baseline gap-1 break-all">
                            <span className="text-xs sm:text-sm font-bold">ETB</span>
                            {metrics.walletBalance}
                        </h3>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
