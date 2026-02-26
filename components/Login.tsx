'use client'

import Image from 'next/image'
import img from "../public/Agricultural.jpg"
import { Lock, Eye, EyeOff, User } from "lucide-react"
import { Input } from './ui/input'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function submitToServer(data: { email: string; password: string }) {
    // POST to your auth endpoint; server should set httpOnly refresh cookie and return access token
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // important for httpOnly cookies
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const message = body?.message || `Login failed (${res.status})`
      throw new Error(message)
    }

    return res.json() // expected shape: { accessToken?: string, user?: {...} }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Basic client-side validation
      if (!formData.email || !formData.password) {
        setError('Please enter email and password.')
        return
      }

      // Try server login
      try {
        const payload = await submitToServer(formData)
        // If your AuthContext.login expects credentials or token, pass it
        // Here we call login() to update local state and localStorage (AuthContext handles persistence)
        login()
        // Optionally store access token in memory via a more advanced AuthContext
        // e.g. auth.setAccessToken(payload.accessToken)
      } catch (serverErr) {
        // If server is not available or returns 4xx/5xx, surface message
        // For local dev you may want to fallback to client-only login:
        // login() // <-- uncomment to allow local fallback
        throw serverErr
      }

      router.push('/buyer/marketplace')
    } catch (err: any) {
      console.error('Login failed:', err)
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // If you have OAuth server flow, redirect to provider endpoint
      // Example: window.location.href = '/api/auth/google'
      // For now, simulate success and update AuthContext
      login()
      router.push('/buyer/marketplace')
    } catch (err: any) {
      setError('Google login failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block">
        <Image src={img} alt="Agriculture background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <h1 className="text-4xl font-bold">Welcome Back 🌾</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-md">Manage your agricultural system efficiently and securely.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Login to Your Account</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email Address Or Phone Number</label>
              <div className="relative group">
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isLoading} placeholder="you@example.com or +251..." className="h-12 pl-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700">Forgot password?</button>
              </div>

              <div className="relative group">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required disabled={isLoading} placeholder="••••••••" className="h-12 pl-10 pr-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" size={18} />
                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div role="alert" className="text-sm text-red-600">{error}</div>}

            {/* Sign In Button */}
            <button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button type="button" onClick={handleGoogleLogin} className="w-full h-12 flex items-center justify-center gap-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm">
              <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="w-5 h-5" width={20} height={20} />
              Continue with Google
            </button>

            {/* Signup */}
            <p className="text-gray-500 text-center">Don’t have an account? <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">Sign Up</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}