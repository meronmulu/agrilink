'use client'

import Image from 'next/image'
import img from "../public/Agricultural.jpg"
import { Lock, Eye, EyeOff, User } from "lucide-react"
import { Input } from './ui/input'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      console.log('Login attempt:', formData)
      router.push('/buyer/marketplace')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    router.push('/buyer/marketplace')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="grid lg:grid-cols-2 w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:block">
          <Image
            src={img}
            alt="Agriculture background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <h1 className="text-4xl font-bold">Welcome 🌾</h1>
            <p className="mt-4 text-lg text-gray-200 max-w-md">
              Manage your agricultural system efficiently and securely.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 lg:p-10 bg-white">
          <div className="w-full max-w-sm">

            {/* Header */}
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Login
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Enter your details to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Email or Phone
                </label>

                <div className="relative group">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className="h-10 pl-10 rounded-lg border border-gray-200 bg-gray-50
                    focus:bg-white focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500 transition-all duration-200"
                  />
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2
                    text-gray-400 group-focus-within:text-emerald-500"
                    size={16}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="h-10 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50
                    focus:bg-white focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500 transition-all duration-200"
                  />

                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2
                    text-gray-400 group-focus-within:text-emerald-500"
                    size={16}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-gradient-to-r 
                from-emerald-600 to-teal-600 
                hover:from-emerald-700 hover:to-teal-700
                text-white text-sm font-semibold shadow-md 
                transition-all duration-200
                disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white
                  rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-10 flex items-center justify-center gap-2
                border border-gray-200 rounded-lg bg-white
                hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                  width={18}
                  height={18}
                />
                Continue with Google
              </button>

              {/* Signup */}
              <p className="text-gray-500 text-center text-sm">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Sign Up
                </Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}