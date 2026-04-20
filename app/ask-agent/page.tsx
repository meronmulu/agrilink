'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createRoleRequest } from "@/services/roleRequestService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { MapPin, FileUp, CheckCircle2, Briefcase, GraduationCap, Paperclip } from "lucide-react"

export default function AskAgentPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    kebeleId: "",
    experienceInAgriculture: false,
    currentRole: "",
    educationLevel: "",
    digitalSkills: false,
    governmentAssigned: false,
  })

  const [files, setFiles] = useState<File[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("kebeleId", form.kebeleId)
      data.append("currentRole", form.currentRole)
      data.append("educationLevel", form.educationLevel)
      data.append("experienceInAgriculture", String(form.experienceInAgriculture))
      data.append("digitalSkills", String(form.digitalSkills))
      data.append("governmentAssigned", String(form.governmentAssigned))

      if (files) {
        files.forEach((file) => data.append("files", file))
      }

      await createRoleRequest(data)
      toast.success("Application submitted successfully ")
      router.push("/buyer")
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || "Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      {/* Decorative background element */}
      <div className="fixed top-0 left-0 w-full h-64 bg-linear-to-b from-emerald-50/50 to-transparent -z-10" />

      <main className="grow pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-6">
            
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Become an Agent
            </h1>
            <p className="text-slate-500 mt-3 text-sm">
              Empower your community and join our growing agricultural network.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="h-1 bg-linear-to-r from-emerald-500 to-teal-500" />
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* SECTION: Identification */}
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="kebeleId" className="text-slate-700 font-medium">Kebele ID </Label>
                  <div className="relative group">
                    <Input
                      id="kebeleId"
                      name="kebeleId"
                      placeholder="Enter your Kebele identification number"
                      className=" h-10 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Qualifications */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <Briefcase size={16} /> Current Role
                  </Label>
                  <Select
                    onValueChange={(value) => setForm((prev) => ({ ...prev, currentRole: value }))}
                  >
                    <SelectTrigger className="h-12 border-slate-200 w-full">
                      <SelectValue placeholder="Select current role" />
                    </SelectTrigger>
                    <SelectContent className="h-12">
                      <SelectItem value="DA_OFFICER">DA Officer</SelectItem>
                      <SelectItem value="FARMER">Farmer</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <GraduationCap size={16} /> Education Level
                  </Label>
                  <Select
                    onValueChange={(value) => setForm((prev) => ({ ...prev, educationLevel: value }))}
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

              {/* SECTION: Attributes */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                  <Checkbox
                    id="experience"
                    className="data-[state=checked]:bg-emerald-600 border-slate-300"
                    onCheckedChange={(v) => handleCheckboxChange("experienceInAgriculture", !!v)}
                  />
                  <Label htmlFor="experience" className="cursor-pointer text-slate-700">Experience in Agriculture</Label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                  <Checkbox
                    id="digital"
                    className="data-[state=checked]:bg-emerald-600 border-slate-300"
                    onCheckedChange={(v) => handleCheckboxChange("digitalSkills", !!v)}
                  />
                  <Label htmlFor="digital" className="cursor-pointer text-slate-700">Digital Skills (Smartphone usage, etc.)</Label>
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                  <Checkbox
                    id="gov"
                    className="data-[state=checked]:bg-emerald-600 border-slate-300"
                    onCheckedChange={(v) => handleCheckboxChange("governmentAssigned", !!v)}
                  />
                  <Label htmlFor="gov" className="cursor-pointer text-slate-700">Government Assigned Position</Label>
                </div>
              </div>

              {/* SECTION: File Upload */}
              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Supporting Documents</Label>
                <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <FileUp className="text-emerald-600" size={24} />
                    </div>
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {/* File list preview */}
                {files && files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-100 p-2 rounded-md shadow-sm">
                        <Paperclip size={14} className="text-emerald-500" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <Button 
                disabled={loading} 
                className="w-full h-12 text-base font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]
                  bg-linear-to-r from-emerald-600 to-teal-600 
                  hover:from-emerald-700 hover:to-teal-700 text-white border-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Application...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Application
                  </div>
                )}
              </Button>

            </form>
          </div>

          
        </div>
      </main>

      <Footer />
    </div>
  )
}