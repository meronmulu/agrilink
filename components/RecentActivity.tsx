import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { History, Loader2 } from 'lucide-react'
import { getBuyerActivities } from '@/services/buyerService'
import type { RecentActivity } from '@/services/buyerService'
import { useLanguage } from '@/context/LanguageContext'

export default function RecentActivity() {
    const { t } = useLanguage()
    const [activities, setActivities] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await getBuyerActivities()
                setActivities(data)
            } catch (error) {
                console.error('Failed to fetch activities:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const getActivityColor = (type: string) => {
        switch (type) {
            case 'order': return 'bg-emerald-500'
            case 'negotiation': return 'bg-blue-500'
            case 'review': return 'bg-purple-500'
            default: return 'bg-gray-300'
        }
    }

    if (loading) {
        return (
            <Card className="rounded-2xl border-gray-100 shadow-sm border mt-6">
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <History className="text-emerald-500" size={20} />
                        {t('recent_activity') || 'Recent Activity'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border mt-6">
            <CardHeader className="p-4 sm:p-6 border-b border-gray-50 bg-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <History className="text-emerald-500 shrink-0" size={20} />
                    {t('recent_activity') || 'Recent Activity'}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 bg-white">
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-2">

                    {activities.map((activity) => (
                        <div key={activity.id} className="relative pl-6">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${getActivityColor(activity.type)}`}></div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{activity.title}</h4>
                                <span className="text-xs font-medium text-gray-400 shrink-0">{activity.time}</span>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                        </div>
                    ))}

                </div>
            </CardContent>
        </Card>
    )
}
