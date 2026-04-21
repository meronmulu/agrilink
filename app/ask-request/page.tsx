'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createRoleRequest } from "@/services/roleRequestService"
import { getAllKebeles, getKebeles, getRegions, getWoredas, getZones } from "@/services/profileService"
import { Kebele, Region, Woreda, Zone } from "@/types/profile"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Briefcase, GraduationCap, UploadCloud } from "lucide-react"

export default function AskAgentPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    kebeleId: "",
    requestedRole: "AGENT",
    experienceInAgriculture: false,
    currentRole: "",
    educationLevel: "",
    digitalSkills: false,
    governmentAssigned: false,
  })

  const [loadingKebeles, setLoadingKebeles] = useState(false)

  const [files, setFiles] = useState<File[] | null>(null)
  const [loading, setLoading] = useState(false)


  const [regions, setRegions] = useState<Region[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [woredas, setWoredas] = useState<Woreda[]>([])
  const [kebeles, setKebeles] = useState<Kebele[]>([])

  const [regionId, setRegionId] = useState("")
  const [zoneId, setZoneId] = useState("")
  const [woredaId, setWoredaId] = useState("")



  // Load regions
  useEffect(() => {
    const fetch = async () => {
      const data = await getRegions()
      setRegions(data || [])
    }
    fetch()
  }, [])

  // Load zones
  useEffect(() => {
    if (!regionId) return

    const fetch = async () => {
      const data = await getZones(regionId)
      setZones(data || [])

      // reset
      setZoneId("")
      setWoredaId("")
      setKebeles([])
      setForm((p) => ({ ...p, kebeleId: "" }))
    }

    fetch()
  }, [regionId])

  // Load woredas
  useEffect(() => {
    if (!zoneId) return

    const fetch = async () => {
      const data = await getWoredas(zoneId)
      setWoredas(data || [])

      // reset
      setWoredaId("")
      setKebeles([])
      setForm((p) => ({ ...p, kebeleId: "" }))
    }

    fetch()
  }, [zoneId])

  // Load kebeles
  useEffect(() => {
    if (!woredaId) return

    const fetch = async () => {
      const data = await getKebeles(woredaId)
      setKebeles(data || [])

      // reset
      setForm((p) => ({ ...p, kebeleId: "" }))
    }

    fetch()
  }, [woredaId])








  useEffect(() => {
    const fetchKebeles = async () => {
      try {
        setLoadingKebeles(true)
        const data = await getAllKebeles()
        setKebeles(data)
      } catch (err) {
        toast.error("Failed to load kebeles")
      } finally {
        setLoadingKebeles(false)
      }
    }

    fetchKebeles()
  }, [])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.kebeleId) {
      toast.error("Please select a kebele")
      return
    }

    setLoading(true)

    try {
      const data = new FormData()

      data.append("kebeleId", form.kebeleId)
      data.append("requestedRole", form.requestedRole)
      data.append("currentRole", form.currentRole)
      data.append("educationLevel", form.educationLevel)
      data.append("experienceInAgriculture", String(form.experienceInAgriculture))
      data.append("digitalSkills", String(form.digitalSkills))
      data.append("governmentAssigned", String(form.governmentAssigned))

      if (files) {
        files.forEach((file) => data.append("files", file))
      }

      await createRoleRequest(data)
      toast.success("Application submitted successfully")
      router.push("/buyer")
    } catch (err) {
      console.log(err)

      toast.error("Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      <div className="fixed top-0 left-0 w-full h-64 bg-linear-to-b from-emerald-50/50 to-transparent -z-10" />

      <main className="grow pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Become an Agent and Data Collecter
            </h1>
            <p className="text-slate-500 mt-3 text-sm">
              Empower your community and join our growing agricultural network.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="h-1 bg-linear-to-r from-emerald-500 to-teal-500" />

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* REGION */}
              <Select value={regionId} onValueChange={setRegionId}>
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                  <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                <SelectContent>
                  {regions.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ZONE */}
              <Select value={zoneId} onValueChange={setZoneId} disabled={!regionId}>
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                  <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                <SelectContent>
                  {zones.map(z => (
                    <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* WOREDA */}
              <Select value={woredaId} onValueChange={setWoredaId} disabled={!zoneId}>
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                  <SelectValue placeholder="Select Woreda" />
                  </SelectTrigger>
                <SelectContent>
                  {woredas.map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* KEBELE */}
              <Select
                value={form.kebeleId}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, kebeleId: value }))
                }
                disabled={!woredaId}
              >
                <SelectTrigger className="h-12 border-slate-200 w-full">
                  <SelectValue placeholder="Select Kebele" />
                </SelectTrigger>
                <SelectContent>
                  {kebeles.map(k => (
                    <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>


              {/* REQUESTED ROLE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase size={16} /> Requested Role
                </Label>

                <Select
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, requestedRole: value }))
                  }
                >
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DATA_CONTRIBUTOR">Data Contributor</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>

                  </SelectContent>
                </Select>
              </div>

              {/* CURRENT ROLE */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase size={16} /> Current Role
                </Label>

                <Select
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, currentRole: value }))
                  }
                >
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DA_OFFICER">DA Officer</SelectItem>
                    <SelectItem value="FARMER">Farmer</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TRADER">Trader</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* EDUCATION */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap size={16} /> Education Level
                </Label>

                <Select
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, educationLevel: value }))
                  }
                >
                  <SelectTrigger className="h-12 border-slate-200 w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="PRIMARY">Primary</SelectItem>
                    <SelectItem value="SECONDARY">Secondary</SelectItem>
                    <SelectItem value="DIPLOMA">Diploma</SelectItem>
                    <SelectItem value="DEGREE">Degree</SelectItem>
                    <SelectItem value="MASTERS">Masters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CHECKBOXES */}
              <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                <p className="text-sm font-semibold text-slate-700">
                  Skills & Experience
                </p>

                {[
                  ["experienceInAgriculture", "Experience in Agriculture"],
                  ["digitalSkills", "Digital Skills"],
                  ["governmentAssigned", "Government Assigned"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <Checkbox
                      onCheckedChange={(v) =>
                        setForm((p) => ({ ...p, [key]: !!v }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* FILE UPLOAD */}
              <div className="space-y-2">
                <Label className="text-slate-700">Documents</Label>

                <label className="group border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-white">
                  <UploadCloud className="text-slate-400 group-hover:text-emerald-500 mb-2" />
                  <p className="text-sm text-slate-500">
                    Click or drag files to upload
                  </p>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {files?.length ? (
                  <div className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <p key={i} className="text-xs text-slate-500">
                        • {f.name}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* SUBMIT */}
              <Button
                disabled={loading || loadingKebeles}
                className="w-full h-12 bg-emerald-600 text-white"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}