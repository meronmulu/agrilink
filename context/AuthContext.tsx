'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as AuthService from '@/services/authService'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<User | null>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user")
      if (userString) {
        try {
          const parsedUser = JSON.parse(userString)
          setUser({
            id: parsedUser.id,
            role: parsedUser.role,
            email: parsedUser.email ?? '',
            phone: parsedUser.phone ?? '',
          })
        } catch (error) {
          console.error("Failed to parse user data from local storage", error)
        }
      }
    }
  }, [])

  const login = async (credentials: { email?: string; phone?: string; password: string }) => {
    const res = await AuthService.login(credentials)

    if (res?.token && res?.user) {
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))

      const loggedUser = {
        id: res.user.id,
        role: res.user.role,
        email: res.user.email ?? '',
        phone: res.user.phone ?? '',
      }

      setUser(loggedUser)
      return loggedUser
    }

    return null
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}