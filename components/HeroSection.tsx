'use client'

import Image from "next/image"
import img from "../public/agriGirl.jpg"
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className=" bg-gray-50 py-5">
      <div className=" mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="mx-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
            {t('heroSec_title')}
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {t('heroSec_desc')}
          </p>

          <div className="mt-5 space-y-6">

            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16  h-10 rounded-full bg-emerald-500 text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t('heroSec_step1_title')}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {t('heroSec_step1_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16 h-10 rounded-full bg-emerald-500 text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t('heroSec_step2_title')}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {t('heroSec_step2_desc')}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16 h-10 rounded-full bg-emerald-500 text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {t('heroSec_step3_title')}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {t('heroSec_step3_desc')}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative  md:px-20 mt-6">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={img}
              alt="Farmer holding vegetables"
              width={700}
              height={500}
              className="object-cover w-screen h-screen"
            />
          </div>

          {/* Floating Card */}
          <div className="absolute -bottom-4 -left-6 bg-white shadow-lg rounded-xl px-6 py-4">
            <p className="text-2xl font-bold text-emerald-500">{t('heroSec_stat_rate')}</p>
            <p className="text-sm text-gray-600">
              {t('heroSec_stat_text1')} <br /> {t('heroSec_stat_text2')}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}