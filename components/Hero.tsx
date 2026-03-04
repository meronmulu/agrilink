'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import img from "../public/Agricultural.jpg"
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative top-12 w-full h-[90vh] flex items-center">

      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center">
        <Image
          src={img}
          alt="hero image"
          fill
          className="object-cover "
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative  max-w-7xl  px-20 text-white">
        <div className="max-w-2xl">

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {t('hero_title1')} <br />
            {t('hero_title2')}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-6 text-base rounded-lg">
                {t('hero_btn_start')}
              </Button>
            </Link>



            <Button
              variant="outline"
              className="border-white hover:bg-white text-black px-6 py-6 text-base rounded-lg"
            >
              {t('hero_btn_view')}
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}