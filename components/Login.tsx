'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Lock, Eye, EyeOff, User } from 'lucide-react'
import { Input } from './ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { googleSignin } from '@/services/authService'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/validation/auth.schema'
import Cookies from 'js-cookie'
import { Button } from './ui/button'
import { listenForegroundNotification, requestNotificationPermission } from '@/services/notificationService'

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { login, setUser } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  })

  // ==========================
  // NORMAL LOGIN
  // ==========================
  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)

    try {
      const payload = data.identifier.includes('@')
  ? {
      email: data.identifier,
      password: data.password
    }
  : {
      phone: data.identifier,
      password: data.password
    }

const user = await login(payload)

      if (!user) return

      //  BLOCK NON ACTIVE USERS
      if (user.status !== 'ACTIVE') {
        toast.warning('Please verify your account first')

        router.replace(
          `/verify-otp?identifier=${encodeURIComponent(data.identifier)}&purpose=LOGIN`
        )
        return
      }

      toast.success('Login successful')
  
      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        AGENT: '/agent/farmer',
        BUYER: '/buyer',
        FARMER: '/farmer',
      }

      router.push(roleRoutes[user.role] || '/')
    } catch (error: any) {
      console.error(error)

      const msg = (error?.message || '').toLowerCase()
      const isUnverified =
        msg.includes('verif') ||
        msg.includes('unverified') ||
        msg.includes('inactive') ||
        msg.includes('pending')

      if (isUnverified) {
        toast.warning(error.message || 'Account not verified')

        router.replace(
          `/verify-otp?identifier=${encodeURIComponent(data.identifier)}&purpose=LOGIN`
        )
        return
      }

      toast.error(error?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  // ==========================
  // GOOGLE LOGIN
  // ==========================
  const handleGoogleLogin = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()

    try {
      setIsLoading(true)

      const res = await googleSignin()

      console.log('Google Login Response:', res)

      // 🚨 BLOCK NON ACTIVE USERS
      if (res.user.status !== 'ACTIVE') {
        toast.warning('Please verify your account first')

        router.replace(
          `/verify-otp?identifier=${encodeURIComponent(
            res.user.email || res.user.phone
          )}&purpose=LOGIN`
        )
        return
      }

      // ✅ ONLY ACTIVE USER SAVE SESSION
      setUser({
        id: res.user.id,
        role: res.user.role,
        email: res.user.email ?? '',
        phone: res.user.phone ?? ''
      })

      Cookies.set('token', res.token, { expires: 7 })
      Cookies.set('user-role', res.user.role, { expires: 7 })
      Cookies.set('user-status', res.user.status, { expires: 7 })

      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))
        
     
      toast.success('Google login successful')

      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin/dashboard',
        AGENT: '/agent/farmer',
        BUYER: '/buyer',
        FARMER: '/farmer',
      }

      router.push(roleRoutes[res.user.role] || '/')
    } catch (error) {
      console.error('Google login failed', error)
      toast.error('Google login failed. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="grid lg:grid-cols-2 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-700">

        {/* LEFT IMAGE */}
        <div className="relative hidden lg:block">
          <Image
            src="/Agricultural.jpg"
            alt="Agriculture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <h1 className="text-4xl font-bold">{t('login_welcome')}</h1>
            <p className="mt-4 text-lg text-gray-200 max-w-md">{t('login_subtitle')}</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center lg:text-left">
              {t('login_header')}
            </h2>
            <p className="text-gray-500 text-sm text-center lg:text-left mt-1">
              {t('login_subheader')}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">

              {/* IDENTIFIER */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email or Phone
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter email or phone"
                    {...register('identifier')}
                    disabled={isLoading}
                    className="h-10 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white
                    focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500 placeholder:dark:text-gray-400"
                  />
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier.message}</p>}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link href="/forgotPassword" className="text-emerald-600 hover:text-emerald-700 text-sm">
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    {...register('password')}
                    disabled={isLoading}
                    className="h-10 pl-10 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white
                    focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-emerald-500/20
                    focus:border-emerald-500 placeholder:dark:text-gray-400"
                  />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              {/* LOGIN BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-linear-to-r from-emerald-600 to-teal-600
                hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold shadow-md
                disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t('login_signin_btn')
                )}
              </Button>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-10 flex items-center justify-center gap-2
                border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium dark:text-gray-200"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                Continue with Google
              </button>

              {/* SIGNUP LINK */}
              <p className="text-gray-500 text-center text-sm mt-2">
                {t('login_no_account')}{' '}
                <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
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