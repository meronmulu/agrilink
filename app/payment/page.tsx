'use client'

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center shadow-lg border-0">
        <CardContent className="p-8 flex flex-col items-center gap-4">
          
          {/* Success Icon */}
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800">
            Payment Successful
          </h1>

          {/* Message */}
          <p className="text-gray-500 text-sm">
            Your payment has been processed successfully.  
            Thank you for your purchase 🎉
          </p>

          {/* Button */}
          <Button
            className="mt-4 w-full"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}