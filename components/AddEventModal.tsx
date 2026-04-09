'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '@/lib/axios/axios'

type EventStatus = 'On Track' | 'Risk of delay' | 'Completed'

export interface HarvestEvent {
    id: string
    cropName: string
    date: string         // ISO date string e.g. "2025-10-15"
    expectedYieldKg: number
    status: EventStatus
}

const STATUSES: EventStatus[] = ['On Track', 'Risk of delay', 'Completed']

interface AddEventModalProps {
    open: boolean
    onClose: () => void
    onSaved: (event: HarvestEvent) => void
}

export default function AddEventModal({ open, onClose, onSaved }: AddEventModalProps) {
    const [form, setForm] = useState({
        cropName: '',
        date: '',
        expectedYieldKg: '',
        status: 'On Track' as EventStatus,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setForm({ cropName: '', date: '', expectedYieldKg: '', status: 'On Track' })
            setError(null)
        }
    }, [open])

    const set = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.cropName.trim()) return setError('Crop name is required.')
        if (!form.date) return setError('Date is required.')
        if (!form.expectedYieldKg || Number(form.expectedYieldKg) <= 0)
            return setError('Expected yield must be greater than 0.')

        const payload = {
            cropName: form.cropName.trim(),
            date: form.date,
            expectedYieldKg: Number(form.expectedYieldKg),
            status: form.status,
        }

        setLoading(true)
        try {
            const res = await api.post('/api/harvest-events', payload)
            onSaved(res.data as HarvestEvent)
            onClose()
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Something went wrong. Please try again.'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays size={18} className="text-emerald-500" />
                        Add Harvest Event
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Crop Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name *</label>
                        <Input
                            value={form.cropName}
                            onChange={(e) => set('cropName', e.target.value)}
                            placeholder="e.g. Wheat, Maize"
                            className="h-10 border-gray-200"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Harvest Date *</label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => set('date', e.target.value)}
                            className="h-10 border-gray-200"
                            required
                        />
                    </div>

                    {/* Expected Yield */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Expected Yield (kg) *
                        </label>
                        <Input
                            type="number"
                            min={1}
                            value={form.expectedYieldKg}
                            onChange={(e) => set('expectedYieldKg', e.target.value)}
                            placeholder="e.g. 4000"
                            className="h-10 border-gray-200"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => set('status', e.target.value as EventStatus)}
                            className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >
                            {STATUSES.map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                    Saving…
                                </>
                            ) : (
                                'Add Event'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
