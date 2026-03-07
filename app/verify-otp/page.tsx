'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { verifyOtp } from "@/services/authService"

export default function VerifyOTP() {
  const router = useRouter()
  const params = useSearchParams()

  const identifier = params.get("identifier") || ""
  const purpose = params.get("purpose") || "SIGNUP" // could be SIGNUP | LOGIN | RESET

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!identifier) return alert("Identifier missing")
    if (otp.length < 6) return alert("Enter 6-digit OTP")

    try {
      setLoading(true)
      const res = await verifyOtp({ identifier, code: otp, purpose: purpose as "SIGNUP" | "LOGIN" | "RESET" })
      console.log("OTP Verified:", res)
      // alert(res.message)

      // Handle after OTP based on purpose
      switch (purpose) {
        case "SIGNUP":
          router.push("/login") // after signup OTP, go to login
          break
        case "RESET":
          router.push(`/resetPassword?identifier=${encodeURIComponent(identifier)}&otp=${otp}`) // go to reset page
          break
        case "LOGIN":
          router.push("/dashboard") // after login OTP, go to dashboard
          break
      }

    } catch (error) {
      console.log(error)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
        <p className="text-center text-sm text-gray-600">
          Enter the 6-digit code sent to <span className="font-medium">{identifier}</span>
        </p>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  )
}