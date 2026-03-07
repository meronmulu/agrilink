'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/axios'

type Purpose = 'SIGNUP' | 'LOGIN' | 'RESET'

interface OTPVerificationModalProps {
  open: boolean
  onClose: () => void
  identifier: string // email or phone
  purpose: Purpose
  onVerified: (userData?: any) => void // Allow passing user data from verification
  userRole?: string // For signup redirection
}

export default function OTPVerificationModal({
  open,
  onClose,
  identifier,
  purpose,
  onVerified,
  userRole
}: OTPVerificationModalProps) {
  const { t } = useLanguage()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (open) {
      setOtp('')
      setNewPassword('')
      setConfirmPassword('')
      setError(null)
      setCountdown(60) // 60 seconds countdown
    }
  }, [open])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP code')
      return
    }

    if (purpose === 'RESET') {
      if (!newPassword || !confirmPassword) {
        setError('Please enter new password')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      let response;
      if (purpose === 'RESET') {
        // For password reset, call reset-password API
        response = await api.post('/auth/reset-password', {
          emailOrPhone: identifier,
          password: newPassword,
          confirmPassword: confirmPassword
        })
      } else {
        // For SIGNUP/LOGIN, verify OTP
        response = await api.post('/auth/verify-otp', {
          identifier,
          code: otp.trim(),
          purpose
        })
      }

      // For signup, redirect based on user role
      if (purpose === 'SIGNUP' && userRole) {
        const role = userRole.toUpperCase()
        if (role === 'FARMER') {
          window.location.href = '/farmer/crops'
        } else if (role === 'AGENT') {
          window.location.href = '/agent/dashboard'
        } else {
          window.location.href = '/buyer/marketplace'
        }
      } else {
        // For other purposes, call the original onVerified callback
        onVerified(response?.data)
      }

      onClose()
    } catch (err: any) {
      console.error('Verification failed:', err)
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError(null)

    try {
      if (purpose === 'RESET') {
        await api.post('/auth/forgot-password', {
          emailOrPhone: identifier
        })
      } else {
        // For SIGNUP/LOGIN, might need to resend from backend
        // Assuming backend handles resend, or we can call a resend endpoint
      }

      setCountdown(60)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            Verify OTP
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
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            We've sent a 6-digit code to <strong>{identifier}</strong>
          </p>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Enter OTP Code
            </label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          {purpose === 'RESET' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6 || (purpose === 'RESET' && (!newPassword || !confirmPassword))}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {purpose === 'RESET' ? 'Resetting...' : 'Verifying...'}
                </>
              ) : purpose === 'RESET' ? (
                'Reset Password'
              ) : (
                'Verify'
              )}
            </Button>
          </div>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend code in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}