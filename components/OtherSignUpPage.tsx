'use client'

import { useEffect, useState } from "react"
import { getRegions, getZones, getWoredas, getKebeles, createProfile } from "@/services/profileService"
import { Region, Zone, Woreda, Kebele } from "@/types/profile"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Input } from "./ui/input"
import { useRouter, useSearchParams } from "next/navigation"

export default function OtherSignUpPage() {
  const router = useRouter()
  const params = useSearchParams()
  const role = params.get("role") || "BUYER"

  const [regions, setRegions] = useState<Region[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [woredas, setWoredas] = useState<Woreda[]>([])
  const [kebeles, setKebeles] = useState<Kebele[]>([])

  const [regionId, setRegionId] = useState("")
  const [zoneId, setZoneId] = useState("")
  const [woredaId, setWoredaId] = useState("")
  const [kebeleId, setKebeleId] = useState("")

  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load regions
  useEffect(() => {
    const fetchRegions = async () => {
      const data = await getRegions()
      setRegions(data || [])
    }
    fetchRegions()
  }, [])

  // Load zones
  useEffect(() => {
    if (!regionId) return

    const fetchZones = async () => {
      const data = await getZones(regionId)
      setZones(data || [])

      setZoneId("")
      setWoredas([])
      setKebeles([])
    }

    fetchZones()
  }, [regionId])

  // Load woredas
  useEffect(() => {
    if (!zoneId) return

    const fetchWoredas = async () => {
      const data = await getWoredas(zoneId)
      setWoredas(data || [])

      setWoredaId("")
      setKebeles([])
    }

    fetchWoredas()
  }, [zoneId])

  // Load kebeles
  useEffect(() => {
    if (!woredaId) return

    const fetchKebeles = async () => {
      const data = await getKebeles(woredaId)
      setKebeles(data || [])

      setKebeleId("")
    }

    fetchKebeles()
  }, [woredaId])


 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!fullName || !kebeleId) {
    alert("Please fill all fields")
    return
  }

  try {
    setIsLoading(true)

    const res = await createProfile({
      fullName,
      kebeleId
    })

    // Log the role
    console.log("Role selected:", role)

    // Redirect based on role
    if (role === "BUYER") 
      router.push("/buyer")
    else if (role === "FARMER") 
      router.push("/farmer")

    console.log("Profile created:", res)

  } catch (error) {
    console.log(error)
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="space-y-2">

      <form onSubmit={handleSubmit} className="space-y-2">

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>

          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
            className="h-9 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Region</label>

          <Select value={regionId} onValueChange={setRegionId}>
            <SelectTrigger className="h-11 w-full  rounded-xl">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        {/* Zone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Zone</label>

          <Select value={zoneId} onValueChange={setZoneId} disabled={!regionId}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {zones.map(zone => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        {/* Woreda */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Woreda</label>

          <Select value={woredaId} onValueChange={setWoredaId} disabled={!zoneId}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select Woreda" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {woredas.map(w => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>

        {/* Kebele */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Kebele</label>

          <Select value={kebeleId} onValueChange={setKebeleId} disabled={!woredaId}>
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select Kebele" />
            </SelectTrigger>

            <SelectContent className="w-full">
              {kebeles.map(k => (
                <SelectItem key={k.id} value={k.id}>
                  {k.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
        </div>


        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center disabled:opacity-50"
        >
          {isLoading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : "Create Profile"}
        </button>

      </form>

    </div>
  )
}