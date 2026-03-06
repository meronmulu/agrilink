'use client'

import Image from 'next/image'
import img from "../public/Agricultural.jpg"
import { Lock, Eye, EyeOff, User } from "lucide-react"
import { Input } from './ui/input'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export default function Login() {

  const { t } = useLanguage()
  const router = useRouter()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)

    if (!formData.email || !formData.password) {
      setError("Please enter email and password")
      return
    }

    setIsLoading(true)

    try {

      const success = await login(formData)

      if (success) {
        router.push('/buyer/marketplace')
      } else {
        setError("Invalid email or password")
      }

    } catch (err) {
      console.error("Login failed:", err)
      setError("Something went wrong. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

      <div className="grid lg:grid-cols-2 w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
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
        <div className="flex items-center justify-center p-6 lg:p-10">

          <div className="w-full max-w-sm">

            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Login
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Enter your details to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative group">

                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    className="h-10 pl-10 rounded-lg border border-gray-200 bg-gray-50
                    focus:bg-white focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500"
                  />

                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">

                <div className="flex justify-between text-sm">

                  <label className="font-medium text-gray-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot Password?
                  </Link>

                </div>

                <div className="relative group">

                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="h-10 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50
                    focus:bg-white focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500"
                  />

                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                </div>

              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-gradient-to-r 
                from-emerald-600 to-teal-600
                hover:from-emerald-700 hover:to-teal-700
                text-white text-sm font-semibold shadow-md
                disabled:opacity-50 flex items-center justify-center"
              >

                {isLoading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : "Sign In"
                }

              </button>

              {/* SIGNUP */}
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