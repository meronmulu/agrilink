'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { verifyOtp } from "@/services/authService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"

export default function VerifyOTP() {
  const router = useRouter()
  const params = useSearchParams()

  const { setUser } = useAuth()

  const identifier = params.get("identifier") || ""
  const purpose = params.get("purpose") || "SIGNUP"
  const role = params.get("role") || "BUYER"

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!identifier) return alert("Identifier missing")
    if (otp.length < 6) return alert("Enter 6-digit OTP")

    try {
      setLoading(true)

      const res = await verifyOtp({
        identifier,
        code: otp,
        purpose: purpose as "SIGNUP" | "LOGIN" | "RESET"
      })

      console.log("OTP Verified:", res)

      // ✅ Save token + user
      if (res?.token && res?.user) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))

        setUser({
          id: res.user.id,
          role: res.user.role,
          email: res.user.email ?? "",
          phone: res.user.phone ?? ""
        })
      }

      // Redirect based on purpose
      switch (purpose) {
        case "SIGNUP":
          router.push(`/other-register?identifier=${identifier}&role=${role}`)
          break

        case "RESET":
          router.push(`/resetPassword?identifier=${encodeURIComponent(identifier)}&otp=${otp}`)
          break

        case "LOGIN":
          router.push("/dashboard")
          break
      }

    } catch (error) {
      console.log(error)
      alert("OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify OTP
          </CardTitle>

          <CardDescription>
            Enter the 6-digit code sent to
            <span className="font-medium"> {identifier}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-center py-2">
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
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
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