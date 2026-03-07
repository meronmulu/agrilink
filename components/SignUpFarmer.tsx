'use client'

import { useEffect, useState } from "react"
import { getRegions, getZones, getWoredas, getKebeles } from "@/services/authService"
import { Region, Zone, Woreda, Kebele } from "@/types/auth"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "./ui/input"

export default function RegionLocationSelector() {

  const [regions, setRegions] = useState<Region[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [woredas, setWoredas] = useState<Woreda[]>([])
  const [kebeles, setKebeles] = useState<Kebele[]>([])

  const [regionId, setRegionId] = useState("")
  const [zoneId, setZoneId] = useState("")
  const [woredaId, setWoredaId] = useState("")
  const [kebeleId, setKebeleId] = useState("")

  // Load regions
  useEffect(() => {
    const fetchRegions = async () => {
      const data = await getRegions()
      setRegions(data)
    }
    fetchRegions()
  }, [])

  // Load zones
  useEffect(() => {
    if (!regionId) return

    const fetchZones = async () => {
      const data = await getZones(regionId)
      setZones(data)

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
      setWoredas(data)

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
      setKebeles(data)

      setKebeleId("")
    }

    fetchKebeles()
  }, [woredaId])


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
           Full Name
        </label>
        <div className="relative group">
          <Input
            name="fullname"
            type="text"
            placeholder=" Full Name"
            required
            className="h-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Role</label>
        <Select value={regionId} onValueChange={setRegionId}>
          <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent className="w-4xl">
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
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Role</label>
        <Select value={zoneId} onValueChange={setZoneId} disabled={!regionId}>
          <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select Zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Role</label>
        <Select value={woredaId} onValueChange={setWoredaId} disabled={!zoneId}>
          <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select Woreda" />
          </SelectTrigger>
          <SelectContent>
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
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Role</label>
        <Select value={kebeleId} onValueChange={setKebeleId} disabled={!woredaId}>
          <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select Kebele" />
          </SelectTrigger>
          <SelectContent>
            {kebeles.map(k => (
              <SelectItem key={k.id} value={k.id}>
                {k.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


    </div>
  )
}