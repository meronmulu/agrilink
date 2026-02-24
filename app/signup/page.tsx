'use client'

import Image from 'next/image'
import img from "../../public/Agricultural.jpg"
import { useState } from "react"
import SignUpFarmer from "@/components/SignUpFarmer"
import SignUpBuyer from "@/components/SignUpBuyer"

type Role = "FARMER" | "BUYER"

export default function SignupPage() {
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
          <h1 className="text-4xl font-bold">Welcome 🌾</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-md">
            Manage your agricultural system efficiently and securely.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col  p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mx-auto  lg:text-left mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 mt-1">
              Select your role and fill the details to sign up
            </p>
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
              🌾 Farmer
            </button>

            <button
              onClick={() => setSelectedRole("BUYER")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${selectedRole === "BUYER"
                  ? "bg-white shadow text-emerald-600"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              🛒 Buyer
            </button>
          </div>

          {/* FORM SECTION */}
          <div className="pt-2">
            {selectedRole === "FARMER" && <SignUpFarmer role="FARMER" />}
            {selectedRole === "BUYER" && <SignUpBuyer role="BUYER" />}
          </div>

        </div>
      </div>
    </div>
  )
}