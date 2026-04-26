import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Handshake, Bookmark, Wallet, Loader2 } from 'lucide-react'
import { getBuyerMetrics, BuyerMetrics } from '@/services/buyerService'
import { useLanguage } from '@/context/LanguageContext'

export default function BuyerMetricsCards() {
    const { t } = useLanguage()
    const [metrics, setMetrics] = useState<BuyerMetrics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getBuyerMetrics()
                setMetrics(data)
            } catch (error) {
                console.error('Failed to fetch buyer metrics:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMetrics()
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8 px-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="rounded-2xl border-gray-100 shadow-sm border">
                        <CardContent className="p-4 sm:p-6">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (!metrics) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">{t('toast_failed_load_metrics')}</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8 px-6">
            {/* Total Orders */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border ">
                <CardContent className="p-4 sm:p-6  items-start  gap-4 h-full">
                    <div className='flex flex-row gap-4'>
                       <div className=" h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">{t('total_orders') || 'Total Orders'}</p>
                    </div> 
                    </div>
                    
                    <div>
                        
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
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 leading-tight">{t('active_negotiations') || 'Active Negotiations'}</p>
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
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">{t('saved_farms') || 'Saved Farms'}</p>
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
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">{t('wallet_balance') || 'Wallet Balance'}</p>
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
