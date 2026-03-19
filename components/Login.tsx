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
import { googleSignin } from '@/services/authService'
import { toast } from 'sonner'


export default function Login() {
  const { t } = useLanguage()
  const router = useRouter()
  const { login } = useAuth()
  const { setUser } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '', // can be email or phone
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!formData.identifier || !formData.password) {
    toast.error("Please enter email/phone and password");
    return;
  }

  setIsLoading(true);

  try {
    const user = await login({
      email: formData.identifier.includes('@') ? formData.identifier : undefined,
      phone: !formData.identifier.includes('@') ? formData.identifier : undefined,
      password: formData.password
    });

    console.log("USER LOGIN RESPONSE:", user);

    if (user) {
      toast.success("Login successful ");

      const roleRoutes: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        AGENT: "/Agent/dashboard",
        BUYER: "/buyer",
        FARMER: "/farmer",
      };

      router.push(roleRoutes[user.role] || "/");
    }

  } catch (error: any) {
    setNeedsVerification(false);

    const msg = (error?.message || "").toLowerCase();
    const isUnverified = msg.includes("verif") || msg.includes("unverified");

    if (isUnverified) {
      toast.warning(error.message || "Account not verified");
      setNeedsVerification(true);

    } else if (error.status === 401) {
      toast.error("Invalid email/phone or password");

    } else if (error.status === 504) {
      toast.error("Server timeout. Try again");

    } else if (error.status === 400) {
      toast.error(error.message || "Invalid input");

    } else {
      toast.error(error.message || "Login failed");
    }

  } finally {
    setIsLoading(false);
  }
};


  const handleGoogleLogin = async () => {
  try {
    const res = await googleSignin();

    setUser({
      id: res.user.id,
      role: res.user.role,
      email: res.user.email ?? '',
      phone: res.user.phone ?? '',
    });

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));

    toast.success("Google login successful ");

    const roleRoutes: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      AGENT: "/Agent/dashboard",
      BUYER: "/buyer",
      FARMER: "/farmer",
    };

    router.push(roleRoutes[res.user.role] || "/");

  } catch (error: any) {
    console.error("Google login failed", error);
    toast.error("Google login failed. Try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="grid lg:grid-cols-2 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-700">

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('login_header')}</h2>
              <p className="text-gray-500 mt-1 text-sm">{t('login_subheader')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* IDENTIFIER (EMAIL OR PHONE) */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
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
                    className="h-10 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white
                      focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-500/20
                      focus:border-emerald-500 placeholder:dark:text-gray-400"
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
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
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
                    className="h-10 pl-10 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white
                      focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-500/20
                      focus:border-emerald-500 placeholder:dark:text-gray-400"
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
                <div className="flex flex-col gap-2 py-1">
                  <p className="text-red-500 text-sm">{error}</p>
                  {needsVerification && (
                    <button
                      type="button"
                      onClick={() => router.push(`/verify-otp?identifier=${encodeURIComponent(formData.identifier)}&purpose=SIGNUP`)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline text-left w-fit"
                    >
                      Verify your account now
                    </button>
                  )}
                </div>
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
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500">{t('login_or')}</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-10 flex items-center justify-center gap-2
                  border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium dark:text-gray-200"
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