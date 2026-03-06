"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { verifyOtp } from "@/services/authService"

export default function VerifyOTP() {
  const router = useRouter()
  const params = useSearchParams()
  const email = params.get("email") || "" // fallback to empty string

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  // Debug: log OTP changes
  useEffect(() => {
    console.log("Current OTP:", otp)
  }, [otp])

  const handleVerify = async () => {
    console.log("Verify button clicked")

    if (!email) {
      alert("Email/identifier missing. Please register again.")
      return
    }

    if (otp.length < 6) {
      alert("Please enter 6-digit OTP")
      return
    }

    try {
      setLoading(true)

      const res = await verifyOtp({
        identifier: email,
        code: otp,
        purpose: "SIGNUP",
      })

      console.log("OTP verified:", res)
      alert(res?.message || "Account verified successfully")

      router.push("/login")

    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value: string) => setOtp(value)}
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
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}