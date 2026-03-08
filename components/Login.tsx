'use client'

import Image from 'next/image'
import img from "../public/Agricultural.jpg"
import { Lock, Eye, EyeOff, User, Phone } from "lucide-react"
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
    identifier: '', // can be email or phone
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.identifier || !formData.password) {
      setError("Please enter email/phone and password");
      return;
    }

    setIsLoading(true);

    try {
      // Send either email or phone as "identifier"
      const user = await login({
        email: formData.identifier.includes('@') ? formData.identifier : undefined,
        phone: !formData.identifier.includes('@') ? formData.identifier : undefined,
        password: formData.password
      });

      console.log("USER LOGIN RESPONSE:", user);

      if (user) {
        const roleRoutes: Record<string, string> = {
          ADMIN: "/admin",
          AGENT: "/Agent/dashboard",
          BUYER: "/buyer",
          FARMER: "/farmer",
        };
        console.log("USER ROLE:", user.role);
        router.push(roleRoutes[user.role] || "/");
      } else {
        setError("Invalid email/phone or password");
      }

    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google login not implemented yet")
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
            <h1 className="text-4xl font-bold">{t('login_welcome')}</h1>
            <p className="mt-4 text-lg text-gray-200 max-w-md">
              {t('login_subtitle')}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-sm">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('login_header')}</h2>
              <p className="text-gray-500 mt-1 text-sm">{t('login_subheader')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* IDENTIFIER (EMAIL OR PHONE) */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">
                  Email or Phone
                </label>
                <div className="relative">
                  <Input
                    name="identifier"
                    type="text"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter email or phone"
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
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgotPassword" className="text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter password"
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

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
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
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white
                    rounded-full animate-spin" />
                ) : (
                  t('login_signin_btn')
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{t('login_or')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* GOOGLE LOGIN */}
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
                {t('login_google_btn')}
              </button>

              {/* SIGNUP */}
              <p className="text-gray-500 text-center text-sm">
                {t('login_no_account')}{" "}
                <Link
                  href="/signup"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {t('login_signup_link')}
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}