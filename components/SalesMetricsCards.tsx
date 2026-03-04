import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Banknote, ShoppingBag, BarChart3 } from 'lucide-react'

interface MetricsProps {
    totalRevenue: string;
    revenueTrend: string;
    ordersCompleted: number;
    ordersTrend: string;
    avgOrderValue: string;
    avgOrderTrend: string;
}

export default function SalesMetricsCards({ metrics, t }: { metrics: MetricsProps, t: any }) {
    return (
        <div className="grid gap-6 md:grid-cols-3 mb-6">

            {/* Total Revenue */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{t('sales_total_revenue')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.totalRevenue}</h3>
                        <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <span className="text-emerald-500">↗</span> {metrics.revenueTrend}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Completed */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{t('sales_orders_completed')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.ordersCompleted}</h3>
                        <p className="text-xs font-medium text-blue-600">
                            + {metrics.ordersTrend}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Avg Order Value */}
            <Card className="rounded-2xl border-gray-100 shadow-sm border">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{t('sales_avg_order_value')}</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{metrics.avgOrderValue}</h3>
                        <p className="text-xs font-medium text-gray-500">
                            {metrics.avgOrderTrend}
                        </p>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
