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

export default function AddCrop() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  // Form
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [amount, setAmount] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubCategory, setSelectedSubCategory] = useState('')

  // Image
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  // Crop
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
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
    if (!name || !selectedSubCategory || amount === '' || price === '') {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)

      const imageBlob = await getCroppedImageBlob()

      if (!imageBlob) {
        toast.error('Please upload and crop image')
        return
      }

      await addProducts({
        name,
        subCategoryId: selectedSubCategory,
        amount: Number(amount),
        price: Number(price),
        description,
        image: imageBlob
      })

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

      {/* Header */}
      <header className="bg-white border-b px-6 py-4 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">Add Crop</h1>
          <p className="text-sm text-slate-500">
            Create a new crop with details and image.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="py-2 md:p-5">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-8">

          {/* Basic Info */}
          <div className="space-y-4">
            <Label>Crop Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />

            <Label>Category *</Label>
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
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
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
              <Label className="mb-2">Price (ETB) *</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <Label className="mb-2">Available Amount *</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
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

              <div className="w-full h-14 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-emerald-400 transition">
                <ImagePlus size={20} className="text-emerald-600" />
                <span>
                  {imageSrc ? "Change image" : "Upload image"}
                </span>
              </div>
            </div>

            {imageSrc ? (
              <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border">

                {imageSrc && (
                  <div className="relative h-72 w-full bg-black rounded-xl overflow-hidden">
                    <Cropper
                      key={imageSrc} 
                      image={imageSrc}
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
                )}

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