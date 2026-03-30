'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
    Camera,
    Save
} from 'lucide-react'
import { addProducts } from '@/services/productService'
import { SubCategory } from '@/types/category'
import { getSubCategories } from '@/services/categoryService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddCrop() {
    const { t } = useLanguage();
    // Image Cropping State
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [rotation, setRotation] = useState(0)
    const [subCategories, setSubCategories] = useState<SubCategory[]>([])
    // Form State
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState<number | ''>('')
    const [price, setPrice] = useState<number | ''>('')
    const [description, setDescription] = useState('')
    const router = useRouter()
    

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setImageSrc(reader.result as string))
            reader.readAsDataURL(e.target.files[0])
        }
    }

   const getCroppedImageBlob = async (): Promise<Blob | null> => {
  if (!imageSrc || !croppedAreaPixels) return null

  const image = new Image()
  image.src = imageSrc
  await new Promise((resolve) => (image.onload = resolve))

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const { width, height, x, y } = croppedAreaPixels

  canvas.width = width
  canvas.height = height

  ctx.save()
  ctx.translate(width / 2, height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-width / 2, -height / 2)

  ctx.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  )

  ctx.restore()

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
  })
}

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const data = await getSubCategories()
                setSubCategories(data)
            } catch (error) {
                console.error("Failed to load subcategories", error)
            }
        }

        fetchSubCategories()
    }, [])


    const handleSaveCrop = async () => {
  try {
    // 🔍 Validation
        if (!name || !category || !amount || !price) {
            toast.error(t('addcrop_required_fields'))
            return
        }

        const imageBlob = await getCroppedImageBlob()

        if (!imageBlob) {
            toast.error(t('addcrop_upload_crop_image'))
            return
        }

        // ⏳ Optional loading toast
        const loadingToast = toast.loading(t('addcrop_uploading_product'))

    // 🚀 API call
    await addProducts({
      name,
      subCategoryId: category,
      amount: Number(amount),
      price: Number(price),
      description,
      image: imageBlob
    })

    // ✅ Success
    toast.dismiss(loadingToast)
    toast.success(t('addcrop_product_uploaded'))

    // 🔁 Redirect
    setTimeout(() => {
      router.push("/farmer/crops")
    }, 1000)

  } catch (error: any) {
    console.error(error)

        toast.error(
            error?.response?.data?.message ||
            error?.message ||
            t('addcrop_something_wrong')
        )
  }
}

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-800">

            <header className="bg-white border-b border-slate-100 px-6 py-4  flex rounded-2xl ">
                {/* Header */}
                <div className=" border-slate-100 pb-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('addcrop_title')}</h1>
                    <p className="text-sm text-slate-500">{t('addcrop_subtitle')}</p>
                </div>
            </header>
            {/* Main Content */}
            <main className="flex-1 p-5">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-10">



                    <div className="space-y-8">
                        {/* SECTION 1: Basic Info */}
                        <div className="space-y-6">


                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-slate-700">{t('addcrop_crop_name')} <span className="text-red-500">*</span></Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('addcrop_crop_name_placeholder')}
                                    className="h-11 shadow-sm border-slate-200"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-slate-700">{t('addcrop_category')} <span className="text-red-500">*</span></Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="h-11 w-full shadow-sm border-slate-200">
                                        <SelectValue placeholder={t('addcrop_select_category')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subCategories.map((sub) => (
                                            <SelectItem key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-semibold text-slate-700">{t('addcrop_description')}</Label>
                                <div className="border border-slate-200 rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-[#10B981] focus-within:border-[#10B981] overflow-hidden">

                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 text-sm border-none focus:ring-0 resize-none placeholder:text-slate-400 outline-none"
                                        placeholder={t('addcrop_description_placeholder')}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 text-right">{description.length}/2000 {t('addcrop_characters')}</p>
                            </div>
                        </div>


                        <div className="space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700">{t('addcrop_price')} <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 sm:text-sm font-medium">ETB</span>
                                        </div>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                            placeholder={t('addcrop_price_placeholder')}
                                            className="h-11 pl-12 shadow-sm border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm font-semibold text-slate-700">{t('addcrop_available_amount')} <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder={t('addcrop_available_amount_placeholder')}
                                        className="h-11 shadow-sm border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* SECTION 3: Photos */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                {t('addcrop_crop_photo')} <span className="text-red-500 text-sm">*</span>
                            </h2>

                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#10B981] transition-colors bg-slate-50/50">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400">
                                            <Camera className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{t('addcrop_click_upload')}</span>
                                        <span className="text-xs text-slate-400">{t('addcrop_upload_hint')}</span>
                                    </Label>
                                </div>

                                {/* Image Cropper Component */}
                                {imageSrc && (
                                    <div className="space-y-4 pt-4">
                                        <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                                            <Cropper
                                                image={imageSrc}
                                                crop={crop}
                                                zoom={zoom}
                                                rotation={rotation}
                                                aspect={4 / 3}
                                                onCropChange={setCrop}
                                                onZoomChange={setZoom}
                                                onRotationChange={setRotation}
                                                onCropComplete={onCropComplete}
                                            />
                                        </div>
                                        <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-medium text-slate-600 w-12">{t('addcrop_zoom')}</span>
                                                <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(val) => setZoom(val[0])} className="flex-1" />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-medium text-slate-600 w-12">{t('addcrop_rotate')}</span>
                                                <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={(val) => setRotation(val[0])} className="flex-1" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                            <Button variant="outline" className="text-slate-600 border-slate-200 hover:bg-slate-50 font-medium px-6 h-11">
                                {t('addcrop_cancel')}
                            </Button>
                            <Button onClick={handleSaveCrop} className="bg-[#10B981] hover:bg-[#059669] text-white shadow-sm font-medium px-6 h-11 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {t('addcrop_save_upload')}
                            </Button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
