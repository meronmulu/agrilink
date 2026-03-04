'use client'

import Image from 'next/image'
import img from "../../public/Agricultural.jpg"
import SignUpBuyer from "@/components/SignUpBuyer"
import { useLanguage } from '@/context/LanguageContext'


export default function SignupPage() {
  const { t } = useLanguage()
  // Farmer is selected by default
  const [selectedRole, setSelectedRole] = useState<Role>("FARMER")

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
          <h1 className="text-4xl font-bold">{t('signup_welcome')}</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-md">
            {t('signup_subtitle')}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col  p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mx-auto  lg:text-left mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('signup_header')}
            </h2>
            <p className="text-gray-500 mt-1">
              {t('signup_subheader')}

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">

      <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:block">
          <Image
            src={img}
            alt="Agriculture background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <h1 className="text-5xl font-bold leading-tight">
              Join Our Platform 
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-md">
              Connect farmers and buyers in one powerful agricultural ecosystem.
            </p>
          </div>
        </div>

          {/* ROLE SELECTOR */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setSelectedRole("FARMER")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedRole === "FARMER"
                  ? "bg-white shadow text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              🌾 {t('signup_role_farmer').replace('🌾', '').trim()}
            </button>

            <button
              onClick={() => setSelectedRole("BUYER")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedRole === "BUYER"
                  ? "bg-white shadow text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              🛒 {t('signup_role_buyer').replace('🛒', '').trim()}
            </button>
          </div>
        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 lg:p-14 bg-white/80 backdrop-blur-xl">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Choose your role and complete the registration
              </p>
            </div>

           
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <SignUpBuyer role="BUYER" />
                </div>
            
            </div>

          </div>
        </div>

    </div>
  )
}