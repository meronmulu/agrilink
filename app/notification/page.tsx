'use client'

import { useEffect, useState } from 'react'
import { Bell, Calendar, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getNotifications } from '@/services/notificationService'

type NotificationType = {
  id: string
  title: string
  message: string
  createdAt: string
  isRead?: boolean
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const res = await getNotifications()
      setNotifications(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-24">
        <div className="max-w-3xl mx-auto">

          <Button variant="ghost" onClick={() => router.back()} className="mb-5">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Bell className="w-8 h-8 text-emerald-600" />
              Notifications
            </h1>
            <p className="text-gray-500 mt-2">
              Latest alerts, approvals, market updates and system messages.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <Bell className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">
                  No notifications yet
                </h2>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className="rounded-2xl border border-gray-100 hover:shadow-md transition"
                >
                  <CardContent className="px-5 py-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {n.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}