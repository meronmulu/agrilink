'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Lock, Mail, User, Phone } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import Link from 'next/link'
import api from '@/axios'
import OTPVerificationModal from './OTPVerificationModal'

export default function SignUpBuyer({ role }: { role: string }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      const payload = {
        role: role as 'BUYER' | 'FARMER',
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone
      }

      await api.post('/auth/signup', payload)

      // Show OTP verification modal
      setShowOTPModal(true)
    } catch (error: any) {
      console.error('Registration failed:', error)
      setError(error.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
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
            value={formData.email}
            onChange={handleChange}
            placeholder={t('signup_email_placeholder')}
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          {t('signup_phone_label')}
        </label>
        <div className="relative group">
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+251912033566"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
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
            value={formData.password}
            onChange={handleChange}
            placeholder={t('signup_password_placeholder')}
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          {t('signup_confirm_password_label')}
        </label>
        <div className="relative group">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="h-11 pl-10 rounded-xl border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <div className="space-y-4 mt-6">
        <p className="text-gray-500 text-center text-sm">
          {t('signup_already_account')}{" "}
          <Link
            href="/login"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            {t('signup_signin_link')}
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
