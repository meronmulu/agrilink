'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as AuthService from '@/services/authService'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email?: string; phone?: string; password?: string }) => Promise<User | null>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore user on page reload
  useEffect(() => {
    const restoreUser = async () => {
      const userString = localStorage.getItem('user')
      if (userString) {
        try {
          const basicUser = JSON.parse(userString)
          // fetch full profile for all roles
          const fullUser = await AuthService.getUserById(basicUser.id)
          setUser(fullUser)
          localStorage.setItem('user', JSON.stringify(fullUser))
        } catch (error) {
          console.error('Failed to restore user', error)
        }
      }
      setLoading(false)
    }
    restoreUser()
  }, [])

  // Login and fetch full profile
  const login = async (credentials: { email?: string; phone?: string; password?: string }) => {
    const res = await AuthService.login(credentials)

    if (res?.token && res?.user) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user)) // temp store

      // Fetch full user profile immediately
      const fullUser = await AuthService.getUserById(res.user.id)
      setUser(fullUser)
      localStorage.setItem('user', JSON.stringify(fullUser))

      return fullUser
    }

    return null
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.replace('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}