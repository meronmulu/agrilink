'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Lock, Mail, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { register } from '@/services/authService'

export default function SignUp() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setconfirmPassword] = useState("")
  const [role, setRole] = useState("BUYER")



  const [isLoading, setIsLoading] = useState(false)




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await register({ email, phone, password, confirmPassword, role })

      if (user) {
        console.log("User registered successfully", user)

        router.push(`/verify-otp?email=${email || phone}`)
      }
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">Role</label>
        <Select onValueChange={setRole} value={role}>
          <SelectTrigger className="h-11 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="BUYER">Buyer</SelectItem>
            <SelectItem value="FARMER">Farmer</SelectItem>
          </SelectContent>
        </Select>


      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          {t('signup_email_label')}
        </label>
        <div className="relative group">
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Phone
        </label>
        <div className="relative group">
          <Input
            id="phone"
            name="phone"
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251912033566"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          {t('signup_password_label')}
        </label>
        <div className="relative group">
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative group">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      <p className="text-gray-500 text-center text-sm mt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Sign In
        </Link>
      </p>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-md transition-all flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          t('signup_buyer_btn')
        )}
      </button>
    </form>

    <OTPVerificationModal
      open={showOTPModal}
      onClose={() => setShowOTPModal(false)}
      identifier={formData.email || formData.phone}
      purpose="SIGNUP"
      onVerified={() => {}}
      userRole={role}
    />
    </>
  )
}