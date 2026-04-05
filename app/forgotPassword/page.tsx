'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { forgotPassword } from "@/services/authService"
import { useLanguage } from "@/context/LanguageContext"

export default function ForgotPassword() {
  const { t } = useLanguage()
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSendOtp = async () => {
    if (!emailOrPhone) return alert("Enter email or phone")

    try {
      setLoading(true)
      const res = await forgotPassword({ emailOrPhone })
      console.log("Forgot Password Result:", res)
    //   alert(res.message)
      router.push(`/verify-otp?identifier=${encodeURIComponent(emailOrPhone)}&purpose=RESET`)
    } catch (error) {
      console.log(error)
    //   alert(error?.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('forgot_password') || 'Forgot Password'}</CardTitle>
          <CardDescription>
            {t('forgot_password_desc') || 'Enter your email address or phone number below. We’ll send you an OTP to reset your password.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('email_or_phone') || 'Email or Phone'}</label>
            <Input
              placeholder={t('enter_email_or_phone') || "Enter your email or phone"}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="h-11"
            />
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 mt-2"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? (t('sending') || "Sending...") : (t('send_otp') || "Send OTP")}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}