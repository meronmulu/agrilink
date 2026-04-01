'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import * as AuthService from '@/services/authService'
import { User } from '@/types/auth'

// ---- Context Type ----
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<User | null>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

// ---- Create Context ----
const AuthContext = createContext<AuthContextType | null>(null)

// ---- Provider ----
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ---- Restore user from localStorage on page reload ----
  useEffect(() => {
    const restoreUser = async () => {
      const userString = localStorage.getItem('user')
      if (userString) {
        try {
          const basicUser: User = JSON.parse(userString)
          const fullUser = await AuthService.getUserById(basicUser.id)
          setUser(fullUser)
          localStorage.setItem('user', JSON.stringify(fullUser))
        } catch (error) {
          console.error('Failed to restore user:', error)
          setUser(null)
        }
      }
      setLoading(false)
    }
    restoreUser()
  }, [])

  // ---- Login ----
  const login = async (credentials: { email?: string; phone?: string; password: string }) => {
    if (!credentials.password) {
      throw new Error('Password is required')
    }

    const res = await AuthService.login(credentials)

    if (res?.token && res?.user) {
      // Save token & user
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))

      // Fetch full user profile
      const fullUser = await AuthService.getUserById(res.user.id)
      setUser(fullUser)
      localStorage.setItem('user', JSON.stringify(fullUser))

      return fullUser
    }

    return null
  }

  // ---- Logout ----
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.replace('/') // redirect to home
  }

  // ---- Provide context values ----
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---- Custom Hook ----
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}