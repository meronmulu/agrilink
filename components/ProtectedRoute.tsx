'use client'

import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type Role = 'ADMIN' | 'AGENT' | 'BUYER' | 'FARMER'

export default function ProtectedRoute({
  children,
  roles
}: {
  children: React.ReactNode
  roles?: Role[]
}) {

  const { user, loading } = useAuth()
  const router = useRouter()

  //  Handle redirect AFTER loading
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/")
        return
      }

      if (roles && !roles.includes(user.role as Role)) {
        router.replace("/unauthorized")
      }
    }
  }, [user, loading, roles, router])

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  if (!user) return null

  if (roles && !roles.includes(user.role as Role)) return null

  return <>{children}</>
}