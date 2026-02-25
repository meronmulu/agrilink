'use client'

import Image from 'next/image'
import img from "../public/Agricultural.jpg"
import { Lock, Eye, EyeOff, Mail, User } from "lucide-react"
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Login attempt:', formData)
      router.push('/buyer/marketplace')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Continue with Google")
    // later connect to backend OAuth
    router.push('/buyer/marketplace')
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">

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
          <h1 className="text-4xl font-bold">Welcome Back 🌾</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-md">
            Manage your agricultural system efficiently and securely.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Login to Your Account
            </h2>
            <p className="text-gray-500 mt-2">
              Enter your credentials to continue
            </p>
          </div>






          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                Email Address Or Phone Number
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
                  placeholder="you@example.com or +251..."
                  className="h-12 pl-10 rounded-xl border-gray-200
                   focus:ring-2 focus:ring-emerald-500/20
                   focus:border-emerald-500 transition-all"
                />
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 
                   text-gray-400 group-focus-within:text-emerald-500"
                  size={18}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
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
                  className="h-12 pl-10 pr-10 rounded-xl border-gray-200
                   focus:ring-2 focus:ring-emerald-500/20
                   focus:border-emerald-500 transition-all"
                />

                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2
                   text-gray-400 group-focus-within:text-emerald-500"
                  size={18}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r
               from-emerald-600 to-teal-600
               hover:from-emerald-700 hover:to-teal-700
               text-white font-medium shadow-lg
               hover:shadow-xl transition-all
               disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white
                      rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 flex items-center justify-center gap-3
               border border-gray-200 rounded-xl
               hover:bg-gray-50 transition-all font-medium shadow-sm"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-5 h-5"
                width={20}
                height={20}
              />
              Continue with Google
            </button>


            {/* Signup */}
            <p className="text-gray-500 text-center">
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
    </div >
  )
}