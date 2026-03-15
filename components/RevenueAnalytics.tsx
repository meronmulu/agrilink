import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart } from 'lucide-react'

export default function RevenueAnalytics({ t }: { t: any }) {
    // A simple static visual representation of the chart
    const bars = [
        { month: 'May', height: 'h-12', color: 'bg-gray-200' },
        { month: 'Jun', height: 'h-16', color: 'bg-emerald-200' },
        { month: 'Jul', height: 'h-24', color: 'bg-emerald-400' },
        { month: 'Aug', height: 'h-20', color: 'bg-emerald-300' },
        { month: 'Sep', height: 'h-32', color: 'bg-emerald-500' },
        { month: 'Oct', height: 'h-40', color: 'bg-emerald-600' },
    ]

    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <BarChart className="text-emerald-500" size={20} />
                    {t('sales_revenue_analytics')}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {/* Chart Area */}
                <div className="h-48 mt-4 flex items-end justify-between px-2 gap-2">
                    {bars.map((bar, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                            <div className={`w-full max-w-6 ${bar.height} rounded-t-sm ${bar.color} opacity-90 transition-all hover:opacity-100 cursor-pointer`}></div>
                            <span className={`text-[10px] font-medium ${idx === bars.length - 1 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                                {bar.month}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Stats Below Chart */}
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                            {t('sales_chart_best_month')}
                        </p>
                        <p className="font-bold text-gray-900">October</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mb-1">
                            {t('sales_chart_total_year')}
                        </p>
                        <p className="font-bold text-gray-900">ETB 450k</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
