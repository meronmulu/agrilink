'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Camera, Save, Loader2 } from 'lucide-react'
import { addProducts } from '@/services/productService'
import { SubCategory, Category } from '@/types/category'
import { getSubCategories, getCategories } from '@/services/categoryService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddCrop() {
  const { t } = useLanguage()
  const router = useRouter()

  // Image Crop
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  // Selection
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  // Form
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [price, setPrice] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories()
        const subs = await getSubCategories()
        setCategories(cats)
        setSubCategories(subs)
      } catch {
        toast.error('Failed to load categories')
      }
    }
    fetchData()
  }, [])

  // Filter subcategories
  const filteredSubs = subCategories.filter(
    (sub) => sub.categoryId === selectedCategory
  )

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Crop image → Blob
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
      canvas.width,
      canvas.height
    )

    ctx.restore()

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
    })
  }

  // Submit
  const handleSaveCrop = async () => {
    if (!name || !selectedSubCategory || !amount || !price) {
      toast.error(t('addcrop_required_fields'))
      return
    }

    try {
      setLoading(true)

      const imageBlob = await getCroppedImageBlob()

      if (!imageBlob) {
        toast.error(t('addcrop_upload_crop_image'))
        return
      }

      const loadingToast = toast.loading(t('addcrop_uploading_product'))

      await addProducts({
        name,
        subCategoryId: selectedSubCategory,
        amount: Number(amount),
        price: Number(price),
        description,
        image: imageBlob
      })

      toast.dismiss(loadingToast)
      toast.success(t('addcrop_product_uploaded'))

      router.push('/farmer/crops')
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        t('addcrop_something_wrong')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 rounded-2xl">
        <h1 className="text-2xl font-bold">{t('addcrop_title')}</h1>
        <p className="text-sm text-slate-500">{t('addcrop_subtitle')}</p>
      </header>

      {/* Content */}
      <main className="flex-1 p-5">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border p-8 space-y-8">

          {/* Name */}
          <div>
            <Label>{t('addcrop_crop_name')} *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Select value={selectedCategory} onValueChange={(val) => {
              setSelectedCategory(val)
              setSelectedSubCategory('')
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div>
            <Label>Subcategory *</Label>
            <Select
              value={selectedSubCategory}
              onValueChange={setSelectedSubCategory}
              disabled={!selectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubs.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          {/* Description */}
          <textarea
            className="border rounded-lg p-3"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image Upload */}
          <div>
            <Input type="file" accept="image/*" onChange={handleFileChange} />

            {imageSrc && (
              <>
                <div className="relative w-full h-72 bg-black mt-4">
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

                <div className="mt-4 space-y-3">
                  <Slider value={[zoom]} min={1} max={3} step={0.1}
                    onValueChange={(val) => setZoom(val[0])} />

                  <Slider value={[rotation]} min={0} max={360} step={1}
                    onValueChange={(val) => setRotation(val[0])} />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/farmer/crops')}>
              {t('addcrop_cancel')}
            </Button>

            <Button onClick={handleSaveCrop} disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              {t('addcrop_save_upload')}
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}