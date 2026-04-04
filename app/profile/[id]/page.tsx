'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Camera, Mail, Phone, MapPin, Save } from 'lucide-react'

import { getUserById } from '@/services/authService'
import {
  updateProfile,
  getRegions,
  getZones,
  getWoredas,
  getKebeles
} from '@/services/profileService'

import { User } from '@/types/auth'
import { Region, Zone, Woreda, Kebele } from '@/types/profile'

interface FormState {
  fullName: string
  kebeleId: string
  image: File | null
}

export default function Page() {
  const params = useParams()
  const id = params?.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [form, setForm] = useState<FormState>({
    fullName: '',
    kebeleId: '',
    image: null
  })
  const [preview, setPreview] = useState<string | null>(null)

  const [regions, setRegions] = useState<Region[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [woredas, setWoredas] = useState<Woreda[]>([])
  const [kebeles, setKebeles] = useState<Kebele[]>([])

  const [regionId, setRegionId] = useState<string | undefined>()
  const [zoneId, setZoneId] = useState<string | undefined>()
  const [woredaId, setWoredaId] = useState<string | undefined>()

  /* ====================== Fetch User ====================== */
  useEffect(() => {
    if (!id) return

    const fetchUser = async () => {
      try {
        const data = await getUserById(id)
        setUser(data)

        const region = data.profile?.kebele?.woreda?.zone?.region
        const zone = data.profile?.kebele?.woreda?.zone
        const woreda = data.profile?.kebele?.woreda
        const kebele = data.profile?.kebele

        setRegionId(region?.id)
        setZoneId(zone?.id)
        setWoredaId(woreda?.id)

        setForm({
          fullName: data.profile?.fullName || '',
          kebeleId: kebele?.id || '',
          image: null
        })

        if (region?.id) setZones(await getZones(region.id))
        if (zone?.id) setWoredas(await getWoredas(zone.id))
        if (woreda?.id) setKebeles(await getKebeles(woreda.id))
      } catch (error) {
        console.error('Failed to fetch user:', error)
        toast.error('Failed to load user')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id])

  /* ====================== Load Regions ====================== */
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const data = await getRegions()
        setRegions(data)
      } catch (error) {
        console.error('Failed to load regions:', error)
      }
    }
    loadRegions()
  }, [])

  /* ====================== Handlers ====================== */
  const handleRegionChange = async (value: string) => {
    setRegionId(value)
    setZoneId(undefined)
    setWoredaId(undefined)
    setForm({ ...form, kebeleId: '' })

    try {
      const zoneData = await getZones(value)
      setZones(zoneData)
      setWoredas([])
      setKebeles([])
    } catch (error) {
      console.error('Failed to load zones:', error)
    }
  }

  const handleZoneChange = async (value: string) => {
    setZoneId(value)
    setWoredaId(undefined)
    setForm({ ...form, kebeleId: '' })

    try {
      const woredaData = await getWoredas(value)
      setWoredas(woredaData)
      setKebeles([])
    } catch (error) {
      console.error('Failed to load woredas:', error)
    }
  }

  const handleWoredaChange = async (value: string) => {
    setWoredaId(value)

    try {
      const kebeleData = await getKebeles(value)
      setKebeles(kebeleData)
    } catch (error) {
      console.error('Failed to load kebeles:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setForm({ ...form, image: file })
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async () => {
    if (!form.kebeleId) {
      toast.error('Please select kebele')
      return
    }

    try {
      setUpdating(true)

      const formData = new FormData()
      formData.append('fullName', form.fullName)
      formData.append('kebeleId', form.kebeleId)
      if (form.image) formData.append('image', form.image)

      // Debug: log entries
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.size, value.type)
        } else {
          console.log(key, value)
        }
      }

      const res = await updateProfile(formData)
      console.log('Profile updated response:', res)

      // Update local state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile!,
                fullName: form.fullName,
                kebeleId: form.kebeleId,
                imageUrl: preview || prev.profile?.imageUrl
              }
            }
          : prev
      )

      // Refetch fresh user
      try {
        const freshUser = await getUserById(id)
        setUser(freshUser)
      } catch (e) {
        console.log('Refetch failed, using local update')
      }

      setPreview(null)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  /* ====================== Render ====================== */
  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <ProtectedRoute roles={['ADMIN', 'AGENT', 'BUYER', 'FARMER']}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-6 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* PROFILE CARD */}
            <div className="lg:col-span-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={preview || user?.profile?.imageUrl} />
                      <AvatarFallback>{getInitials(form.fullName)}</AvatarFallback>
                    </Avatar>

                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input type="file" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>

                  <h2 className="font-bold text-xl mt-4">{form.fullName}</h2>
                  <Badge className="mt-2 bg-emerald-500">{user?.role}</Badge>

                  <div className="w-full mt-6 space-y-3 text-left">
                    <div className="flex gap-3 items-center">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {user?.profile?.kebele?.woreda?.zone?.region?.name} •{' '}
                        {user?.profile?.kebele?.woreda?.zone?.name} •{' '}
                        {user?.profile?.kebele?.woreda?.name} • {user?.profile?.kebele?.name}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FORM */}
            <div className="lg:col-span-8">
              <Card className="p-7">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>

                  {/* Region */}
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select value={regionId} onValueChange={handleRegionChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Zone */}
                  <div className="space-y-2">
                    <Label>Zone</Label>
                    <Select value={zoneId} onValueChange={handleZoneChange} disabled={!regionId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Woreda */}
                  <div className="space-y-2">
                    <Label>Woreda</Label>
                    <Select
                      value={woredaId}
                      onValueChange={handleWoredaChange}
                      disabled={!zoneId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select woreda" />
                      </SelectTrigger>
                      <SelectContent>
                        {woredas.map((woreda) => (
                          <SelectItem key={woreda.id} value={woreda.id}>
                            {woreda.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Kebele */}
                  <div className="space-y-2">
                    <Label>Kebele</Label>
                    <Select
                      value={form.kebeleId}
                      onValueChange={(value) => setForm({ ...form, kebeleId: value })}
                      disabled={!woredaId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select kebele" />
                      </SelectTrigger>
                      <SelectContent>
                        {kebeles.map((kebele) => (
                          <SelectItem key={kebele.id} value={kebele.id}>
                            {kebele.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdate}
                      disabled={updating}
                      className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}