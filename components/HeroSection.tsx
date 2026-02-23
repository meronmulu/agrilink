'use client'

import Image from "next/image"
import img from "../public/agriGirl.jpg"

export default function HeroSection() {
  return (
    <section className=" bg-gray-50 py-5">
      <div className=" mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE */}
        <div className="mx-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
            Bridging the Information Gap
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            For too long, Ethiopian farmers have struggled with unfair pricing
            due to lack of market data. AgriLink was born from a mission to
            democratize information, ensuring that those who work the land
            receive their fair share of the value created.
          </p>

          <div className="mt-5 space-y-6">
            
            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16  h-10 rounded-full bg-emerald-500 text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Verified Registration
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Farmers and buyers undergo a simple verification process to
                  ensure trade security.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16 h-10 rounded-full bg-emerald-500 text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Real-Time Listing
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  List your produce or search for specific crops based on
                  current market intelligence.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center md:w-10 w-16 h-10 rounded-full bg-emerald-500 text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Secure Transaction
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Communicate through our platform and finalize trades with
                  transparent terms.
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
            <p className="text-2xl font-bold text-emerald-500">98%</p>
            <p className="text-sm text-gray-600">
              Trade Security <br /> Satisfaction Rate
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}