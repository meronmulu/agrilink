'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import * as AuthService from '@/services/authService'
import { User } from '@/types/auth'
import Cookies from 'js-cookie' // 1. Import Cookies

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<User | null>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreUser = async () => {
      // We still use localStorage for the UI state, 
      // but Middleware will rely on the Cookie we set in login()
      const userString = localStorage.getItem('user')
      if (userString) {
        try {
          const basicUser: User = JSON.parse(userString)
          const fullUser = await AuthService.getUserById(basicUser.id)
          setUser(fullUser)
        } catch (error) {
          console.error('Failed to restore user:', error)
          Cookies.remove('token')
          Cookies.remove('user-role')
          setUser(null)
        }
      }
      setLoading(false)
    }
    restoreUser()
  }, [])

 const login = async (credentials: { email?: string; phone?: string; password: string }) => {
  if (!credentials.password) {
    throw new Error('Password is required')
  }

  const res = await AuthService.login(credentials)

  if (res?.token && res?.user) {
    // 🚨 RETURN NON ACTIVE USER IMMEDIATELY
    if (res.user.status !== 'ACTIVE') {
      return res.user
    }

    // ✅ ONLY ACTIVE USER SAVE SESSION
    Cookies.set('token', res.token, { expires: 7, path: '/' })
    Cookies.set('user-role', res.user.role, { expires: 7, path: '/' })
    Cookies.set('user-status', res.user.status, { expires: 7, path: '/' })

    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(res.user))

    const fullUser = await AuthService.getUserById(res.user.id)

    setUser(fullUser)
    localStorage.setItem('user', JSON.stringify(fullUser))

    return fullUser
  }

  return null
}

  const logout = () => {
  // 1. Clear LocalStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // 2. Clear Cookies with explicit path (IMPORTANT)
  Cookies.remove('token', { path: '/' })
  Cookies.remove('user-role', { path: '/' })

  // 3. Clear State
  setUser(null)

   router.replace('/') 
}
  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}