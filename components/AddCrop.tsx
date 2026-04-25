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
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { addProducts } from '@/services/productService'
import { getCategories, getSubCategories } from '@/services/categoryService'
import { Category, SubCategory } from '@/types/category'
import { productSchema, ProductInput } from '@/lib/validation/product.schema'
import { useLanguage } from '@/context/LanguageContext'
import { Checkbox } from './ui/checkbox'

export default function AddCrop() {
  const router = useRouter()
  const { t } = useLanguage()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})

  // Form state
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [amount, setAmount] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [city, setCity] = useState('')
  const [withDelivery, setWithDelivery] = useState(false)
  // Image + crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_area: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  // Load categories
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

  const filteredSubs = subCategories.filter(
    (sub) => sub.categoryId === selectedCategory
  )

  // File input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Crop → Blob
  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!imageSrc || !croppedAreaPixels) return null

    const image = new Image()
    image.src = imageSrc
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

  const handleSave = async () => {
    setErrors({})

    if (!imageSrc) {
      toast.error('Please upload an image')
      return
    }

    try {
      setLoading(true)

      const imageBlob = await getCroppedImageBlob()

      if (!imageBlob) {
        toast.error('Please crop the image properly')
        return
      }

      const input: ProductInput = {
        name,
        subCategoryId: selectedSubCategory,
        amount: amount === '' ? 0 : Number(amount),
        price: price === '' ? 0 : Number(price),
        description,
        city,
        withDelivery,
        image: new File([imageBlob], `${name}.jpg`, {
          type: 'image/jpeg',
        }),
      }

      //  SAFE PARSE
      const result = productSchema.safeParse(input)

      if (!result.success) {
        const fieldErrors: any = {}

        result.error.issues.forEach((err) => {
          const field = err.path[0]
          if (field) fieldErrors[field] = err.message
        })

        setErrors(fieldErrors)
        toast.error(result.error.issues[0].message)
        return
      }

      await addProducts(result.data)

      toast.success('Crop added successfully')
      router.push('/farmer/crops')

    } catch (err) {
      console.error(err)
      toast.error('Failed to add crop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <header className="bg-white border-b px-6 py-4 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">Add Crop</h1>
          <p className="text-sm text-slate-500">
            Create a new crop with details and image.
          </p>
        </div>
      </header>

      <main className="py-2 md:p-5">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-8">

          {/* Basic Info */}
          <div className="space-y-4">
            <Label>{t('crop_name') || 'Crop Name *'}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

            <Label>{t('category') || 'Category *'}</Label>
            <Select
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val)
                setSelectedSubCategory('')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Subcategory *</Label>
            <Select
              value={selectedSubCategory}
              onValueChange={setSelectedSubCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubs.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subCategoryId && (
              <p className="text-sm text-red-500">{errors.subCategoryId}</p>
            )}

            <Label>{t('description') || 'Description'}</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className='mb-2'>Price (ETB) *</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            <div>
              <Label className='mb-2'>Available Amount *</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <Label className='mb-2'>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Checkbox
                id="delivery"
                checked={withDelivery}
                onCheckedChange={(checked) => setWithDelivery(checked === true)}
              />

              <Label
                htmlFor="delivery"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                With Delivery
              </Label>
            </div>

          </div>

          {/* Image */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">
              Product Image
            </h2>

            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-14 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-gray-600">
                <ImagePlus size={20} />
                <span>{imageSrc ? "Change image" : "Upload image"}</span>
              </div>
            </div>

            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}

            {imageSrc ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border">
                <div className="relative h-72 w-full bg-black rounded-xl overflow-hidden">
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 border border-dashed rounded-2xl text-gray-400">
                <ImageIcon size={40} />
                <p>No image selected</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => router.push('/farmer/crops')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className='bg-emerald-500'>
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Add Crop
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}