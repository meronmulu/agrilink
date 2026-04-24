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
import { Save, Loader2, ImagePlus, ImageIcon } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

import { getCategories, getSubCategories } from '@/services/categoryService'
import { getProductById, updateProduct } from '@/services/productService'
import { Category, SubCategory } from '@/types/category'
import { toast } from 'sonner'
import { useLanguage } from '@/context/LanguageContext'
import { Checkbox } from './ui/checkbox'

export default function EditCrop() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    const { t } = useLanguage()

    const [isFetching, setIsFetching] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form
    const [name, setName] = useState('')
    const [amount, setAmount] = useState<number | ''>('')
    const [price, setPrice] = useState<number | ''>('')
    const [description, setDescription] = useState('')

    // Category + Subcategory
    const [categories, setCategories] = useState<Category[]>([])
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubCategory, setSelectedSubCategory] = useState('')

    // Image
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
    const [newImageSrc, setNewImageSrc] = useState<string | null>(null)
    const [city, setCity] = useState('')
    const [withDelivery, setWithDelivery] = useState(false)
    // Crop
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels)
    }, [])

    // Load data
    useEffect(() => {
        const loadData = async () => {
            if (!id) return

            setIsFetching(true)
            try {
                const [product, cats, subs] = await Promise.all([
                    getProductById(id),
                    getCategories(),
                    getSubCategories()
                ])

                setCategories(cats)
                setSubCategories(subs)

                setName(product.name)
                setAmount(product.amount)
                setPrice(product.price)
                setDescription(product.description || '')
                setExistingImageUrl(product.image || null)
                setCity(product.city || '')
                setWithDelivery(product.withDelivery || false)
                setSelectedSubCategory(product.subCategoryId)

                // Find category from subcategory
                const foundSub = subs.find(
                    (s) => s.id === product.subCategoryId
                )
                if (foundSub) {
                    setSelectedCategory(foundSub.categoryId)
                }

            } catch (err) {
                console.error(err)
                toast.error('Failed to load product')
            } finally {
                setIsFetching(false)
            }
        }

        loadData()
    }, [id])

    // Filter subcategories
    const filteredSubs = subCategories.filter(
        (sub) => sub.categoryId === selectedCategory
    )

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
        if (!name || !selectedSubCategory || !amount || !price) {
            toast.error('Please fill all required fields')
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
                subCategoryId: selectedSubCategory,
                amount: Number(amount),
                price: Number(price),
                description,
                city,
                withDelivery,
                ...(imageBlob ? { image: imageBlob } : {})
            })

            toast.success('Product updated successfully')

            setTimeout(() => {
                router.push('/farmer/crops')
            }, 1000)

        } catch (err) {
            console.error(err)
            toast.error('Update failed')
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
                <h1 className="text-2xl font-bold">{t('edit_crop') || 'Edit Crop'}</h1>
                <p className="text-sm text-slate-500">
                    {t('edit_crop_desc') || 'Update crop details and image.'}
                </p>
            </header>

            {/* Form */}
            <main className="py-2 md:p-5">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <Label>{t('crop_name') || 'Crop Name *'}</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />

                        {/* Category */}
                        <Label>{t('category') || 'Category *'}</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(val) => {
                                setSelectedCategory(val)
                                setSelectedSubCategory('')
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('select_category') || "Select category"} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Subcategory */}
                        <Label>{t('subcategory') || 'Subcategory *'}</Label>
                        <Select
                            value={selectedSubCategory}
                            onValueChange={setSelectedSubCategory}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('select_subcategory') || "Select subcategory"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredSubs.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>{t('description') || 'Description'}</Label>
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
                            <Label>{t('price_etb') || 'Price (ETB) *'}</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <Label>{t('available_amount') || 'Available Amount *'}</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        {/* CITY */}
                        <div>
                            <Label>{t('city') || 'City'}</Label>
                            <Input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Enter city"
                            />
                        </div>

                        {/* DELIVERY CHECKBOX */}
                        <div className="flex items-center space-x-3 mt-6">
                            <Checkbox
                                id="delivery"
                                checked={withDelivery}
                                onCheckedChange={(checked) => setWithDelivery(!!checked)}
                            />
                            <Label htmlFor="delivery" className="cursor-pointer">
                                {t('with_delivery') || 'With Delivery'}
                            </Label>
                        </div>

                    </div>

                    {/* Image */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold border-b pb-2">
                            {t('product_image') || 'Product Image'}
                        </h2>

                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />

                            <div className="w-full h-14 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-emerald-400 transition">
                                <ImagePlus size={20} className="text-emerald-600" />
                                <span>
                                    {newImageSrc ? (t('change_image') || "Change image") : (t('upload_image') || "Upload image")}
                                </span>
                            </div>
                        </div>

                        {newImageSrc ? (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border">
                                <div className="relative h-80 w-full bg-black rounded-xl overflow-hidden">
                                    <Cropper
                                        key={newImageSrc}
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
                            </div>
                        ) : existingImageUrl ? (
                            <div className="relative w-1/2 aspect-4/3 rounded-xl overflow-hidden">
                                <Image src={existingImageUrl} alt="crop" fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="text-gray-400 text-center">
                                <ImageIcon />
                                {t('no_image') || 'No image'}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button variant="outline" onClick={() => router.push('/farmer/crops')}>
                            {t('cancel') || 'Cancel'}
                        </Button>

                        <Button onClick={handleUpdate} disabled={isSaving} className='bg-emerald-500'>
                            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            {t('update_crop') || 'Update Crop'}
                        </Button>
                    </div>

                </div>
            </main>
        </div>
    )
}