'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { useLanguage } from '@/context/LanguageContext'
import { register } from '@/services/authService'
import { toast } from 'sonner'

export default function AgentFarmerRegistration() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //  Fixed role
  const role = "FARMER"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      //  Validation: at least email OR phone
      if (!email.trim() && !phone.trim()) {
        toast.error("Please provide at least email or phone.")
        setIsLoading(false)
        return
      }

      if (!password) {
        toast.error("Password is required.")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.")
        setIsLoading(false)
        return
      }

      //  API Call
      const user = await register({
        email,
        phone,
        password,
        confirmPassword,
        role
      })

      if (user) {
        toast.success("Account created successfully ")

        const identifier = email || phone

        // Redirect to OTP
        router.push(
          `/verify-otp?identifier=${encodeURIComponent(identifier)}&purpose=SIGNUP&role=${role}`
        )
      }

    } catch (error: any) {
      console.log("Registration error:", error)

      if (error?.response?.status === 504) {
        toast.warning("Server timeout. OTP may still be sent.")
      } else if (error?.response?.status === 409) {
        toast.error("This email or phone number is already registered.")
      } else if (error?.response?.status === 400) {
        toast.error(
          error?.response?.data?.message ||
          "Invalid input. Please check your details."
        )
      } else {
        toast.error(
          error?.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
        )
      }

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Role (Fixed) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{t('role') || 'Role'}</label>
        <div className="h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
          {t('farmer') || 'Farmer'}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          {t('email_optional') || 'Email (Optional)'}
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('you_example_optional') || "you@example.com (optional)"}
          className="h-11 pl-3 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          {t('phone') || 'Phone'}
        </label>
        <Input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+251... "
          className="h-11 pl-3 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          {t('password') || 'Password'}
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 pl-3 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          {t('confirm_password') || 'Confirm Password'}
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 pl-3 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          t('create_farmer_account') || "Create Farmer Account"
        )}
      </button>

    </form>
  )
}