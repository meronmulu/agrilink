'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Lock, Mail, Shield, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import Link from 'next/link'

export default function SignUpBuyer({ role }: { role: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      // Redirect to buyer marketplace after successful registration
      router.push('/buyer/marketplace')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
            placeholder="John Doe"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative group">
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
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

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          Role
        </label>

        <div className="relative">
          <Select >
            <SelectTrigger className="pl-10 h-24 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
              <SelectValue placeholder="Select user role" />
            </SelectTrigger>

            <SelectContent className="bg-white">
              <SelectItem value="ADMIN">Farmer</SelectItem>
              <SelectItem value="PHARMACIST">Buyer</SelectItem>
            </SelectContent>
          </Select>


        </div>

        <p className="text-gray-500 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Sign In
          </Link>
        </p>
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
          'Create Buyer Account'
        )}
      </button>
    </form>
  )
}
