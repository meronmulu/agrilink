'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import img from "../../public/Agricultural.jpg"
import SignUpBuyer from "@/components/SignUpBuyer"
import SignUpFarmer from "@/components/SignUpFarmer"
import { useLanguage } from '@/context/LanguageContext'

export default function SignupPage() {
  const { t } = useLanguage()
  const [role, setRole] = useState<'BUYER' | 'FARMER'>('BUYER')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">

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
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
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

            {/* Role Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                onClick={() => setRole('BUYER')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'BUYER' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('signup_role_buyer') || 'Buyer'}
              </button>
              <button
                onClick={() => setRole('FARMER')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'FARMER' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('signup_role_farmer') || 'Farmer'}
              </button>
            </div>

            <div className="animate-in fade-in duration-300">
              {role === 'BUYER' ? <SignUpBuyer role="BUYER" /> : <SignUpFarmer role="FARMER" />}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
