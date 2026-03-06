'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, ChevronDown, Plus, Loader2, Sprout } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CropCard, { Crop } from '@/components/CropCard'
import HarvestForecast from '@/components/HarvestForecast'
import AIStorageTips from '@/components/AIStorageTips'
import AddCropModal from '@/components/AddCropModal'
import api from '@/axios'

const CATEGORIES = ['All Categories', 'Grains', 'Fruits', 'Vegetables', 'Commodity', 'Legumes', 'Spices', 'Other']
const STATUSES = ['All Status', 'In Stock', 'Low Stock', 'Out of Season']

export default function MyCropsPage() {
    const [crops, setCrops] = useState<Crop[]>([])
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)

    // Filters
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All Categories')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [showCatDrop, setShowCatDrop] = useState(false)
    const [showStatusDrop, setShowStatusDrop] = useState(false)
    const catRef = useRef<HTMLDivElement>(null)
    const statusRef = useRef<HTMLDivElement>(null)

    // Modals
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCrop, setEditingCrop] = useState<Crop | null>(null)

    // ─── Fetch crops ──────────────────────────────────────────────────
    const fetchCrops = useCallback(async () => {
        setLoading(true)
        setFetchError(null)
        try {
            const res = await api.get<Crop[]>('/api/crops?farmer=me')
            setCrops(res.data)
        } catch {
            setFetchError('Failed to load your crops. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchCrops() }, [fetchCrops])

    // ─── Close dropdowns on outside click ────────────────────────────
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCatDrop(false)
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusDrop(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])

    // ─── Filtered list ────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return crops.filter((c) => {
            const matchSearch = !q || c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
            const matchCat = categoryFilter === 'All Categories' || c.category === categoryFilter
            const matchStatus =
                statusFilter === 'All Status' ||
                c.status.replace(' (placeholder)', '') === statusFilter
            return matchSearch && matchCat && matchStatus
        })
    }, [crops, search, categoryFilter, statusFilter])

    // ─── Modal callbacks ──────────────────────────────────────────────
    const openAdd = () => { setEditingCrop(null); setModalOpen(true) }
    const openEdit = (crop: Crop) => { setEditingCrop(crop); setModalOpen(true) }

    const handleSaved = (saved: Crop) => {
        setCrops((prev) => {
            const idx = prev.findIndex((c) => c.id === saved.id)
            if (idx >= 0) {
                const next = [...prev]
                next[idx] = saved
                return next
            }
            return [saved, ...prev]
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this crop listing?')) return
        try {
            await api.delete(`/api/crops/${id}`)
            setCrops((prev) => prev.filter((c) => c.id !== id))
        } catch {
            alert('Failed to delete crop. Please try again.')
        }
    }

    // ─── Skeleton loader ──────────────────────────────────────────────
    const Skeleton = () => (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                <div className="flex gap-2 pt-2">
                    <div className="h-9 bg-gray-100 rounded-lg flex-1" />
                    <div className="h-9 bg-gray-100 rounded-lg flex-1" />
                </div>
            </div>
        </div>
    )

    return (
        <>
            <AddCropModal
                open={modalOpen}
                initialData={editingCrop}
                onClose={() => setModalOpen(false)}
                onSaved={handleSaved}
            />

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">

                    {/* Top Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search my crops..."
                                className="pl-10 h-11 bg-white border-gray-200 focus:ring-emerald-500/20"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            {/* Category Dropdown */}
                            <div ref={catRef} className="relative">
                                <Button
                                    variant="outline"
                                    className="h-11 bg-white border-gray-200 text-gray-700 px-4 justify-between min-w-[150px]"
                                    onClick={() => { setShowCatDrop((v) => !v); setShowStatusDrop(false) }}
                                >
                                    {categoryFilter}
                                    <ChevronDown size={16} className={`ml-2 text-gray-400 transition-transform ${showCatDrop ? 'rotate-180' : ''}`} />
                                </Button>
                                {showCatDrop && (
                                    <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
                                        {CATEGORIES.map((c) => (
                                            <button
                                                key={c}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${categoryFilter === c ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                                                onClick={() => { setCategoryFilter(c); setShowCatDrop(false) }}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Status Dropdown */}
                            <div ref={statusRef} className="relative">
                                <Button
                                    variant="outline"
                                    className="h-11 bg-white border-gray-200 text-gray-700 px-4 justify-between min-w-[130px]"
                                    onClick={() => { setShowStatusDrop((v) => !v); setShowCatDrop(false) }}
                                >
                                    {statusFilter}
                                    <ChevronDown size={16} className={`ml-2 text-gray-400 transition-transform ${showStatusDrop ? 'rotate-180' : ''}`} />
                                </Button>
                                {showStatusDrop && (
                                    <div className="absolute top-12 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px]">
                                        {STATUSES.map((s) => (
                                            <button
                                                key={s}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${statusFilter === s ? 'font-semibold text-emerald-600' : 'text-gray-700'}`}
                                                onClick={() => { setStatusFilter(s); setShowStatusDrop(false) }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post New Crop – desktop */}
                        <Button
                            onClick={openAdd}
                            className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:w-auto px-6 whitespace-nowrap hidden sm:flex"
                        >
                            <Plus size={18} className="mr-2" />
                            Post New Crop
                        </Button>
                    </div>

                    {/* Mobile Post Button */}
                    <Button
                        onClick={openAdd}
                        className="h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm w-full sm:hidden"
                    >
                        <Plus size={18} className="mr-2" />
                        Post New Crop
                    </Button>

                    {/* Error */}
                    {fetchError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
                            <span>{fetchError}</span>
                            <button onClick={fetchCrops} className="ml-4 font-semibold underline text-red-700 hover:text-red-900">
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Crop Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                            <Sprout size={48} className="mb-4 text-gray-200" />
                            <p className="font-semibold text-gray-600 text-lg">
                                {crops.length === 0 ? 'No crops yet' : 'No crops match your search'}
                            </p>
                            <p className="text-sm mt-1">
                                {crops.length === 0
                                    ? 'Click "Post New Crop" to list your first crop on the marketplace.'
                                    : 'Try adjusting your search or filters.'}
                            </p>
                            {crops.length === 0 && (
                                <Button onClick={openAdd} className="mt-5 bg-emerald-500 hover:bg-emerald-600 text-white">
                                    <Plus size={16} className="mr-2" /> Post New Crop
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filtered.map((crop) => (
                                <CropCard
                                    key={crop.id}
                                    crop={crop}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    <HarvestForecast />
                    <AIStorageTips />
                </div>

            </div>
        </>
    )
}
