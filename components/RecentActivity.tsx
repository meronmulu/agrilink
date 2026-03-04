import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { History } from 'lucide-react'

// Mock Data
const activities = [
    {
        id: 1,
        title: 'Order #4592 Shipped',
        description: 'Your order of 100kg Red Onions from Gojjam Co-op has been dispatched.',
        time: '2h ago',
        color: 'bg-emerald-500' // Green dot
    },
    {
        id: 2,
        title: 'New Message from Farmer Abebe',
        description: '"I can offer 165 ETB for bulk if you can pick it up..."',
        time: '5h ago',
        color: 'bg-blue-500' // Blue dot
    },
    {
        id: 3,
        title: 'Payment Successful',
        description: 'Payment of ETB 12,500 released to Alemitu Coffee for Order #4580.',
        time: 'Yesterday',
        color: 'bg-gray-300' // Gray dot
    }
]

export default function RecentActivity() {
    return (
        <Card className="rounded-2xl border-gray-100 shadow-sm border mt-6">
            <CardHeader className="p-4 sm:p-6 border-b border-gray-50 bg-white">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                    <History className="text-emerald-500 shrink-0" size={20} />
                    Recent Activity
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 bg-white">
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-2">

                    {activities.map((activity) => (
                        <div key={activity.id} className="relative pl-6">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white ${activity.color}`}></div>

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
