'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import img from "../../public/Agricultural.jpg"
import { useLanguage } from '@/context/LanguageContext'
import OtherSignUpPage from '@/components/OtherSignUpPage'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">

      <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden mt-16 md:mt-0">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:block">
          <Image
            src={img}
            alt="Agriculture background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
            <h1 className="text-5xl font-bold leading-tight">
              {t('signup_welcome')}
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-md">
              {t('signup_subtitle')}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 lg:p-14 bg-white/80 backdrop-blur-xl">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900">
                {t('signup_header')}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {t('signup_subheader')}
              </p>
            </div>

           
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <Suspense fallback={<div>Loading signup form...</div>}>
                <OtherSignUpPage />
              </Suspense>
            </div>
            
            </div>

          </div>
        </div>
      </div>
  )
}
