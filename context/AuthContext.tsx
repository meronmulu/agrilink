'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as AuthService from '@/services/authService';
import { User } from '@/types/auth';


interface AuthContextType {
  user: User | null;
  login: (credentials: { email?: string; phone?: string; password: string }) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (credentials: { email?: string; phone?: string; password: string }) => {
    const res = await AuthService.login(credentials);
    // console.log("LOGIN RESPONSE:", res);

    if (res?.token && res.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser({
        id: res.user.id,
        role: res.user.role,
        email: res.user.email ?? '',
        phone: res.user.phone ?? '',
      });
      return {
        id: res.user.id,
        role: res.user.role,
        email: res.user.email ?? '',
        phone: res.user.phone ?? '',
      };
    }

    return null;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      const parsedUser = JSON.parse(userString);
      setTimeout(() => {
        setUser({
          id: parsedUser.id,
          role: parsedUser.role,
          email: parsedUser.email ?? '',
          phone: parsedUser.phone ?? '',
        });
      }, 0);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};