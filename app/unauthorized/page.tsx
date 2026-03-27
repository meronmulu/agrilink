'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldX } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <ShieldX className="w-16 h-16 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          403 - Unauthorized
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="default">
              Go Home
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}