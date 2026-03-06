'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react'

export default function AgentDashboard() {
    const stats = [
        { title: 'Total Registered Farmers', value: '142', icon: Users, color: 'text-emerald-600' },
        { title: 'Training Sessions Held', value: '24', icon: BookOpen, color: 'text-blue-600' },
        { title: 'Certifications Issued', value: '89', icon: Award, color: 'text-purple-600' },
        { title: 'Monthly Growth', value: '+12%', icon: TrendingUp, color: 'text-amber-600' },
    ]

    const recentActivity = [
        { id: 1, action: 'Registered new farmer', details: 'Abebe Kebede from Oromia Region', time: '2 hours ago' },
        { id: 2, action: 'Completed Training', details: '"Modern Irrigation Techniques" with 15 farmers', time: 'Yesterday' },
        { id: 3, action: 'Registered new farmer', details: 'Fatuma Hassan from Somali Region', time: 'Yesterday' },
        { id: 4, action: 'Issued Certification', details: 'Basic Agronomy to 10 farmers', time: '3 days ago' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Agent Overview</h1>
                <p className="text-gray-500 mt-1">Monitor your farmer registration and training activities.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <div>
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-500">{activity.details}</p>
                                </div>
                                <span className="ml-auto text-xs text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
