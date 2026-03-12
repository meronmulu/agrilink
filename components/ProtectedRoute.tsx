// 'use client'

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/context/AuthContext"

// export default function ProtectedRoute({
//   children,
//   role
// }: {
//   children: React.ReactNode
//   role?: string
// }) {

//   const { user } = useAuth()
//   const router = useRouter()

//   useEffect(() => {

//     if (!user) {
//       router.push("/login")
//       return
//     }

//     if (role && user.role !== role) {
//       router.push("/")
//     }

//   }, [user, role, router])

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
    
//       </div>
//     )
//   }

//   return <>{children}</>
// }