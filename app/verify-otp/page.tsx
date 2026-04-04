'use client'

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { verifyOtp, resendOtp } from "@/services/authService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useLanguage } from "@/context/LanguageContext"

export default function VerifyOTP() {
  const router = useRouter()
  const { t } = useLanguage()

  const { setUser } = useAuth()

  const [identifier, setIdentifier] = useState("")
  const [purpose, setPurpose] = useState("SIGNUP")
  const [role, setRole] = useState("BUYER")

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    setIdentifier(params.get("identifier") || "")
    setPurpose(params.get("purpose") || "SIGNUP")
    setRole(params.get("role") || "BUYER")
  }, [])

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async () => {
    console.log("handleVerify called, otp:", otp, "length:", otp.length)
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

  const handleResend = async () => {
    if (!identifier) return alert("Identifier missing")

    try {
      setResendLoading(true)
      await resendOtp(identifier, purpose)
      setCountdown(60)
      alert("OTP resent successfully")
    } catch (error) {
      console.log("Resend failed:", error)
      alert("Failed to resend OTP. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t('verify_otp') || 'Verify OTP'}
          </CardTitle>

          <CardDescription>
            {t('enter_6_digit_code') || 'Enter the 6-digit code sent to'}
            <span className="font-medium"> {identifier}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                console.log("OTP input changed:", value)
                setOtp(value)
              }}
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

          <p className="text-center text-sm text-gray-500">OTP: {otp} (length: {otp.length})</p>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? (t('verifying') || "Verifying...") : (t('verify_otp') || "Verify OTP")}
          </Button>

          <div className="text-center mt-4">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                {t('resend_code_in') || 'Resend code in'} {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
              >
                {resendLoading ? (t('sending') || 'Sending...') : (t('resend_code') || 'Resend Code')}
              </button>
            )}
          </div>

        </CardContent>

      </Card>
    </div>
  )
}