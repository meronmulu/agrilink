'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Award, TrendingUp, UserPlus, GraduationCap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAgentStats, getAgentActivities, AgentStats, RecentActivity } from '@/services/agentService'

export default function AgentDashboard() {
    const router = useRouter()
    const [stats, setStats] = useState<AgentStats | null>(null)
    const [activities, setActivities] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, activitiesData] = await Promise.all([
                    getAgentStats(),
                    getAgentActivities()
                ])
                setStats(statsData)
                setActivities(activitiesData)
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load dashboard data</p>
            </div>
        )
    }

    const statsArray = [
        { title: 'Total Registered Farmers', value: stats.totalFarmers.toString(), icon: Users, color: 'text-emerald-600' },
        { title: 'Training Sessions Held', value: stats.trainingSessions.toString(), icon: BookOpen, color: 'text-blue-600' },
        { title: 'Certifications Issued', value: stats.certificationsIssued.toString(), icon: Award, color: 'text-purple-600' },
        { title: 'Monthly Growth', value: `+${stats.monthlyGrowth}%`, icon: TrendingUp, color: 'text-amber-600' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Agent Overview</h1>
                <p className="text-gray-500 mt-1">Monitor your farmer registration and training activities.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsArray.map((stat, i) => (
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    onClick={() => router.push('/agent/register-farmer')}
                    className="h-20 bg-emerald-500 hover:bg-emerald-600 flex flex-col items-center justify-center gap-2"
                >
                    <UserPlus size={24} />
                    <span>Register Farmer</span>
                </Button>
                <Button
                    onClick={() => router.push('/agent/farmer')}
                    variant="outline"
                    className="h-20 border-blue-200 text-blue-600 hover:bg-blue-50 flex flex-col items-center justify-center gap-2"
                >
                    <Users size={24} />
                    <span>View Farmers</span>
                </Button>
                <Button
                    onClick={() => router.push('/agent/training')}
                    variant="outline"
                    className="h-20 border-purple-200 text-purple-600 hover:bg-purple-50 flex flex-col items-center justify-center gap-2"
                >
                    <GraduationCap size={24} />
                    <span>Training Modules</span>
                </Button>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((activity) => (
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
