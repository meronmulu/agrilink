'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Crop } from '@/components/CropCard'
import api from '@/axios'

type Status = Crop['status']

const CATEGORIES = ['Grains', 'Fruits', 'Vegetables', 'Commodity', 'Legumes', 'Spices', 'Herbs', 'Roots & Tubers', 'Other']
const STATUSES: Status[] = ['In Stock', 'Low Stock', 'Out of Season']
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'liter', 'box']

interface AddCropModalProps {
    open: boolean
    initialData?: Crop | null
    onClose: () => void
    onSaved: (crop: Crop) => void
}

export default function AddCropModal({ open, initialData, onClose, onSaved }: AddCropModalProps) {
    const isEdit = !!initialData
    const fileInputRef = useRef<HTMLInputElement>(null)

    const emptyForm = {
        name: '',
        category: CATEGORIES[0],
        price: '',
        unit: UNITS[0],
        currentStock: '',
        maxStock: '',
        status: 'In Stock' as Status,
    }

    const [form, setForm] = useState(emptyForm)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setForm({
                    name: initialData.name,
                    category: initialData.category,
                    price: String(initialData.price),
                    unit: initialData.unit,
                    currentStock: String(initialData.currentStock),
                    maxStock: String(initialData.maxStock),
                    status: initialData.status,
                })
                setImagePreview(initialData.image ?? null)
            } else {
                setForm(emptyForm)
                setImagePreview(null)
            }
            setImageFile(null)
            setError(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialData])

    // Revoke object URL when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        }
    }, [imagePreview])

    // Handle file selection — generate local preview immediately
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate type & size (max 5 MB)
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file (JPEG, PNG, WebP, etc.)')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5 MB.')
            return
        }

        setError(null)
        if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        const objectUrl = URL.createObjectURL(file)
        setImageFile(file)
        setImagePreview(objectUrl)
    }



    const set = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }))





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.name.trim()) return setError('Crop name is required.')
        if (Number(form.price) < 0) return setError('Price must be a positive number.')
        if (Number(form.maxStock) < 1) return setError('Max stock must be at least 1.')

        setSaving(true)
        try {
            // Create FormData to send file and other data
            const formData = new FormData()
            formData.append('name', form.name.trim())
            formData.append('category', form.category)
            formData.append('price', String(Number(form.price)))
            formData.append('unit', form.unit)
            formData.append('currentStock', String(Number(form.currentStock)))
            formData.append('maxStock', String(Number(form.maxStock)))
            formData.append('status', form.status)
            if (imageFile) {
                formData.append('image', imageFile)
            }

            let res
            if (isEdit && initialData) {
                res = await api.patch(`/api/crops/${initialData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            } else {
                res = await api.post('/api/crops', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
            }

            onSaved(res.data as Crop)
            onClose()
        } catch (err: unknown) {
            const msg =
                (err as Error)?.message ??
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Something went wrong. Please try again.'
            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    const isLoading = saving

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEdit ? 'Edit Crop Listing' : 'Post New Crop'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">

                    {/* ── Image Upload ───────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Crop Image
                        </label>

                        {/* Hidden real file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {imagePreview ? (
                            /* Preview with replace/remove controls */
                            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imagePreview}
                                    alt="Crop preview"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        Replace
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                                        className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Upload drop zone */
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                            >
                                <Upload size={28} />
                                <span className="text-sm font-medium">Click to upload an image</span>
                                <span className="text-xs">JPEG, PNG, WebP · max 5 MB</span>
                            </button>
                        )}
                    </div>

                    {/* ── Crop Name ─────────────────────────────────────────── */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name *</label>
                        <Input
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            placeholder="e.g. Premium Teff"
                            className="h-10 border-gray-200"
                            required
                        />
                    </div>

                    {/* ── Category & Status ─────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => set('category', e.target.value)}
                                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => set('status', e.target.value as Status)}
                                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                                {STATUSES.map((s) => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ── Price & Unit ──────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Price (ETB)</label>
                            <Input
                                type="number" min={0} step={0.01}
                                value={form.price}
                                onChange={(e) => set('price', e.target.value)}
                                placeholder="0"
                                className="h-10 border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                            <select
                                value={form.unit}
                                onChange={(e) => set('unit', e.target.value)}
                                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                                {UNITS.map((u) => <option key={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* ── Stock ─────────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Stock</label>
                            <Input
                                type="number" min={0}
                                value={form.currentStock}
                                onChange={(e) => set('currentStock', e.target.value)}
                                placeholder="0"
                                className="h-10 border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Stock *</label>
                            <Input
                                type="number" min={1}
                                value={form.maxStock}
                                onChange={(e) => set('maxStock', e.target.value)}
                                placeholder="1000"
                                className="h-10 border-gray-200"
                                required
                            />
                        </div>
                    </div>

                    {/* ── Error ─────────────────────────────────────────────── */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                            {error}
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <Button
                        type="button" variant="outline"
                        onClick={onClose} disabled={isLoading}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit" disabled={isLoading}
                        onClick={handleSubmit}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Saving…
                            </>
                        ) : isEdit ? 'Save Changes' : 'Post Crop'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
