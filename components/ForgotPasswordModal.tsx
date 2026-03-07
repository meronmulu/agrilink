'use client'

import React, { useState } from 'react'
import { X, Loader2, Mail, Phone } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/axios'
import OTPVerificationModal from './OTPVerificationModal'

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const { t } = useLanguage()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOTPModal, setShowOTPModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await api.post('/auth/forgot-password', {
        emailOrPhone: emailOrPhone.trim()
      })

      setShowOTPModal(true)
    } catch (err: any) {
      console.error('Forgot password failed:', err)
      setError(err.response?.data?.message || 'Failed to send reset code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerified = () => {
    // Could redirect to reset password page, but for now just close
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-bold text-gray-900">
              Reset Password
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email or phone number to receive a reset code.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email or Phone
              </label>
              <Input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="email@example.com or +251912033566"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>
        </div>
      </div>

      <OTPVerificationModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        identifier={emailOrPhone}
        purpose="RESET"
        onVerified={handleOTPVerified}
      />
    </>
  )
}