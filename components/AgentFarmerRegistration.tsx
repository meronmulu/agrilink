'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { useLanguage } from '@/context/LanguageContext'
import { registerFarmer } from '@/services/authService'
import { toast } from 'sonner'

export default function AgentFarmerRegistration() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const role = "FARMER"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const trimmedEmail = email.trim()
      const trimmedPhone = phone.trim()

      // At least one required
      if (!trimmedEmail && !trimmedPhone) {
        toast.error("Please provide at least email or phone.")
        return
      }

      if (!password) {
        toast.error("Password is required.")
        return
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.")
        return
      }

      //  Build payload (NO EMPTY STRINGS)
      const payload: any = {
        password,
        confirmPassword,
        role
      }

      if (trimmedEmail) payload.email = trimmedEmail
      if (trimmedPhone) payload.phone = trimmedPhone

      console.log("FINAL PAYLOAD ", payload)

      const user = await registerFarmer(payload)

      if (user) {
        toast.success("Account created successfully")

        const identifier = trimmedEmail || trimmedPhone

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

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('role') || 'Role'}
        </label>
        <div className="h-11 flex items-center px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
          {t('farmer') || 'Farmer'}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('email_optional') || 'Email (Optional)'}
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 rounded-xl"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('phone') || 'Phone'}
        </label>
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+251..."
          className="h-11 rounded-xl"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('password') || 'Password'}
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 rounded-xl"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t('confirm_password') || 'Confirm Password'}
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 rounded-xl"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Create Farmer Account"
        )}
      </button>

    </form>
  )
}