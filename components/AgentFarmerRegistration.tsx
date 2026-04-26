
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { useLanguage } from '@/context/LanguageContext'
import { registerFarmer } from '@/services/authService'
import { toast } from 'sonner'
import { signUpSchema } from '@/lib/validation/auth.schema'

export default function AgentFarmerRegistration() {
  const { t } = useLanguage()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const role = "FARMER"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const result = signUpSchema.safeParse({
        email: email || undefined,
        phone: phone || undefined,
        password,
        confirmPassword,
        role
      })

      if (!result.success) {
        const fieldErrors: any = {}

        result.error.issues.forEach((err) => {
          const field = err.path[0]
          if (field) fieldErrors[field] = err.message
        })

        setErrors(fieldErrors)
        toast.error(result.error.issues[0].message)
        return
      }

      const validData = result.data

      const payload: any = {
        role: validData.role,
        password: validData.password,
        confirmPassword: validData.confirmPassword
      }

      if (validData.email) payload.email = validData.email
      if (validData.phone) payload.phone = validData.phone

      const user = await registerFarmer(payload)

      if (user) {
        toast.success(t('toast_farmer_created'))

        const identifier = validData.email || validData.phone

        router.push(
          `/verify-otp?identifier=${encodeURIComponent(identifier!)}&purpose=SIGNUP&role=${role}`
        )
      }

    } catch (error) {
      console.log(error)
      toast.error(t('toast_registration_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ROLE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t('role') || 'Role'}
        </label>
        <div className="h-11 flex items-center px-3 rounded-xl border bg-gray-50">
          {t('farmer')}
        </div>
      </div>

      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm font-medium">{t('signup_email_label')} ({t('optional')})</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className={`h-11 rounded-xl ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div className="space-y-1">
        <label className="text-sm font-medium">{t('signup_phone_label')}</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('enter_phone_number')}
          className={`h-11 rounded-xl ${errors.phone ? "border-red-500" : ""}`}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-sm font-medium">{t('signup_password_label')}</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          className={`h-11 rounded-xl ${errors.password ? "border-red-500" : ""}`}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="space-y-1">
        <label className="text-sm font-medium">{t('signup_confirm_password_label')}</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••"
          className={`h-11 rounded-xl ${errors.confirmPassword ? "border-red-500" : ""}`}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-emerald-600 text-white"
      >
        {isLoading ? t('loading') || "Loading..." : t('create_farmer_account')}
      </button>

    </form>
  )
}

