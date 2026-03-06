'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, CheckCircle2, AlertTriangle, Plus, CheckCheck, Loader2 } from 'lucide-react'
import AddEventModal, { HarvestEvent } from '@/components/AddEventModal'
import api from '@/axios'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(iso: string) {
    const d = new Date(iso)
    return { month: MONTH_LABELS[d.getMonth()], day: String(d.getDate()).padStart(2, '0') }
}

const STATUS_CONFIG = {
    'On Track': { icon: <CheckCircle2 size={14} />, color: 'text-emerald-600', bg: 'bg-blue-50 text-blue-600' },
    'Risk of delay': { icon: <AlertTriangle size={14} />, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-600' },
    'Completed': { icon: <CheckCheck size={14} />, color: 'text-gray-500', bg: 'bg-gray-50 text-gray-500' },
}

export default function HarvestForecast() {
    const [events, setEvents] = useState<HarvestEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const fetchEvents = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get<HarvestEvent[]>('/api/harvest-events?farmer=me')
            setEvents(res.data)
        } catch {
            // silently fail – show empty state
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchEvents() }, [fetchEvents])

    const handleSaved = (event: HarvestEvent) => {
        setEvents((prev) => [...prev, event])
    }

    return (
        <>
            <AddEventModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
            />

            <Card className="rounded-2xl border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <CalendarDays className="text-emerald-500" size={20} />
                        Harvest Forecast
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-6 text-gray-400">
                            <Loader2 size={22} className="animate-spin mr-2" />
                            <span className="text-sm">Loading events…</span>
                        </div>
                    ) : events.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            No upcoming harvest events yet.
                        </p>
                    ) : (
                        events.map((ev, idx) => {
                            const { month, day } = formatDate(ev.date)
                            const cfg = STATUS_CONFIG[ev.status] ?? STATUS_CONFIG['On Track']
                            return (
                                <React.Fragment key={ev.id}>
                                    {idx > 0 && <div className="h-px bg-gray-100 w-full" />}
                                    <div className="flex gap-4">
                                        <div className={`flex flex-col items-center justify-center ${cfg.bg} rounded-xl px-3 py-2 h-14 min-w-[56px]`}>
                                            <span className="text-xs font-bold uppercase">{month}</span>
                                            <span className="text-lg font-extrabold leading-none">{day}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{ev.cropName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5 mb-1.5">
                                                Expected yield: {ev.expectedYieldKg.toLocaleString()}kg
                                            </p>
                                            <div className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
                                                {cfg.icon}
                                                <span>{ev.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })
                    )}

                    {/* Add Event Button */}
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-full py-2.5 mt-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                    >
                        <Plus size={16} />
                        Add Harvest Event
                    </button>
                </CardContent>
            </Card>
        </>
    )
}
