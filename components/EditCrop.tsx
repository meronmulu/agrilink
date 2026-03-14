'use client'

import { useState, useCallback, useEffect } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Save, ArrowLeft, Loader2, ImagePlus, ImageIcon } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

import { getSubCategories } from '@/services/categoryService'
import { getProductById, updateProduct } from '@/services/productService'
import { SubCategory } from '@/types/category'

export default function EditCrop() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [isFetching, setIsFetching] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState<number | ''>('')
    const [price, setPrice] = useState<number | ''>('')
    const [description, setDescription] = useState('')
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])

    // Image
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
    const [newImageSrc, setNewImageSrc] = useState<string | null>(null)

    // Crop
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            if (!id) return

            setIsFetching(true)
            try {
                const [product, categories] = await Promise.all([
                    getProductById(id),
                    getSubCategories()
                ])

                setSubCategories(categories)
                setName(product.name)
                setCategory(product.subCategoryId)
                setAmount(product.amount)
                setPrice(product.price)
                setDescription(product.description || '')
                setExistingImageUrl(product.image || null)
            } catch (err) {
                console.error(err)
            } finally {
                setIsFetching(false)
            }
        }

        loadData()
    }, [id])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.onload = () => setNewImageSrc(reader.result as string)
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const getCroppedImageBlob = async (): Promise<Blob | null> => {
        if (!newImageSrc || !croppedAreaPixels) return null

        const image = new window.Image()
        image.src = newImageSrc
        await new Promise((resolve) => (image.onload = resolve))

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        canvas.width = croppedAreaPixels.width
        canvas.height = croppedAreaPixels.height

        ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
        })
    }

    const handleUpdate = async () => {
        if (!name || !category || !amount || !price) {
            alert('Please fill required fields')
            return
        }

        setIsSaving(true)
        try {
            let imageBlob

            if (newImageSrc && croppedAreaPixels) {
                imageBlob = await getCroppedImageBlob()
            }

            await updateProduct(id, {
                name,
                subCategoryId: category,
                amount: Number(amount),
                price: Number(price),
                description,
                ...(imageBlob ? { image: imageBlob } : {})
            })

            router.push('/farmer/crops')
        } catch (err) {
            console.error(err)
            alert('Update failed')
        } finally {
            setIsSaving(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] p-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl animate-pulse h-96" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">

            {/* Header */}
            <header className="bg-white border-b px-6 py-4 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Crop</h1>
                        <p className="text-sm text-slate-500">
                            Update crop details and image.
                        </p>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="p-5">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <Label>Crop Name *</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />

                        <Label>Category *</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {subCategories.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Description</Label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-lg p-3"
                            rows={4}
                        />
                    </div>

                    {/* Pricing */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <Label className='mb-2'>Price (ETB) *</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label className='mb-2'>Available Amount *</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                            Product Image
                        </h2>

                        {/* Custom File Upload Button */}
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            <div className="w-full h-14 border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 hover:border-emerald-400 transition-all">
                                <ImagePlus size={20} className="text-emerald-600" />
                                <span className="font-medium">
                                    {newImageSrc
                                        ? "Choose a different image"
                                        : "Upload new image (optional)"}
                                </span>
                            </div>
                        </div>

                        {/* Image Preview / Cropper Area */}
                        {newImageSrc ? (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="relative hmb-2 sm:h-100 w-full bg-black rounded-xl overflow-hidden shadow-inner">
                                    <Cropper
                                        image={newImageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        rotation={rotation}
                                        aspect={4 / 3}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onRotationChange={setRotation}
                                        onCropComplete={onCropComplete}
                                        showGrid
                                    />
                                </div>

                                {/* Crop Controls */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 px-2">
                                    {/* Zoom */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span>Zoom</span>
                                            <span>{Math.round(zoom * 100)}%</span>
                                        </div>

                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            value={zoom}
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                    </div>

                                    {/* Rotation */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span>Rotation</span>
                                            <span>{rotation}°</span>
                                        </div>

                                        <input
                                            type="range"
                                            min={0}
                                            max={360}
                                            step={1}
                                            value={rotation}
                                            onChange={(e) => setRotation(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : existingImageUrl ? (
                            <div className="space-y-3">
                                <Label className="text-gray-500 text-sm">
                                    Current Image
                                </Label>

                                <div className="relative w-full sm:w-2/3 md:w-1/2 aspect-4/3 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                    <Image
                                        src={existingImageUrl}
                                        alt="Current crop"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400">
                                <ImageIcon size={48} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">
                                    No image currently uploaded
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/farmer/crops')}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="bg-[#10B981] hover:bg-[#059669]"
                        >
                            {isSaving ? (
                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Update Crop
                        </Button>
                    </div>

                </div>
            </main>
        </div>
    )
}