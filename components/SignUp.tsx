'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { register } from '@/services/authService'
import { toast } from 'sonner'

export default function SignUp() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("BUYER")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const trimmedEmail = email.trim()
      const trimmedPhone = phone.trim()

      // ✅ Validation
      if (!trimmedEmail && !trimmedPhone) {
        toast.error("Please provide either email or phone number.")
        return
      }

      if (trimmedEmail && trimmedPhone) {
        toast.error("Use either email OR phone, not both.")
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

      // ✅ Build payload (NO empty fields)
      const payload: any = {
        password,
        confirmPassword,
        role,
      }

      if (trimmedEmail) payload.email = trimmedEmail
      if (trimmedPhone) payload.phone = trimmedPhone

      console.log("Sending payload:", payload)

      // ✅ API call
      const user = await register(payload)

      if (user) {
        toast.success("Account created successfully")

        const identifier = trimmedEmail || trimmedPhone

        // ✅ Redirect
        router.push(
          `/verify-otp?identifier=${encodeURIComponent(identifier)}&purpose=SIGNUP&role=${role}`
        )
      }

    } catch (error: any) {
      console.log("Registration error:", error)

      if (error?.response?.status === 504) {
        toast.warning("Server timeout. OTP may still be sent. Check your email/phone.")
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
    <form onSubmit={handleSubmit} className="space-y-2">

      {/* Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Role</label>
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
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+251..."
          className="h-11 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="h-11 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500 w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Sign Up"
        )}
      </button>

      <p className="text-gray-500 text-center text-sm mt-2">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
          Sign In
        </Link>
      </p>
    </form>
  )
}