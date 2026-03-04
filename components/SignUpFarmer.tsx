'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Lock, Mail, User, Phone, MapPin } from 'lucide-react'

export default function SignUpFarmer({ role }: { role: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    location: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log(`Registering as ${role}:`, formData)
      // Redirect to farmer dashboard after successful registration
      router.push('/farmer/crops')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative group">
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Abebe Tadesse"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Email or Phone */}
      <div className="space-y-2">
        <label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-700">
          Email or Phone Number
        </label>
        <div className="relative group">
          <Input
            id="emailOrPhone"
            name="emailOrPhone"
            type="text"
            required
            value={formData.emailOrPhone}
            onChange={handleChange}
            placeholder="+251..."
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium text-gray-700">
          Farm Location / Region
        </label>
        <div className="relative group">
          <Input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="Jimma, Oromia"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative group">
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md transition-all flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Create Farmer Account'
        )}
      </button>
    </form>
  )
}