'use client'

import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

type Role = 'ADMIN' | 'AGENT' | 'BUYER' | 'FARMER'

export default function ProtectedRoute({
  children,
  roles
}: {
  children: React.ReactNode
  roles?: Role[]
}) {

  const { user } = useAuth()

  useEffect(() => {

    if (!user) {
      window.location.href = "/"
      return
    }

    if (roles && !roles.includes(user.role as Role)) {
      window.location.href = "/unauthorized"
    }

  }, [user, roles])

  
  if (!user) {
    return (
     <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return <>{children}</>
}