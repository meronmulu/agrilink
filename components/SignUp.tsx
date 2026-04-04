'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useLanguage } from '@/context/LanguageContext'
import { register as registerUser } from '@/services/authService'
import { signUpSchema, SignUpInput } from '@/lib/validation/auth.schema'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUpPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      role: 'BUYER',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)
    try {
      const payload: {
        role: 'BUYER' | 'FARMER';
        password: string;
        confirmPassword: string;
        email?: string;
        phone?: string;
      } = {
        role: data.role,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
      if (data.email) payload.email = data.email
      if (data.phone) payload.phone = data.phone

      const user = await registerUser(payload)
      if (user) {
        toast.success('Account created successfully')
        const identifier = data.email ?? data.phone ?? ''
        router.push(
          `/verify-otp?identifier=${encodeURIComponent(identifier)}&purpose=SIGNUP&role=${data.role}`
        )
      }
    } catch (error) {
      console.log('Registration error:', error)
      // if (error?.response?.status === 504) {
      //   toast.warning('Server timeout. OTP may still be sent. Check your email/phone.')
      // } else if (error?.response?.status === 409) {
      //   toast.error('This email or phone number is already registered.')
      // } else if (error?.response?.status === 400) {
      //   toast.error(error?.response?.data?.message || 'Invalid input. Please check your details.')
      // } else {
      toast.error('Registration failed.')
      // }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">

      {/* Role */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <Select
          onValueChange={(value) => setValue('role', value as 'BUYER' | 'FARMER')}
          defaultValue="BUYER"
        >
          <SelectTrigger className="h-14 bg-white rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 w-full">
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="BUYER">Buyer</SelectItem>
            <SelectItem value="FARMER">Farmer</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
        className='h-9'
          type="email"
          placeholder="you@example.com"
          {...register('email')}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Phone</label>
        <Input
                className='h-9'

          type="text"
          placeholder="+2517... / 07..."
          {...register('phone')}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1 relative">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
                className='h-9'

          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2  text-gray-500 text-sm"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1 relative">
        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
        <Input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 text-gray-500 text-sm"
        >
          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Sign Up'
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