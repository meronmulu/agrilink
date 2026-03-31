'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPassword } from "@/services/authService"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"

export default function ResetPassword() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    setIdentifier(params.get("identifier") || "")
  }, [])

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    if (!password || !confirmPassword) return alert("Fill both fields")
    if (password !== confirmPassword) return alert("Passwords do not match")
    if (!identifier) return alert("Invalid reset request")

    try {
      setLoading(true)
      const res = await resetPassword({ emailOrPhone: identifier, password, confirmPassword })
      console.log("Reset Password Response:", res)
     
      router.push("/login")
    } catch (error) {
         console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your account for <span className="font-medium">{identifier}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <Input
              placeholder="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11"
            />
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 mt-2"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}