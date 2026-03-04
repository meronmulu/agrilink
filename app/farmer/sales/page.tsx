'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import SalesMetricsCards from '@/components/SalesMetricsCards'
import SalesTransactionsTable from '@/components/SalesTransactionsTable'
import RevenueAnalytics from '@/components/RevenueAnalytics'
import NeedLogisticsBanner from '@/components/NeedLogisticsBanner'

export default function SalesDashboard() {
    const { t } = useLanguage()

    // Mock data for the metrics
    const mockMetrics = {
        totalRevenue: 'ETB 450,230',
        revenueTrend: '+12% from last month',
        ordersCompleted: 142,
        ordersTrend: '8 new this week',
        avgOrderValue: 'ETB 3,170',
        avgOrderTrend: 'Stable vs last month'
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('sales_title')}</h1>
                    <p className="text-gray-500 mt-1">{t('sales_subtitle')}</p>
                </div>

                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-semibold h-11 px-6">
                    <Download size={18} className="mr-2" />
                    {t('sales_download_report')}
                </Button>
            </div>

            {/* Top KPIs */}
            <SalesMetricsCards metrics={mockMetrics} t={t} />

            {/* Main Content & Sidebar */}
            <div className="flex flex-col xl:flex-row gap-6">

                {/* Left Area (Table) */}
                <div className="flex-1 min-w-0">
                    <SalesTransactionsTable t={t} />
                </div>

                {/* Right Area (Chart + Ad) */}
                <div className="w-full xl:w-80 shrink-0 space-y-6">
                    <RevenueAnalytics t={t} />
                    <NeedLogisticsBanner t={t} />
                </div>

            </div>
        </div>
    )
}
